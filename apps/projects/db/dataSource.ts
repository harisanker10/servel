import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  entities: ['dist/src/entities/*.entity.js'],
  // entities: [],
  // migrations: ['./migrations/*.ts'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
