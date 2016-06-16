import * as React from 'react';
import * as moment from 'moment';

import { createContainer, RelayProp } from 'react-relay';
import { CreateUserMutation } from '../mutations/create-user.mutation.ts';

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
  relay: RelayProp | any;
  store: {
    userConnection: IConnection;
  };
}

export class UserListComponent extends React.Component<IMainProps, IMainState> {
  refs: {
    [string: string]: any;
    newId: any;
    newName: any;
    newSurname: any;
    newEmail: any;
  }

  public setLimit: any = (e: any): void => {
    let newLimit: number = Number(e.target.value);
    this.props.relay.setVariables({ limit: newLimit });
  }

  public handleSubmit: any = (e: any): void => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new CreateUserMutation({
        id: this.refs.newId.value,
        name: this.refs.newName.value,
        surname: this.refs.newSurname.value,
        email: this.refs.newEmail.value,
        store: this.props.store
      })
    );
    this.refs.newId.value = '';
    this.refs.newName.value = '';
    this.refs.newSurname.value = '';
    this.refs.newEmail.value = '';
  }

  public dateLabel(user: IUser): string {
    if (this.props.relay.hasOptimisticUpdate(user)) {
      return 'Saving...';
    }
    return moment(user.createdAt).format('d-MM-YYYY h:mm');
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.userConnection.edges.map(edge => {
        return <li key={edge.node.id}>
          {this.dateLabel(edge.node) } | {edge.node.email}
          </li>;
      });
    return (
      <div>
        <h3>Users</h3>
        <select onChange={this.setLimit} defaultValue={this.props.relay.variables.limit}>
          <option value='2'>2</option>
          <option value='4'>4</option>
        </select>

        <form onSubmit={this.handleSubmit}>
          <input type='test' placeholder='id' ref='newId'/>
          <input type='text' placeholder='name' ref='newName'/>
          <input type='text' placeholder='surname' ref='newSurname'/>
          <input type='text' placeholder='email' ref='newEmail'/>
          <button type='submit'>New user</button>
        </form>
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
      id,
      userConnection(first: $limit) {
        edges {
          node {
            id,
            email,
            createdAt
          }
        }
      }
    }`
  }
});
