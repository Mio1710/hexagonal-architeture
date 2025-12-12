import { BaseModel } from './BaseModel.interface';

export interface User extends BaseModel {
  id: string;
  name: string;
  email: string;
}
