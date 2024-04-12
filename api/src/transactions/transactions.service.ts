import { Injectable } from '@nestjs/common';
import { RequestTransactionDto } from './dto/request-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createTransactionDto: RequestTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [account] = await this.accountsRepository.find({
        where: { id: createTransactionDto.accountId },
      });

      if (createTransactionDto.type === 'c') {
        account.balance += createTransactionDto.value;
      } else {
        account.balance -= createTransactionDto.value;
      }

      await this.accountsRepository.save(account);

      const transaction = this.transactionsRepository.create({
        value: createTransactionDto.value,
        type: createTransactionDto.type,
        date: createTransactionDto.date,
        description: createTransactionDto.description,
        account: account,
      });

      await this.transactionsRepository.save(transaction);

      await queryRunner.commitTransaction();

      return transaction;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll() {
    return this.transactionsRepository.find();
  }

  findOne(id: number) {
    return this.transactionsRepository.find({ where: { id } });
  }

  async findByAccount(accountId: number) {
    return this.transactionsRepository.find({
      where: { account: { id: accountId } },
    });
  }

  async update(
    id: number,
    updateTransactionDto: Partial<RequestTransactionDto>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [transaction] = await this.transactionsRepository.find({
        where: { id },
      });

      const [account] = await this.accountsRepository.find({
        where: { id: transaction.account.id },
      });

      // "remove" the old value
      account.balance =
        transaction.type === 'c'
          ? account.balance - transaction.value
          : account.balance + transaction.value;

      // "add" the new value
      account.balance =
        updateTransactionDto.type === 'c'
          ? account.balance + updateTransactionDto.value
          : account.balance - updateTransactionDto.value;

      await this.accountsRepository.save(account);

      await this.transactionsRepository.save({
        ...transaction,
        ...updateTransactionDto,
      });

      await queryRunner.commitTransaction();

      return {
        ...transaction,
        ...updateTransactionDto,
      };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [transaction] = await this.transactionsRepository.find({
        where: { id },
      });

      console.log(transaction);

      const [account] = await this.accountsRepository.find({
        where: { id: transaction.account.id },
      });

      if (transaction.type === 'c') {
        account.balance -= transaction.value;
      } else {
        account.balance += transaction.value;
      }
      await this.accountsRepository.save(account);

      const response = await this.transactionsRepository.delete(id);
      await queryRunner.commitTransaction();

      return response;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
