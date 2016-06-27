import {
  GraphQLObjectTypeConfig
} from 'graphql';
import {
  connectionFromPromisedArray,
  globalIdField
} from 'graphql-relay';

import { connectionArgsExt, IConnectionArgsExt } from './connection-args.ts';

import { seedConnection, nodeDefs } from './type.ts';
import { userConnection } from './type.ts';

export class StoreTypeConfig {
  public getConfig(): GraphQLObjectTypeConfig {
    return {
      name: 'Store',
      fields: () => ({
        id: globalIdField('Store'),
        node: nodeDefs.nodeField,
        seedConnection: {
          type: seedConnection.connectionType,
          args: connectionArgsExt,
          resolve: (_, args: IConnectionArgsExt, context) => {
            let findParams: any = {};
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
              args
            );
          }
        },
        userConnection: {
          type: userConnection.connectionType,
          args: connectionArgsExt,
          resolve: (_, args: IConnectionArgsExt, context) => {
            let findParams: any = {};
            if (args.query) {
              findParams[args.field || 'login'] = new RegExp(args.query, 'i');
            }
            if (!args.limit || args.limit > 200) {
              args.limit = 100;
            }
            return connectionFromPromisedArray(
              context.db.collection('users')
                .find(findParams)
                .sort({ createdAt: -1 })
                .limit(Number(args.limit))
                .toArray(),
              args
            );
          }
        }
      }),
      interfaces: [nodeDefs.nodeInterface]
    };
  };
};
