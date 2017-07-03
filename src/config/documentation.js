import HapiSwagger from 'hapi-swagger';

import parameters from 'config/parameters';
import { version } from '../../package.json';

const { HOST, PROTOCOL } = parameters.DOCUMENTATION;

const documentationPlugin = {
  register: HapiSwagger,
  options: {
    info: {
      title: 'hapi-api-boilerplate Server Documentation',
      version
    },
    schemes: [PROTOCOL],
    host: HOST,
    grouping: 'tags',
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};

export default documentationPlugin;
