import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse, createPagination } from '../../../lib/helpers/apiResponse';
import { Status } from '@/lib/types/enumStatus';
import { StatusCode } from '@/lib/types/statusCode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
  } catch (error) {
    console.error('Error in episodes handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}

// GET /api/episodes
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string || '';
    const movie_id = req.query.movie_id as string;
    const chapter_id = req.query.chapter_id as string;
    const status = req.query.status as string || 'all';

    // First get total count
    let countQuery = db('episodes')
      .where('episodes.status', '!=', Status.DELETED);

    if (movie_id) {
      countQuery = countQuery.where('episodes.movie_id', movie_id);
    }

    if (chapter_id) {
      countQuery = countQuery.where('episodes.chapter_id', chapter_id);
    }

    if (status !== 'all') {
      countQuery = countQuery.where('episodes.status', Number(status));
    }

    if (search) {
      countQuery = countQuery.where((builder) => {
        builder
          .whereILike('episodes.title', `%${search}%`)
          .orWhereRaw('CAST(episodes.episode_number AS TEXT) ILIKE ?', [`%${search}%`]);
      });
    }

    const [{ count }] = await countQuery.count();
    const totalItems = Number(count);

    // Then get paginated data
    let dataQuery = db('episodes')
      .select(
        'episodes.*',
        'movies.title as movie_title',
        'chapters.title as chapter_title',
        'images.url as image_url'
      )
      .leftJoin('movies', 'episodes.movie_id', 'movies.id')
      .leftJoin('chapters', 'episodes.chapter_id', 'chapters.id')
      .leftJoin('images', 'episodes.image_id', 'images.id')
      .where('episodes.status', '!=', Status.DELETED)
      .orderBy([
        { column: 'episodes.movie_id', order: 'asc' },
        { column: 'episodes.chapter_id', order: 'asc' },
        { column: 'episodes.episode_number', order: 'asc' }
      ]);

    if (movie_id) {
      dataQuery = dataQuery.where('episodes.movie_id', movie_id);
    }

    if (chapter_id) {
      dataQuery = dataQuery.where('episodes.chapter_id', chapter_id);
    }

    if (status !== 'all') {
      dataQuery = dataQuery.where('episodes.status', Number(status));
    }

    if (search) {
      dataQuery = dataQuery.where((builder) => {
        builder
          .whereILike('episodes.title', `%${search}%`)
          .orWhereRaw('CAST(episodes.episode_number AS TEXT) ILIKE ?', [`%${search}%`])
          .orWhereILike('movies.title', `%${search}%`)
          .orWhereILike('chapters.title', `%${search}%`);
      });
    }

    const episodes = await dataQuery.offset(offset).limit(limit);

    const pagination = createPagination(totalItems, { page, limit });

    return res.status(StatusCode.OK).json(
      createApiResponse({ data: episodes, pagination }, StatusCode.OK)
    );

  } catch (error) {
    console.error('Error in episodes GET handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}


// POST /api/episodes
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const trx = await db.transaction();
  
  try {
    const {
      movie_id,
      chapter_id,
      episode_number,
      title,
      slug,
      short_description,
      description,
      duration,
      image_id,
      video_links
    } = req.body;

    // Validate required fields
    if (!movie_id || !episode_number || !slug) {
      return res.status(StatusCode.BAD_REQUEST).json(
        createApiResponse(null, StatusCode.BAD_REQUEST, undefined, 'Missing required fields')
      );
    }

    // Check if movie exists
    const movie = await trx('movies').where('id', movie_id).first();
    if (!movie) {
      return res.status(StatusCode.NOT_FOUND).json(
        createApiResponse(null, StatusCode.NOT_FOUND, undefined, 'Movie not found')
      );
    }

    // Check if chapter exists if chapter_id is provided
    if (chapter_id) {
      const chapter = await trx('chapters').where('id', chapter_id).first();
      if (!chapter) {
        return res.status(StatusCode.NOT_FOUND).json(
          createApiResponse(null, StatusCode.NOT_FOUND, undefined, 'Chapter not found')
        );
      }
    }

    // Check for duplicate episode number
    const existingEpisode = await trx('episodes')
      .where({ movie_id, chapter_id, episode_number })
      .first();

    if (existingEpisode) {
      return res.status(StatusCode.CONFLICT).json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Episode number already exists')
      );
    }

    // Check for duplicate slug
    const existingSlug = await trx('episodes')
      .where({ movie_id, chapter_id, slug })
      .first();

    if (existingSlug) {
      return res.status(StatusCode.CONFLICT).json(
        createApiResponse(null, StatusCode.CONFLICT, undefined, 'Slug already exists')
      );
    }

    // Insert episode
    const [episode] = await trx('episodes').insert({
      movie_id,
      chapter_id,
      episode_number,
      title,
      slug,
      short_description,
      description,
      duration,
      image_id,
      status: Status.ACTIVE,
      view_count: 0,
      unique_viewers: 0
    }).returning('*');

    // Insert video links if provided
    if (video_links && Array.isArray(video_links)) {
      await Promise.all(video_links.map(async (link: string, index: number) => {
        await trx('videolinks').insert({
          movie_id,
          episode_id: episode.id,
          link_order: index + 1,
          link,
          status: Status.ACTIVE
        });
      }));
    }

    await trx.commit();

    return res.status(StatusCode.CREATED).json(
      createApiResponse(episode, StatusCode.CREATED, undefined, 'Episode created successfully')
    );

  } catch (error) {
    await trx.rollback();
    console.error('Error in episodes POST handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}
