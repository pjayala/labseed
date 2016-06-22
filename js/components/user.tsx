import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import * as moment from 'moment';
let Relay: any = require('react-relay');

import { ListItem, Avatar } from 'material-ui';
import { darkBlack } from 'material-ui/styles/colors';

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
      <ListItem
        primaryText={user.id}
        secondaryText={<p><span style={{ color: darkBlack }}>{user.email}</span> -- {this.dateLabel(user) } </p>}
        leftAvatar={
          <Avatar>
            {user.id.substring(0, 2)}
          </Avatar>
        }
        />
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
