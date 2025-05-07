import { jest } from '@jest/globals';

// Use variables to store the mock implementations that will be exposed by the mocked modules
const mockCacheService = {
	generateKey: jest.fn(),
	get: jest.fn(),
	set: jest.fn(),
	TTL: { LIST: 3600 }
};

const mockAdmin = {
	find: jest.fn().mockImplementation(() => ({
		select: jest.fn().mockReturnThis(),
		lean: jest.fn().mockResolvedValue([])
	}))
};

const mockEditor = {
	find: jest.fn()
};

const mockOwner = {
	find: jest.fn()
};

const mockRequest = {
	find: jest.fn()
};

const mockVideo = {
	find: jest.fn()
};

// Mock the modules before importing the functions that use them
jest.unstable_mockModule('../../../services/cache.service.js', () => ({
	default: mockCacheService
}));

jest.unstable_mockModule('../../../models/admin.model.js', () => ({
	default: mockAdmin
}));

jest.unstable_mockModule('../../../models/editor.model.js', () => ({
	default: mockEditor
}));

jest.unstable_mockModule('../../../models/owner.model.js', () => ({
	default: mockOwner
}));

jest.unstable_mockModule('../../../models/request.model.js', () => ({
	default: mockRequest
}));

jest.unstable_mockModule('../../../models/video.model.js', () => ({
	default: mockVideo
}));

// Import the controller functions after mocking
const { getAllOwners, getAllEditors, getAllRequests, getAllVideos } = await import('../../../controllers/admin.controller.js');

