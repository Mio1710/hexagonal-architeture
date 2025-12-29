import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BaseUser } from 'src/application/domain/interfaces';
import { UserService } from 'src/application/services/User.service';
import { CreateUserDto } from '../domain/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const data = await this.userService.getUserById(id);
    if (!data) {
      return {
        status: 'error',
        message: 'User not found',
      };
    }
    return {
      status: 'success',
      data: data,
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: BaseUser) {
    const data: BaseUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    };
    return await this.userService.updateUser('some-id', data);
  }
}
