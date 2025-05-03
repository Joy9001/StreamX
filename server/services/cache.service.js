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
	async invalidateVideoCaches(video) {
		const keysToDelete = []

		// Keys related to lists the video might appear in
		if (video?.ownerId) {
			const ownerId = video.ownerId.toString()
			keysToDelete.push(this.generateKey('allVideos', { role: 'Owner', userId: ownerId }))
			keysToDelete.push(this.generateKey('recentVideos', { role: 'Owner', userId: ownerId }))
			keysToDelete.push(this.generateKey('storageUsage', { role: 'Owner', userId: ownerId }))
		}

		if (video?.editorId) {
			const editorId = video.editorId.toString()
			keysToDelete.push(this.generateKey('allVideos', { role: 'Editor', userId: editorId }))
			keysToDelete.push(this.generateKey('recentVideos', { role: 'Editor', userId: editorId }))
			keysToDelete.push(this.generateKey('videosByEditor', { editorId }))
			keysToDelete.push(this.generateKey('storageUsage', { role: 'Editor', userId: editorId }))
			keysToDelete.push(this.generateKey('hiredByOwners', { editorId })) // Add hiredByOwners invalidation
		}

		// Admin lists
		keysToDelete.push(this.generateKey('allVideos', { role: 'Admin' }))
		keysToDelete.push(this.generateKey('videos', { key: 'all' }))

		// Remove duplicates and delete
		await this.delete([...new Set(keysToDelete)])
		console.log('Cache invalidated for video:', video)
	}

	async invalidateOwnerCaches({ ownerId, email }) {
		const keysToDelete = [this.generateKey('allOwners'), this.generateKey('owner', { key: 'all' })]

		if (ownerId != null) {
			const idStr = ownerId.toString()
			keysToDelete.push(
				this.generateKey('ownerProfile', { id: idStr }),
				this.generateKey('ownerName', { id: idStr }),
				this.generateKey('hiredEditors', { ownerId: idStr })
			)
		}

		if (email) {
			keysToDelete.push(this.generateKey('ownerByEmail', { email }))
		}

		const uniqueKeys = [...new Set(keysToDelete)].filter(Boolean)

		await this.delete(uniqueKeys)
		console.log(`Owner caches invalidated for: ${ownerId || email || 'general lists'}`, uniqueKeys)
	}

	async invalidateEditorCaches({ editorId, email }) {
		const keysToDelete = []
		// keys from admin controller
		keysToDelete.push(this.generateKey('editor', { key: 'all' }))

		// Specific editor caches if identifiers are provided
		if (editorId) {
			keysToDelete.push(this.generateKey('editorName', { editorId }))
			keysToDelete.push(this.generateKey('hiredByOwners', { editorId }))
		}
		if (email) {
			keysToDelete.push(this.generateKey('editor', { email }))
		}

		await this.delete([...new Set(keysToDelete)])
		console.log(`Cache invalidated for editor: ${editorId || email}`)
	}

	async invalidateAdminCaches(adminId) {
		const keysToDelete = []
		// keys from admin controller
		keysToDelete.push(this.generateKey('admin', { key: 'all' }))

		await this.delete([...new Set(keysToDelete)])
		console.log('Cache invalidated for admin:', adminId)
	}

	async invalidateRequestCaches(request) {
		const keysToDelete = []

		// Admin/general keys
		keysToDelete.push(this.generateKey('request', { key: 'all' }))

		if (request) {
			if (typeof request === 'object') {
				const { _id, to_id, from_id } = request

				if (_id) keysToDelete.push(this.generateKey('requestMessages', { id: _id }))
				if (to_id) keysToDelete.push(this.generateKey('requests', { to_id }))
				if (from_id) {
					keysToDelete.push(this.generateKey('requests', { from_id }))
					keysToDelete.push(this.generateKey('aggregateRequests', { fromId: from_id }))
				}
				if (to_id && from_id) {
					keysToDelete.push(this.generateKey('requestsByFromTo', { from_id, to_id }))
				}
			} else {
				const requestId = request
				keysToDelete.push(this.generateKey('requestMessages', { id: requestId }))
			}
		}

		await this.delete([...new Set(keysToDelete)])
		console.log('Cache invalidated for request:', request)
	}

	async invalidateEditorGigCaches(email) {
		const keysToDelete = []
		keysToDelete.push(this.generateKey('editorGig', { email }))
		keysToDelete.push(this.generateKey('editorGigs', { key: 'all' }))

		await this.delete([...new Set(keysToDelete)])
		console.log(`Cache invalidated for editor gig: ${email}`)
	}

	async invalidateEditorPlanCaches(email) {
		const keysToDelete = [this.generateKey('editorPlans', { key: 'all' })]

		if (email) {
			keysToDelete.push(this.generateKey('editorPlans', { email }))
			keysToDelete.push(this.generateKey('editorGigs', { email }))
		}
		await this.delete([...new Set(keysToDelete)])
		console.log(`Cache invalidated for editor plans and related gigs: ${email}`)
	}

	getClient() {
		return this.client
	}
}

const cacheService = new CacheService()
export default cacheService
