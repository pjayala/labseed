import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';

let Relay: any = require('react-relay');

import { List, Divider } from 'material-ui';

import { ISeed, IUser } from '../models/index.ts';
import { Seed } from './seed.tsx';
import { IPageInfo } from '../models/index.ts';

interface IMainState {
  seed: ISeed[];
}

interface IUserEdges {
  node: IUser;
}
interface IConnection {
  pageInfo: IPageInfo;
  edges: IUserEdges[];
}

interface IEdges {
  node: ISeed;
}
interface ISeedConnection {
  pageInfo: IPageInfo;
  edges: IEdges[];
}

interface IMainProps {
  seeds: ISeedConnection;
}

export class SeedListComponent extends React.Component<IMainProps, IMainState> {
  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.seeds.edges.map(edge => {
        return <span key={edge.node.id}><Seed seed={edge.node}/><Divider/></span>;
      });
    return (
      <List>
        {content}
      </List>
    );
  }
};

export let SeedList: any = createContainer(SeedListComponent, {
  initialVariables: {
  },
  fragments: {
    seeds: () => Relay.QL`
      fragment on seedConnection {
        edges {
          node {
            id,
            ${Seed.getFragment('seed')}
          }
        }
      }`
  }
});
