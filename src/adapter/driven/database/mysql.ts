import {
  Connection,
  ConnectionOptions,
  createConnection,
} from 'mysql2/promise';
import { BaseModel } from 'src/application/domain/interfaces';
import { DatabaseRepository } from 'src/application/domain/repositories/database.repository';
import { v4 as uuidv4 } from 'uuid';

const access: ConnectionOptions = {
  user: 'test',
  database: 'test',
};

export class MysqlAdapter implements DatabaseRepository {
  private db: Connection;
  table: string;
  constructor() {}

  async initialize(): Promise<void> {
    this.db = await createConnection(access);
    console.log('MySQL adapter initialized');
  }

  async create<T>(data: T): Promise<T & BaseModel> {
    // Logic to create a record in MySQL
    try {
      // generate uuid
      const id: string = uuidv4();
      const now = new Date();
      const result = await this.db.execute(
        'INSERT INTO items (id, data, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [id, JSON.stringify(data), now, now],
      );

      console.log('Created: ', result);

      return {
        ...data,
        id,
        created_at: now,
        updated_at: now,
      } as T & BaseModel;
    } catch (error) {
      console.error('Error creating record in MySQL:', error);
      throw error;
    }
  }
  async findById<T>(id: string): Promise<T | null> {
    const [rows] = await this.db.execute('SELECT * FROM items WHERE id = ?', [
      id,
    ]);

    return rows as T;
  }

  async update<T>(id: string, data: T): Promise<T & BaseModel> {
    const now = new Date();
    const result = await this.db.execute(
      'UPDATE items SET data = ?, updated_at = ? WHERE id = ?',
      [JSON.stringify(data), now, id],
    );
    console.log('Updated: ', result);

    return { ...data, id, updated_at: new Date() } as T & BaseModel;
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.execute('DELETE FROM items WHERE id = ?', [
      id,
    ]);
    console.log('Deleted: ', result);
  }

  async findAll<T>(): Promise<T[]> {
    const [rows] = await this.db.execute('SELECT * FROM items');
    return rows as T[];
  }
}
