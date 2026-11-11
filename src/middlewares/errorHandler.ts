import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: 'Validation error' });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Invalid ID' });
    return;
  }

  if (err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ message: 'Invalid request' });
    return;
  }

  if (err.code === 11000) {
    res.status(409).json({ message: 'Already checked in' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
