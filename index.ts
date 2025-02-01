import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import depthLimit from 'graphql-depth-limit';
import { mergedGQLSchema } from './src/schema/typeDefs';
import { resolvers } from './src/schema/resolver';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { expressMiddleware } from '@apollo/server/express4';

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import route from './src/routes';

import { connectDatabase } from './src/config/db-connection';
import config from './src/config';

import { authDirective, authLogin } from './src/middleware/auth';
import { ROLE } from './src/types/role.type';
import { UserController } from './src/controller/user/user.controller';

const { PORT } = config;
const app: Application = express();

try {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));
  app.use(
    express.json({
      limit: '25mb'
    })
  );
  app.use(route);
  const httpServer = http.createServer(app);

  let schema = makeExecutableSchema({
    typeDefs: mergedGQLSchema,
    resolvers: resolvers
  });

  schema = authDirective(schema, 'auth');
  schema = authLogin(schema, 'authLogin');

  const server: ApolloServer = new ApolloServer({
    schema,
    introspection: true,
    validationRules: [depthLimit(10)],
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  Promise.all([connectDatabase(), server.start()])
    .then(() => {
      app.use(
        expressMiddleware(server, {
          context: async ({ req }) => {
            try {
              const token = req.headers.authorization || '';
              return await UserController.getTokenInfo(token);
            } catch (error) {
              return { role: ROLE.UNAUTH, adminId: null };
            }
          }
        })
      );
    })
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
      });
    });
} catch (err) {
  console.log('⛔ Error occurred while starting');
  console.error(err);
}
