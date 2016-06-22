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
}

export class UserManagerComponent extends React.Component<IMainProps, IMainState> {

  private setVariables: any = debounce(this.props.relay.setVariables, 300);

  constructor(props: IMainProps) {
    super(props);
    this.state = {
      createUser: false
    };
  }

  public showMore: any = (e: any): void => {
    this.props.relay.setVariables({ limit: this.props.relay.variables.limit + 10 });
  }

  public search: any = (e: any): void => {
    this.setVariables({
      query: e.target.value,
      limit: 10
    });
  }

  public handleSubmit: any = (user: any): void => {
    user.store = this.props.store;
    Relay.Store.commitUpdate(
      new CreateUserMutation(user)
    );
    this.handleClose();
  }

  public handleToggleSideMenu: any = () => {
    this.setVariables({
      showSideMenu: !this.props.relay.variables.showSideMenu
    });
  };

  public handleOpen: any = () => {
    this.setVariables({ createUser: true });
  };

  public handleClose: any = () => {
    this.setVariables({ createUser: false });
  };

  public render(): any {

    return (
      <div>
        <AppBar
          title='Users'
          onLeftIconButtonTouchTap={this.handleToggleSideMenu}>
          <SideMenu open={this.props.relay.variables.showSideMenu} close={this.handleToggleSideMenu}/>
          <TextField hintText='Search users' onChange={this.search}/>
        </AppBar>

        <Dialog
          title='Create new User'
          modal={false}
          open={this.props.relay.variables.createUser}
          onRequestClose={this.handleClose}
          >
          <UserCreateComponent createUser={this.handleSubmit} />
        </Dialog>
        <div className='row center-xs'>
          <div className='col-xs-12 col-sm-10 col-md-8 col-lg-6'>
            <div className='box'>
              <div className='row start-xs'>
                <div className='col-xs-12'>
                  <div className='box'>
                    <br/>
                    <Paper zDepth={2}>
                      <div className='row end-xs'>
                        <div className='col-xs-2'>
                          <div className='box'>
                            <FloatingActionButton onClick={this.handleOpen} mini={true}>
                              <ContentAdd />
                            </FloatingActionButton>
                          </div>
                        </div>
                      </div>

                      <UserList users={this.props.store.userConnection}/>

                      <div className='row center-xs'>
                        <div className='col-xs-12'>
                          <div className='box'>
                            <ShowMore pageInfo={this.props.store.userConnection.pageInfo} showMore={this.showMore}/>
                          </div>
                        </div>
                      </div>
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

export let UserManager: any = createContainer(UserManagerComponent, {
  initialVariables: {
    limit: 10,
    query: '',
    showSideMenu: false,
    createUser: false
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        userConnection(first: $limit, query: $query) {
          pageInfo{
            hasNextPage
          },
          ${UserList.getFragment('users')}
        }
      }`
  }
});
