import * as React from 'react';
import * as moment from 'moment';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');
import { createContainer, RelayProp } from 'react-relay';

import { List, TextField, RaisedButton, Dialog, AppBar, Paper, Divider } from 'material-ui';

import { CreateUserMutation } from '../mutations/create-user.mutation.ts';

import { User } from './user.tsx';
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

export class UserListComponent extends React.Component<IMainProps, IMainState> {
  public refs: {
    [string: string]: any;
    newId: any;
    newName: any;
    newSurname: any;
    newEmail: any;
  };

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

  public handleSubmit: any = (e: any): void => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new CreateUserMutation({
        id: this.refs.newId.input.value,
        name: this.refs.newName.input.value,
        surname: this.refs.newSurname.input.value,
        email: this.refs.newEmail.input.value,
        store: this.props.store
      })
    );
    this.handleClose();
    this.refs.newId.input.value = '';
    this.refs.newName.input.value = '';
    this.refs.newSurname.input.value = '';
    this.refs.newEmail.input.value = '';
  }

  public handleToggleSideMenu: any = () => {
    this.setVariables({
      showSideMenu: ! this.props.relay.variables.showSideMenu
    });
  };

  public handleOpen: any = () => {
    this.setVariables({ createUser: true });
  };

  public handleClose: any = () => {
    this.setVariables({ createUser: false });
  };

  public dateLabel(user: IUser): string {
    if (this.props.relay.hasOptimisticUpdate(user)) {
      return 'Saving...';
    }
    return moment(user.createdAt).format('d-MM-YYYY h:mm');
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.userConnection.edges.map(edge => {
        return <span key={edge.node.id}><User user={edge.node}/><Divider /></span>;
      });
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
          <form onSubmit={this.handleSubmit}>
            <TextField
              hintText='Enter a unique user id'
              floatingLabelText='User id'
              ref='newId'
              /><br />
            <TextField
              hintText='User name'
              floatingLabelText='Name'
              ref='newName'
              /><br />
            <TextField
              hintText='User surname'
              floatingLabelText='Surname'
              ref='newSurname'
              /><br />
            <TextField
              hintText='Email address'
              floatingLabelText='Email'
              ref='newEmail'
              /><br />
            <RaisedButton type='submit' label='New user' primary/>
          </form>
        </Dialog>
        <div className='row center-xs'>
          <div className='col-xs-12 col-sm-10 col-md-8 col-lg-6'>
            <div className='box'>
              <div className='row start-xs'>
                <div className='col-xs-12'>
                  <div className='box'>
                    <br/>
                    <Paper zDepth={2}>
                      <RaisedButton label='New user' onClick={this.handleOpen} />

                      <List>
                        {content}
                      </List>

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

export let UserList: any = createContainer(UserListComponent, {
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
