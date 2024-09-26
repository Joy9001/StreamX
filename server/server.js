import connectMongo from './db/connectMongo.db.js';
import express from 'express';
import ownerRoute from "./routes/owner.route.js";
import dotenv from 'dotenv';
import ownerRouter from "./routes/owner.route.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use(ownerRoute)

connectMongo().then(() => {
	console.log('Connected to MongoDB');
});


app.listen(PORT, () => {
	console.log(`Server Running at port ${PORT}`);
});


