import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { movieId } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const comments = await db('comments')
          .join('users', 'users.id', 'comments.user_id')
          .where('movie_id', movieId)
          .select(
            'comments.*',
            'users.name as user_name',
            'users.avatar as user_avatar'
          )
          .orderBy('comments.created_at', 'desc');
        return res.status(200).json(comments);

      case 'POST':
        const { content, userId } = req.body;
        const [newComment] = await db('comments')
          .insert({
            content,
            user_id: userId,
            movie_id: movieId,
            likes: 0
          })
          .returning('*');
        return res.status(201).json(newComment);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in comments handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 