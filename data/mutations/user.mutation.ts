import {
  GraphQLNonNull,
  GraphQLString,

} from 'graphql';
import { InsertOneWriteOpResult } from 'mongodb';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { ObjectID } from 'mongodb';

import { userConnection } from '../types/type.ts';

import { storeType } from '../types/type.ts';
import { store } from '../models/store.model.ts';
import { IContext } from '../models/context.model.ts';

interface IUser {
  id: string;
  login: string;
  name: string;
  surname: string;
  email: string;
  createdAt?: number;
  updatedAt?: number;
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
  mutateAndGetPayload: (user: IUser, context: IContext) => {
    user.createdAt = Date.now();
    return context.db.collection('users').insertOne(user);
  }
});


export let updateUserMutation: any = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    login: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    surname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    store: {
      type: storeType,
      resolve: () => {
        console.log(store);
        return store;
      }
    }
  },
  mutateAndGetPayload: (user: IUser, context: IContext) => {
    user.updatedAt = Date.now();
    let id: ObjectID = new ObjectID(fromGlobalId(user.id).id);
    console.log(user);
    return context.db.collection('users').updateOne(
      { _id: id },
      {
        $set: {
          login: user.login,
          email: user.email,
          name: user.name,
          surname: user.surname,
          updatedAt: user.updatedAt
        }
      }
    );
  }
});
