import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { Db } from 'mongodb';

export let Schema = (db: Db) => {

  let seedType = new GraphQLObjectType({
    name: 'seed',
    fields: () => ({
      _id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
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
        }
      })
    })
  });

  return schema;
}

