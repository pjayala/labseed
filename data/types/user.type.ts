import {
  GraphQLObjectTypeConfig,
  GraphQLString,
  GraphQLList
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeDefs } from './type.ts';
import { seedType } from './type.ts';

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
        seeds: {
          type: new GraphQLList(seedType),
          resolve: (parent, args, context) =>
            context.db.collection('seeds').find({ userId: `${parent._id}` }).toArray()
        }
      }),
      interfaces: [nodeDefs.nodeInterface]
    };
  };
};
