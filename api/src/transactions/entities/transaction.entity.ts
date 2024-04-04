import { AccountEntity } from 'src/accounts/entities/account.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ unsigned: true, type: 'float' })
  value: number;

  @Column({ type: 'enum', enum: ['c', 'd'] })
  /**
   * c - credit
   * d - debit
   */
  type: string;

  @ManyToOne(() => AccountEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
