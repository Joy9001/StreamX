import { jest } from '@jest/globals'

// Create mock constructor for Owner
const mockOwnerModel = function () {
	return {
		save: jest.fn().mockResolvedValue(this),
		toObject: jest.fn().mockReturnValue(this),
	}
}

// Use variables to store the mock
const mockCacheService = {
	generateKey: jest.fn(),
	get: jest.fn(),
	set: jest.fn(),
	invalidateOwnerCaches: jest.fn(),
	TTL: {
		LIST: 3600,
		SINGLE: 1800,
	},
}

const mockOwner = Object.assign(
	jest.fn().mockImplementation(() => mockOwnerModel()),
	{
		find: jest.fn(),
		findOne: jest.fn(),
		findById: jest.fn(),
		findOneAndUpdate: jest.fn(),
		deleteOne: jest.fn(),
	}
)

const mockEditor = {
	find: jest.fn(),
}

const mockVideo = {
	distinct: jest.fn(),
}

// Mock the modules before importing the functions
jest.unstable_mockModule('../../../services/cache.service.js', () => ({
	default: mockCacheService,
}))

jest.unstable_mockModule('../../../models/owner.model.js', () => ({
	default: mockOwner,
}))

jest.unstable_mockModule('../../../models/editor.model.js', () => ({
	default: mockEditor,
}))

jest.unstable_mockModule('../../../models/video.model.js', () => ({
	default: mockVideo,
}))

// Import the controller functions after mocking
const {
	getAllOwners,
	createOwner,
	deleteOwner,
	getOwnerProfile,
	getOwnerByEmail,
	updateOwner,
	getHiredEditors,
	getOwnerNameById,
} = await import('../../../controllers/owner.controller.js')

