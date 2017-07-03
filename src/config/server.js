import Hapi from 'hapi';
import Good from 'good';
import JWTAuth from 'hapi-auth-jwt2';
import Inert from 'inert';
import Vision from 'vision';

import parameters from 'config/parameters';
import Routes from 'routes';
import Auth from 'config/auth';
import Database from 'config/db';
import Documentation from 'config/documentation';

const server = new Hapi.Server({
  connections: {
    router: { stripTrailingSlash: true },
    state: { isSameSite: 'Lax' }
  }
});
server.connection({
  port: process.env.PORT || parameters.PORT,
  routes: {
    cors: {
      origin: ['*'],
      credentials: true
    },
    state: {
      failAction: 'ignore'
    }
  }
});

const plugins = [
  Inert,
  Vision, // for hapi-sequelizejs
  Documentation,
  JWTAuth,
  Auth,
  Routes,
  Database,
  {
    register: Good,
    options: {
      ops: { interval: 60000 },
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', error: '*' }]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  }
];

const getServer = async () => {
  await server.register(plugins);
  return server;
};

export { getServer };
