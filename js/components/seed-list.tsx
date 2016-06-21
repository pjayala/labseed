import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');

import { List, TextField, RaisedButton, Dialog, AppBar, Paper, Divider } from 'material-ui';

import { ISeed } from '../models/index.ts';
import { Seed } from './seed.tsx';
import { IPageInfo } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';
import { SideMenu } from './side-menu.tsx';

interface IMainState {
  seed: ISeed[];
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
  };
}

export class SeedListComponent extends React.Component<IMainProps, IMainState> {
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
      showSideMenu: ! this.props.relay.variables.showSideMenu
    });
  };

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.seedConnection.edges.map(edge => {
        return <span key={edge.node.id}><Seed seed={edge.node}/><Divider/></span>;
      });
    return (
      <div>
        <AppBar
          title='Seeds'
          onLeftIconButtonTouchTap={this.handleToggleSideMenu}>
          <SideMenu open={this.props.relay.variables.showSideMenu} close={this.handleToggleSideMenu}/>
          <TextField hintText='Search seeds' onChange={this.search}/>
        </AppBar>
        <div className='row center-xs'>
          <div className='col-xs-12 col-sm-8 col-md-6 col-lg-4'>
            <div className='box'>
              <div className='row start-xs'>
                <div className='col-xs-12'>
                  <div className='box'>
                    <br/>
                    <Paper zDepth={2}>
                      <List>
                        {content}
                      </List>
                      <ShowMore pageInfo={this.props.store.seedConnection.pageInfo} showMore={this.showMore}/>
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

export let SeedList: any = createContainer(SeedListComponent, {
  initialVariables: {
    limit: 10,
    query: '',
    showSideMenu: false
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        seedConnection(first: $limit, query: $query) {
          pageInfo{
            hasNextPage
          },
          edges {
            node {
              id,
              ${Seed.getFragment('seed')}
            }
          }
        }
      }`
  }
});
