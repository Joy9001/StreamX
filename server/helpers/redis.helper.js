import { createClient } from 'redis'

const redisClient = createClient({
	url: process.env.REDIS_URL,
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

const connectRedis = async () => {
	try {
		await redisClient.connect()
	} catch (error) {
		console.error('Redis connection error:', error)
	}
}

const CACHE_TTL = {
	DEFAULT: 3600, // 1 hour
	RECENT: 900, // 15 minutes
	SINGLE: 21600, // 6 hours
	LIST: 1800, // 30 minutes
}

const getCacheKey = (prefix, params) => {
	const keyParts = Object.values(params).filter((val) => val !== undefined && val !== null)
	return `${prefix}:${keyParts.join(':')}`
}

const getFromCache = async (key) => {
	try {
		const data = await redisClient.get(key)
		return data ? JSON.parse(data) : null
	} catch (err) {
		console.error(`Error getting data from Redis cache for key ${key}:`, err)
		return null
	}
}

const setToCache = async (key, data, ttl = CACHE_TTL.DEFAULT) => {
	try {
		await redisClient.set(key, JSON.stringify(data), { EX: ttl })
	} catch (err) {
		console.error(`Error setting data to Redis cache for key ${key}:`, err)
	}
}

const deleteFromCache = async (keys) => {
	if (!keys || keys.length === 0) return
	try {
		await redisClient.del(keys)
		console.log(`Cache invalidated for keys: ${keys.join(', ')}`)
	} catch (err) {
		console.error(`Error deleting data from Redis cache for keys ${keys.join(', ')}:`, err)
	}
}

export { CACHE_TTL, connectRedis, deleteFromCache, getCacheKey, getFromCache, redisClient, setToCache }
