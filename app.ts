import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// ROUTES
import { recordRoutes } from './modules/records.routes';
import { userRouter } from './modules/users.routes';

// Create express instance
const app = express();
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
app.use(cors());
app.use(express.json());


// Swagger configuration
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation',
            version: '1.0.0',
            description: 'A sample API documentation using Swagger',
            servers: [
                {
                    url: "http://localhost:3000",
                },
            ],
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
    },
    apis: [
        './modules/records.routes.ts',
        './modules/users.routes.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware to check bearer token authorization
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey!, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        // req.user = user;
        console.log(user);
        next();
    });
};

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/user', userRouter);
app.use('/api/records', verifyToken, recordRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on Port: ${port}...`);
});

