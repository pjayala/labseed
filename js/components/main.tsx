import * as React from 'react';

import { API } from '../api.ts';
import { seedStore } from '../stores/seed-store.ts';

import { ISeed } from '../models/index.ts';

interface IMainState {
  seeds: ISeed[];
}

interface IMainProps {
  limit?: number;
}

export class Main extends React.Component<IMainProps, IMainState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = this.getAppState();
  }

  public componentDidMount(): any {
    let api: API = new API();
    api.fetchSeeds();
    seedStore.on('change', this.onChange.bind(this));
  }

  public componentWillUnmount(): any {
    seedStore.removeListener('change', this.onChange);
  }

  public onChange(): any {
    this.setState(this.getAppState());
  }

  public render(): any {
    const content: React.HTMLProps<HTMLLIElement> = this.state.seeds.slice(0, this.props.limit).map(seed => {
      return <li key={seed._id}>
        {seed.name} | {seed.location} | {seed.description} | {seed.user.id} | {seed.user.email}
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

  private getAppState(): IMainState {
    return { seeds: seedStore.getAll() };
  }
};

