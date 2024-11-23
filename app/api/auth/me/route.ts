import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME || '_sess_auth');

    if (!token || !token.value) {
      return NextResponse.json(
          { message: 'Unauthorized - No token provided' },
          { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    // Decode token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET) as {
      id: number;
      email: string;
      username: string;
    };

    // Fetch user from the database
    const user = await db('users').where('id', decoded.id).first();

    if (!user) {
      return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
      );
    }

    // Remove sensitive data (like password) from the response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
          { message: 'Unauthorized - Invalid token' },
          { status: 401 }
      );
    }

    console.error('Error getting user info:', error);
    return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
    );
  }
}
