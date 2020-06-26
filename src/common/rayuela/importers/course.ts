import { Repository } from 'typeorm';

import { Course } from '../../../entities';

export class ImportCourse {
  constructor(
    private readonly courseStr: string,
    private readonly courseRepo: Repository<Course>,
  ) {}

  async run(): Promise<Course> {
    return await this.saveCourse();
  }

  private async saveCourse(): Promise<Course> {
    let course = await this.courseRepo.findOne({
      denomination: this.courseStr,
    });
    if (!course) {
      course = new Course();
      course.course = this.courseStr;
      course.denomination = this.courseStr;
    }
    return await this.courseRepo.save(course);
  }
}
