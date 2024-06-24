import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1719243028886 } from 'src/migrations/1719243028886-CreateCoursesTable';
import { CreateTagsTable1719244010506 } from 'src/migrations/1719244010506-CreateTagsTable';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateCoursesTable1719243028886, CreateTagsTable1719244010506],
});
