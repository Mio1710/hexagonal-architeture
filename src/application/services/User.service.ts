import { Injectable } from '@nestjs/common';
import { BaseUser, User } from '../domain/interfaces';
import { UserRepository } from '../domain/repositories/User.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: BaseUser): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  async updateUser(id: string, userData: BaseUser): Promise<User> {
    return this.userRepository.updateUser(id, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }
}
