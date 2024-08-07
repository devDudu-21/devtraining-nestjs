import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CoursesModule } from './courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

describe('CoursesController e2e', () => {
  let app: INestApplication;
  let module: TestingModule;
  let data: any;
  /* eslint-disable-next-line */
  let courses: Course[];

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Course, Tag],
    synchronize: true,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    data = {
      name: 'Node JS',
      description: 'Node JS course',
      tags: ['nodejs', 'nestjs'],
    };
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Course);
    courses = await repository.find();
    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /courses', () => {
    it('should create a course', async () => {
      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body.created_at).toBeDefined();
      expect(res.body.tags[0].name).toEqual(data.tags[0]);
      expect(res.body.tags[1].name).toEqual(data.tags[1]);
    });
  });

  describe('GET /courses', () => {
    it('should list all courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].name).toEqual(data.name);
      expect(res.body[0].description).toEqual(data.description);
      expect(res.body[0].created_at).toBeDefined();
      res.body.map((course) =>
        expect(course).toEqual({
          id: course.id,
          name: course.name,
          description: course.description,
          created_at: course.created_at,
          tags: [...course.tags],
        }),
      );
    });
  });

  describe('GET /courses:id', () => {
    it('should gets a course by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/courses/${courses[0].id}`)
        .expect(200);

      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual(courses[0].name);
      expect(res.body.description).toEqual(courses[0].description);
    });
  });

  describe('PUT /courses:id', () => {
    it('should update a course', async () => {
      const updateData = {
        name: 'new name',
        description: 'new description',
        tags: ['newTag1', 'newTag2'],
      };
      const res = await request(app.getHttpServer())
        .put(`/courses/${courses[0].id}`)
        .send(updateData)
        .expect(200);

      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual(updateData.name);
      expect(res.body.description).toEqual(updateData.description);
      expect(res.body.tags).toHaveLength(2);
      expect(res.body.tags[0].name).toEqual(updateData.tags[0]);
      expect(res.body.tags[1].name).toEqual(updateData.tags[1]);
    });
  });

  describe('DELETE /courses:id', () => {
    it('should delete a course', async () => {
      await request(app.getHttpServer())
        .delete(`/courses/${courses[0].id}`)
        .expect(204)
        .expect({});
    });
  });
});
