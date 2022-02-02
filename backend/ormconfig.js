module.exports = {
  type: 'better-sqlite3',
  database: './db.sqlite',
  entities: ['src/**/*.orm-entity.ts'],
  cli: {
    migrationsDir: 'src/sql/migrations',
  },
};
