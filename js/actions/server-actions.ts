import { appDispatcher } from '../app-dispatcher.ts';
import { ActionTypes } from '../constants.ts';

import { ISeed } from '../models/index.ts';

class ServerActions {
  public receiveSeeds(seeds: ISeed[]) {
    appDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_SEEDS,
      seeds: seeds
    });
  }
}

export const serverActions: ServerActions = new ServerActions();
