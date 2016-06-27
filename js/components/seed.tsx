import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import * as moment from 'moment';
let Relay: any = require('react-relay');

import { TableRow, TableRowColumn } from 'material-ui';

import { ISeed } from '../models/index.ts';

interface IProps {
  relay: RelayProp | any;
  seed: ISeed;
}

export class SeedComponent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  public dateLabel(seed: ISeed): string {
    if (this.props.relay.hasOptimisticUpdate(seed)) {
      return 'Saving...';
    }
    return moment(seed.createdAt).format('d-MM-YYYY h:mm');
  }

  public getName(seed: ISeed): string {
    if (seed) {
      if (this.props.relay.hasOptimisticUpdate(seed)) {
        return 'Saving...';
      }
      return `${seed.cross.name}`;
    } else {
      return '';
    }
  };

  public getSeedId(seed: ISeed, which?: string): string {
    if (seed) {
      if (this.props.relay.hasOptimisticUpdate(seed)) {
        return 'Saving...';
      }
      let id: string;
      let index: number;
      if (which) {
        let parentSeed: ISeed = seed.cross[which];
        if (parentSeed) {
          id = seed.cross[which].user.login;
          index = seed.cross[which].index;
          return `${id}-${index}`;
        }
      } else {
        id = seed.user.login;
        index = seed.index;
        return `${id}-${index}`;
      }
    }
    return '';
  };

  public render(): any {
    const seed: ISeed = this.props.seed;
    return (
      <TableRow>
        <TableRowColumn>{this.getSeedId(seed)}</TableRowColumn>
        <TableRowColumn>{seed.name}</TableRowColumn>
        <TableRowColumn>{this.getName(seed)}</TableRowColumn>
        <TableRowColumn>{this.getSeedId(seed, 'first')}</TableRowColumn>
        <TableRowColumn>{this.getSeedId(seed, 'second')}</TableRowColumn>
        <TableRowColumn>{this.dateLabel(seed)}</TableRowColumn>
      </TableRow>
    );
  }
};

export let Seed: any = createContainer(SeedComponent, {
  fragments: {
    seed: () => Relay.QL`
    fragment on seed {
      name,
      description,
      index,
      user {
        login
      },
      cross {
        name,
        first {
          index,
          user {
            login
          }
        },
        second {
          index,
          user {
            login
          }
        }
      }
      location,
      createdAt
    }`
  }
});
