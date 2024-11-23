import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { createApiResponse } from '@/lib/helpers/apiResponse';
import { StatusCode } from '@/lib/types/statusCode';

export async function POST(req: Request) {
  try {
    const { username, email, password, full_name } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        createApiResponse(null, StatusCode.BAD_REQUEST, undefined, 'Missing required fields'),
        { status: StatusCode.BAD_REQUEST }
      );
    }

    // Check if username already exists
    const existingUsername = await db('users').where('username', username).first();
    if (existingUsername) {
      return NextResponse.json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Username already exists'),
        { status: StatusCode.CONFLICT }
      );
    }

    // Check if email already exists  
    const existingEmail = await db('users').where('email', email).first();
    if (existingEmail) {
      return NextResponse.json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Email already exists'),
        { status: StatusCode.CONFLICT }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);

    // Create new user
    const [newUser] = await db('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        full_name,
        role_id: 'd4e5f6a7-b8c9-7011-b910-1234567890ab' // Default user role
      })
      .returning(['id', 'username', 'email', 'full_name', 'role_id', 'created_at']);

    return NextResponse.json(
      createApiResponse(newUser, StatusCode.CREATED, undefined, 'User registered successfully'),
      { status: StatusCode.CREATED }
    );

  } catch (error) {
    console.error('Error in register:', error);
    return NextResponse.json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error'),
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
