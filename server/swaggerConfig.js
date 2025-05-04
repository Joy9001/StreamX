import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {
	requestDocs,
	videoDocs,
	editorDocs,
	adminDocs,
	userDocs,
	auth0Docs,
	walletDocs,
	ytDocs,
	ownerDocs,
} from './swagger.js'

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
				url: 'http://localhost:3000',
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				...requestDocs.components.schemas,
				...videoDocs.components.schemas,
				...editorDocs.components.schemas,
				...adminDocs.components.schemas,
				...userDocs.components.schemas,
				...(walletDocs.components?.schemas || {}),
				...(ownerDocs.components?.schemas || {}),
			},
		},
		paths: {
			...requestDocs.paths,
			...videoDocs.paths,
			...editorDocs.paths,
			...adminDocs.paths,
			...userDocs.paths,
			...auth0Docs.paths,
			...walletDocs.paths,
			...ytDocs.paths,
			...ownerDocs.paths,
		},
	},
	apis: [], // We're using the imported documentation objects instead of scanning files
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
