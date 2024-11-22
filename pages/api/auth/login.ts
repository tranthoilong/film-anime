import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, password } = req.body;

    const user = await db('users')
      .where('email', email)
      .first();

    if (!user || !verifyPassword(user.password, password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error in login handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 