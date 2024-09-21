import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET; // Ensure this is set in your environment variables

export async function POST(request) {
  const { email, password, name, role } = await request.json();

  // Validate input
  if (!email || !password || !name || !role) {
    return new Response(JSON.stringify({ error: 'Name, email, password, and role are required' }), { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: [{ role: role }] // Create a role for the new user
        }
      },
      include: {
        roles: true, // Include roles in the user data
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, roles: newUser.roles.map(role => role.role) }, // Payload includes roles
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Return the token
    return new Response(JSON.stringify({ token }), { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
  }
}
