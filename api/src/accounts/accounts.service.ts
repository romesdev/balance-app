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

  update(id: number, updateAccountDto: Partial<RequestAccountDto>) {
    return this.accountsRepository.update(id, updateAccountDto);
  }

  remove(id: number) {
    return this.accountsRepository.delete(id);
  }
}
