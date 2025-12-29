import * as dotenv from 'dotenv';
import { Connection, createConnection } from 'mysql2/promise';
import { BaseModel } from 'src/application/domain/interfaces';
import { DatabaseRepository } from 'src/application/domain/repositories/database.repository';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'root_password';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '3306';
const dbName = process.env.DB_NAME || 'hexagonal';

const connectionUrl = `mysql://${user}:${password}@${host}:${port}/${dbName}`;

export class MysqlAdapter implements DatabaseRepository {
  private db: Connection;
  table: string;
  constructor() {}

  async initialize(): Promise<void> {
    this.db = await createConnection(connectionUrl);
  }

  async create<T>(data: T): Promise<T & BaseModel> {
    // Logic to create a record in MySQL
    try {
      // generate uuid
      const id: string = uuidv4();
      const now = new Date();
      const columns = Object.keys(data).join(', ');
      const valuesPlaceholders = Object.keys(data)
        .map(() => '?')
        .join(', ');

      const query = `INSERT INTO ${this.table} (id, ${columns}, created_at, updated_at) VALUES (?, ${valuesPlaceholders}, ?, ?)`;
      const result = await this.db.execute(query, [
        id,
        ...Object.values(data),
        now,
        now,
      ]);
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
    console.log('Find user by id: ', id);

    const [rows] = await this.db.execute(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id],
    );

    return rows[0] || null;
  }

  async update<T>(id: string, data: T): Promise<T & BaseModel> {
    const now = new Date();
    const columns = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(data);
    const result = await this.db.execute(
      `UPDATE ${this.table} SET ${columns}, updated_at = ? WHERE id = ?`,
      [...values, now, id],
    );

    return { ...data, id, updated_at: new Date() } as T & BaseModel;
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.execute(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id],
    );
    return;
  }

  async findAll<T>(): Promise<T[]> {
    const [rows] = await this.db.execute(`SELECT * FROM ${this.table}`);
    return rows as T[];
  }

  async query(sql: string): Promise<any> {
    const [rows] = await this.db.execute(sql);
    return rows;
  }
}
