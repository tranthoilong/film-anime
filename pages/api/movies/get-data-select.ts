import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse } from '../../../lib/helpers/apiResponse';
import { Status } from '@/lib/types/enumStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const search = req.query.search as string || '';

        // Build query
        let query = db('movies')
          .where('movies.status', '!=', Status.DELETED)
          .select('movies.id', 'movies.title');

        // Add search condition if search term exists
        if (search) {
          query = query.where('movies.title', 'ilike', `%${search}%`);
        }

        const movies = await query
          .orderBy('movies.created_at', 'desc');

        return res.status(200).json(
          createApiResponse(movies, 200)
        );

      default:
        res.setHeader('Allow', ['GET']);
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
