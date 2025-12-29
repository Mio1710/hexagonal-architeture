import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseUser } from 'src/application/domain/interfaces';
import { UserService } from 'src/application/services/User.service';
import { CreateUserDto } from '../domain/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() res: Response) {
    const data = await this.userService.getAllUsers();
    return res.status(200).json({
      status: 'success',
      data: data,
    });
  }

  @Post()
  async createUser(@Res() res: Response, @Body() body: CreateUserDto) {
    const data = await this.userService.createUser(body);
    return res.status(201).json({
      status: 'success',
      data: data,
    });
  }

  @Get(':id')
  async getUserById(@Res() res: Response, @Param('id') id: string) {
    const data = await this.userService.getUserById(id);
    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: data,
    });
  }

  @Put(':id')
  async updateUser(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: BaseUser,
  ) {
    const data = await this.userService.updateUser(id, body);
    return res.status(200).json({
      status: 'success',
      data: data,
    });
  }

  @Delete(':id')
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      return res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete user',
      });
    }
  }
}
