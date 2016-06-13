import { EventEmitter } from 'events';

import { appDispatcher } from '../app-dispatcher.ts';
import { ActionTypes } from '../constants.ts';

import { ISeed } from '../models/index.ts';

class SeedStore extends EventEmitter {
  private seeds: ISeed[] = [];

  constructor() {
    super();

    appDispatcher.register((action: any) => {
      switch (action.actionType) {
        case ActionTypes.RECEIVE_SEEDS:
          this.seeds = action.seeds;
          this.emit('change');
          break;
        default:
        // do nothing
      }
    });
  }

  public getAll() {
    return this.seeds;
  }
}

export let seedStore: SeedStore = new SeedStore();
