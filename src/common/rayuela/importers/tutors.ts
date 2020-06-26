import { Connection, Repository } from 'typeorm';

import { ParseRayuelaGroups } from '../parsers';
import { CenterDTO, LevelDTO } from '../dto';
import {
  Course,
  CourseGroup,
  CourseTeacher,
  Group,
  Level,
  Teacher,
} from '../../../entities';

export class ImportTutors {
  private levelsDTO: LevelDTO[] = [];
  private centerDTO: CenterDTO;
  private levelRepo: Repository<Level>;
  private groupRepo: Repository<Group>;
  private courseGroupRepo: Repository<CourseGroup>;
  private teacherRepo: Repository<Teacher>;
  private courseTeacherRepo: Repository<CourseTeacher>;

  constructor(
    private readonly groupsXmlFile: string,
    private readonly connection: Connection,
    private readonly course: Course,
  ) {
    this.levelRepo = this.connection.getRepository(Level);
    this.groupRepo = this.connection.getRepository(Group);
    this.courseGroupRepo = this.connection.getRepository(CourseGroup);
    this.teacherRepo = this.connection.getRepository(Teacher);
    this.courseTeacherRepo = this.connection.getRepository(CourseTeacher);
  }

  async getRayuelaData(): Promise<void> {
    const parseRayuelaGroups = new ParseRayuelaGroups();
    const { levelsDTO, centerDTO } = await parseRayuelaGroups.parseFile(
      this.groupsXmlFile,
    );
    this.levelsDTO = levelsDTO;
    this.centerDTO = centerDTO;
  }

  async processLevel(levelDTO: LevelDTO): Promise<void> {
    let level = await this.levelRepo.findOne({ level: levelDTO.level });
    if (!level) {
      level = await this.levelRepo.save(levelDTO);
    }
    for (const tutorDTO of levelDTO.groups) {
      let group = await this.groupRepo.findOne({ group: tutorDTO.group });
      if (!group) {
        group = await this.groupRepo.save({
          group: tutorDTO.group,
          denomination: tutorDTO.group,
          level,
        });
      } else {
        await this.groupRepo.update(group.id, { group: tutorDTO.group, level });
      }
      let courseGroup = await this.courseGroupRepo.findOne({
        course: this.course,
        group,
      });
      if (!courseGroup) {
        courseGroup = await this.courseGroupRepo.save({
          course: this.course,
          group,
        });
      }
      const teacher = await this.teacherRepo.findOne({ dni: tutorDTO.dni });
      if (teacher) {
        const courseTeacher = await this.courseTeacherRepo.findOne({
          courseId: this.course.id,
          teacherId: teacher.id,
        });
        if (courseTeacher) {
          await this.courseGroupRepo.update(
            {
              id: courseGroup.id,
            },
            { tutorTeacher: courseTeacher },
          );
        }
      }
    }
  }

  getLevelsDTO(): LevelDTO[] {
    return this.levelsDTO;
  }

  getCenterDTO(): CenterDTO {
    return this.centerDTO;
  }
}
