import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { Db } from 'mongodb';

export let Schema = (db: Db) => {

  let userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
      _id: { type: GraphQLString },
      id: { type: GraphQLString },
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

  let seedType = new GraphQLObjectType({
    name: 'seed',
    fields: () => ({
      _id: { type: GraphQLString },
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

  let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        seeds: {
          type: new GraphQLList(seedType),
          resolve: () => db.collection('seeds').find({}).toArray()
        },
        users: {
          type: new GraphQLList(userType),
          resolve: () => db.collection('users').find({}).toArray()
        }
      })
    })
  });

  return schema;
}

