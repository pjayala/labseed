import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');

import { List, TextField, RaisedButton, Dialog, AppBar, Paper, Divider, AutoComplete, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { CreateSeedMutation } from '../mutations/create-seed.mutation.ts';

import { ISeed, IUser } from '../models/index.ts';
import { Seed } from './seed.tsx';
import { SeedList } from './seed-list.tsx';

import { IPageInfo } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';
import { SideMenu } from './side-menu.tsx';

interface IMainState {
  seed: ISeed[];
}

interface IUserEdges {
  node: IUser;
}
interface IConnection {
  pageInfo: IPageInfo;
  edges: IUserEdges[];
}

interface IEdges {
  node: ISeed;
}
interface ISeedConnection {
  pageInfo: IPageInfo;
  edges: IEdges[];
}

interface IMainProps {
  limit?: number;
  relay: RelayProp;
  store: {
    seedConnection: ISeedConnection;
    userConnection: IConnection;
  };
}

export class SeedManagerComponent extends React.Component<IMainProps, IMainState> {
  public refs: {
    [string: string]: any;
    newName: any;
    newDescription: any;
    newLocation: any;
    newUserId: any;
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

  public handleToggleSideMenu: any = () => {
    this.setVariables({
      showSideMenu: !this.props.relay.variables.showSideMenu
    });
  };

  public handleSubmit: any = (e: any): void => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new CreateSeedMutation({
        name: this.refs.newName.input.value,
        description: this.refs.newDescription.input.value,
        location: this.refs.newLocation.input.value,
        userId: this.refs.newUserId.refs.searchTextField.input.value,
        store: this.props.store
      })
    );
    this.handleClose();
    this.refs.newName.input.value = '';
    this.refs.newDescription.input.value = '';
    this.refs.newLocation.input.value = '';
    this.refs.newUserId.refs.searchTextField.input.value = '';
  }

  public handleOpen: any = () => {
    this.setVariables({ createUser: true });
  };

  public handleClose: any = () => {
    this.setVariables({ createUser: false });
  };

  public getUsers: any = () => {
    return this.props.store.userConnection.edges.map(edge => {
      return edge.node.id;
    });
  };

  public handleUpdateInput: any = (input: any) => {
    this.setVariables({ userQuery: input });
  };

  public render(): any {
    return (
      <div>
        <AppBar
          title='Seeds'
          onLeftIconButtonTouchTap={this.handleToggleSideMenu}>
          <SideMenu open={this.props.relay.variables.showSideMenu} close={this.handleToggleSideMenu}/>
          <TextField hintText='Search seeds' onChange={this.search}/>
        </AppBar>

        <Dialog
          title='Create new Seed'
          modal={false}
          open={this.props.relay.variables.createUser}
          onRequestClose={this.handleClose}
          >
          <form onSubmit={this.handleSubmit}>
            <TextField
              hintText='Name'
              floatingLabelText='Name'
              fullWidth={true}
              ref='newName'
              /><br />
            <TextField
              hintText='Description'
              floatingLabelText='Description'
              fullWidth={true}
              ref='newDescription'
              /><br />
            <TextField
              hintText='Location'
              floatingLabelText='Location'
              fullWidth={true}
              ref='newLocation'
              /><br />

            <AutoComplete
              hintText='Select a user'
              floatingLabelText='User'
              dataSource={this.getUsers() }
              onUpdateInput={this.handleUpdateInput}
              fullWidth={true}
              filter={(searchText: string, key: string) => true}
              ref='newUserId'
              /><br />

            <RaisedButton type='submit' label='New seed' primary/>
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
                      <div className='row end-xs'>
                        <div className='col-xs-2'>
                          <div className='box'>
                            <FloatingActionButton onClick={this.handleOpen} mini={true}>
                              <ContentAdd />
                            </FloatingActionButton>
                          </div>
                        </div>
                      </div>

                      <SeedList seeds={this.props.store.seedConnection}/>

                      <div className='row center-xs'>
                        <div className='col-xs-12'>
                          <div className='box'>
                            <ShowMore pageInfo={this.props.store.seedConnection.pageInfo} showMore={this.showMore}/>
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

export let SeedManager: any = createContainer(SeedManagerComponent, {
  initialVariables: {
    limit: 10,
    query: '',
    showSideMenu: false,
    createUser: false,
    userQuery: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        seedConnection(first: $limit, query: $query) {
          pageInfo{
            hasNextPage
          },
          ${SeedList.getFragment('seeds')}
        },
        userConnection(first: 10, query: $userQuery) {
          edges {
            node {
              id
            }
          }
        }
      }`
  }
});
