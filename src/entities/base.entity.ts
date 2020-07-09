import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
} from 'typeorm';
import { TimeStampEntity } from './timestamp.entity';

export abstract class BaseEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @VersionColumn()
  version: number;
}
