import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  const { email, password, role } = await request.json();

  if (!email || !password || !role) {
    return new Response(JSON.stringify({ error: 'Email, password, and role are required' }), { status: 400 });
  }

  try {
    // Fetch user with roles
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true }, // Include user roles in the query
    });

    if (!user) {
      console.error('User not found');
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error('Invalid password');
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Check if the user has the required role
    const hasRole = user.roles.some(userRole => userRole.role === role);
    if (!hasRole) {
      console.error('User does not have the required role');
      return new Response(JSON.stringify({ error: 'Invalid role for this user' }), { status: 403 });
    }

    // Generate the JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
