import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} from 'graphql';
import {
  connectionDefinitions,
  GraphQLConnectionDefinitions
} from 'graphql-relay';

import { userType } from './user.type.ts';
import { crossType } from './cross.type.ts';

export let seedType: GraphQLObjectType = new GraphQLObjectType({
  name: 'seed',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj._id
    },
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
        context.db.collection('users').find({ id: parent.userId }).limit(1).next()
    },
    cross: {
      type: crossType,
      resolve: (parent, args) => parent.cross
    },
    location: { type: GraphQLString }
  })
});

export let seedConnection: GraphQLConnectionDefinitions = connectionDefinitions({
  name: 'seed',
  nodeType: seedType
});



