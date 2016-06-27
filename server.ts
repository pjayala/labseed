import * as express from 'express';
import * as fs from 'fs';
import { MongoClient, Db } from 'mongodb';
import { GraphQLSchema, graphql, GraphQLResult } from 'graphql';

let graphqlUtils: any = require('graphql/utilities');
let graphqlHTTP: any = require('express-graphql');

import { schema } from './data/schema.ts';


let app: express.Express = express();
app.use(express.static('public'));


let db: Db;

(async () => {
  try {
    db = await MongoClient.connect(process.env.MONGO_URL);
    app.use('/graphql', graphqlHTTP({
      schema,
      graphiql: true,
      pretty: true,
      context: {
        db
      }
    }));

    app.get('*', function (req: express.Request, res: express.Response) {
      res.sendFile(__dirname + '/public/index.html');
    });

    app.listen(3000, () => console.log('Listening on port 3000'));
    // generate schema.json
    let result: GraphQLResult = await graphql(schema, graphqlUtils.introspectionQuery);
    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ', result
      );
    } else {
      fs.writeFile('./data/schema.json', JSON.stringify(result, null, 2), err => {
        if (err) {
          throw err;
        }
        console.log('JSON Schema created');
      });
    }
  } catch (error) {
    console.log(error);
  }

})();
