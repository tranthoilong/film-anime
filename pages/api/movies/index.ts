import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse, createPagination } from '../../../lib/helpers/apiResponse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count
        const [{ count }] = await db('movies').count('id as count');
        const totalItems = Number(count);

        // Get paginated data
        const movies = await db('movies')
          .select('*')
          .orderBy('created_at', 'desc')
          .offset(offset)
          .limit(limit);

        const pagination = createPagination(totalItems, { page, limit });
        
        return res.status(200).json(
          createApiResponse(movies, 200, pagination)
        );

      case 'POST':
        const { title, short_description, description, release_year, duration, type, image_id } = req.body;

        // Start a transaction
        const trx = await db.transaction();

        try {
          // Insert movie
          const [newMovie] = await trx('movies')
            .insert({
              title,
              short_description,
              description,
              release_year,
              duration,
              type,
              image_id,
              view_count: 0,
              unique_viewers: 0
            })
            .returning('*');

          // Commit transaction
          await trx.commit();

          return res.status(201).json(
            createApiResponse(newMovie, 201, undefined, 'Movie created successfully')
          );

        } catch (error) {
          // Rollback transaction on error
          await trx.rollback();
          throw error;
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json(
          createApiResponse(null, 405, undefined, `Method ${req.method} Not Allowed`)
        );
    }
  } catch (error) {
    console.error('Error in movies handler:', error);
    return res.status(500).json(
      createApiResponse(null, 500, undefined, 'Internal Server Error')
    );
  }
}