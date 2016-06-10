import { EventEmitter } from 'events';

import { appDispatcher } from '../app-dispatcher.ts';
import { ActionTypes } from '../constants.ts';

class SeedStore extends EventEmitter {
  private seeds = [];

  constructor(props) {
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

  getAll() {
    return this.seeds;
  }
}

export let seedStore = new SeedStore({});