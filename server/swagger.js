/**
 * Request routes documentation
 */
const requestDocs = {
	components: {
		schemas: {
			Request: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the request',
					},
					from_id: {
						type: 'string',
						description: 'ID of the user who created the request',
					},
					to_id: {
						type: 'string',
						description: 'ID of the user who received the request',
					},
					video_id: {
						type: 'string',
						description: 'ID of the video associated with the request',
					},
					status: {
						type: 'string',
						enum: ['pending', 'approved', 'rejected'],
						description: 'Current status of the request',
					},
					description: {
						type: 'string',
						description: 'Description of the request',
					},
					price: {
						type: 'number',
						description: 'Price or budget for the request',
					},
					messages: {
						type: 'array',
						description: 'Messages related to this request',
						items: {
							$ref: '#/components/schemas/Message',
						},
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the request was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the request was last updated',
					},
				},
			},
			Message: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the message',
					},
					sender_id: {
						type: 'string',
						description: 'ID of the user who sent the message',
					},
					sender_role: {
						type: 'string',
						enum: ['Owner', 'Editor'],
						description: 'Role of the sender',
					},
					sender_name: {
						type: 'string',
						description: 'Name of the sender',
					},
					message: {
						type: 'string',
						description: 'Content of the message',
					},
					timestamp: {
						type: 'string',
						format: 'date-time',
						description: 'When the message was created',
					},
				},
			},
			ProcessedRequest: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the request',
					},
					request_id: {
						type: 'string',
						description: 'The id of the request (same as _id)',
					},
					from: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								description: 'ID of the user who created the request',
							},
							name: {
								type: 'string',
								description: 'Name of the user who created the request',
							},
						},
					},
					to: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								description: 'ID of the user who received the request',
							},
							name: {
								type: 'string',
								description: 'Name of the user who received the request',
							},
						},
					},
					video: {
						type: 'object',
						properties: {
							url: {
								type: 'string',
								description: 'URL of the video',
							},
							title: {
								type: 'string',
								description: 'Title of the video',
							},
							_id: {
								type: 'string',
								description: 'ID of the video',
							},
						},
					},
					description: {
						type: 'string',
						description: 'Description of the request',
					},
					price: {
						type: 'number',
						description: 'Price or budget for the request',
					},
					status: {
						type: 'string',
						enum: ['pending', 'approved', 'rejected'],
						description: 'Current status of the request',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the request was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the request was last updated',
					},
				},
			},
		},
	},
	paths: {
		'/requests/create': {
			post: {
				summary: 'Create a new request',
				description: 'Creates a new request from an owner to an editor or vice versa',
				tags: ['Requests'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									from_id: {
										type: 'string',
										description: 'ID of the user creating the request',
									},
									to_id: {
										type: 'string',
										description: 'ID of the user receiving the request',
									},
									video_id: {
										type: 'string',
										description: 'ID of the video associated with the request',
									},
									description: {
										type: 'string',
										description: 'Description of the request',
									},
									price: {
										type: 'number',
										description: 'Price or budget for the request',
									},
									status: {
										type: 'string',
										enum: ['pending', 'approved', 'rejected'],
										description: 'Status of the request (defaults to pending)',
									},
								},
								required: ['from_id', 'to_id', 'video_id', 'description', 'price'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Request created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Request',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/to-id/{to_id}': {
			get: {
				summary: 'Get requests by recipient ID',
				description: 'Get all requests received by a specific user',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'to_id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'ID of the user who received the requests',
					},
				],
				responses: {
					200: {
						description: 'List of requests',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/ProcessedRequest',
									},
								},
							},
						},
					},
					404: {
						description: 'Requests not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/from-id/{from_id}': {
			get: {
				summary: 'Get requests by sender ID',
				description: 'Get all requests sent by a specific user',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'from_id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'ID of the user who sent the requests',
					},
				],
				responses: {
					200: {
						description: 'List of requests',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/ProcessedRequest',
									},
								},
							},
						},
					},
					404: {
						description: 'Requests not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/{id}/status': {
			patch: {
				summary: 'Update request status',
				description: 'Update the status of a specific request',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										enum: ['pending', 'approved', 'rejected'],
										description: 'New status for the request',
									},
								},
								required: ['status'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Request updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Request',
								},
							},
						},
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/delete/{id}': {
			delete: {
				summary: 'Delete a request',
				description: 'Delete a specific request by ID',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID',
					},
				],
				responses: {
					200: {
						description: 'Request deleted successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Request deleted successfully',
										},
										deletedRequest: {
											$ref: '#/components/schemas/Request',
										},
									},
								},
							},
						},
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/aggregate/{fromId}': {
			get: {
				summary: 'Get aggregated request statistics',
				description: 'Get statistics about requests for a specific user',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'fromId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'ID of the user who created the requests',
					},
				],
				responses: {
					200: {
						description: 'Aggregated request statistics',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										totalRequests: {
											type: 'number',
											description: 'Total number of requests',
										},
										totalPendingRequests: {
											type: 'number',
											description: 'Number of pending requests',
										},
										totalApprovedRequests: {
											type: 'number',
											description: 'Number of approved requests',
										},
										totalRejectedRequests: {
											type: 'number',
											description: 'Number of rejected requests',
										},
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/to-id/{to_id}': {
			get: {
				summary: 'Get requests by recipient ID',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'to_id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'ID of request recipient',
					},
				],
				responses: {
					200: {
						description: 'List of requests sent to the specified user',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Request',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/from-id/{from_id}': {
			get: {
				summary: 'Get requests by sender ID',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'from_id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'ID of request sender',
					},
				],
				responses: {
					200: {
						description: 'List of requests sent by the specified user',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Request',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/{id}/status': {
			patch: {
				summary: 'Update request status',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									status: {
										type: 'string',
										enum: ['pending', 'approved', 'rejected'],
										description: 'New status for the request',
									},
								},
								required: ['status'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Request status updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Request',
								},
							},
						},
					},
					400: {
						description: 'Invalid status value',
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/delete/{id}': {
			delete: {
				summary: 'Delete a request',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID to delete',
					},
				],
				responses: {
					200: {
						description: 'Request deleted successfully',
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/aggregate/{fromId}': {
			get: {
				summary: 'Get aggregated request data for a user',
				description:
					'Returns statistics about total, pending, approved, and rejected requests for a specific user',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'fromId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'User ID to aggregate requests for',
					},
				],
				responses: {
					200: {
						description: 'Aggregated request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/{id}/messages': {
			get: {
				summary: 'Get messages for a specific request',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID',
					},
				],
				responses: {
					200: {
						description: 'List of request messages',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Message',
									},
								},
							},
						},
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			post: {
				summary: 'Add a message to a request',
				tags: ['Requests'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Request ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									sender_id: {
										type: 'string',
										description: 'ID of the user sending the message',
									},
									sender_role: {
										type: 'string',
										enum: ['Owner', 'Editor'],
										description: 'Role of the sender',
									},
									sender_name: {
										type: 'string',
										description: 'Name of the sender',
									},
									message: {
										type: 'string',
										description: 'Message content',
									},
								},
								required: ['sender_id', 'sender_role', 'sender_name', 'message'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Message added successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Message',
								},
							},
						},
					},
					400: {
						description: 'Invalid message data',
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/from-to': {
			post: {
				summary: 'Get requests between two users',
				description: 'Retrieves all requests exchanged between a specific sender and recipient',
				tags: ['Requests'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									from_id: {
										type: 'string',
										description: 'ID of the sender',
									},
									to_id: {
										type: 'string',
										description: 'ID of the receiver',
									},
								},
								required: ['from_id', 'to_id'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'List of requests between specified users',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Request',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/requests/change-price': {
			post: {
				summary: 'Change the price of a request',
				tags: ['Requests'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'ID of the request',
									},
									price: {
										type: 'number',
										description: 'New price',
									},
								},
								required: ['id', 'price'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Request price updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Request',
								},
							},
						},
					},
					404: {
						description: 'Request not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * Video routes documentation
 */
const videoDocs = {
	components: {
		schemas: {
			Video: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the video',
					},
					ownerId: {
						type: 'string',
						description: 'ID of the video owner',
					},
					editorId: {
						type: 'string',
						description: 'ID of the assigned editor',
					},
					url: {
						type: 'string',
						description: 'URL of the video',
					},
					editorAccess: {
						type: 'boolean',
						description: 'Whether editor has access to this video',
					},
					metaData: {
						type: 'object',
						description: 'Metadata of the video',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the video was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the video was last updated',
					},
				},
			},
		},
	},
	paths: {
		'/api/videos/all/{role}/{userId}': {
			get: {
				summary: 'Get all videos for a user based on role',
				tags: ['Videos'],
				parameters: [
					{
						in: 'path',
						name: 'role',
						required: true,
						schema: {
							type: 'string',
							enum: ['Owner', 'Editor', 'Admin'],
						},
						description: 'User role',
					},
					{
						in: 'path',
						name: 'userId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'User ID',
					},
				],
				responses: {
					200: {
						description: 'List of videos',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										videos: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Video',
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Invalid role specified',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/api/videos/recent/{role}/{userId}': {
			get: {
				summary: 'Get recent videos for a user based on role',
				tags: ['Videos'],
				parameters: [
					{
						in: 'path',
						name: 'role',
						required: true,
						schema: {
							type: 'string',
							enum: ['Owner', 'Editor', 'Admin'],
						},
						description: 'User role',
					},
					{
						in: 'path',
						name: 'userId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'User ID',
					},
				],
				responses: {
					200: {
						description: 'List of recent videos',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										videos: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Video',
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Invalid role specified',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/api/videos/storage-usages/{role}/{userId}': {
			get: {
				summary: 'Get storage usage for a user based on role',
				tags: ['Videos'],
				parameters: [
					{
						in: 'path',
						name: 'role',
						required: true,
						schema: {
							type: 'string',
							enum: ['Owner', 'Editor', 'Admin'],
						},
						description: 'User role',
					},
					{
						in: 'path',
						name: 'userId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'User ID',
					},
				],
				responses: {
					200: {
						description: 'Storage usage information',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										storageUsage: {
											type: 'number',
											description: 'Total storage used in bytes',
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Invalid role specified',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Invalid role specified',
										},
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Failed to get storage usage',
										},
										error: {
											type: 'string',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/videos/upload': {
			post: {
				summary: 'Upload a new video',
				tags: ['Videos'],
				requestBody: {
					required: true,
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									file: {
										type: 'string',
										format: 'binary',
										description: 'Video file to upload',
									},
									userId: {
										type: 'string',
										description: 'ID of the user uploading the video',
									},
									role: {
										type: 'string',
										enum: ['Owner', 'Editor'],
										description: 'Role of the user uploading',
									},
								},
								required: ['file', 'userId', 'role'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Video uploaded successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'File uploaded successfully',
										},
										url: {
											type: 'string',
											description: 'Download URL for the uploaded video',
										},
										videoData: {
											type: 'object',
											properties: {
												_id: {
													type: 'string',
												},
												ownerId: {
													type: 'string',
												},
												editorId: {
													type: 'string',
												},
												url: {
													type: 'string',
												},
												metaData: {
													type: 'object',
												},
												owner: {
													type: 'string',
												},
												ownerPic: {
													type: 'string',
												},
												editor: {
													type: 'string',
												},
												editorPic: {
													type: 'string',
												},
												createdAt: {
													type: 'string',
													format: 'date-time',
												},
												updatedAt: {
													type: 'string',
													format: 'date-time',
												},
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Invalid request or missing file',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'No file uploaded',
										},
									},
								},
							},
						},
					},
					500: {
						description: 'Server error during upload',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Failed to upload file',
										},
										error: {
											type: 'string',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/videos/update-ownership': {
			patch: {
				summary: 'Update video ownership',
				tags: ['Videos'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									videoId: {
										type: 'string',
										description: 'ID of the video to update',
									},
									userId: {
										type: 'string',
										description: 'ID of the new user to assign (owner or editor)',
									},
									role: {
										type: 'string',
										enum: ['Owner', 'Editor'],
										description: 'Role to update (whether updating owner or editor)',
									},
								},
								required: ['videoId', 'userId', 'role'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Video ownership updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Video',
								},
							},
						},
					},
					400: {
						description: 'Invalid request or missing data',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'New user ID (userId) is required',
										},
									},
								},
							},
						},
					},
					404: {
						description: 'Video not found',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Video not found',
										},
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Error updating video ownership',
										},
										error: {
											type: 'string',
										},
										stack: {
											type: 'string',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'/api/videos/delete': {
			delete: {
				summary: 'Delete a video',
				tags: ['Videos'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'ID of the video to delete',
									},
									userId: {
										type: 'string',
										description: 'ID of the user deleting the video',
									},
									role: {
										type: 'string',
										enum: ['Owner', 'Editor', 'Admin'],
										description: 'Role of the user attempting to delete',
									},
								},
								required: ['id', 'userId', 'role'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Video deleted successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Video deleted successfully',
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Missing required parameters',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Missing required parameters (id, userId, role)',
										},
									},
								},
							},
						},
					},
					404: {
						description: 'Video not found or user lacks permission',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Video not found or user lacks permission',
										},
									},
								},
							},
						},
					},
					500: {
						description: 'Server error during deletion',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: {
											type: 'string',
											example: 'Failed to delete video',
										},
										error: {
											type: 'string',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
}

/**
 * Editor routes documentation
 */
const editorDocs = {
	components: {
		schemas: {
			Editor: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the editor',
					},
					email: {
						type: 'string',
						description: "Editor's email address",
					},
					name: {
						type: 'string',
						description: "Editor's name",
					},
					profilephoto: {
						type: 'string',
						description: "URL to editor's profile photo",
					},
					bio: {
						type: 'string',
						description: "Editor's biography",
					},
					experience: {
						type: 'number',
						description: 'Years of experience',
					},
					area_of_expertise: {
						type: 'array',
						items: {
							type: 'string',
						},
						description: 'List of areas of expertise',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the editor account was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the editor account was last updated',
					},
				},
			},
			EditorGig: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the editor gig',
					},
					editorId: {
						type: 'string',
						description: 'ID of the editor',
					},
					services: {
						type: 'array',
						items: {
							type: 'string',
						},
						description: 'List of services offered',
					},
					description: {
						type: 'string',
						description: 'Description of the gig',
					},
					ratings: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								userId: {
									type: 'string',
								},
								rating: {
									type: 'number',
								},
								comment: {
									type: 'string',
								},
							},
						},
						description: 'Ratings and reviews',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the gig was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the gig was last updated',
					},
				},
			},
			EditorPlan: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the plan',
					},
					editorId: {
						type: 'string',
						description: 'ID of the editor',
					},
					title: {
						type: 'string',
						description: 'Title of the plan',
					},
					description: {
						type: 'string',
						description: 'Description of the plan',
					},
					price: {
						type: 'number',
						description: 'Price of the plan',
					},
					deliveryTime: {
						type: 'number',
						description: 'Delivery time in days',
					},
					features: {
						type: 'array',
						items: {
							type: 'string',
						},
						description: 'Features included in the plan',
					},
				},
			},
		},
	},
	paths: {
		'/editorProfile': {
			post: {
				summary: 'Create a new editor profile',
				tags: ['Editors'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										description: "Editor's email address",
									},
									name: {
										type: 'string',
										description: "Editor's name",
									},
									bio: {
										type: 'string',
										description: "Editor's biography",
									},
									profilephoto: {
										type: 'string',
										description: "URL to editor's profile photo",
									},
									experience: {
										type: 'number',
										description: 'Years of experience',
									},
									area_of_expertise: {
										type: 'array',
										items: {
											type: 'string',
										},
										description: 'List of areas of expertise',
									},
								},
								required: ['email', 'name'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Editor profile created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Editor',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			get: {
				summary: 'Get all editor profiles',
				tags: ['Editors'],
				responses: {
					200: {
						description: 'List of all editor profiles',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Editor',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorProfile/name/{editorId}': {
			get: {
				summary: "Get editor's name by ID",
				tags: ['Editors'],
				parameters: [
					{
						in: 'path',
						name: 'editorId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Editor ID',
					},
				],
				responses: {
					200: {
						description: "Editor's name",
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										name: {
											type: 'string',
										},
									},
								},
							},
						},
					},
					404: {
						description: 'Editor not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorProfile/{email}': {
			get: {
				summary: 'Get editor by email',
				tags: ['Editors'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				responses: {
					200: {
						description: 'Editor details',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Editor',
								},
							},
						},
					},
					404: {
						description: 'Editor not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			put: {
				summary: 'Update editor profile',
				tags: ['Editors'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										description: 'Updated name',
									},
									bio: {
										type: 'string',
										description: 'Updated biography',
									},
									profilephoto: {
										type: 'string',
										description: 'Updated profile photo URL',
									},
									experience: {
										type: 'number',
										description: 'Updated years of experience',
									},
									area_of_expertise: {
										type: 'array',
										items: {
											type: 'string',
										},
										description: 'Updated areas of expertise',
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Editor profile updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Editor',
								},
							},
						},
					},
					404: {
						description: 'Editor not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			delete: {
				summary: 'Delete editor profile',
				tags: ['Editors'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				responses: {
					200: {
						description: 'Editor profile deleted successfully',
					},
					404: {
						description: 'Editor not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorProfile/hiredby/{editorId}': {
			get: {
				summary: 'Get owners who hired this editor',
				tags: ['Editors'],
				parameters: [
					{
						in: 'path',
						name: 'editorId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Editor ID',
					},
				],
				responses: {
					200: {
						description: 'List of owners who hired this editor',
					},
					404: {
						description: 'Editor not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorGig': {
			post: {
				summary: 'Create a new editor gig',
				tags: ['Editor Gigs'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									editorId: {
										type: 'string',
										description: 'Editor ID',
									},
									services: {
										type: 'array',
										items: {
											type: 'string',
										},
										description: 'Services offered',
									},
									description: {
										type: 'string',
										description: 'Gig description',
									},
								},
								required: ['editorId'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Editor gig created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/EditorGig',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			get: {
				summary: 'Get all editor gigs',
				tags: ['Editor Gigs'],
				responses: {
					200: {
						description: 'List of all editor gigs',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/EditorGig',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorGig/plans': {
			get: {
				summary: 'Get all editor gig plans',
				tags: ['Editor Gigs'],
				responses: {
					200: {
						description: 'List of all editor gig plans',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/EditorPlan',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorGig/plan': {
			post: {
				summary: 'Create editor gig plans',
				tags: ['Editor Gigs'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									editorId: {
										type: 'string',
										description: 'Editor ID',
									},
									plans: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												title: {
													type: 'string',
													description: 'Plan title',
												},
												description: {
													type: 'string',
													description: 'Plan description',
												},
												price: {
													type: 'number',
													description: 'Plan price',
												},
												deliveryTime: {
													type: 'number',
													description: 'Delivery time in days',
												},
												features: {
													type: 'array',
													items: {
														type: 'string',
													},
													description: 'Features included in the plan',
												},
											},
										},
										description: 'Array of plans',
									},
								},
								required: ['editorId', 'plans'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Editor gig plans created successfully',
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorGig/email/{email}': {
			get: {
				summary: 'Get editor gig by email',
				tags: ['Editor Gigs'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				responses: {
					200: {
						description: 'Editor gig details',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/EditorGig',
								},
							},
						},
					},
					404: {
						description: 'Editor gig not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			patch: {
				summary: 'Update editor gig by email',
				tags: ['Editor Gigs'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									services: {
										type: 'array',
										items: {
											type: 'string',
										},
										description: 'Updated services',
									},
									description: {
										type: 'string',
										description: 'Updated description',
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Editor gig updated successfully',
					},
					404: {
						description: 'Editor gig not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/editorGig/plans/email/{email}': {
			get: {
				summary: 'Get editor gig plans by email',
				tags: ['Editor Gigs'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				responses: {
					200: {
						description: 'Editor gig plans',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/EditorPlan',
									},
								},
							},
						},
					},
					404: {
						description: 'Editor gig plans not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			patch: {
				summary: 'Update editor gig plans by email',
				tags: ['Editor Gigs'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Editor's email address",
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									plans: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												title: {
													type: 'string',
													description: 'Plan title',
												},
												description: {
													type: 'string',
													description: 'Plan description',
												},
												price: {
													type: 'number',
													description: 'Plan price',
												},
												deliveryTime: {
													type: 'number',
													description: 'Delivery time in days',
												},
												features: {
													type: 'array',
													items: {
														type: 'string',
													},
													description: 'Features included in the plan',
												},
											},
										},
										description: 'Updated plans',
									},
								},
								required: ['plans'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Editor gig plans updated successfully',
					},
					404: {
						description: 'Editor gig plans not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * Admin routes documentation
 */
const adminDocs = {
	components: {
		schemas: {
			Owner: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the owner',
					},
					email: {
						type: 'string',
						description: "Owner's email address",
					},
					name: {
						type: 'string',
						description: "Owner's name",
					},
					profilephoto: {
						type: 'string',
						description: "URL to owner's profile photo",
					},
					bio: {
						type: 'string',
						description: "Owner's biography",
					},
				},
			},
		},
	},
	paths: {
		'/admin/owners': {
			get: {
				summary: 'Get all owners (admin access)',
				tags: ['Admin'],
				responses: {
					200: {
						description: 'List of all owners',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Owner',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/admin/editors': {
			get: {
				summary: 'Get all editors (admin access)',
				tags: ['Admin'],
				responses: {
					200: {
						description: 'List of all editors',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Editor',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/admin/requests': {
			get: {
				summary: 'Get all requests (admin access)',
				tags: ['Admin'],
				responses: {
					200: {
						description: 'List of all requests',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Request',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/admin/videos': {
			get: {
				summary: 'Get all videos (admin access)',
				tags: ['Admin'],
				responses: {
					200: {
						description: 'List of all videos',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Video',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * User routes documentation
 */
const userDocs = {
	components: {
		schemas: {
			User: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the user',
					},
					email: {
						type: 'string',
						description: "User's email address",
					},
					name: {
						type: 'string',
						description: "User's name",
					},
					role: {
						type: 'string',
						enum: ['Owner', 'Editor', 'Admin'],
						description: "User's role in the system",
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the user was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the user was last updated',
					},
				},
			},
		},
	},
	paths: {
		'/user': {
			post: {
				summary: 'Create a new user',
				tags: ['Users'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										description: "User's email address",
									},
									name: {
										type: 'string',
										description: "User's name",
									},
									role: {
										type: 'string',
										enum: ['Owner', 'Editor', 'Admin'],
										description: "User's role",
									},
								},
								required: ['email', 'name', 'role'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'User created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/User',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * Auth0 routes documentation
 */
const auth0Docs = {
	paths: {
		'/auth0/create': {
			post: {
				summary: 'Create a new Auth0 user in the system',
				tags: ['Auth0'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										description: "User's email address",
									},
									name: {
										type: 'string',
										description: "User's name",
									},
									role: {
										type: 'string',
										enum: ['Owner', 'Editor', 'Admin'],
										description: "User's role",
									},
								},
								required: ['email', 'name', 'role'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Auth0 user created successfully',
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * Wallet routes documentation
 */
const walletDocs = {
	components: {
		schemas: {
			Wallet: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the wallet',
					},
					userId: {
						type: 'string',
						description: 'ID of the user who owns this wallet',
					},
					type: {
						type: 'string',
						enum: ['owner', 'editor', 'admin'],
						description: 'Type of wallet',
					},
					balance: {
						type: 'number',
						description: 'Current balance in the wallet',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the wallet was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the wallet was last updated',
					},
				},
			},
		},
	},
	paths: {
		'/wallet': {
			get: {
				summary: 'Get all wallets (admin access)',
				tags: ['Wallets'],
				responses: {
					200: {
						description: 'List of all wallets',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Wallet',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
			post: {
				summary: 'Create a new wallet',
				tags: ['Wallets'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									userId: {
										type: 'string',
										description: 'ID of the user',
									},
									type: {
										type: 'string',
										enum: ['owner', 'editor', 'admin'],
										description: 'Type of wallet',
									},
									balance: {
										type: 'number',
										description: 'Initial balance',
									},
								},
								required: ['userId', 'type'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Wallet created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Wallet',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/wallet/{id}': {
			get: {
				summary: 'Get wallet by ID',
				tags: ['Wallets'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Wallet ID',
					},
				],
				responses: {
					200: {
						description: 'Wallet details',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Wallet',
								},
							},
						},
					},
					404: {
						description: 'Wallet not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/wallet/{id}/balance': {
			patch: {
				summary: 'Update wallet balance',
				tags: ['Wallets'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Wallet ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									amount: {
										type: 'number',
										description: 'Amount to add or subtract from balance',
									},
								},
								required: ['amount'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Wallet balance updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Wallet',
								},
							},
						},
					},
					404: {
						description: 'Wallet not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/wallet/{id}/deposit': {
			post: {
				summary: 'Add money to wallet',
				tags: ['Wallets'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Wallet ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									amount: {
										type: 'number',
										description: 'Amount to deposit',
									},
								},
								required: ['amount'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Money added to wallet successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Wallet',
								},
							},
						},
					},
					404: {
						description: 'Wallet not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/wallet/transfer': {
			post: {
				summary: 'Transfer money between wallets',
				tags: ['Wallets'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									fromWalletId: {
										type: 'string',
										description: 'Source wallet ID',
									},
									toWalletId: {
										type: 'string',
										description: 'Destination wallet ID',
									},
									amount: {
										type: 'number',
										description: 'Amount to transfer',
									},
								},
								required: ['fromWalletId', 'toWalletId', 'amount'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Money transferred successfully',
					},
					400: {
						description: 'Invalid transfer data or insufficient funds',
					},
					404: {
						description: 'Wallet not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/wallet/type/{type}': {
			get: {
				summary: 'Get wallets by type',
				tags: ['Wallets'],
				parameters: [
					{
						in: 'path',
						name: 'type',
						required: true,
						schema: {
							type: 'string',
							enum: ['owner', 'editor', 'admin'],
						},
						description: 'Wallet type',
					},
				],
				responses: {
					200: {
						description: 'List of wallets by type',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Wallet',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * YouTube routes documentation
 */
const ytDocs = {
	paths: {
		'/yt/upload/{role}/{userId}/{id}': {
			post: {
				summary: 'Upload a video to YouTube',
				tags: ['YouTube'],
				parameters: [
					{
						in: 'path',
						name: 'role',
						required: true,
						schema: {
							type: 'string',
							enum: ['Owner', 'Editor'],
						},
						description: 'User role',
					},
					{
						in: 'path',
						name: 'userId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'User ID',
					},
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Video ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									title: {
										type: 'string',
										description: 'Video title',
									},
									description: {
										type: 'string',
										description: 'Video description',
									},
									tags: {
										type: 'array',
										items: {
											type: 'string',
										},
										description: 'Video tags',
									},
								},
								required: ['title'],
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Video uploaded to YouTube successfully',
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/yt/req-admin/{videoId}': {
			post: {
				summary: 'Request admin for YouTube upload',
				tags: ['YouTube'],
				parameters: [
					{
						in: 'path',
						name: 'videoId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Video ID',
					},
				],
				responses: {
					200: {
						description: 'Admin request for YouTube upload sent successfully',
					},
					404: {
						description: 'Video not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

/**
 * Owner routes documentation
 */
const ownerDocs = {
	components: {
		schemas: {
			OwnerProfile: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'The auto-generated id of the owner profile',
					},
					ownerId: {
						type: 'string',
						description: 'ID of the owner',
					},
					name: {
						type: 'string',
						description: "Owner's name",
					},
					bio: {
						type: 'string',
						description: "Owner's biography",
					},
					profilePhoto: {
						type: 'string',
						description: "URL to owner's profile photo",
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the profile was created',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'When the profile was last updated',
					},
				},
			},
		},
	},
	paths: {
		'/owner/ownerProfile': {
			get: {
				summary: 'Get all owners (admin access)',
				tags: ['Owners'],
				responses: {
					200: {
						description: 'List of all owners',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Owner',
									},
								},
							},
						},
					},
					500: {
						description: 'Server error',
					},
				},
			},
			post: {
				summary: 'Create a new owner',
				tags: ['Owners'],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										description: "Owner's email address",
									},
									name: {
										type: 'string',
										description: "Owner's name",
									},
									bio: {
										type: 'string',
										description: "Owner's biography",
									},
									profilephoto: {
										type: 'string',
										description: "URL to owner's profile photo",
									},
								},
								required: ['email', 'name'],
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Owner created successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Owner',
								},
							},
						},
					},
					400: {
						description: 'Invalid request data',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/owner/ownerProfile/{email}': {
			get: {
				summary: 'Get owner by email',
				tags: ['Owners'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Owner's email address",
					},
				],
				responses: {
					200: {
						description: 'Owner details',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Owner',
								},
							},
						},
					},
					404: {
						description: 'Owner not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			patch: {
				summary: 'Update owner information',
				tags: ['Owners'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Owner's email address",
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										description: 'Updated name',
									},
									bio: {
										type: 'string',
										description: 'Updated biography',
									},
									profilephoto: {
										type: 'string',
										description: 'Updated profile photo URL',
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: 'Owner information updated successfully',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Owner',
								},
							},
						},
					},
					404: {
						description: 'Owner not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
			delete: {
				summary: 'Delete an owner',
				tags: ['Owners'],
				parameters: [
					{
						in: 'path',
						name: 'email',
						required: true,
						schema: {
							type: 'string',
						},
						description: "Owner's email address",
					},
				],
				responses: {
					200: {
						description: 'Owner deleted successfully',
					},
					404: {
						description: 'Owner not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/owner/name/{ownerId}': {
			get: {
				summary: 'Get owner name by ID',
				tags: ['Owners'],
				parameters: [
					{
						in: 'path',
						name: 'ownerId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Owner ID',
					},
				],
				responses: {
					200: {
						description: "Owner's name",
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										name: {
											type: 'string',
										},
									},
								},
							},
						},
					},
					404: {
						description: 'Owner not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
		'/owner/hired/{ownerId}': {
			get: {
				summary: 'Get hired editors',
				tags: ['Owners'],
				parameters: [
					{
						in: 'path',
						name: 'ownerId',
						required: true,
						schema: {
							type: 'string',
						},
						description: 'Owner ID',
					},
				],
				responses: {
					200: {
						description: 'List of hired editors',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Editor',
									},
								},
							},
						},
					},
					404: {
						description: 'Owner not found',
					},
					500: {
						description: 'Server error',
					},
				},
			},
		},
	},
}

// Export the documentation objects for use in the server setup
export { adminDocs, auth0Docs, editorDocs, ownerDocs, requestDocs, userDocs, videoDocs, walletDocs, ytDocs }
