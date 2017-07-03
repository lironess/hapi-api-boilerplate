import HapiSequelize from 'hapi-sequelizejs';
import Sequelize from 'sequelize';
import { join } from 'path';

import parameters from 'config/parameters';

const databasePlugin = {
  register: HapiSequelize,
  options: [{
    name: 'hapi_api_boilerplate',
    models: [join(__dirname, '../models/*.js'), join(__dirname, '../models/links/*.js')],
    sequelize: new Sequelize(parameters.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: (process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'staging')
      },
      logging: false
    }),
    sync: true,
    forceSync: false,
  }]
};

export default databasePlugin;
