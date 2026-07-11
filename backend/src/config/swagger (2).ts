import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Timetable Generator API',
      version: '1.0.0',
      description: `
### Welcome to the AI Timetable Generator Backend API Documentation!

This system provides a full-featured REST API for automated college scheduling.
Administrators can log in to manage master tables (Faculty, Subjects, Departments, Classrooms) 
and execute optimized timetable generations powered by an AI-module.

#### **Key Features:**
* **Role-Based Authentication (RBAC)** using JWT (Admin role enforced for writes).
* **Complete CRUD Operations** for college schedule entities.
* **Auto-Generating Scheduler Trigger** that interfaces with a solver backend.

#### **Authorization instructions:**
1. Call \`POST /api/v1/auth/signup\` or \`POST /api/v1/auth/login\` to get a JWT token.
2. Click the **Authorize** button on the top right.
3. Paste the token as: \`Bearer <your_token>\` and apply!
`,
      contact: {
        name: 'AI Timetable Dev Support',
        email: 'raminisaisanthosh@gmail.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'V1 API Prefix',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI annotations
  apis: [
    './backend/src/routes/*.ts',
    './backend/src/routes/*.js',
    './backend/src/routes/**/*.ts',
    './backend/src/models/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * Registers the Swagger UI middleware on the Express app.
 */
export function setupSwagger(app: Express): void {
  // Serve Swagger UI assets
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Also redirect the root endpoint '/' to '/docs' so that the iframe displays the live Swagger interactive terminal!
  app.get('/', (_req, res) => {
    res.redirect('/docs');
  });

  console.log('📖 Swagger Interactive API Documentation is registered at /docs (and root /)');
}
