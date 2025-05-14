import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const userRouter = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

/**
* @swagger
* /api/user/login:
*   post:
*     summary: login
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The created book.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Records'
*       500:
*         description: Some server error
*
*/
userRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Replace with actual user authentication logic
    if (username === 'user' && password === 'password') {
        // User is authenticated, generate a JWT token
        const token = jwt.sign({ username }, secretKey!, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

export { userRouter }