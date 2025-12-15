import { Db, MongoClient } from 'mongodb';
import { BaseModel } from 'src/application/domain/interfaces';
import { DatabaseRepository } from 'src/application/domain/repositories/database.repository';
const uri = 'mongodb://localhost:27017';

export class MongodbAdapter implements DatabaseRepository {
  private db: Db;

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
    // Logic to create a document in MongoDB
    const now = new Date();
    const result = await this.db.collection('items').insertOne({
      ...data,
      created_at: now,
      updated_at: now,
    });
    return {
      ...data,
      id: result.insertedId.toString(),
      created_at: now,
      updated_at: now,
    } as T & BaseModel;
  }
  async findById<T>(id: string): Promise<T | null> {
    // Logic to find a document by ID in MongoDB
    console.log('Finding document by ID in MongoDB', id);
    const result = await this.db.collection('items').findOne({ id: id });
    return result as T | null;
  }

  async update<T>(id: string, data: T): Promise<T & BaseModel> {
    // Logic to update a document in MongoDB
    console.log('Updating document in MongoDB', id, data);
    data['updated_at'] = new Date();
    await this.db.collection('items').updateOne({ id: id }, { $set: data });
    return { ...data, id } as T & BaseModel;
  }

  async delete(id: string): Promise<void> {
    // Logic to delete a document in MongoDB
    console.log('Deleting document in MongoDB', id);
    await this.db.collection('items').deleteOne({ id: id });
  }

  async findAll<T>(): Promise<T[]> {
    // Logic to find all documents in MongoDB
    console.log('Finding all documents in MongoDB');
    const results = await this.db.collection('items').find({}).toArray();
    return results as T[];
  }
}
