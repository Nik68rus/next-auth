import { MongoClient } from 'mongodb';

export async function connectDb() {
  const client = await MongoClient.connect(process.env.MONGO_URI);

  return client;
}
