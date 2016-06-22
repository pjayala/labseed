import * as React from 'react';

let Relay: any = require('react-relay');
import { createContainer } from 'react-relay';

import { List, Divider } from 'material-ui';

import { User } from './user.tsx';
import { IUser } from '../models/index.ts';

interface IMainState {
}

interface IEdges {
  node: IUser;
}
interface IConnection {
  edges: IEdges[];
}

interface IMainProps {
  users: IConnection;
}

export class UserListComponent extends React.Component<IMainProps, IMainState> {

  constructor(props: IMainProps) {
    super(props);
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.users.edges.map(edge => {
        return <span key={edge.node.id}><User user={edge.node}/><Divider /></span>;
      });
    return (
      <List>
        {content}
      </List>
    );
  }
};

export let UserList: any = createContainer(UserListComponent, {
  initialVariables: {
  },
  fragments: {
    users: () => Relay.QL`
      fragment on userConnection {
        edges {
          node {
            id,
            ${User.getFragment('user')}
          }
        }
      }`
  }
});
