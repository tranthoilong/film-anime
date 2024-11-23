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
        let query = db('chapters')
          .where('chapters.status', '!=', Status.DELETED)
          .select('chapters.id', 'chapters.title');

        // Add search condition if search term exists
        if (search) {
          query = query.where('chapters.title', 'ilike', `%${search}%`);
        }

        const chapters = await query
          .orderBy('chapters.created_at', 'desc');

        return res.status(200).json(
          createApiResponse(chapters, 200)
        );

      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json(
          createApiResponse(null, 405, undefined, `Method ${req.method} Not Allowed`)
        );
    }
  } catch (error) {
    console.error('Error in chapters handler:', error);
    return res.status(500).json(
      createApiResponse(null, 500, undefined, 'Internal Server Error')
    );
  }
}
