import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLFieldConfig
} from 'graphql';
import { Db, InsertOneWriteOpResult, FindAndModifyWriteOpResultObject } from 'mongodb';
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  GraphQLConnectionDefinitions,
  mutationWithClientMutationId,
  globalIdField,
  nodeDefinitions,
  GraphQLNodeDefinitions,
  fromGlobalId,
  ResolvedGlobalId
} from 'graphql-relay';


export const Schema = (db: Db) => {
  let storeType: GraphQLObjectType;
  let seedType: GraphQLObjectType;
  let userType: GraphQLObjectType;
  let seedConnection: GraphQLConnectionDefinitions;
  let userConnection: GraphQLConnectionDefinitions;

  class Store { };
  let store: any = new Store();

  let nodeDefs: GraphQLNodeDefinitions = nodeDefinitions(
    (globalId) => {
      let global: ResolvedGlobalId = fromGlobalId(globalId);
      if (global.type === 'Store') {
        return store;
      }
      return null;
    },
    (obj) => {
      if (obj instanceof Store) {
        return storeType;
      }
      return null;
    }
  );

  let connectionArgsExt: any = {
    query: { type: GraphQLString },
    field: { type: GraphQLString }
  };
  Object.assign(connectionArgsExt, connectionArgs);

  storeType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      id: globalIdField('Store'),
      seedConnection: {
        type: seedConnection.connectionType,
        args: connectionArgsExt,
        resolve: (_, args) => {
          let findParams: any = {};
          if (args['query']) {
            findParams[args['field'] || 'name'] = new RegExp(args['query'], 'i');
          }
          if (!args['limit'] || args['limit'] > 200) {
            args['limit'] = 100
          }
          return connectionFromPromisedArray(
            db.collection('seeds')
              .find(findParams)
              .sort({ createdAt: -1 })
              .limit(Number(args['limit']))
              .toArray(),
            args
          );
        }
      },
      userConnection: {
        type: userConnection.connectionType,
        args: connectionArgsExt,
        resolve: (_, args) => {
          let findParams: any = {};
          if (args['query']) {
            findParams[args['field'] || 'id'] = new RegExp(args['query'], 'i');
          }
          if (!args['limit'] || args['limit'] > 200) {
            args['limit'] = 100;
          }
          return connectionFromPromisedArray(
            db.collection('users')
              .find(findParams)
              .sort({ createdAt: -1 })
              .limit(Number(args['limit']))
              .toArray(),
            args
          );
        }
      }
    }),
    interfaces: [nodeDefs.nodeInterface]
  });

  userType = new GraphQLObjectType({
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
        resolve: (parent, args) =>
          db.collection('seeds').find({ userId: parent.id }).toArray()
      }
    })
  });

  let crossType: GraphQLObjectType = new GraphQLObjectType({
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
        resolve: (parent, args) => {
          return db.collection('seeds').find({ index: parent.first }).limit(1).next();
        }
      },
      second: {
        type: seedType,
        resolve: (parent, args) => {
          return db.collection('seeds').find({ index: parent.second }).limit(1).next();
        }
      }
    })
  });

  seedType = new GraphQLObjectType({
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
        resolve: (parent, args) =>
          db.collection('users').find({ id: parent.userId }).limit(1).next()
      },
      cross: {
        type: crossType,
        resolve: (parent, args) => parent.cross
      },
      location: { type: GraphQLString }
    })
  });

  seedConnection = connectionDefinitions({
    name: 'seed',
    nodeType: seedType
  });

  userConnection = connectionDefinitions({
    name: 'user',
    nodeType: userType
  });

  interface IUser {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt?: number;
  }

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

  let createUserMutation: any = mutationWithClientMutationId({
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
    mutateAndGetPayload: (user: IUser) => {
      user.createdAt = Date.now();
      return db.collection('users').insertOne(user);
    }
  });

  let getSeedNextSequence: any = (name) => {
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

  let createSeedMutation: GraphQLFieldConfig = mutationWithClientMutationId({
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
    mutateAndGetPayload: (seed: ISeed) => {
      return (async () => {
        seed.createdAt = Date.now();
        let counter: ISequenceValue = await getSeedNextSequence('seedCounter');
        seed.index = counter.value.seq;
        if (seed.cross.first !== null) {
          let firstSeed: ISeed = await db.collection('seeds').find({ index: seed.cross.first }).limit(1).next();

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

        return db.collection('seeds').insertOne(seed);
      })();
    }
  });

  let schema: GraphQLSchema = new GraphQLSchema({
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

  return schema;
};

