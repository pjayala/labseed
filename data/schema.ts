import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { Db } from 'mongodb';
import { connectionDefinitions, connectionArgs, connectionFromPromisedArray, GraphQLConnectionDefinitions } from 'graphql-relay';


export const Schema = (db: Db) => {
  let seedType: GraphQLObjectType;
  let userType: GraphQLObjectType;
  let seedConnection: GraphQLConnectionDefinitions;
  let userConnection: GraphQLConnectionDefinitions;

  let store: any = {};

  let storeType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
      seedConnection: {
        type: seedConnection.connectionType,
        args: connectionArgs,
        resolve: (_, args) => connectionFromPromisedArray(
          db.collection('seeds').find({}).limit(Number(args['limit'])).toArray(),
          args
        )
      },
      userConnection: {
        type: userConnection.connectionType,
        args: connectionArgs,
        resolve: (_, args) => connectionFromPromisedArray(
          db.collection('users').find({}).limit(Number(args['limit'])).toArray(),
          args
        )
      }
    })
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

  let schema: GraphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        store: {
          type: storeType,
          resolve: () => store
        }
      })
    })
  });

  return schema;
};

