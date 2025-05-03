import { createClient } from 'redis'

export class CacheService {
	constructor() {
		this.client = createClient({
			url: process.env.REDIS_URL,
		})

		this.client.on('error', (err) => console.log('Redis Client Error', err))

		this.TTL = {
			DEFAULT: 3600, // 1 hour
			RECENT: 900, // 15 minutes
			SINGLE: 21600, // 6 hours
			LIST: 1800, // 30 minutes
		}
	}

	async connect() {
		try {
			await this.client.connect()
			console.log('Redis cache service connected')
		} catch (error) {
			console.error('Redis connection error:', error)
		}
	}

	generateKey(prefix, params = {}) {
		const keyParts = Object.entries(params)
			.filter(([_, val]) => val !== undefined && val !== null)
			.map(([_, val]) => val)
		return `${prefix}:${keyParts.join(':')}`
	}

	async get(key) {
		try {
			const data = await this.client.get(key)
			console.log(`Cache ${data ? 'hit' : 'miss'} for ${key}`)
			return data ? JSON.parse(data) : null
		} catch (err) {
			console.error(`Error getting data from Redis cache for key ${key}:`, err)
			return null
		}
	}

	async set(key, data, ttl = this.TTL.DEFAULT) {
		try {
			await this.client.set(key, JSON.stringify(data), { EX: ttl })
		} catch (err) {
			console.error(`Error setting data to Redis cache for key ${key}:`, err)
		}
	}

	async delete(keys) {
		if (!keys || (Array.isArray(keys) && keys.length === 0)) return

		try {
			const keyArray = Array.isArray(keys) ? keys : [keys]
			await this.client.del(keyArray)
			console.log(`Cache invalidated for keys: ${keyArray.join(', ')}`)
		} catch (err) {
			console.error(
				`Error deleting data from Redis cache for keys ${Array.isArray(keys) ? keys.join(', ') : keys}:`,
				err
			)
		}
	}

	// Video-specific cache operations
	async invalidateVideoRelatedCaches(video) {
		if (!video) return
		const keysToDelete = []

		// Keys related to lists the video might appear in
		if (video.ownerId) {
			const ownerId = video.ownerId.toString()
			keysToDelete.push(this.generateKey('allVideos', { role: 'Owner', userId: ownerId }))
			keysToDelete.push(this.generateKey('recentVideos', { role: 'Owner', userId: ownerId }))
			keysToDelete.push(this.generateKey('storageUsage', { role: 'Owner', userId: ownerId }))
		}

		if (video.editorId) {
			const editorId = video.editorId.toString()
			keysToDelete.push(this.generateKey('allVideos', { role: 'Editor', userId: editorId }))
			keysToDelete.push(this.generateKey('recentVideos', { role: 'Editor', userId: editorId }))
			keysToDelete.push(this.generateKey('videosByEditor', { editorId }))
			keysToDelete.push(this.generateKey('storageUsage', { role: 'Editor', userId: editorId }))
		}

		// Admin lists
		keysToDelete.push(this.generateKey('allVideos', { role: 'Admin' }))
		keysToDelete.push(this.generateKey('allVideosAdmin', {}))

		// Remove duplicates and delete
		await this.delete([...new Set(keysToDelete)])
	}

	getClient() {
		return this.client
	}
}

const cacheService = new CacheService()
export default cacheService
