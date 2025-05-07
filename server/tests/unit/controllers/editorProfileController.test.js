import { jest } from '@jest/globals'

// Spy on console methods and suppress output during tests
jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})

// Create mock save function
const mockEditorGigSave = jest.fn().mockImplementation(function () {
	return Promise.resolve({ ...this, _doc: { ...this } })
})

// Mock models with a factory pattern
class MockEditorGigModel {
	constructor(data) {
		this._id = data._id || 'editor-gig-123'
		this.name = data.name
		this.email = data.email
		this.phone = data.phone
		this.location = data.location
		this.image = data.image
		this.software = data.software || []
		this.specializations = data.specializations || []
		this._doc = { ...this }
		this.save = mockEditorGigSave
	}

	static find = jest.fn()
	static findOne = jest.fn()
	static findById = jest.fn()
	static findOneAndDelete = jest.fn()
	static findOneAndUpdate = jest.fn()
}

class MockEditorModel {
	constructor(data) {
		this._id = data._id || 'editor-123'
		this.name = data.name
		this.email = data.email
		this.profilephoto = data.profilephoto
		this._doc = { ...this }
	}

	static find = jest.fn()
	static findOne = jest.fn()
	static findById = jest.fn()
	static findOneAndDelete = jest.fn()
	static findOneAndUpdate = jest.fn()
}

class MockVideoModel {
	constructor(data) {
		this._id = data._id || 'video-123'
		this.editorId = data.editorId
		this.ownerId = data.ownerId
		this._doc = { ...this }
	}

	static find = jest.fn()
}

class MockOwnerModel {
	constructor(data) {
		this._id = data._id || 'owner-123'
		this.name = data.name
		this.email = data.email
		this.username = data.username
		this.profileImage = data.profileImage
		this._doc = { ...this }
	}

	static find = jest.fn()
}

// Mock the models
jest.unstable_mockModule('../../../models/editorGig.model.js', () => ({
	default: MockEditorGigModel,
}))

jest.unstable_mockModule('../../../models/editor.model.js', () => ({
	default: MockEditorModel,
}))

jest.unstable_mockModule('../../../models/video.model.js', () => ({
	default: MockVideoModel,
}))

jest.unstable_mockModule('../../../models/owner.model.js', () => ({
	default: MockOwnerModel,
}))

// Mock cache service
const mockCacheSet = jest.fn().mockResolvedValue(true)
const mockCacheGet = jest.fn()
const mockCacheGenerateKey = jest.fn()
const mockCacheInvalidateEditorGigCaches = jest.fn().mockResolvedValue(true)
const mockCacheInvalidateEditorCaches = jest.fn().mockResolvedValue(true)

const mockCacheService = {
	get: mockCacheGet,
	set: mockCacheSet,
	generateKey: mockCacheGenerateKey,
	invalidateEditorGigCaches: mockCacheInvalidateEditorGigCaches,
	invalidateEditorCaches: mockCacheInvalidateEditorCaches,
	TTL: {
		DEFAULT: 3600,
		LIST: 1800,
		RECENT: 900,
		SINGLE: 7200,
	},
}

// Mock cache service module
jest.unstable_mockModule('../../../services/cache.service.js', () => ({
	default: mockCacheService,
}))

// Import the controller after mocking dependencies
const controllers = await import('../../../controllers/editorProfile.controller.js')

// Import mocked dependencies for test use
const models = {
	EditorGig: (await import('../../../models/editorGig.model.js')).default,
	Editor: (await import('../../../models/editor.model.js')).default,
	Video: (await import('../../../models/video.model.js')).default,
	Owner: (await import('../../../models/owner.model.js')).default,
}

