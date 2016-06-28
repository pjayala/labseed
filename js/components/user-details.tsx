import * as React from 'react';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');
import { createContainer, RelayProp } from 'react-relay';

import { TextField, Dialog, AppBar, Paper, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { CreateUserMutation } from '../mutations/create-user.mutation.ts';

import { UserList } from './user-list.tsx';
import { UserCreateComponent } from './user-create.tsx';

import { IUser } from '../models/index.ts';
import { IPageInfo } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';
import { SideMenu } from './side-menu.tsx';


interface IMainState {
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
  params: any;
}

export class UserDetailsComponent extends React.Component<IMainProps, IMainState> {

  private setVariables: any = debounce(this.props.relay.setVariables, 300);

  constructor(props: IMainProps) {
    super(props);
    this.state = {
      createUser: false
    };
    this.setVariables({
      id: this.props.params.id
    });
  }

  public handleToggleSideMenu: any = () => {
    this.setVariables({
      showSideMenu: !this.props.relay.variables.showSideMenu
    });
  };

  public render(): any {

    return (
      <div>
        <AppBar
          title='User Details'
          onLeftIconButtonTouchTap={this.handleToggleSideMenu}>
          <SideMenu open={this.props.relay.variables.showSideMenu} close={this.handleToggleSideMenu}/>
        </AppBar>

        <div className='row center-xs'>
          <div className='col-xs-12 col-sm-10 col-md-8 col-lg-6'>
            <div className='box'>
              <div className='row start-xs'>
                <div className='col-xs-12'>
                  <div className='box'>
                    <br/>
                    <Paper zDepth={2}>

                      <UserList users={this.props.store.userConnection}/>

                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export let UserDetails: any = createContainer(UserDetailsComponent, {
  initialVariables: {
    showSideMenu: false,
    id: 'xxxx'
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        userConnection(first: 1, query: $id) {
          ${UserList.getFragment('users')}
        }
      }`
  }
});
