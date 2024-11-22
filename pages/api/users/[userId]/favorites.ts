import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const favorites = await db('favorites')
          .join('movies', 'movies.id', 'favorites.movie_id')
          .where('favorites.user_id', userId)
          .select('movies.*', 'favorites.created_at as favorited_at')
          .orderBy('favorites.created_at', 'desc');
        return res.status(200).json(favorites);

      case 'POST':
        const { movieId } = req.body;
        
        // Check if already favorited
        const existing = await db('favorites')
          .where({
            user_id: userId,
            movie_id: movieId
          })
          .first();
          
        if (existing) {
          return res.status(400).json({ error: 'Movie already in favorites' });
        }

        const [newFavorite] = await db('favorites')
          .insert({
            user_id: userId,
            movie_id: movieId
          })
          .returning('*');
        return res.status(201).json(newFavorite);

      case 'DELETE':
        const { movieId: movieToDelete } = req.body;
        await db('favorites')
          .where({
            user_id: userId,
            movie_id: movieToDelete
          })
          .del();
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in favorites handler:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 