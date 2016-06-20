import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID
} from 'graphql';
import { Db, InsertOneWriteOpResult } from 'mongodb';
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
        args: connectionArgs,
        resolve: (_, args) => connectionFromPromisedArray(
          db.collection('seeds')
            .find({})
            .limit(Number(args['limit']))
            .toArray(),
          args
        )
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
            args['limit'] = 100
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
          db.collection('seeds').find({ user_id: parent.id }).toArray()
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
      user: {
        type: userType,
        resolve: (parent, args) =>
          db.collection('users').find({ id: parent.user_id }).limit(1).next()
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
        createUser: createUserMutation
      })
    })
  });

  return schema;
};

