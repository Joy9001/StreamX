import { jest } from '@jest/globals'

// Spy on console methods and suppress output during tests
jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})

// Create mock save function
const mockRequestSave = jest.fn().mockImplementation(function () {
	return Promise.resolve({ ...this, _doc: { ...this } })
})

// Mock models with a factory pattern
class MockRequestModel {
	constructor(data) {
		this._id = data._id || 'request-123'
		this.to_id = data.to_id
		this.video_id = data.video_id
		this.from_id = data.from_id
		this.description = data.description
		this.price = data.price
		this.status = data.status || 'pending'
		this.messages = data.messages || []
		this.createdAt = data.createdAt || new Date()
		this.updatedAt = data.updatedAt || new Date()
		this._doc = { ...this }
		this.save = mockRequestSave
	}

	static find = jest.fn()
	static findById = jest.fn()
	static findByIdAndUpdate = jest.fn()
	static findByIdAndDelete = jest.fn()
}

// Mock the Request model
jest.unstable_mockModule('../../../models/request.model.js', () => ({
	default: MockRequestModel,
}))

// Mock Editor model
jest.unstable_mockModule('../../../models/editor.model.js', () => ({
	default: {
		find: jest.fn(),
		findById: jest.fn(),
	},
}))

// Mock Owner model
jest.unstable_mockModule('../../../models/owner.model.js', () => ({
	default: {
		find: jest.fn(),
		findById: jest.fn(),
	},
}))

// Mock cache service
const mockCacheSet = jest.fn().mockResolvedValue(true)
const mockCacheGet = jest.fn()
const mockCacheGenerateKey = jest.fn()
const mockCacheInvalidateRequestCaches = jest.fn().mockResolvedValue(true)

const mockCacheService = {
	get: mockCacheGet,
	set: mockCacheSet,
	generateKey: mockCacheGenerateKey,
	invalidateRequestCaches: mockCacheInvalidateRequestCaches,
	TTL: {
		DEFAULT: 3600,
		LIST: 1800,
		RECENT: 900,
	},
}

// Mock cache service module
jest.unstable_mockModule('../../../services/cache.service.js', () => ({
	default: mockCacheService,
}))

// Import the controller after mocking dependencies
const controllers = await import('../../../controllers/request.controller.js')

// Import mocked dependencies for test use
const models = {
	Request: (await import('../../../models/request.model.js')).default,
	Owner: (await import('../../../models/owner.model.js')).default,
	Editor: (await import('../../../models/editor.model.js')).default,
}

