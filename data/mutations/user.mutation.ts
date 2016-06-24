import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import { InsertOneWriteOpResult } from 'mongodb';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import { userConnection } from '../types/user.type.ts';

import { store, storeType } from '../types/store.type.ts';

interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  createdAt?: number;
}

export let createUserMutation: any = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    surname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    userEdge: {
      type: userConnection.edgeType,
      resolve: (obj: InsertOneWriteOpResult) => ({ node: obj.ops[0], cursor: obj.insertedId })
    },
    store: {
      type: storeType,
      resolve: () => store
    }
  },
  mutateAndGetPayload: (user: IUser, context) => {
    user.createdAt = Date.now();
    return context.db.collection('users').insertOne(user);
  }
});


