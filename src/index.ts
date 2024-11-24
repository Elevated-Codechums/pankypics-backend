import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import authRouter from './routers/authRouters.js';
import uploadRouter from './routers/uploadRouters.js';
import albumsRouter from './routers/albumRouters.js';
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 4000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const app: Application = express();

app.use(
    cors({
        origin: `http://${SERVER_HOSTNAME}:${CLIENT_PORT}`,
        credentials: true
    })
);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('API is running...');
});

app.use(express.json());
app.use(cookieparser());

app.use(uploadRouter);

app.use(albumsRouter);
app.use('/api/auth', authRouter);

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port http://${SERVER_HOSTNAME}:${SERVER_PORT}`);
});
