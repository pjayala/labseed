import * as React from 'react';
import { get } from 'jquery';

import { API } from '../api.ts';
import { seedStore } from '../stores/seed-store.ts';

interface MainState {
  seeds: {
    _id: number;
    name: string;
    description: string;
    location: string;
  }[];
}

interface MainProps {
  limit?: number;
}

export class Main extends React.Component<MainProps, MainState> {
  constructor(props) {
    super(props);

    this.state = this.getAppState();
  }

  componentDidMount() {
    let api = new API();
    api.fetchSeeds();
    seedStore.on('change', this.onChange.bind(this));
  }

  componentWillUnmount() {
    seedStore.removeListener('change', this.onChange);
  }

  onChange() {
    this.setState(this.getAppState());
  }

  render() {
    const content = this.state.seeds.slice(0, this.props.limit).map(seed => {
      return <li key={seed._id}>
        {seed.name} | {seed.location} | {seed.description}
      </li>;
    });
    return (
      <div>
        <h3>Seeds</h3>
        <ul>
          {content}
        </ul>
      </div>
    );
  }

  private getAppState() {
    return { seeds: seedStore.getAll() };
  }
};