describe('Owner Controller', () => {
	let mockReq
	let mockRes
	let originalConsoleError

	// Save the original console.error and replace it with a mock before all tests
	beforeAll(() => {
		originalConsoleError = console.error
		console.error = jest.fn()
	})

	// Restore the original console.error after all tests
	afterAll(() => {
		console.error = originalConsoleError
	})

	beforeEach(() => {
		mockReq = {
			params: {},
			body: {},
		}
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}
		jest.clearAllMocks()

		// Silence console logs during tests
		jest.spyOn(console, 'log').mockImplementation(() => {})
	})

	describe('getAllOwners', () => {
		const mockCacheKey = 'allOwners'
		const mockOwners = [
			{ _id: '1', username: 'owner1', email: 'owner1@example.com' },
			{ _id: '2', username: 'owner2', email: 'owner2@example.com' },
		]

		beforeEach(() => {
			mockCacheService.generateKey.mockReturnValue(mockCacheKey)
		})

		it('should return owners from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockOwners)

			await getAllOwners(mockReq, mockRes)

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('allOwners')
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockOwner.find).not.toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockOwners)
		})

		it('should fetch owners from database if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockOwner.find.mockReturnValue({
				lean: jest.fn().mockResolvedValue(mockOwners),
			})

			await getAllOwners(mockReq, mockRes)

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockOwner.find).toHaveBeenCalledWith({})
			expect(mockCacheService.set).toHaveBeenCalledWith(mockCacheKey, mockOwners, mockCacheService.TTL.LIST)
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockOwners)
		})

		it('should handle errors', async () => {
			const error = new Error('Database error')
			mockCacheService.get.mockRejectedValue(error)

			await getAllOwners(mockReq, mockRes)

			expect(mockRes.status).toHaveBeenCalledWith(500)
			expect(mockRes.json).toHaveBeenCalledWith({
				message: 'Error fetching owners',
				error: 'Database error',
			})
		})
	})

	describe('createOwner', () => {
		beforeEach(() => {
			mockReq.body = {
				username: 'newowner',
				email: 'newowner@example.com',
				password: 'password123',
				YTchannelname: 'NewOwnerChannel',
				profilephoto: 'photo.jpg',
				storageLimit: 20,
			}

			// Setup mock for Owner constructor
			const mockOwnerInstance = {
				...mockReq.body,
				_id: 'mockid123',
				toObject: jest.fn().mockReturnValue({
					...mockReq.body,
					_id: 'mockid123',
					storageLimit: mockReq.body.storageLimit * 1024,
				}),
				save: jest.fn().mockResolvedValue({
					...mockReq.body,
					_id: 'mockid123',
				}),
			}

			// Setup a new Owner instance that will be returned
			mockOwner.mockReturnValueOnce(mockOwnerInstance)
		})

		it('should create a new owner successfully', async () => {
			mockOwner.findOne.mockReturnValue({
				lean: jest.fn().mockResolvedValue(null),
			})

			await createOwner(mockReq, mockRes)

			expect(mockOwner.findOne).toHaveBeenCalledWith({ email: 'newowner@example.com' })
			expect(mockCacheService.invalidateOwnerCaches).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(201)
			expect(mockRes.json).toHaveBeenCalledWith(
				expect.objectContaining({
					username: 'newowner',
					email: 'newowner@example.com',
				})
			)
			// Password should be removed from response
			expect(mockRes.json.mock.calls[0][0].password).toBeUndefined()
		})

		it('should return 400 if required fields are missing', async () => {
			mockReq.body = { email: 'partial@example.com' } // Missing username and password

			await createOwner(mockReq, mockRes)

			expect(mockRes.status).toHaveBeenCalledWith(400)
			expect(mockRes.json).toHaveBeenCalledWith({
				message: 'Missing required fields: username, email, password',
			})
		})
	})

	describe('deleteOwner', () => {
		beforeEach(() => {
			mockReq.params = {
				email: 'owner@example.com',
			}
		})

		it('should delete an owner successfully', async () => {
			mockOwner.findOne.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue({ _id: 'ownerid123' }),
			})
			mockOwner.deleteOne.mockResolvedValue({ deletedCount: 1 })

			await deleteOwner(mockReq, mockRes)

			expect(mockOwner.findOne).toHaveBeenCalledWith({ email: 'owner@example.com' })
			expect(mockOwner.deleteOne).toHaveBeenCalledWith({ email: 'owner@example.com' })
			expect(mockCacheService.invalidateOwnerCaches).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith({ message: 'Owner deleted successfully' })
		})

		it('should return 404 if owner not found', async () => {
			mockOwner.findOne.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(null),
			})

			await deleteOwner(mockReq, mockRes)

			expect(mockOwner.findOne).toHaveBeenCalledWith({ email: 'owner@example.com' })
			expect(mockRes.status).toHaveBeenCalledWith(404)
			expect(mockRes.json).toHaveBeenCalledWith({ message: 'Owner not found' })
		})
	})

	describe('getOwnerProfile', () => {
		const mockCacheKey = 'ownerProfile:123'
		const mockOwnerId = '123'
		const mockOwnerData = {
			_id: mockOwnerId,
			username: 'testuser',
			email: 'test@example.com',
			storageLimit: 10240, // 10 MB in KB
			usedStorage: 5120, // 5 MB in KB
		}

		beforeEach(() => {
			mockReq.params = { id: mockOwnerId }
			mockCacheService.generateKey.mockReturnValue(mockCacheKey)
		})

		it('should return owner profile from cache if available', async () => {
			// When getting from cache, the controller already has these calculated values
			// but will still convert KB to MB in the response
			const cachedProfile = {
				...mockOwnerData,
				remainingStorage: 5120,
				storagePercentage: '50.00',
			}
			mockCacheService.get.mockResolvedValue(cachedProfile)

			// Mock response.json to simulate the controller function's behavior
			// This will help us test what's passed to the response without modifying the controller
			let responseData
			mockRes.json.mockImplementation((data) => {
				responseData = data
				return mockRes
			})

			await getOwnerProfile(mockReq, mockRes)

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('ownerProfile', { id: mockOwnerId })
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockOwner.findById).not.toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)

			// In the controller, the cached values are used to create the response
			// with the storage values converted from KB to MB
			expect(responseData).toBeDefined()
			expect(responseData.storageLimit).toBe(cachedProfile.storageLimit)
			expect(responseData.usedStorage).toBe(cachedProfile.usedStorage)
			expect(responseData.remainingStorage).toBe(cachedProfile.remainingStorage)
			expect(responseData.storagePercentage).toBe(cachedProfile.storagePercentage)
		})

		it('should fetch owner profile from database if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockOwner.findById.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockOwnerData),
			})

			await getOwnerProfile(mockReq, mockRes)

			expect(mockOwner.findById).toHaveBeenCalledWith(mockOwnerId)
			expect(mockCacheService.set).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalled()
		})
	})

	describe('getOwnerByEmail', () => {
		const mockEmail = 'owner@example.com'
		const mockCacheKey = 'ownerByEmail:owner@example.com'
		const mockOwnerData = {
			_id: 'ownerid123',
			username: 'testowner',
			email: mockEmail,
			storageLimit: 10240, // 10 MB in KB
			password: 'hashedpassword123',
		}

		beforeEach(() => {
			mockReq.params = { email: mockEmail }
			mockCacheService.generateKey.mockReturnValue(mockCacheKey)
		})

		it('should return owner from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockOwnerData)

			await getOwnerByEmail(mockReq, mockRes)

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockOwner.findOne).not.toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)

			// Verify response has password removed
			const responseData = mockRes.json.mock.calls[0][0]
			expect(responseData.password).toBeUndefined()
		})

		it('should return 404 if owner not found', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockOwner.findOne.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(null),
			})

			await getOwnerByEmail(mockReq, mockRes)

			expect(mockRes.status).toHaveBeenCalledWith(404)
			expect(mockRes.json).toHaveBeenCalledWith({ message: 'Owner not found' })
		})
	})

	describe('updateOwner', () => {
		const mockEmail = 'owner@example.com'
		const mockUpdatedOwner = {
			_id: 'ownerid123',
			username: 'updatedname',
			email: mockEmail,
			storageLimit: 20480, // 20 MB in KB
		}

		beforeEach(() => {
			mockReq.params = { email: mockEmail }
			mockReq.body = {
				username: 'updatedname',
				storageLimit: 20,
			}
		})

		it('should update an owner successfully', async () => {
			mockOwner.findOneAndUpdate.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockUpdatedOwner),
			})

			await updateOwner(mockReq, mockRes)

			expect(mockOwner.findOneAndUpdate).toHaveBeenCalled()
			expect(mockCacheService.invalidateOwnerCaches).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalled()
		})

		it('should return 404 if owner not found', async () => {
			mockOwner.findOneAndUpdate.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(null),
			})

			await updateOwner(mockReq, mockRes)

			expect(mockRes.status).toHaveBeenCalledWith(404)
			expect(mockRes.json).toHaveBeenCalledWith({ message: 'Owner not found' })
		})
	})

	describe('getHiredEditors', () => {
		const mockOwnerId = 'ownerid123'
		const mockCacheKey = 'hiredEditors:ownerid123'
		const mockEditorIds = ['editorid1', 'editorid2']
		const mockEditors = [
			{ _id: 'editorid1', name: 'Editor One', email: 'editor1@example.com' },
			{ _id: 'editorid2', name: 'Editor Two', email: 'editor2@example.com' },
		]

		beforeEach(() => {
			mockReq.params = { ownerId: mockOwnerId }
			mockCacheService.generateKey.mockReturnValue(mockCacheKey)
		})

		it('should return hired editors from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockEditors)

			await getHiredEditors(mockReq, mockRes)

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockVideo.distinct).not.toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockEditors)
		})

		it('should fetch hired editors if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockVideo.distinct.mockResolvedValue(mockEditorIds)
			mockEditor.find.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockEditors),
			})

			await getHiredEditors(mockReq, mockRes)

			expect(mockVideo.distinct).toHaveBeenCalled()
			expect(mockEditor.find).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockEditors)
		})
	})

	describe('getOwnerNameById', () => {
		const mockOwnerId = 'ownerid123'
		const mockCacheKey = 'ownerName:ownerid123'
		const mockOwnerData = {
			_id: mockOwnerId,
			username: 'testowner',
		}
		const mockNameData = { name: 'testowner' }

		beforeEach(() => {
			mockReq.params = { id: mockOwnerId }
			mockCacheService.generateKey.mockReturnValue(mockCacheKey)
		})

		it('should return owner name from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockNameData)

			await getOwnerNameById(mockReq, mockRes)

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey)
			expect(mockOwner.findById).not.toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockNameData)
		})

		it('should fetch owner name if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockOwner.findById.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockOwnerData),
			})

			await getOwnerNameById(mockReq, mockRes)

			expect(mockOwner.findById).toHaveBeenCalledWith(mockOwnerId)
			expect(mockCacheService.set).toHaveBeenCalled()
			expect(mockRes.status).toHaveBeenCalledWith(200)
			expect(mockRes.json).toHaveBeenCalledWith(mockNameData)
		})

		it('should return 404 if owner not found', async () => {
			mockCacheService.get.mockResolvedValue(null)
			mockOwner.findById.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(null),
			})

			await getOwnerNameById(mockReq, mockRes)

			expect(mockRes.status).toHaveBeenCalledWith(404)
			expect(mockRes.json).toHaveBeenCalledWith({ message: 'Owner not found' })
		})
	})
})
