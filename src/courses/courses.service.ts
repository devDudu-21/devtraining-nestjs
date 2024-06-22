import { Injectable } from '@nestjs/common';
import { Course } from './courses.entity';

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: 1,
      name: 'NestJS',
      description: 'Curso sobre Fundamento do Framework NestJS',
      tags: ['node.js', 'nest.js', 'javascript', 'typescript'],
    },
  ];
}
