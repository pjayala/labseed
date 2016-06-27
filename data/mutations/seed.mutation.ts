import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLFieldConfig
} from 'graphql';
import { InsertOneWriteOpResult, FindAndModifyWriteOpResultObject } from 'mongodb';
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay';

import { storeType, seedConnection } from '../types/type.ts';
import { store } from '../models/store.model.ts';


interface ISeed {
  id: string;
  name: string;
  description: string;
  index: number;
  location: string;
  userId: string;
  createdAt?: number;
  cross: {
    name: string;
    type: string;
    first?: number;
    second?: number;
    index: number;
    secondIndex: number;
  };
}

interface ISequence {
  _id: string;
  seq: number;
}

interface ISequenceValue {
  value: ISequence;
}

let getSeedNextSequence: any = (name, db) => {
  let ret: Promise<FindAndModifyWriteOpResultObject> = db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true }
  );

  return ret;
};

let crossSeedObject: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'cross',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    first: { type: GraphQLInt },
    second: { type: GraphQLInt }
  }
});

export let createSeedMutation: GraphQLFieldConfig = mutationWithClientMutationId({
  name: 'CreateSeed',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    cross: { type: crossSeedObject }
  },
  outputFields: {
    seedEdge: {
      type: seedConnection.edgeType,
      resolve: (obj: InsertOneWriteOpResult) => ({ node: obj.ops[0], cursor: obj.insertedId })
    },
    store: {
      type: storeType,
      resolve: () => store
    }
  },
  mutateAndGetPayload: (seed: ISeed, context) => {
    return (async () => {
      seed.createdAt = Date.now();
      seed.userId = fromGlobalId(seed.userId).id;
      let counter: ISequenceValue = await getSeedNextSequence('seedCounter', context.db);
      seed.index = counter.value.seq;
      if (seed.cross.first !== undefined) {
        let firstSeed: ISeed = await context.db.collection('seeds').find({ index: seed.cross.first }).limit(1).next();

        seed.cross.secondIndex = firstSeed.cross.secondIndex;

        if (seed.cross.type === 'G') {
          seed.cross.name = firstSeed.cross.name;
          seed.cross.index = firstSeed.cross.index + 1;

        } else {
          seed.cross.name = seed.cross.type;
          seed.cross.index = 1;

          if (seed.cross.type === 'BC' || seed.cross.type === 'OC') {
            seed.cross.secondIndex = (firstSeed.cross.secondIndex || 0) + 1;
          }
        }
      } else {
        seed.cross.index = 0;
        seed.cross.name = seed.cross.type;
      }

      return context.db.collection('seeds').insertOne(seed);
    })();
  }
});


