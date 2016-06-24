import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID
} from 'graphql';
import {
  connectionDefinitions,
  GraphQLConnectionDefinitions
} from 'graphql-relay';

import { seedType } from './seed.type.ts';

export let userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    _id: { type: GraphQLString },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj.id
    },
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
        context.db.collection('seeds').find({ userId: parent.id }).toArray()
    }
  })
});

export let userConnection: GraphQLConnectionDefinitions = connectionDefinitions({
  name: 'user',
  nodeType: userType
});

