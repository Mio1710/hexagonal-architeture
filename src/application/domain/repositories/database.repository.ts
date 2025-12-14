import { BaseModel } from '../interfaces';

export interface DatabaseRepository {
  create<T>(item: T): Promise<T & BaseModel>;
  findById<T>(id: string): Promise<T | null>;
  update<T>(id: string, item: T): Promise<T & BaseModel>;
  delete(id: string): Promise<void>;

  // Optiona;
  findAll<T>(): Promise<T[]>;
}
