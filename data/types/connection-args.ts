import { GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';

export interface IConnectionArgsExt {
  query: string;
  field: string;
  limit: number;
};

export let connectionArgsExt: any = {
  query: { type: GraphQLString },
  field: { type: GraphQLString }
};
Object.assign(connectionArgsExt, connectionArgs);
