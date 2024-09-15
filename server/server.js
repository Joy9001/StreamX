import connectMongo from './db/connectMongo.db.js';
import dotenv from 'dotenv';

dotenv.config();

connectMongo().then(() => {
	console.log('Connected to MongoDB');
});
