import * as React from 'react';
import { RootContainer } from 'react-relay';
let Relay: any = require('react-relay');

export function createRelayContainer(Component: any, props: any) {
  if (Relay.isContainer(Component)) {
    let route: any = props.route.route;
    return (
      <Relay.RootContainer
        Component={Component}
        route={new route() }
        />
    );
  } else {
    return <Component {...props}/>;
  }
};
