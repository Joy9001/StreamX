import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import connectMongo from './db/connectMongo.db.js'
import { authCheck } from './middlewares/auth0.middleware.js'
import AdminRouter from './routes/admin.route.js'
import auth0Router from './routes/auth0.route.js'
import editor_gig_route from './routes/editorGig.route.js'
import editorProfileRoute from './routes/editorProfile.route.js'
import OwnerRouter from './routes/owner.route.js'
import requestRoutes from './routes/request.route.js'
import UserRoute from './routes/user.route.js'
import VideoRouter from './routes/video.route.js'
import YTRouter from './routes/yt.route.js'

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

app.use('/requests', requestRoutes)
app.use('/auth0', authCheck, auth0Router)
app.use('/api/videos', VideoRouter)
app.use('/api/yt', YTRouter)
app.use('/api', OwnerRouter)
app.use('/api/admin', AdminRouter)
app.use('/editor_gig', editor_gig_route)
app.use('/editorProfile', editorProfileRoute)
app.use('/user', UserRoute)

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
})
