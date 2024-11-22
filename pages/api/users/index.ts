import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await db('users')
          .select('id', 'email', 'name', 'avatar', 'created_at')
          .orderBy('created_at', 'desc');
        return res.status(200).json(users);

      case 'POST':
        const { email, name, password, avatar } = req.body;
        
        // Check if user exists
        const existingUser = await db('users')
          .where('email', email)
          .first();
          
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password using crypto (built-in Node.js module)
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto
          .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
          .toString('hex');

        const [newUser] = await db('users')
          .insert({
            email,
            name,
            password: `${salt}:${hashedPassword}`, // Store both salt and hash
            avatar
          })
          .returning(['id', 'email', 'name', 'avatar', 'created_at']);

        return res.status(201).json(newUser);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in users handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 