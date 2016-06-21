import * as React from 'react';
import { createContainer } from 'react-relay';
let Relay: any = require('react-relay');

import { ListItem, Avatar } from 'material-ui';

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
      <ListItem
        primaryText={seed.name}
        secondaryText={<p>{seed.location} | {seed.description} | {seed.user.id} | {seed.user.email} </p>}
      />
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
