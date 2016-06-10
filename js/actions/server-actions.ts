import { appDispatcher } from '../app-dispatcher.ts';
import { ActionTypes } from '../constants.ts';

class ServerActions {
  receiveSeeds(seeds) {
    appDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_SEEDS,
      seeds: seeds
    });
  }
}

export const serverActions = new ServerActions();