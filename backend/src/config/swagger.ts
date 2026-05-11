import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DGIAESG Platform API',
            version: '1.0.0',
            description: 'API documentation for the DGIAESG platform',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
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
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API docs
};

/**
 * Sur Vercel, le filesystem du bundle ne contient pas ces chemins ; `swaggerJsdoc`
 * au chargement faisait planter la fonction serverless (500 FUNCTION_INVOCATION_FAILED).
 */
export const setupSwagger = (app: Express) => {
    if (process.env.VERCEL || process.env.VERCEL_ENV) {
        return;
    }
    try {
        const swaggerSpec = swaggerJsdoc(options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    } catch (err) {
        console.error('[swagger] setup failed:', err);
    }
};
