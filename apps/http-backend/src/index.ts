import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { roomRouter } from './routes/room';
import { chatRouter } from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/room', roomRouter);
app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});