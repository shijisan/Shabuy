import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET; // Make sure this is set in your environment variables

export async function POST(request) {
  const { email, password, role } = await request.json();

  if (!email || !password || !role) {
    return new Response(JSON.stringify({ error: 'Email, password, and role are required' }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role }, // Include role in token payload
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
  }
}
