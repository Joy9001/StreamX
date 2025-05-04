import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'StreamX API Documentation',
			version: '1.0.0',
			description: 'API documentation for StreamX application',
			contact: {
				name: 'StreamX Team',
			},
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ['./routes/*.js', './controllers/*.js'],
}

const specs = swaggerJsDoc(options)

export { specs, swaggerUi }
