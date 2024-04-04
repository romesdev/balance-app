import { AccountEntity } from 'src/accounts/entities/account.entity';
import { TransactionEntity } from '../entities/transaction.entity';

export class ResponseTransactionDto {
  id: number;
  value: number;
  description: string;
  date: Date;
  type: string;
  account: AccountEntity;

  constructor(transaction: Partial<TransactionEntity>) {
    this.id = transaction.id;
    this.value = transaction.value;
    this.description = transaction.description;
    this.date = transaction.date;
    this.type = transaction.type;
    this.account = transaction.account;
  }
}
