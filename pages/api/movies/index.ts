import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse, createPagination } from '../../../lib/helpers/apiResponse';
import { Status } from '@/lib/types/enumStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search as string || '';
        const type_filter = req.query.type as string || 'all';

        // Build query
        let query = db('movies')
          .where('movies.status','!=', Status.DELETED);

        // Add search condition if search term exists
        if (search) {
          query = query.where((builder) => {
            builder.where('movies.title', 'ilike', `%${search}%`)
              .orWhere('movies.short_description', 'ilike', `%${search}%`)
              .orWhere('movies.description', 'ilike', `%${search}%`);
          });
        }

        // Add type filter if specified
        if (type_filter !== 'all') {
          query = query.where('movies.type', type_filter);
        }

        // Get total count
        const [{ count }] = await query.clone().count('id as count');
        const totalItems = Number(count);

        // Get paginated data with image details
        const movies = await query
          .select(
            'movies.*',
            'images.url as image_url',
            'images.name as image_name'
          )
          .leftJoin('images', 'movies.image_id', 'images.id')
          .orderBy('movies.created_at', 'desc')
          .offset(offset)
          .limit(limit);

        const pagination = createPagination(totalItems, { page, limit });
        
        return res.status(200).json(
          createApiResponse(movies, 200, pagination)
        );

      case 'POST':
        const { 
          title,
          slug,
          short_description,
          description,
          release_year,
          duration,
          type,
          image_id,
          status = 1
        } = req.body;

        // Insert movie
        const [newMovie] = await db('movies')
          .insert({
            title,
            slug,
            short_description,
            description,
            release_year,
            duration,
            type,
            image_id,
            status,
            view_count: 0,
            unique_viewers: 0
          })
          .returning('*');

        return res.status(201).json(
          createApiResponse(newMovie, 201, undefined, 'Movie created successfully')
        );

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