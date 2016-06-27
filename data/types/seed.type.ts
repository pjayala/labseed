import {
  GraphQLObjectTypeConfig,
  GraphQLString,
  GraphQLInt
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { ObjectID } from 'mongodb';

import { userType, nodeDefs } from './type.ts';
import { crossType } from './cross.type.ts';

export class SeedTypeConfig {
  public getConfig(): GraphQLObjectTypeConfig {
    return {
      name: 'seed',
      fields: () => ({
        id: globalIdField('Seed', (seed) => seed._id),
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        index: { type: GraphQLInt },
        createdAt: {
          type: GraphQLString,
          resolve: (obj) => new Date(obj.createdAt).toISOString()
        },
        user: {
          type: userType,
          resolve: (parent, args, context) =>
            context.db.collection('users').find({ _id: new ObjectID(parent.userId) }).limit(1).next()
        },
        cross: {
          type: crossType,
          resolve: (parent, args) => parent.cross
        },
        location: { type: GraphQLString }
      }),
      interfaces: [nodeDefs.nodeInterface]
    };
  };
};




