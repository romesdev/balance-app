import { BaseEntity } from 'src/common/entity/base.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'opening_balance', unsigned: true, type: 'float' })
  openingBalance: number;

  @Column({ type: 'float' })
  balance: number;

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.account,
    {  cascade: true},
  )
  transactions: TransactionEntity[];
}
