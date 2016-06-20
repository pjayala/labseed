import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import * as moment from 'moment';
let Relay: any = require('react-relay');


import { IUser } from '../models/index.ts';

interface IProps {
  relay: RelayProp | any;
  user: IUser;
}

export class UserComponent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  public dateLabel(user: IUser): string {
    if (this.props.relay.hasOptimisticUpdate(user)) {
      return 'Saving...';
    }
    return moment(user.createdAt).format('d-MM-YYYY h:mm');
  }

  public render(): any {
    const user: IUser = this.props.user;
    return (
      <li>
        {this.dateLabel(user) } | {user.id} | {user.id} | {user.email}
      </li>
    );
  }
};

export let User: any = createContainer(UserComponent, {
  fragments: {
    user: () => Relay.QL`
      fragment on user {
        id,
        email,
        createdAt
      }`
  }
});
