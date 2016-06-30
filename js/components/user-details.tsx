import * as React from 'react';
import { debounce } from 'lodash';
import { Link } from 'react-router';

let Relay: any = require('react-relay');
import { createContainer, RelayProp } from 'react-relay';

import { AppBar, Paper } from 'material-ui';

import { UpdateUserMutation } from '../mutations/user-update.mutation.ts';
import { UserCreateComponent } from './user-create.tsx';
import { SeedList } from './seed-list.tsx';

import { IUser } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';
import { SideMenu } from './side-menu.tsx';


interface IMainState {
}

interface IMainProps {
  limit?: number;
  relay: RelayProp | any;
  history: any;
  store: {
    userConnection: {
      edges: {
        node: IUser;
      }[];
    }
  };
  params: any;
}

export class UserDetailsComponent extends React.Component<IMainProps, IMainState> {

  private setVariables: any = debounce(this.props.relay.setVariables, 300);


  public showMore: any = (e: any): void => {
    this.props.relay.setVariables({ limit: this.props.relay.variables.limit + 10 });
  }

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

  public handleSubmit: any = (user: any): void => {
    user.id = this.props.store.userConnection.edges[0].node.id;
    user.store = this.props.store;
    Relay.Store.commitUpdate(
      new UpdateUserMutation(user)
    );
  }

  public render(): any {
    const content: any = this.props.store.userConnection.edges.length ? (
      <span>
        <UserCreateComponent createUser={this.handleSubmit} user={this.props.store.userConnection.edges[0].node}/>
      </span>
    ) : <span/>;

    const seedListContent: any = this.props.store.userConnection.edges.length ? (
      <span>
        < SeedList seeds= { this.props.store.userConnection.edges[0].node.seedConnection } />

        <div className='row center-xs'>
          <div className='col-xs-12'>
            <div className='box'>
              <ShowMore pageInfo={this.props.store.userConnection.edges[0].node.seedConnection.pageInfo} showMore={this.showMore}/>
            </div>
          </div>
        </div>

      </span>
    ) : <span/>;

    return (
      <div>
        <AppBar
          title={<span><a href='#' onClick={this.props.history.goBack} alt='Users'>◀︎ </a>User Details</span>}
          onLeftIconButtonTouchTap={this.handleToggleSideMenu}>
          <SideMenu open={this.props.relay.variables.showSideMenu} close={this.handleToggleSideMenu}/>
        </AppBar>

        <div className='row center-xs'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='box'>
              <div className='row start-xs'>
                <div className='col-xs-12'>
                  <div className='box'>
                    <br/>
                    <Paper zDepth={2}>
                      {content}
                    </Paper>
                    <br/>
                    <Paper zDepth={2}>
                      {seedListContent}
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
    id: 'xxxx',
    limit: 10,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        userConnection(first: 1, query: $id) {
          edges {
            node {
              id,
              login,
              name,
              surname,
              email,
              seedConnection(first: $limit, query: $query) {
                pageInfo{
                  hasNextPage
                },
                ${SeedList.getFragment('seeds')}
              }
            }
          }
        }
      }`
  }
});
