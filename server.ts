import * as express from 'express';
import { MongoClient, MongoError, Db } from 'mongodb';
// import * as graphqlHTTP from 'express-graphql';
var graphqlHTTP = require('express-graphql');

import { Schema } from './data/schema.ts';

let app = express();
app.use(express.static('public'));

let db: Db;

(async () => {
  db = await MongoClient.connect(process.env.MONGO_URL);

  app.use('/graphql', graphqlHTTP({
    schema: Schema(db),
    graphiql: true
  }));

  app.listen(3000, () => console.log('Listening on port 3000'));
})();
