import {
  GraphQLObjectType
} from 'graphql';
import {
  GraphQLNodeDefinitions,
  ResolvedGlobalId,
  nodeDefinitions,
  fromGlobalId,
  GraphQLConnectionDefinitions,
  connectionDefinitions
} from 'graphql-relay';
import { ObjectID } from 'mongodb';

import { IContext } from '../models/context.model.ts';
import { SeedTypeConfig } from './seed.type.ts';
import { StoreTypeConfig } from './store.type.ts';
import { UserTypeConfig } from './user.type.ts';

export let storeType: GraphQLObjectType;
export let seedType: GraphQLObjectType;
export let userType: GraphQLObjectType;

class Store { };
export let store: Store = new Store();


async function idFetcher(globalId: any, context: IContext) {
  let global: ResolvedGlobalId = fromGlobalId(globalId);
  if (global.type === 'Store') {
    return store;

  } else if (global.type === 'Seed') {
    return await context.db.collection('seeds').find({ _id: new ObjectID(global.id) }).limit(1).next();

  } else if (global.type === 'User') {
    return await context.db.collection('users').find({ _id: new ObjectID(global.id) }).limit(1).next();

  }
  return null;

}

export let nodeDefs: GraphQLNodeDefinitions = nodeDefinitions(
  idFetcher,
  (obj) => {
    if (obj instanceof Store) {
      return storeType;

    } else if (obj.cross) {
      return seedType;

    } else if (obj.email) {
      return userType;
    }
    return null;
  }

);

userType = new GraphQLObjectType(new UserTypeConfig().getConfig());
export let userConnection: GraphQLConnectionDefinitions = connectionDefinitions({
  name: 'user',
  nodeType: userType
});


seedType = new GraphQLObjectType(new SeedTypeConfig().getConfig());
export let seedConnection: GraphQLConnectionDefinitions = connectionDefinitions({
  name: 'seed',
  nodeType: seedType
});

storeType = new GraphQLObjectType(new StoreTypeConfig().getConfig());
