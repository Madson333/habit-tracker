import express from 'express';
import mongoose from 'mongoose';
import notFoundMiddleware from './middlewares/notFound';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
    res.status(503).json({ message: 'Database connection failed' });
    return;
  }

  res.status(200).json({ message: 'Server is healthy' });
});

app.use(notFoundMiddleware);
app.use(errorHandler);
export default app;
