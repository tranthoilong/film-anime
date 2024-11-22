import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';
import { createApiResponse } from '../../../../lib/helpers/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { movieId } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const movie = await db('movies')
          .where('id', movieId)
          .first();
        
        if (!movie) {
          return res.status(404).json(
            createApiResponse(null, 404, undefined, 'Movie not found')
          );
        }

        const genres = await db('genres_on_movies')
          .join('genres', 'genres.id', 'genres_on_movies.genre_id')
          .where('movie_id', movieId)
          .select('genres.*');

        const episodes = await db('episodes')
          .where('movie_id', movieId)
          .orderBy('number', 'asc');

        const movieData = {
          ...movie,
          genres,
          episodes
        };

        return res.status(200).json(
          createApiResponse(movieData)
        );

      case 'PUT':
        const { title, description, release_year, duration, rating, thumbnail, video_url } = req.body;
        const [updatedMovie] = await db('movies')
          .where('id', movieId)
          .update({
            title,
            description,
            release_year,
            duration,
            rating,
            thumbnail,
            video_url,
            updated_at: db.fn.now()
          })
          .returning('*');

        return res.status(200).json(
          createApiResponse(updatedMovie, 200, undefined, 'Movie updated successfully')
        );

      case 'DELETE':
        await db('movies')
          .where('id', movieId)
          .del();
        return res.status(204).json(
          createApiResponse(null, 204, undefined, 'Movie deleted successfully')
        );

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json(
          createApiResponse(null, 405, undefined, `Method ${req.method} Not Allowed`)
        );
    }
  } catch (error) {
    console.error('Error in movie handler:', error);
    return res.status(500).json(
      createApiResponse(null, 500, undefined, 'Internal Server Error')
    );
  }
} 