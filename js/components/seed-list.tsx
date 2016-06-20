import * as React from 'react';
import { createContainer, RelayProp } from 'react-relay';
import { debounce } from 'lodash';

let Relay: any = require('react-relay');

import { ISeed } from '../models/index.ts';
import { Seed } from './seed.tsx';
import { IPageInfo } from '../models/index.ts';

import { ShowMore } from './show-more.tsx';

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

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> =
      this.props.store.seedConnection.edges.map(edge => {
        return <Seed key={edge.node.id} seed={edge.node}/>;
      });
    return (
      <div>
        <h3>Seeds</h3>
        <input type='text' placeholder='Search' onChange={this.search}/>
        <ul>
          {content}
        </ul>
        <ShowMore pageInfo={this.props.store.seedConnection.pageInfo} showMore={this.showMore}/>
      </div>
    );
  }
};

export let SeedList: any = createContainer(SeedListComponent, {
  initialVariables: {
    limit: 10,
    query: ''
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
