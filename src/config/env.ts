export function validateEnv() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const PORT = process.env.PORT;
  const port = Number(PORT);

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid integer between 1 and 65535');
  }

  return {
    MONGODB_URI,
    PORT: port
  };
}
