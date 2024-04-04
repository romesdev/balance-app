import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @CreateDateColumn({
    name: 'create_date_time',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDateTime: Date;

  @UpdateDateColumn({
    name: 'last_changed_date_time',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastChangedDateTime: Date;
}
