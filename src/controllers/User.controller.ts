import { Controller, Get, Post, Put } from '@nestjs/common';
import { BaseUser } from 'src/application/domain/interfaces';
import { UserService } from 'src/application/services/User.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser() {
    const data: BaseUser = {
      name: 'John Doe',
      email: 'nguyenthile.work@gmail.com',
    };
    return this.userService.createUser(data);
  }

  @Get(':id')
  async getUserById() {
    return this.userService.getUserById('some-id');
  }

  @Put(':id')
  async updateUser() {
    const data: BaseUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    };
    return this.userService.updateUser('some-id', data);
  }
}
