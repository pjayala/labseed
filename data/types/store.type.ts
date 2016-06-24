import {
  GraphQLObjectType
} from 'graphql';
import {
  connectionFromPromisedArray,
  globalIdField,
  GraphQLNodeDefinitions,
  ResolvedGlobalId,
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay';

import { connectionArgsExt, IConnectionArgsExt } from './connection-args.ts';

import { seedConnection } from './seed.type.ts';
import { userConnection, userType } from './user.type.ts';

export let storeType: GraphQLObjectType;

class Store { };
export let store: Store = new Store();

export let nodeDefs: GraphQLNodeDefinitions = nodeDefinitions(
  (globalId) => {
    let global: ResolvedGlobalId = fromGlobalId(globalId);
    if (global.type === 'Store') {
      return store;
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Store) {
      return storeType;
    }

    return userType;
  }
);

storeType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    id: globalIdField('Store'),
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
          findParams[args.field || 'id'] = new RegExp(args.query, 'i');
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
});
