import { Inject, Injectable } from '@nestjs/common';
import { BaseUser, User } from '../interfaces';
import type { DatabaseRepository } from './database.repository';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('DatabaseRepository')
    private readonly db: DatabaseRepository,
  ) {}

  async createUser(user: BaseUser): Promise<User> {
    const data = await this.db.create(user);
    return data;
  }
  findUserById(id: string): Promise<User | null> {
    return this.db.findById(id);
  }
  updateUser(id: string, user: BaseUser): Promise<User> {
    return this.db.update(id, user);
  }
  deleteUser(id: string): Promise<void> {
    return this.db.delete(id);
  }
  findAllUsers(): Promise<User[]> {
    return this.db.findAll();
  }
}
