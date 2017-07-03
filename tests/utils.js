export const mocks = {
  hapiPlugin: () => {
    const mockedPlugin = {
      register: (_, __, next) => next()
    };
    mockedPlugin.register.attributes = { name: 'mock' };
    return mockedPlugin;
  }
};
