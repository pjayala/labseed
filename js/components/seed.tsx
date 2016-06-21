import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import * as moment from 'moment';
let Relay: any = require('react-relay');

import { ListItem, Avatar } from 'material-ui';
import { darkBlack } from 'material-ui/styles/colors';

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

  public render(): any {
    const seed: ISeed = this.props.seed;
    return (
      <ListItem
        primaryText={seed.name}
        secondaryTextLines={2}
        secondaryText={
          <p>
            <span style={{ color: darkBlack }}>{seed.location} | {seed.description} | {seed.user.id} | {seed.user.email}</span>
            <br/> {this.dateLabel(seed) }
          </p>
        }
      />
    );
  }
};

export let Seed: any = createContainer(SeedComponent, {
  fragments: {
    seed: () => Relay.QL`
    fragment on seed {
      name,
      description,
      user {
        id,
        email
      }
      location,
      createdAt
    }`
  }
});
