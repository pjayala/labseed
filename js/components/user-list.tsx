import * as React from 'react';
import * as moment from 'moment';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');
import { createContainer, RelayProp } from 'react-relay';
import { CreateUserMutation } from '../mutations/create-user.mutation.ts';

import { User } from './user.tsx';
import { IUser } from '../models/index.ts';
import { IPageInfo } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';


interface IMainState {
  user: IUser[];
}

interface IEdges {
  node: IUser;
}
interface IConnection {
  pageInfo: IPageInfo;
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
  public refs: {
    [string: string]: any;
    newId: any;
    newName: any;
    newSurname: any;
    newEmail: any;
  };

  private setVariables: any = debounce(this.props.relay.setVariables, 300);

  public showMore: any = (e: any): void => {
    this.props.relay.setVariables({ limit: this.props.relay.variables.limit + 10 });
  }

  public search: any = (e: any): void => {
    this.setVariables({
      query: e.target.value,
      limit: 10
    });
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
        return <User key={edge.node.id} user={edge.node}/>;
      });
    return (
      <div>
        <h3>Users</h3>
        <input type='text' placeholder='Search' onChange={this.search}/>

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
        <ShowMore pageInfo={this.props.store.userConnection.pageInfo} showMore={this.showMore}/>
      </div>
    );
  }
};

export let UserList: any = createContainer(UserListComponent, {
  initialVariables: {
    limit: 10,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        userConnection(first: $limit, query: $query) {
          pageInfo{
            hasNextPage
          },
          edges {
            node {
              id,
              ${User.getFragment('user')}
            }
          }
        }
      }`
  }
});
