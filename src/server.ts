import app from './app';
import { validateEnv } from './config/env';
import { connectToDatabase } from './db';

async function main() {
  try {
    const { MONGODB_URI, PORT } = validateEnv();
    await connectToDatabase(MONGODB_URI);
    app.listen(PORT);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

main();
