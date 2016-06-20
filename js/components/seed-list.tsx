import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
let Relay: any = require('react-relay');

import { ISeed } from '../models/index.ts';
import { Seed } from './seed.tsx';

interface IMainState {
  seed: ISeed[];
}


interface IEdges {
  node: ISeed;
}
interface ISeedConnection {
  edges: IEdges[];
}

interface IMainProps {
  limit?: number;
  relay: RelayProp;
  store: {
    seedConnection: ISeedConnection;
  };
}

export class SeedListComponent extends React.Component<IMainProps, IMainState> {
  public setLimit: any = (e: any): void => {
    let newLimit: number = Number(e.target.value);
    this.props.relay.setVariables({ limit: newLimit });
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.seedConnection.edges.map(edge => {
        return <Seed key={edge.node.id} seed={edge.node}/>;
      });
    return (
      <div>
        <h3>Seeds</h3>
        <select onChange={this.setLimit} defaultValue={this.props.relay.variables.limit}>
          <option value='2'>2</option>
          <option value='4'>4</option>
        </select>
        <ul>
          {content}
        </ul>
      </div>
    );
  }
};

export let SeedList: any = createContainer(SeedListComponent, {
  initialVariables: {
    limit: 2
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        seedConnection(first: $limit) {
          edges {
            node {
              id,
              ${Seed.getFragment('seed')}
            }
          }
        }
      }`
  }
});
