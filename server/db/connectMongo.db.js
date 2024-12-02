import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectMongo = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI)

		mongoose.connection.on('error', (error) => {
			console.log('Error connecting to MongoDB: ', error.message)
		})

		mongoose.connection.on('disconnected', () => {
			console.log('Disconnected from MongoDB')
		})
	} catch (error) {
		console.log('Error connecting to MongoDB: ', error.message)
	}
}

export default connectMongo
