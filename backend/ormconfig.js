const { SnakeNamingStrategy } = require('typeorm-snake-naming-strategy');

module.exports = {
  type: 'better-sqlite3',
  database: './db.sqlite',
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/**/*.orm-entity.ts'],
  cli: {
    migrationsDir: 'src/sql/migrations',
  },
};
