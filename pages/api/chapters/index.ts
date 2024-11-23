import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse } from '../../../lib/helpers/apiResponse';
import { StatusCode } from '../../../lib/types/statusCode';
import { Status } from '@/lib/types/enumStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(StatusCode.METHOD_NOT_ALLOWED).json(
        createApiResponse(null, StatusCode.METHOD_NOT_ALLOWED, undefined, `Method ${req.method} Not Allowed`)
      );
  }
}

// GET /api/chapters
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 10, movie_id, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db('chapters')
      .select(
        'chapters.id',
        'chapters.movie_id',
        'chapters.chapter_number',
        'chapters.title',
        'chapters.slug',
        'chapters.description', 
        'chapters.status',
        'chapters.created_at',
        'chapters.updated_at',
        'movies.title as movie_title'
      )
      .leftJoin('movies', 'chapters.movie_id', 'movies.id')
      .where('chapters.status', '!=', Status.DELETED)
      .orderBy([
        { column: 'chapters.movie_id', order: 'asc' },
        { column: 'chapters.chapter_number', order: 'asc' }
      ]);

    if (movie_id) {
      query = query.where('chapters.movie_id', movie_id as string);
    }

    if (search) {
      query = query.where((builder) => {
        builder
          .where('chapters.title', 'ilike', `%${search}%`)
          .orWhere('chapters.chapter_number', 'ilike', `%${search}%`)
          .orWhere('movies.title', 'ilike', `%${search}%`);
      });
    }

    const [totalItems, items] = await Promise.all([
      db('chapters')
        .where('status', '!=', Status.DELETED)
        .count('* as count')
        .first(),
      query.limit(Number(limit)).offset(offset)
    ]);

    const totalPages = Math.ceil(Number(totalItems?.count || 0) / Number(limit));

    return res.status(StatusCode.OK).json(
      createApiResponse(
        {
          data: items,
          pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: Number(totalItems?.count || 0),
            limit: Number(limit)
          }
        },
        StatusCode.OK
      )
    );

  } catch (error) {
    console.error('Error in chapters GET handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}

// POST /api/chapters
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { movie_id, chapter_number, title, description, slug } = req.body;

    if (!movie_id || !chapter_number || !slug) {
      return res.status(StatusCode.BAD_REQUEST).json(
        createApiResponse(null, StatusCode.BAD_REQUEST, undefined, 'Missing required fields')
      );
    }

    // Check if movie exists
    const movie = await db('movies').where('id', movie_id).first();
    if (!movie) {
      return res.status(StatusCode.NOT_FOUND).json(
        createApiResponse(null, StatusCode.NOT_FOUND, undefined, 'Movie not found')
      );
    }

    // Check for duplicate chapter number
    const existingChapter = await db('chapters')
      .where({ movie_id, chapter_number })
      .first();

    if (existingChapter) {
      return res.status(StatusCode.CONFLICT).json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Chapter number already exists for this movie')
      );
    }

    // Check for duplicate slug
    const existingSlug = await db('chapters')
      .where({ movie_id, slug })
      .first();

    if (existingSlug) {
      return res.status(StatusCode.CONFLICT).json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Slug already exists for this movie')
      );
    }

    const [newChapter] = await db('chapters')
      .insert({
        movie_id,
        chapter_number,
        title,
        description,
        slug,
        status: Status.ACTIVE
      })
      .returning('*');

    return res.status(StatusCode.CREATED).json(
      createApiResponse(newChapter, StatusCode.CREATED, undefined, 'Chapter created successfully')
    );

  } catch (error) {
    console.error('Error in chapters POST handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}
