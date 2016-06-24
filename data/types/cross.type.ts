import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import { seedType } from './seed.type.ts';

export let crossType: GraphQLObjectType = new GraphQLObjectType({
  name: 'parentSeeds',
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (parent) => {
        return (parent.name === 'BC' || parent.name === 'OC') ?
          `${parent.name}${parent.secondIndex}F${parent.index}`
          :
          `${parent.name}${parent.index}`;
      }
    },
    type: { type: GraphQLString },
    index: { type: GraphQLInt },
    secondIndex: { type: GraphQLInt },
    first: {
      type: seedType,
      resolve: (parent, args, context) => {
        return context.db.collection('seeds').find({ index: parent.first }).limit(1).next();
      }
    },
    second: {
      type: seedType,
      resolve: (parent, args, context) => {
        return context.db.collection('seeds').find({ index: parent.second }).limit(1).next();
      }
    }
  })
});
