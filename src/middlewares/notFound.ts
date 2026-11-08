import { RequestHandler } from 'express';

const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

export default notFoundMiddleware;
