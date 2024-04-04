import { AccountEntity } from '../entities/account.entity';

export class ResponseAccountDto {
  id: number;
  name: string;
  openingBalance: number;
  balance: number;

  constructor(account: Partial<AccountEntity>) {
    this.id = account.id;
    this.name = account.name;
    this.openingBalance = account.openingBalance;
    this.balance = account.balance;
  }
}
