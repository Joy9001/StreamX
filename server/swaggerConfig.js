import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { adminDocs, auth0Docs, editorDocs, ownerDocs, requestDocs, videoDocs, walletDocs, ytDocs } from './swagger.js'

dotenv.config()

// Define the Swagger configuration
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'StreamX API',
			version: '1.0.0',
			description: 'API documentation for StreamX application',
			contact: {
				name: 'StreamX Support',
				url: 'https://streamx.com/support',
				email: 'support@streamx.com',
			},
		},
		servers: [
			{
				url: process.env.SERVER_URL || 'http://localhost:3000',
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				...requestDocs.components.schemas,
				...videoDocs.components.schemas,
				...editorDocs.components.schemas,
				...adminDocs.components.schemas,
				...(walletDocs.components?.schemas || {}),
				...(ownerDocs.components?.schemas || {}),
			},
		},
		paths: {
			...requestDocs.paths,
			...videoDocs.paths,
			...editorDocs.paths,
			...adminDocs.paths,
			...auth0Docs.paths,
			...walletDocs.paths,
			...ytDocs.paths,
			...ownerDocs.paths,
		},
	},
	apis: [],
}

// Generate the Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Setup Swagger middleware
const swaggerUiOptions = {
	explorer: true,
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: 'StreamX API Documentation',
}

export { swaggerSpec, swaggerUi, swaggerUiOptions }
