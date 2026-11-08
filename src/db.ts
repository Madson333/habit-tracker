import mongoose from 'mongoose';

export async function connectToDatabase(uri: string): Promise<typeof mongoose> {
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });

  return connection;
}
