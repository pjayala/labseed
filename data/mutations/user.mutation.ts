import {
  GraphQLNonNull,
  GraphQLString,

} from 'graphql';
import { InsertOneWriteOpResult } from 'mongodb';
import {
  mutationWithClientMutationId
} from 'graphql-relay';

import { userConnection } from '../types/type.ts';

import { storeType } from '../types/type.ts';
import { store } from '../models/store.model.ts';

interface IUser {
  login: string;
  name: string;
  surname: string;
  email: string;
  createdAt?: number;
}

export let createUserMutation: any = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    login: { type: new GraphQLNonNull(GraphQLString) },
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


