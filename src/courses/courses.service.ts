import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll() {
    return this.courseRepository.find();
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return course;
  }

  async create(createCourseDTO: any) {
    const course = this.courseRepository.create(createCourseDTO);
    return this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDTO: any) {
    const course = await this.courseRepository.preload({
      ...updateCourseDTO,
      id: id,
    });
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }
    return this.courseRepository.remove(course);
  }
}
