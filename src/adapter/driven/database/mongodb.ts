import { Db, MongoClient, ObjectId } from 'mongodb';
import { BaseModel } from 'src/application/domain/interfaces';
import { DatabaseRepository } from 'src/application/domain/repositories/database.repository';

const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'password';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const dbName = process.env.DB_NAME || 'hexagonal';

const uri = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;
export class MongodbAdapter implements DatabaseRepository {
  private db: Db;
  table: string;
  constructor() {}

  async initialize(): Promise<void> {
    try {
      this.db = await this.connect();
      if (!this.db) {
        throw new Error('Failed to connect to MongoDB');
      }
    } catch (error) {
      console.error('Failed to initialize MongoDB adapter:', error);
      throw error;
    }
  }

  private async connect(): Promise<Db> {
    try {
      const client: MongoClient = new MongoClient(uri);

      await client.connect();
      const connect: Db = client.db('hexagonal');
      console.log(
        'Connected successfully to MongoDB server using Native Driver',
      );
      return connect;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async create<T>(data: T): Promise<T & BaseModel> {
    const now = new Date();
    console.log('Create data: ', data);

    const result = await this.db.collection(this.table).insertOne({
      ...data,
      created_at: now,
      updated_at: now,
    });
    console.log('create successfully: ', result);

    return {
      ...data,
      id: result.insertedId.toString(),
      created_at: now,
      updated_at: now,
    } as T & BaseModel;
  }
  async findById<T>(id: string): Promise<T | null> {
    const result = await this.db
      .collection(this.table)
      .findOne({ _id: new ObjectId(id) });
    return result as T | null;
  }

  async update<T>(id: string, data: T): Promise<T & BaseModel> {
    console.log('Updating document in MongoDB', id, data);
    data['updated_at'] = new Date();
    await this.db
      .collection(this.table)
      .updateOne({ _id: new ObjectId(id) }, { $set: data });
    return { ...data, id } as T & BaseModel;
  }

  async delete(id: string): Promise<void> {
    console.log('Deleting document in MongoDB', id);
    await this.db.collection(this.table).deleteOne({ _id: new ObjectId(id) });
  }

  async findAll<T>(): Promise<T[]> {
    console.log('Finding all documents in MongoDB');
    const results = await this.db.collection(this.table).find({}).toArray();
    return results as T[];
  }
}
