import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CourseGroup, Level } from './';

@Entity({ name: 'groups' })
export class Group extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 10 })
  group: string;

  @Column({ type: 'varchar', unique: true, length: 100, nullable: true })
  denomination: string;

  // Bidirectional ManyToMany Course to Groups
  // Course ->> CourseGroup <<- Group
  @OneToMany(
    () => CourseGroup,
    courseGroup => courseGroup.group,
  )
  courseGroups: CourseGroup[];

  // Bidirectional ManyToOne Group to Level
  // Level <<- Group
  @ManyToOne(
    () => Level,
    level => level.groups,
  )
  level: Level;
}
