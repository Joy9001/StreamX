import express from 'express';
import connectMongo from './db/connectMongo.db.js';
import editor_gig_route from './routes/editor_gig_router.js';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use(express.json()); 
app.use(cors());

const port = process.env.PORT || 4001;
connectMongo().then(() => {
	console.log('Connected to MongoDB');
});
app.use("/editor_gig",editor_gig_route);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});
