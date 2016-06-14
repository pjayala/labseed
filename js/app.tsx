import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, RootContainer } from 'react-relay';
let Relay: any = require('react-relay');

import { Main } from './components/main.tsx';

console.log(React.version);


class HomeRoute extends Route {
  public static routeName: String = 'Home';
  public static queries: any = {
    store: (Component: any) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  };
}

ReactDOM.render(
  <RootContainer
    Component={Main}
    route={new HomeRoute()}
  />,
  document.getElementById('react')
);

