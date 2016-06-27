import {
  GraphQLObjectTypeConfig,
  GraphQLString,
  GraphQLList
} from 'graphql';
import { globalIdField, connectionFromPromisedArray } from 'graphql-relay';

import { nodeDefs } from './type.ts';
import { connectionArgsExt, IConnectionArgsExt } from './connection-args.ts';
import { seedConnection } from './type.ts';

export class UserTypeConfig {
  public getConfig(): GraphQLObjectTypeConfig {
    return {
      name: 'user',
      fields: () => ({
        id: globalIdField('User', (user) => user._id),
        login: { type: GraphQLString },
        name: { type: GraphQLString },
        surname: { type: GraphQLString },
        email: { type: GraphQLString },
        createdAt: {
          type: GraphQLString,
          resolve: (obj) => new Date(obj.createdAt).toISOString()
        },
        seedConnection: {
          type: seedConnection.connectionType,
          args: connectionArgsExt,
          resolve: (parent, args: IConnectionArgsExt, context) => {
            let findParams: any = { userId: `${parent._id}` };
            if (args.query) {
              findParams[args.field || 'name'] = new RegExp(args.query, 'i');
            }
            if (!args.limit || args.limit > 200) {
              args.limit = 100;
            }
            return connectionFromPromisedArray(
              context.db.collection('seeds')
                .find(findParams)
                .sort({ createdAt: -1 })
                .limit(Number(args.limit))
                .toArray(),
              args);
          }
        }
      }),
      interfaces: [nodeDefs.nodeInterface]
    };
  };
};
