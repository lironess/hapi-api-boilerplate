import parameters from 'config/parameters';

const register = async (plugin, options, next) => {
  plugin.auth.strategy('jwt', 'jwt', {
    key: parameters.JWT_SECRET,
    validateFunc: async (decoded, request, callback) => (
      callback(null, decoded)
    ),
    verifyOptions: { algorithms: ['HS256'] },
    errorFunc: (context) => ({ ...context, scheme: 401 })
  });

  plugin.auth.default('jwt');

  return next();
};

register.attributes = {
  name: 'auth'
};

export default register;