describe('Editor Profile Controller Tests', () => {
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

	describe('createEditorProfile', () => {
		it('should create a new editor profile successfully', async () => {
			// Arrange
			req.body = {
				name: 'Test Editor',
				email: 'test@example.com',
				phone: '1234567890',
				location: 'New York',
				image: 'profile.jpg',
				software: ['Premiere Pro', 'After Effects'],
				specializations: ['Video Editing', 'Animation'],
			}

			models.EditorGig.findOne.mockResolvedValue(null)

			// Act
			await controllers.createEditorProfile(req, res)

			// Assert
			expect(models.EditorGig.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
			expect(mockEditorGigSave).toHaveBeenCalled()
			expect(mockCacheInvalidateEditorGigCaches).toHaveBeenCalledWith('test@example.com')
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'Test Editor',
					email: 'test@example.com',
					software: ['Premiere Pro', 'After Effects'],
					specializations: ['Video Editing', 'Animation'],
				})
			)
		})

		it('should return 400 if editor with email already exists', async () => {
			// Arrange
			req.body = {
				name: 'Test Editor',
				email: 'existing@example.com',
				phone: '1234567890',
				location: 'New York',
				image: 'profile.jpg',
				software: ['Premiere Pro'],
				specializations: ['Video Editing'],
			}

			const existingEditor = new MockEditorGigModel({
				name: 'Existing Editor',
				email: 'existing@example.com',
			})

			models.EditorGig.findOne.mockResolvedValue(existingEditor)

			// Act
			await controllers.createEditorProfile(req, res)

			// Assert
			expect(models.EditorGig.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' })
			expect(mockEditorGigSave).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(400)
			expect(res.json).toHaveBeenCalledWith({ message: 'Editor with this email already exists.' })
		})

		it('should handle errors during profile creation', async () => {
			// Arrange
			req.body = {
				name: 'Test Editor',
				email: 'test@example.com',
				phone: '1234567890',
				location: 'New York',
				image: 'profile.jpg',
				software: ['Premiere Pro'],
				specializations: ['Video Editing'],
			}

			models.EditorGig.findOne.mockResolvedValue(null)
			mockEditorGigSave.mockRejectedValueOnce(new Error('Database error'))

			// Act
			await controllers.createEditorProfile(req, res)

			// Assert
			expect(models.EditorGig.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
			expect(mockEditorGigSave).toHaveBeenCalled()
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error creating editor profile',
					error: 'Database error',
				})
			)
		})
	})

	describe('getEditorNameById', () => {
		it('should return editor name from cache if available', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }
			const cachedData = { name: 'Test Editor' }

			mockCacheGenerateKey.mockReturnValue('editorName:editorId:editor-123')
			mockCacheGet.mockResolvedValue(cachedData)

			// Act
			await controllers.getEditorNameById(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('editorName:editorId:editor-123')
			expect(models.EditorGig.findById).not.toHaveBeenCalled()
			expect(models.Editor.findById).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(cachedData)
		})

		it('should fetch editor name from EditorGig model if not in cache', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('editorName:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const selectMock = jest.fn().mockResolvedValue({ name: 'Test Editor', email: 'test@example.com' })
			models.EditorGig.findById.mockReturnValue({ select: selectMock })
			models.Editor.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) })

			// Act
			await controllers.getEditorNameById(req, res)

			// Assert
			expect(models.EditorGig.findById).toHaveBeenCalledWith('editor-123')
			expect(mockCacheSet).toHaveBeenCalledWith(
				'editorName:editorId:editor-123',
				{ name: 'Test Editor' },
				expect.any(Number)
			)
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({ name: 'Test Editor' })
		})

		it('should fetch editor name from Editor model if not found in EditorGig', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('editorName:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			models.EditorGig.findById.mockReturnValue({
				select: jest.fn().mockResolvedValue(null),
			})

			models.Editor.findById.mockReturnValue({
				select: jest.fn().mockResolvedValue({ name: 'Test Editor', email: 'test@example.com' }),
			})

			// Act
			await controllers.getEditorNameById(req, res)

			// Assert
			expect(models.EditorGig.findById).toHaveBeenCalledWith('editor-123')
			expect(models.Editor.findById).toHaveBeenCalledWith('editor-123')
			expect(mockCacheSet).toHaveBeenCalledWith(
				'editorName:editorId:editor-123',
				{ name: 'Test Editor' },
				expect.any(Number)
			)
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({ name: 'Test Editor' })
		})

		it('should return 404 if editor not found in both models', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('editorName:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			models.EditorGig.findById.mockReturnValue({
				select: jest.fn().mockResolvedValue(null),
			})

			models.Editor.findById.mockReturnValue({
				select: jest.fn().mockResolvedValue(null),
			})

			// Act
			await controllers.getEditorNameById(req, res)

			// Assert
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Editor not found' })
		})

		it('should handle errors during editor name retrieval', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('editorName:editorId:editor-123')
			mockCacheGet.mockRejectedValue(new Error('Cache error'))

			// Act
			await controllers.getEditorNameById(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Failed to fetch editor name',
					error: 'Cache error',
				})
			)
		})
	})

	describe('getHiredByOwners', () => {
		it('should return hired by owners from cache if available', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }
			const cachedOwners = [
				{ _id: 'owner-1', name: 'Owner 1', email: 'owner1@example.com', profileImage: 'owner1.jpg' },
				{ _id: 'owner-2', name: 'Owner 2', email: 'owner2@example.com', profileImage: 'owner2.jpg' },
			]

			mockCacheGenerateKey.mockReturnValue('hiredByOwners:editorId:editor-123')
			mockCacheGet.mockResolvedValue(cachedOwners)

			// Act
			await controllers.getHiredByOwners(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('hiredByOwners:editorId:editor-123')
			expect(models.Video.find).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(cachedOwners)
		})

		it('should fetch and return hired by owners if not in cache', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('hiredByOwners:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const videos = [
				{ ownerId: 'owner-1' },
				{ ownerId: 'owner-2' },
				{ ownerId: 'owner-1' }, // Duplicate to test uniqueness
			]

			const selectMock = jest.fn().mockResolvedValue(videos)
			models.Video.find.mockReturnValue({ select: selectMock })

			const owners = [
				{ _id: 'owner-1', name: 'Owner 1', email: 'owner1@example.com', profileImage: 'owner1.jpg' },
				{ _id: 'owner-2', name: 'Owner 2', email: 'owner2@example.com', profileImage: 'owner2.jpg' },
			]

			const ownerSelectMock = jest.fn().mockResolvedValue(owners)
			models.Owner.find.mockReturnValue({ select: ownerSelectMock })

			// Act
			await controllers.getHiredByOwners(req, res)

			// Assert
			expect(models.Video.find).toHaveBeenCalledWith({ editorId: 'editor-123' })
			expect(models.Owner.find).toHaveBeenCalledWith({ _id: { $in: ['owner-1', 'owner-2'] } })
			expect(mockCacheSet).toHaveBeenCalledWith('hiredByOwners:editorId:editor-123', owners, expect.any(Number))
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(owners)
		})

		it('should return empty array if no videos found', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('hiredByOwners:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const selectMock = jest.fn().mockResolvedValue([])
			models.Video.find.mockReturnValue({ select: selectMock })

			// Act
			await controllers.getHiredByOwners(req, res)

			// Assert
			expect(models.Video.find).toHaveBeenCalledWith({ editorId: 'editor-123' })
			expect(models.Owner.find).not.toHaveBeenCalled()
			expect(mockCacheSet).toHaveBeenCalledWith('hiredByOwners:editorId:editor-123', [], expect.any(Number))
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith([])
		})

		it('should return empty array if no owner IDs found in videos', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('hiredByOwners:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			const videos = [
				{}, // No ownerId
				{}, // No ownerId
			]

			const selectMock = jest.fn().mockResolvedValue(videos)
			models.Video.find.mockReturnValue({ select: selectMock })

			// Act
			await controllers.getHiredByOwners(req, res)

			// Assert
			expect(models.Video.find).toHaveBeenCalledWith({ editorId: 'editor-123' })
			expect(models.Owner.find).not.toHaveBeenCalled()
			expect(mockCacheSet).toHaveBeenCalledWith('hiredByOwners:editorId:editor-123', [], expect.any(Number))
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith([])
		})

		it('should handle errors during hired by owners retrieval', async () => {
			// Arrange
			req.params = { editorId: 'editor-123' }

			mockCacheGenerateKey.mockReturnValue('hiredByOwners:editorId:editor-123')
			mockCacheGet.mockResolvedValue(null)

			models.Video.find.mockReturnValue({
				select: jest.fn().mockRejectedValue(new Error('Database error')),
			})

			// Act
			await controllers.getHiredByOwners(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Error fetching hired by owners',
					error: 'Database error',
				})
			)
		})
	})

	describe('deleteEditorByEmail', () => {
		it('should delete an editor successfully', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }

			const deletedEditor = {
				_id: 'editor-123',
				email: 'test@example.com',
			}

			const selectMock = jest.fn().mockResolvedValue(deletedEditor)
			models.Editor.findOneAndDelete.mockReturnValue({ select: selectMock })

			// Act
			await controllers.deleteEditorByEmail(req, res)

			// Assert
			expect(models.Editor.findOneAndDelete).toHaveBeenCalledWith({ email: 'test@example.com' })
			expect(mockCacheInvalidateEditorCaches).toHaveBeenCalledWith({
				editorId: 'editor-123',
				email: 'test@example.com',
			})
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({
				message: 'Editor with email test@example.com deleted successfully',
			})
		})

		it('should return 404 if editor not found', async () => {
			// Arrange
			req.params = { email: 'nonexistent@example.com' }

			const selectMock = jest.fn().mockResolvedValue(null)
			models.Editor.findOneAndDelete.mockReturnValue({ select: selectMock })

			// Act
			await controllers.deleteEditorByEmail(req, res)

			// Assert
			expect(models.Editor.findOneAndDelete).toHaveBeenCalledWith({ email: 'nonexistent@example.com' })
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Editor not found' })
		})

		it('should handle errors during editor deletion', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }

			models.Editor.findOneAndDelete.mockReturnValue({
				select: jest.fn().mockRejectedValue(new Error('Database error')),
			})

			// Act
			await controllers.deleteEditorByEmail(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Failed to delete editor',
					error: 'Database error',
				})
			)
		})
	})

	describe('updateEditor', () => {
		it('should update an editor successfully', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }
			req.body = {
				name: 'Updated Name',
				phone: '9876543210',
			}

			const updatedEditor = {
				_id: 'editor-123',
				email: 'test@example.com',
				name: 'Updated Name',
				phone: '9876543210',
			}

			const selectMock = jest.fn().mockResolvedValue(updatedEditor)
			models.Editor.findOneAndUpdate.mockReturnValue({ select: selectMock })

			// Act
			await controllers.updateEditor(req, res)

			// Assert
			expect(models.Editor.findOneAndUpdate).toHaveBeenCalledWith({ email: 'test@example.com' }, req.body, {
				new: true,
			})
			expect(mockCacheInvalidateEditorCaches).toHaveBeenCalledWith({
				editorId: 'editor-123',
				email: 'test@example.com',
			})
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(updatedEditor)
		})

		it('should return 404 if editor not found', async () => {
			// Arrange
			req.params = { email: 'nonexistent@example.com' }
			req.body = {
				name: 'Updated Name',
			}

			const selectMock = jest.fn().mockResolvedValue(null)
			models.Editor.findOneAndUpdate.mockReturnValue({ select: selectMock })

			// Act
			await controllers.updateEditor(req, res)

			// Assert
			expect(models.Editor.findOneAndUpdate).toHaveBeenCalledWith(
				{ email: 'nonexistent@example.com' },
				req.body,
				{ new: true }
			)
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Editor not found' })
		})

		it('should handle errors during editor update', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }
			req.body = {
				name: 'Updated Name',
			}

			models.Editor.findOneAndUpdate.mockReturnValue({
				select: jest.fn().mockRejectedValue(new Error('Database error')),
			})

			// Act
			await controllers.updateEditor(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Server error updating editor',
					error: 'Database error',
				})
			)
		})
	})

	describe('getEditorByEmail', () => {
		it('should return editor from cache if available', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }
			const cachedEditor = {
				_id: 'editor-123',
				name: 'Test Editor',
				email: 'test@example.com',
			}

			mockCacheGenerateKey.mockReturnValue('editor:email:test@example.com')
			mockCacheGet.mockResolvedValue(cachedEditor)

			// Act
			await controllers.getEditorByEmail(req, res)

			// Assert
			expect(mockCacheGet).toHaveBeenCalledWith('editor:email:test@example.com')
			expect(models.Editor.findOne).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(cachedEditor)
		})

		it('should fetch and return editor if not in cache', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }

			mockCacheGenerateKey.mockReturnValue('editor:email:test@example.com')
			mockCacheGet.mockResolvedValue(null)

			const editor = {
				_id: 'editor-123',
				name: 'Test Editor',
				email: 'test@example.com',
			}

			models.Editor.findOne.mockResolvedValue(editor)

			// Act
			await controllers.getEditorByEmail(req, res)

			// Assert
			expect(models.Editor.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
			expect(mockCacheSet).toHaveBeenCalledWith('editor:email:test@example.com', editor, expect.any(Number))
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(editor)
		})

		it('should return 404 if editor not found', async () => {
			// Arrange
			req.params = { email: 'nonexistent@example.com' }

			mockCacheGenerateKey.mockReturnValue('editor:email:nonexistent@example.com')
			mockCacheGet.mockResolvedValue(null)

			models.Editor.findOne.mockResolvedValue(null)

			// Act
			await controllers.getEditorByEmail(req, res)

			// Assert
			expect(models.Editor.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' })
			expect(mockCacheSet).toHaveBeenCalledWith('editor:email:nonexistent@example.com', null, expect.any(Number))
			expect(res.status).toHaveBeenCalledWith(404)
			expect(res.json).toHaveBeenCalledWith({ message: 'Editor not found' })
		})

		it('should handle errors during editor retrieval', async () => {
			// Arrange
			req.params = { email: 'test@example.com' }

			mockCacheGenerateKey.mockReturnValue('editor:email:test@example.com')
			mockCacheGet.mockResolvedValue(null)

			models.Editor.findOne.mockRejectedValue(new Error('Database error'))

			// Act
			await controllers.getEditorByEmail(req, res)

			// Assert
			expect(consoleErrorSpy).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Server error',
					error: 'Database error',
				})
			)
		})
	})
})
