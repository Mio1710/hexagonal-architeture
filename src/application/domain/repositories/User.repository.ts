import { BaseUser, User } from '../interfaces';
import { DatabaseRepository } from './database.repository';

export class UserRepository {
  constructor(private readonly db: DatabaseRepository) {}

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
