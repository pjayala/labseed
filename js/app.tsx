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
import { SeedManager } from './components/seed-manager.tsx';
import { UserManager } from './components/user-manager.tsx';

console.log(React.version);

class RelayRoute1 extends Route {
  public static routeName: String = 'Query';
  public static queries: any = {
    store: (Component: any) => Relay.QL`
      query MainQuery1 {
        store { ${Component.getFragment('store')} }
      }
    `
  };
}

class RelayRoute2 extends Route {
  public static routeName: String = 'Query';
  public static queries: any = {
    store: (Component: any) => Relay.QL`
      query MainQuery2 {
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
          components={{ content: SeedManager }}
          route={RelayRoute1}/>
        <ReactRouter.Route
          path='/users'
          components={{ content: UserManager }}
          route={RelayRoute2}
          />
      </ReactRouter.Route>
    </ReactRouter.Router>
  </MuiThemeProvider>,
  document.getElementById('react')
);
