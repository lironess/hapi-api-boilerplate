import { user } from 'routes/user';
import { login, register as registerRoute } from 'routes/auth';

const register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/user', config: user },
    { method: 'POST', path: '/register', config: registerRoute },
    { method: 'POST', path: '/login', config: login }
  ]);
  next();
};

register.attributes = {
  name: 'api'
};

export default register;
