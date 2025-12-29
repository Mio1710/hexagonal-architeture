import { MysqlAdapter } from '../../mysql';

const init = async () => {
  const table = 'users';
  console.log('Migration for MySQL, creating table: ', table);
  const mysql = new MysqlAdapter();
  await mysql.initialize();
  const query = `CREATE TABLE IF NOT EXISTS ${table} (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  ) ENGINE=InnoDB;`;
  await mysql.query(query);
  console.log(`Table ${table} created successfully (if not exists).`);
  return;
};

init();
