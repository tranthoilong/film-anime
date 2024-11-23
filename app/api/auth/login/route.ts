import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if input is email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    
    // Find user by email or username and join with roles table
    const user = await db('users')
      .select('users.*', 'roles.name as roleName', 'roles.id as roleId')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where(isEmail ? 'users.email' : 'users.username', username)
      .first();

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token with role information
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        roleName: user.roleName
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });

    // Set cookie
    response.cookies.set(process.env.COOKIE_NAME || '_sess_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.JWT_EXPIRATION) || 86400 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
