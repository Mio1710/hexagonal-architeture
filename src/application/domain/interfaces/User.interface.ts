import { BaseModel } from './BaseModel.interface';

export interface BaseUser {
  name: string;
  email: string;
}

export interface User extends BaseUser, BaseModel {}
