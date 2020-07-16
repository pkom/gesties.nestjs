import { Exclude } from 'class-transformer';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class TimeStampEntity {
  @Exclude()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