describe('Request Controller Tests', () => {
	let req, res
	let consoleLogSpy, consoleErrorSpy, consoleWarnSpy

	beforeAll(() => {
		// Spy on console methods
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
	})

	afterAll(() => {
		// Restore console methods
		consoleLogSpy.mockRestore()
		consoleErrorSpy.mockRestore()
		consoleWarnSpy.mockRestore()
	})

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks()

		// Setup request and response objects
		req = { params: {}, body: {} }
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}

		// Setup default response for cache service set
		mockCacheService.set.mockResolvedValue(true)
	})

	describe('createRequest', () => {
		it('should create a new request successfully', async () => {
			// Arrange
			req.body = {
				to_id: 'editor-123',
				video_id: 'video-123',
				from_id: 'owner-123',
				description: 'Test request',
				price: 100,
				status: 'pending',
			}

			// Act
			await controllers.createRequest(req, res)

			// Assert
			expect(mockRequestSave).toHaveBeenCalled()
			expect(mockCacheInvalidateRequestCaches).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					to_id: 'editor-123',
					video_id: 'video-123',
					from_id: 'owner-123',
					description: 'Test request',
					price: 100,
					status: 'pending',
				})
			)
		})

		it('should handle errors during request creation', async () => {
			// Arrange
			req.body = {
				to_id: 'editor-123',
				video_id: 'video-123',
				from_id: 'owner-123',
				description: 'Test request',
				price: 100,
			}

			mockRequestSave.mockRejectedValueOnce(new Error('Database error'))

			// Act
			await controllers.createRequest(req, res)

			// Assert
			expect(mockRequestSave).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error creating request',
					error: 'Database error',
				})
			)
		})
	})

	describe('getRequestsByToId', () => {
		const mockRequest = {
			_id: 'request-123',
			to_id: 'editor-123',
			from_id: 'owner-123',
			video_id: {
				_id: 'video-123',
				url: 'https://example.com/video.mp4',
				metaData: { name: 'Test Video' },
			},
			description: 'Test request',
			price: 100,
			status: 'pending',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		it('should return requests from cache if available', async () => {
			// Arrange
			req.params = { to_id: 'editor-123' }
			const processedRequests = [
				{
					_id: 'request-123',
					request_id: 'request-123',
					from: { id: 'owner-123', name: 'testowner' },
					to: { id: 'editor-123', name: 'testeditor' },
					video: { url: 'https://example.com/video.mp4', title: 'Test Video', _id: 'video-123' },
					description: 'Test request',
					price: 100,
					status: 'pending',
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				},
			]

			mockCacheGenerateKey.mockReturnValue('requests:to_id:editor-123')
			mockCacheGet.mockResolvedValue(processedRequests)

			// Act
			await controllers.getRequestsByToId(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('requests:to_id:editor-123')
			expect(models.Request.find).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(processedRequests)
		})

		it('should fetch and process requests if not in cache', async () => {
			// Arrange
			req.params = { to_id: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('requests:to_id:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const populateMock = jest.fn().mockResolvedValue([mockRequest])
			models.Request.find.mockReturnValue({ populate: populateMock })

			const mockOwner = { _id: 'owner-123', username: 'testowner' }
			models.Owner.findById.mockResolvedValue(mockOwner)

			const mockEditor = { _id: 'editor-123', name: 'testeditor' }
			models.Editor.findById.mockResolvedValue(mockEditor)

			// Act
			await controllers.getRequestsByToId(req, res)

			// Assert
			expect(models.Request.find).toHaveBeenCalledWith({ to_id: 'editor-123' })
			expect(models.Owner.findById).toHaveBeenCalledWith('owner-123')
			expect(models.Editor.findById).toHaveBeenCalledWith('editor-123')
			expect(mockCacheSet).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						_id: 'request-123',
						from: expect.objectContaining({ name: 'testowner' }),
						to: expect.objectContaining({ name: 'testeditor' }),
					}),
				])
			)
		})

		it('should return 404 if no requests found', async () => {
			// Arrange
			req.params = { to_id: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('requests:to_id:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const populateMock = jest.fn().mockResolvedValue([])
			models.Request.find.mockReturnValue({ populate: populateMock })

			// Act
			await controllers.getRequestsByToId(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Requests not found' })
		})

		it('should handle errors during request fetching', async () => {
			// Arrange
			req.params = { to_id: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('requests:to_id:editor-123')
			mockCacheGet.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.getRequestsByToId(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error fetching owner requests',
					error: 'Database error',
				})
			)
		})
	})

	describe('updateRequestStatus', () => {
		it('should update request status successfully', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = { status: 'approved' }

			const updatedRequest = {
				_id: 'request-123',
				status: 'approved',
				to_id: 'editor-123',
				from_id: 'owner-123',
			}

			models.Request.findByIdAndUpdate.mockResolvedValue(updatedRequest)

			// Act
			await controllers.updateRequestStatus(req, res)

			// Assert
			expect(models.Request.findByIdAndUpdate).toHaveBeenCalledWith(
				'request-123',
				{ status: 'approved' },
				{ new: true }
			)
			expect(mockCacheInvalidateRequestCaches).toHaveBeenCalledWith(updatedRequest)
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(updatedRequest)
		})

		it('should return 404 if request not found', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = { status: 'approved' }

			models.Request.findByIdAndUpdate.mockResolvedValue(null)

			// Act
			await controllers.updateRequestStatus(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Request not found' })
		})

		it('should handle errors during status update', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = { status: 'approved' }

			models.Request.findByIdAndUpdate.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.updateRequestStatus(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error updating request',
					error: 'Database error',
				})
			)
		})
	})

	describe('deleteRequest', () => {
		it('should delete a request successfully', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			const deletedRequest = {
				_id: 'request-123',
				to_id: 'editor-123',
				from_id: 'owner-123',
			}

			models.Request.findById.mockResolvedValue(deletedRequest)
			models.Request.findByIdAndDelete.mockResolvedValue(deletedRequest)

			// Act
			await controllers.deleteRequest(req, res)

			// Assert
			expect(models.Request.findById).toHaveBeenCalledWith('request-123')
			expect(models.Request.findByIdAndDelete).toHaveBeenCalledWith('request-123')
			expect(mockCacheInvalidateRequestCaches).toHaveBeenCalledWith(deletedRequest)
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Request deleted successfully',
					deletedRequest,
				})
			)
		})

		it('should return 404 if request not found', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			models.Request.findById.mockResolvedValue(null)

			// Act
			await controllers.deleteRequest(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Request not found' })
		})

		it('should handle errors during request deletion', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			models.Request.findById.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.deleteRequest(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error deleting request',
					error: 'Database error',
				})
			)
		})
	})

	describe('aggregateRequestsController', () => {
		it('should return aggregated request stats from cache if available', async () => {
			// Arrange
			req.params = { fromId: 'owner-123' }
			const aggregatedStats = {
				totalRequests: 5,
				totalPendingRequests: 2,
				totalApprovedRequests: 2,
				totalRejectedRequests: 1,
			}

			mockCacheGenerateKey.mockReturnValue('aggregateRequests:fromId:owner-123')
			mockCacheGet.mockResolvedValue(aggregatedStats)

			// Act
			await controllers.aggregateRequestsController(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('aggregateRequests:fromId:owner-123')
			expect(models.Request.find).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(aggregatedStats)
		})

		it('should calculate and return aggregated request stats if not in cache', async () => {
			// Arrange
			req.params = { fromId: 'owner-123' }

			mockCacheGenerateKey.mockReturnValue('aggregateRequests:fromId:owner-123')
			mockCacheGet.mockResolvedValue(null)

			const mockRequests = [
				{ status: 'pending' },
				{ status: 'pending' },
				{ status: 'approved' },
				{ status: 'approved' },
				{ status: 'rejected' },
			]

			models.Request.find.mockResolvedValue(mockRequests)

			// Act
			await controllers.aggregateRequestsController(req, res)

			// Assert
			expect(models.Request.find).toHaveBeenCalledWith({ from_id: 'owner-123' })
			expect(mockCacheSet).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({
				totalRequests: 5,
				totalPendingRequests: 2,
				totalApprovedRequests: 2,
				totalRejectedRequests: 1,
			})
		})

		it('should handle errors during stats aggregation', async () => {
			// Arrange
			req.params = { fromId: 'owner-123' }

			mockCacheGenerateKey.mockReturnValue('aggregateRequests:fromId:owner-123')
			mockCacheGet.mockResolvedValue(null)

			models.Request.find.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.aggregateRequestsController(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error fetching requests',
					error: 'Database error',
				})
			)
		})
	})

	describe('getRequestMessages', () => {
		it('should return request messages from cache if available', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			const messagesResponse = {
				success: true,
				messages: [
					{
						sender_id: 'owner-123',
						sender_role: 'Owner',
						sender_name: 'testowner',
						message: 'Hello',
						timestamp: new Date(),
					},
				],
				requestId: 'request-123',
			}

			mockCacheGenerateKey.mockReturnValue('requestMessages:id:request-123')
			mockCacheGet.mockResolvedValue(messagesResponse)

			// Act
			await controllers.getRequestMessages(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('requestMessages:id:request-123')
			expect(models.Request.findById).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(messagesResponse)
		})

		it('should fetch and return request messages if not in cache', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			mockCacheGenerateKey.mockReturnValue('requestMessages:id:request-123')
			mockCacheGet.mockResolvedValue(null)

			const messages = [
				{
					sender_id: 'owner-123',
					sender_role: 'Owner',
					sender_name: 'testowner',
					message: 'Hello',
					timestamp: new Date(2023, 0, 1),
				},
				{
					sender_id: 'editor-123',
					sender_role: 'Editor',
					sender_name: 'testeditor',
					message: 'Hi there',
					timestamp: new Date(2023, 0, 2),
				},
			]

			const mockRequest = {
				_id: 'request-123',
				messages,
			}

			models.Request.findById.mockResolvedValue(mockRequest)

			// Act
			await controllers.getRequestMessages(req, res)

			// Assert
			expect(models.Request.findById).toHaveBeenCalledWith('request-123')
			expect(mockCacheSet).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				messages: expect.arrayContaining(messages),
				requestId: 'request-123',
			})
		})

		it('should return 404 if request not found', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			mockCacheGenerateKey.mockReturnValue('requestMessages:id:request-123')
			mockCacheGet.mockResolvedValue(null)

			models.Request.findById.mockResolvedValue(null)

			// Act
			await controllers.getRequestMessages(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Request not found' })
		})

		it('should handle errors during message fetching', async () => {
			// Arrange
			req.params = { id: 'request-123' }

			mockCacheGenerateKey.mockReturnValue('requestMessages:id:request-123')
			mockCacheGet.mockResolvedValue(null)

			models.Request.findById.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.getRequestMessages(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					message: 'Error fetching request messages',
					error: 'Database error',
				})
			)
		})
	})

	describe('addMessageToRequest', () => {
		it('should add a message to a request successfully', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = {
				sender_id: 'owner-123',
				sender_role: 'Owner',
				sender_name: 'testowner',
				message: 'Hello',
			}

			const mockRequest = {
				_id: 'request-123',
				from_id: 'owner-123',
				to_id: 'editor-123',
				messages: [],
				save: jest.fn().mockResolvedValue({
					_id: 'request-123',
					messages: [
						{
							sender_id: 'owner-123',
							sender_role: 'Owner',
							sender_name: 'testowner',
							message: 'Hello',
							timestamp: expect.any(Date),
						},
					],
				}),
			}

			models.Request.findById.mockResolvedValue(mockRequest)

			// Act
			await controllers.addMessageToRequest(req, res)

			// Assert
			expect(models.Request.findById).toHaveBeenCalledWith('request-123')
			expect(mockRequest.save).toHaveBeenCalled()
			expect(mockCacheInvalidateRequestCaches).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Message added successfully',
					newMessage: expect.objectContaining({
						sender_id: 'owner-123',
						message: 'Hello',
					}),
				})
			)
		})

		it('should return 400 if required fields are missing', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = {
				// Missing required fields
				sender_id: 'owner-123',
				sender_role: 'Owner',
				// Missing sender_name and message
			}

			// Act
			await controllers.addMessageToRequest(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(400)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					message: 'Missing required fields for message',
				})
			)
		})

		it('should return 404 if request not found', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = {
				sender_id: 'owner-123',
				sender_role: 'Owner',
				sender_name: 'testowner',
				message: 'Hello',
			}

			models.Request.findById.mockResolvedValue(null)

			// Act
			await controllers.addMessageToRequest(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Request not found' })
		})

		it('should return 403 if sender is not authorized', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = {
				sender_id: 'unauthorized-123',
				sender_role: 'Owner',
				sender_name: 'testowner',
				message: 'Hello',
			}

			const mockRequest = {
				_id: 'request-123',
				from_id: 'owner-123',
				to_id: 'editor-123',
			}

			models.Request.findById.mockResolvedValue(mockRequest)

			// Act
			await controllers.addMessageToRequest(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(403)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					message: 'You are not authorized to add messages to this request',
				})
			)
		})

		it('should handle errors during message addition', async () => {
			// Arrange
			req.params = { id: 'request-123' }
			req.body = {
				sender_id: 'owner-123',
				sender_role: 'Owner',
				sender_name: 'testowner',
				message: 'Hello',
			}

			models.Request.findById.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.addMessageToRequest(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					message: 'Error adding message to request',
					error: 'Database error',
				})
			)
		})
	})

	describe('changePrice', () => {
		it('should change the price of a request successfully', async () => {
			// Arrange
			req.body = {
				id: 'request-123',
				price: 150,
			}

			const mockRequest = {
				_id: 'request-123',
				price: 100,
				save: jest.fn().mockImplementation(function () {
					return Promise.resolve(this)
				}),
			}

			models.Request.findById.mockResolvedValue(mockRequest)

			// Act
			await controllers.changePrice(req, res)

			// Assert
			expect(models.Request.findById).toHaveBeenCalledWith('request-123')
			expect(mockRequest.price).toBe(150)
			expect(mockRequest.save).toHaveBeenCalled()
			expect(mockCacheInvalidateRequestCaches).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: true,
					message: 'Price changed successfully',
					request: expect.objectContaining({
						_id: 'request-123',
						price: 150,
					}),
				})
			)
		})

		it('should return 404 if request not found', async () => {
			// Arrange
			req.body = {
				id: 'request-123',
				price: 150,
			}

			models.Request.findById.mockResolvedValue(null)

			// Act
			await controllers.changePrice(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Request not found' })
		})

		it('should handle errors during price change', async () => {
			// Arrange
			req.body = {
				id: 'request-123',
				price: 150,
			}

			models.Request.findById.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.changePrice(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					message: 'Error changing price',
					error: 'Database error',
				})
			)
		})
	})
})
