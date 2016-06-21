import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Route } from 'react-relay';
let Relay: any = require('react-relay');
let ReactRouter: any = require('react-router');
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import * as getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider } from 'material-ui/styles';

import { createRelayContainer } from './relay-container.tsx';

import { App } from './components/app.tsx';
import { SeedList } from './components/seed-list.tsx';
import { UserList } from './components/user-list.tsx';

console.log(React.version);

class RelayRoute extends Route {
  public static routeName: String = 'Query';
  public static queries: any = {
    store: (Component: any) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  };
}

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme.default()}>
    <ReactRouter.Router
      history={browserHistory}
      createElement={createRelayContainer}>
      <ReactRouter.Route path='/' component={App}>
        <ReactRouter.IndexRoute
          components={{ content: SeedList }}
          route={RelayRoute}/>
        <ReactRouter.Route
          path='/users'
          components={{ content: UserList }}
          route={RelayRoute}
          />
      </ReactRouter.Route>
    </ReactRouter.Router>
  </MuiThemeProvider>,
  document.getElementById('react')
);
