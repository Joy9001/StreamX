import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import connectMongo from './db/connectMongo.db.js'
import VideoRouter from './routes/video.route.js'
import YTRouter from './routes/yt.route.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(morgan('dev'))
app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
		credentidals: true,
	})
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Backend is up!')
})

app.use('/api/videos', VideoRouter)
app.use('/api/yt', YTRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
	connectMongo().then(() => {
		console.log('MongoDB connected')
	})
})
