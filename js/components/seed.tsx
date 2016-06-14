import * as React from 'react';
import { createContainer } from 'react-relay';
let Relay: any = require('react-relay');

import { ISeed } from '../models/index.ts';

interface IProps {
  seed: ISeed;
}

export class SeedComponent extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): any {
    const seed: ISeed = this.props.seed;
    return (
      <li>
        {seed.name} | {seed.location} | {seed.description} | {seed.user.id} | {seed.user.email}
      </li>
    );
  }
};

export let Seed: any = createContainer(SeedComponent, {
  fragments: {
    seed: () => Relay.QL`
    fragment on seed {
      name,
      description,
      user {
        id,
        email
      }
      location
    }`
  }
});
