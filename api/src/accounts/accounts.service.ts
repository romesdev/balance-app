import { Injectable } from '@nestjs/common';
import { RequestAccountDto } from './dto/request-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
  ) {}

  create(createAccountDto: RequestAccountDto) {
    const account = this.accountsRepository.create({
      ...createAccountDto,
      balance: createAccountDto.openingBalance,
    });

    return this.accountsRepository.save(account);
  }

  findAll() {
    return this.accountsRepository.find();
  }

  findOne(id: number) {
    return this.accountsRepository.findOne({ where: { id } });
  }

  // async findTransactions(id: number) {
  //   const account = await this.accountsRepository.findOne({ where: { id } });
  //   return account.transactions.sort(
  //     (a, b) => a.date.getTime() - b.date.getTime(),
  //   );
  // }

  async update(id: number, updateAccount: Partial<RequestAccountDto>) {
    const currentAccount = await this.findOne(id);

    const newCurrentBalance =
      currentAccount.balance -
      currentAccount.openingBalance +
      updateAccount.openingBalance;

    return this.accountsRepository.update(id, {
      ...updateAccount,
      balance: newCurrentBalance,
    });
  }

  remove(id: number) {
    return this.accountsRepository.delete(id);
  }
}
