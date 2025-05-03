import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import connectMongo from './db/connectMongo.db.js'
import { connectRedis } from './helpers/redis.helper.js'
import { authCheck } from './middlewares/auth0.middleware.js'
import adminRouter from './routes/admin.route.js'
import auth0Router from './routes/auth0.route.js'
import editorGigRoute from './routes/editorGig.route.js'
import editorProfileRouter from './routes/editorProfile.route.js'
import ownerRouter from './routes/owner.route.js'
import requestRouter from './routes/request.route.js'
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.route.js'
import walletRouter from './routes/wallet.route.js'
import ytRouter from './routes/yt.route.js'
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

//? Third-party middleware
app.use(morgan('dev'))
app.use(cookieParser())
app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})
)

//? Built-in middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// const sessionMiddleware = session({
// 	secret: process.env.SESSION_SECRET,
// 	resave: true,
// 	saveUninitialized: false,
// 	rolling: true,
// 	cookie: {
// 		maxAge: 1000 * 60 * 60 * 24 * 7,
// 	},
// 	store: MongoStore.create({
// 		mongoUrl: process.env.MONGO_DB_URI,
// 		collectionName: 'sessions',
// 	}),
// })

// app.use(sessionMiddleware)

//? Application-level middleware
// Request logger middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString()

	console.log(`[${req.requestTime}] ${req.method} ${req.originalUrl} from ${req.ip}`)
	next()
})

app.get('/', (req, res) => {
	res.send('Backend is up!')
})

app.use('/requests', requestRouter)
app.use('/auth0', authCheck, auth0Router)
app.use('/api/videos', videoRouter)
app.use('/api/yt', ytRouter)
app.use('/api', ownerRouter)
app.use('/api/admin', adminRouter)
app.use('/editorGig', editorGigRoute)
app.use('/editorProfile', editorProfileRouter)
app.use('/user', userRouter)
app.use('/api/wallet', walletRouter)

//? Error handling middleware
app.use((req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`)
	error.status = 404
	next(error)
})

app.use((err, req, res, next) => {
	const statusCode = err.status || 500
	const message = err.message || 'Internal Server Error'

	console.error(`Error ${statusCode}: ${message}`)
	console.error(err.stack)

	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	})
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
	connectMongo().then(() => {
		console.log('MongoDB connected')
	})
	connectRedis().then(() => {
		console.log('Redis connected')
	})
})
