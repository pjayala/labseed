import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
let Relay: any = require('react-relay');

import { IUser } from '../models/index.ts';

interface IMainState {
  user: IUser[];
}

interface IEdges {
  node: IUser;
}
interface IConnection {
  edges: IEdges[];
}

interface IMainProps {
  limit?: number;
  relay: RelayProp;
  store: {
    userConnection: IConnection;
  };
}

export class UserListComponent extends React.Component<IMainProps, IMainState> {
  public setLimit: any = (e: any): void => {
    let newLimit: number = Number(e.target.value);
    this.props.relay.setVariables({ limit: newLimit });
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.userConnection.edges.map(edge => {
        return <li key={edge.node.id}>{edge.node.email}</li>;
      });
    return (
      <div>
        <h3>Users</h3>
        <select onChange={this.setLimit} default={this.props.relay.variables.limit}>
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

export let UserList: any = createContainer(UserListComponent, {
  initialVariables: {
    limit: 4
  },
  fragments: {
    store: () => Relay.QL`
    fragment on Store {
      userConnection(first: $limit) {
        edges {
          node {
            id,
            email
          }
        }
      }
    }`
  }
});
