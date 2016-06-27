import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';

import { store  } from './models/store.model.ts';
import { storeType, nodeDefs  } from './types/type.ts';
import { createUserMutation } from './mutations/user.mutation.ts';
import { createSeedMutation } from './mutations/seed.mutation.ts';

export let schema: GraphQLSchema = new GraphQLSchema({

  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeDefs.nodeField,
      store: {
        type: storeType,
        resolve: () => store
      }
    })
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createUser: createUserMutation,
      createSeed: createSeedMutation
    })
  })
});
