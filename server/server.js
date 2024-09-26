import MongoStore from 'connect-mongo'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import passport from 'passport'
import connectMongo from './db/connectMongo.db.js'
import isAuthenticated from './middlewares/auth.middleware.js'
import authRoute from './routes/auth.js'
import VideoRouter from './routes/video.route.js'
import YTRouter from './routes/yt.route.js'
import passportStrategy from './strategy/passport.js'

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
passportStrategy()

app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: 'GET,POST,PUT,DELETE',
		credentials: true,
	})
)
const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
	store: MongoStore.create({
		mongoUrl: process.env.MONGO_DB_URI,
		collectionName: 'sessions',
	}),
})
app.use(sessionMiddleware)
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 5 * 60 * 1000,
//   })
// );

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoute)

app.get('/', isAuthenticated, (req, res) => {
	res.send(`Hello!`)
})

app.listen(5000, () => {
	console.log('listening port 5000')
})
