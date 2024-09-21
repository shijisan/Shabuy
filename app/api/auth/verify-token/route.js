import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token not provided' }), { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch user with roles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { roles: true }, // Include roles in the query
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
    }

    // Log user data for debugging
    console.log('Verified user:', user);

    // Return user role in the response
    // If the user has multiple roles, you may need to adapt this
    return new Response(JSON.stringify({ roles: user.roles.map(role => role.role) }), { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return new Response(JSON.stringify({ error: 'Token verification failed' }), { status: 500 });
  }
}
