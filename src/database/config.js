module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'todoapp',
  },
  test: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345',
    database: 'test_db',
  },
};
