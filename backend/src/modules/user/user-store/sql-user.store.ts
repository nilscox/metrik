import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { BaseStore } from '~/sql/base-store';
import { UserOrmEntity } from '~/sql/entities';
import { EntityMapper } from '~/sql/entity-mapper';

import { User } from '../domain/user';

import { UserStore } from './user.store';

class UserMapper implements EntityMapper<User, UserOrmEntity> {
  toDomain(ormEntity: UserOrmEntity): User {
    return new User({
      id: ormEntity.id,
      email: ormEntity.email,
      hashedPassword: ormEntity.hashedPassword,
      token: ormEntity.token ?? undefined,
    });
  }

  toOrm(user: User): UserOrmEntity {
    return new UserOrmEntity({
      id: user.props.id,
      email: user.props.email,
      hashedPassword: user.props.hashedPassword,
      token: user.props.token ?? null,
    });
  }
}

@Injectable()
export class SqlUserStore extends BaseStore<User, UserOrmEntity> implements UserStore {
  constructor(
    @InjectRepository(UserOrmEntity) private readonly userRepository: Repository<UserOrmEntity>,
  ) {
    super('user', new UserMapper());
  }

  findById(id: string): Promise<User | undefined> {
    return this.findWhere({ id });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.findWhere({ email });
  }

  findByToken(token: string): Promise<User | undefined> {
    return this.findWhere({ token });
  }

  private async findWhere(
    where: FindOneOptions<UserOrmEntity>['where'],
  ): Promise<User | undefined> {
    const ormEntity = await this.userRepository.findOne({ where });

    if (ormEntity) {
      return this.toDomain(ormEntity);
    }
  }

  async save(user: User): Promise<void> {
    await this.userRepository.save(this.toOrm(user));
  }
}
