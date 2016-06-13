import { post } from 'jquery';

import { serverActions } from './actions/server-actions.ts';

export class API {
  public fetchSeeds(): any {
    post('/graphql', {
      query: `{
        seeds {
          _id,
          name,
          description,
          user {
            id,
            name,
            surname,
            email
          }
          location
        }
      }`
    }).done(resp => {
      serverActions.receiveSeeds(resp.data.seeds);
    });
  }
};

