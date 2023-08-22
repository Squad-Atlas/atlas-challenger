import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error('DB_URL not specified in the .env file');
}

mongoose.connect(MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Connection error:', err);
});

const db = mongoose.connection;

export default db;
