import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { createApiResponse, createPagination } from '../../../lib/helpers/apiResponse';
import { Status } from '../../../lib/types/enumStatus';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {


    switch (req.method) {
      case 'GET':

      // Lấy tham số page, limit, và search từ query params
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search as string;

  // Xây dựng truy vấn cơ bản
  let query = db('images').where('status', '!=', Status.DELETED);

  // Nếu có tìm kiếm, sử dụng Levenshtein để tìm kiếm gần đúng
  if (search) {
    query = query.whereRaw(`
      LOWER(name) LIKE LOWER(?) OR 
      LEVENSHTEIN(LOWER(name), LOWER(?)) <= 3
    `, [`%${search}%`, search]);
  }

  // Lấy tổng số bản ghi
  const [{ count }] = await query.clone().count('id as count');
  const totalItems = Number(count);

  // Lấy dữ liệu phân trang
  const images = await query
    .select('*')
    .orderBy('created_at', 'desc')
    .offset(offset)
    .limit(limit);

  // Tạo thông tin phân trang
  const pagination = createPagination(totalItems, { page, limit });

  // Trả kết quả cho client
  return res.status(200).json(createApiResponse(images, 200, pagination));

      case 'POST':
        const { name, url } = req.body;

        // Start a transaction
        const trx = await db.transaction();

        try {
          // Insert image
          const [newImage] = await trx('images')
            .insert({
              name,
              url,
              status: Status.ACTIVE
              // created_at will be set by database default
            })
            .returning('*');

          // Commit transaction
          await trx.commit();

          return res.status(201).json(
            createApiResponse(newImage, 201, undefined, 'Image created successfully')
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
    console.error('Error in images handler:', error);
    return res.status(500).json(
      createApiResponse(null, 500, undefined, 'Internal Server Error')
    );
  }
}
