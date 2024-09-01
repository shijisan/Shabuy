// Import the PrismaClient from @prisma/client
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// Export the Prisma client instance for use in other parts of the application
export default prisma;