describe('Admin Controller', () => {
	let mockReq;
	let mockRes;
	let originalConsoleError;

	// Save the original console.error and replace it with a mock before all tests
	beforeAll(() => {
		originalConsoleError = console.error;
		console.error = jest.fn();
	});

	// Restore the original console.error after all tests
	afterAll(() => {
		console.error = originalConsoleError;
	});

	beforeEach(() => {
		mockReq = {};
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		jest.clearAllMocks();
	});

	describe('getAllOwners', () => {
		const mockCacheKey = 'owner:all';
		const mockOwners = [
			{ _id: '1', username: 'owner1', email: 'owner1@example.com', profilephoto: 'photo1.jpg', ytChannelname: 'channel1' },
			{ _id: '2', username: 'owner2', email: 'owner2@example.com', profilephoto: 'photo2.jpg', ytChannelname: 'channel2' },
		];

		beforeEach(() => {
			mockCacheService.generateKey.mockReturnValue(mockCacheKey);
		});

		it('should return owners from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockOwners);

			await getAllOwners(mockReq, mockRes);

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('owner', { key: 'all' });
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockOwner.find).not.toHaveBeenCalled();
			expect(mockCacheService.set).not.toHaveBeenCalled();
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Owners retrieved successfully from cache',
				owners: mockOwners,
			});
		});

		it('should fetch owners from database if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null);
			mockOwner.find.mockResolvedValue(mockOwners);

			await getAllOwners(mockReq, mockRes);

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockOwner.find).toHaveBeenCalledWith({}, 'username email profilephoto ytChannelname');
			expect(mockCacheService.set).toHaveBeenCalledWith(mockCacheKey, mockOwners, mockCacheService.TTL.LIST);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Owners retrieved successfully',
				owners: mockOwners,
			});
		});

		it('should handle errors and return 500 status', async () => {
			const error = new Error('Database error');
			mockCacheService.get.mockRejectedValue(error);

			await getAllOwners(mockReq, mockRes);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: 'Failed to retrieve owners',
				error: 'Database error',
			});
		});
	});

	describe('getAllEditors', () => {
		const mockCacheKey = 'editor:all';
		const mockEditors = [
			{ _id: '1', name: 'editor1', email: 'editor1@example.com', profilephoto: 'photo1.jpg' },
			{ _id: '2', name: 'editor2', email: 'editor2@example.com', profilephoto: 'photo2.jpg' },
		];

		beforeEach(() => {
			mockCacheService.generateKey.mockReturnValue(mockCacheKey);
		});

		it('should return editors from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockEditors);

			await getAllEditors(mockReq, mockRes);

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('editor', { key: 'all' });
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockEditor.find).not.toHaveBeenCalled();
			expect(mockCacheService.set).not.toHaveBeenCalled();
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Editors retrieved successfully from cache',
				editors: mockEditors,
			});
		});

		it('should fetch editors from database if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null);
			mockEditor.find.mockResolvedValue(mockEditors);

			await getAllEditors(mockReq, mockRes);

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockEditor.find).toHaveBeenCalledWith({}, 'name email profilephoto');
			expect(mockCacheService.set).toHaveBeenCalledWith(mockCacheKey, mockEditors, mockCacheService.TTL.LIST);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Editors retrieved successfully',
				editors: mockEditors,
			});
		});

		it('should handle errors and return 500 status', async () => {
			const error = new Error('Database error');
			mockCacheService.get.mockRejectedValue(error);

			await getAllEditors(mockReq, mockRes);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: 'Failed to retrieve editors',
				error: 'Database error',
			});
		});
	});

	describe('getAllRequests', () => {
		const mockCacheKey = 'request:all';
		const mockRequests = [
			{
				_id: 'req1',
				from_id: 'owner1',
				to_id: 'editor1',
				video_id: { _id: 'vid1', url: 'http://example.com/video1', metaData: { name: 'Video 1' } },
				description: 'Request description 1',
				price: 100,
				status: 'pending',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				_id: 'req2',
				from_id: 'owner2',
				to_id: 'admin1',
				video_id: { _id: 'vid2', url: 'http://example.com/video2', metaData: { name: 'Video 2' } },
				description: 'Request description 2',
				price: 200,
				status: 'accepted',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const mockOwners = [
			{ _id: 'owner1', username: 'Owner 1' },
			{ _id: 'owner2', username: 'Owner 2' },
		];

		const mockEditors = [
			{ _id: 'editor1', name: 'Editor 1' },
		];

		const mockAdmins = [
			{ _id: 'admin1', username: 'Admin 1' },
		];

		const mockProcessedRequests = [
			{
				_id: 'req1',
				request_id: 'req1',
				from: { id: 'owner1', name: 'Owner 1', role: 'Owner' },
				to: { id: 'editor1', name: 'Editor 1', role: 'Editor' },
				video: { url: 'http://example.com/video1', title: 'Video 1', _id: 'vid1' },
				description: 'Request description 1',
				price: 100,
				status: 'pending',
				createdAt: mockRequests[0].createdAt,
				updatedAt: mockRequests[0].updatedAt,
			},
			{
				_id: 'req2',
				request_id: 'req2',
				from: { id: 'owner2', name: 'Owner 2', role: 'Owner' },
				to: { id: 'admin1', name: 'Admin 1', role: 'Admin' },
				video: { url: 'http://example.com/video2', title: 'Video 2', _id: 'vid2' },
				description: 'Request description 2',
				price: 200,
				status: 'accepted',
				createdAt: mockRequests[1].createdAt,
				updatedAt: mockRequests[1].updatedAt,
			},
		];

		beforeEach(() => {
			mockCacheService.generateKey.mockReturnValue(mockCacheKey);

			const mockPopulate = jest.fn().mockReturnThis();
			const mockLean = jest.fn().mockResolvedValue(mockRequests);
			mockRequest.find.mockReturnValue({
				populate: mockPopulate,
				lean: mockLean
			});

			mockOwner.find.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockOwners)
			});

			mockEditor.find.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockEditors)
			});

			mockAdmin.find.mockReturnValue({
				select: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue(mockAdmins)
			});
		});

		it('should return requests from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(mockProcessedRequests);

			await getAllRequests(mockReq, mockRes);

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('request', { key: 'all' });
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockRequest.find).not.toHaveBeenCalled();
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Requests retrieved successfully from cache',
				requests: mockProcessedRequests,
			});
		});

		it('should return empty array if no requests found', async () => {
			mockCacheService.get.mockResolvedValue(null);

			// Override the default mockRequest.find for this test
			const emptyMockPopulate = jest.fn().mockReturnThis();
			const emptyMockLean = jest.fn().mockResolvedValue([]);
			mockRequest.find.mockReturnValue({
				populate: emptyMockPopulate,
				lean: emptyMockLean
			});

			await getAllRequests(mockReq, mockRes);

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockRequest.find).toHaveBeenCalled();
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({ success: true, requests: [] });
		});

		it('should handle errors and return 500 status', async () => {
			const error = new Error('Database error');
			mockCacheService.get.mockRejectedValue(error);

			await getAllRequests(mockReq, mockRes);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: 'Error fetching requests',
				error: 'Database error',
			});
		});
	});

	describe('getAllVideos', () => {
		const mockCacheKey = 'video:all';
		const mockVideos = [
			{
				_id: 'video1',
				url: 'http://example.com/video1',
				ownerId: { _id: 'owner1', username: 'owner1', email: 'owner1@example.com', profilephoto: 'photo1.jpg' },
				editorId: { _id: 'editor1', name: 'editor1', email: 'editor1@example.com', profilephoto: 'photo1.jpg' },
				metaData: { name: 'Video 1', size: 10485760, contentType: 'video/mp4' },
				createdAt: new Date(),
			},
			{
				_id: 'video2',
				url: 'http://example.com/video2',
				ownerId: { _id: 'owner2', username: 'owner2', email: 'owner2@example.com', profilephoto: 'photo2.jpg' },
				editorId: null,
				metaData: { name: 'Video 2', size: 5242880, contentType: 'video/mp4' },
				createdAt: new Date(),
			},
		];

		const formattedVideos = mockVideos.map(video => ({
			...video,
			owner: video.ownerId ? {
				id: video.ownerId._id,
				name: video.ownerId.username,
				email: video.ownerId.email,
				profilephoto: video.ownerId.profilephoto,
			} : { name: 'N/A' },
			editor: video.editorId ? {
				id: video.editorId._id,
				name: video.editorId.name,
				email: video.editorId.email,
				profilephoto: video.editorId.profilephoto,
			} : { name: 'N/A' },
			metadata: {
				fileName: video.metaData?.name || 'Untitled',
				fileSize: video.metaData?.size ? `${(video.metaData.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
				contentType: video.metaData?.contentType || 'video/mp4',
			},
		}));

		beforeEach(() => {
			mockCacheService.generateKey.mockReturnValue(mockCacheKey);

			// Create a chain of mock functions for Video.find()
			const mockPopulate = jest.fn().mockReturnThis();
			const mockSort = jest.fn().mockReturnThis();
			const mockLean = jest.fn().mockResolvedValue(mockVideos);

			mockVideo.find.mockReturnValue({
				populate: mockPopulate,
				sort: mockSort,
				lean: mockLean
			});
		});

		it('should return videos from cache if available', async () => {
			mockCacheService.get.mockResolvedValue(formattedVideos);

			await getAllVideos(mockReq, mockRes);

			expect(mockCacheService.generateKey).toHaveBeenCalledWith('video', { key: 'all' });
			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockVideo.find).not.toHaveBeenCalled();
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith(formattedVideos);
		});

		it('should fetch videos from database if not in cache', async () => {
			mockCacheService.get.mockResolvedValue(null);

			await getAllVideos(mockReq, mockRes);

			expect(mockCacheService.get).toHaveBeenCalledWith(mockCacheKey);
			expect(mockVideo.find).toHaveBeenCalled();
			expect(mockCacheService.set).toHaveBeenCalledWith(mockCacheKey, formattedVideos, mockCacheService.TTL.LIST);
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith(formattedVideos);
		});

		it('should handle errors and return 500 status', async () => {
			const error = new Error('Database error');
			mockCacheService.get.mockRejectedValue(error);

			await getAllVideos(mockReq, mockRes);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalledWith({
				message: 'Error fetching videos',
				error: 'Database error',
			});
		});
	});
});
