import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ message: 'Invalid request' });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
