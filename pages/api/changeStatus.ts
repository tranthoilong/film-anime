import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { createApiResponse } from '../../lib/helpers/apiResponse';
import { Status } from '../../lib/types/enumStatus';
import { StatusCode } from '../../lib/types/statusCode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(StatusCode.METHOD_NOT_ALLOWED).json(
      createApiResponse(null, StatusCode.METHOD_NOT_ALLOWED, undefined, `Method ${req.method} Not Allowed`)
    );
  }

  try {
    const { tableName, id, status } = req.body;

    if (!tableName || !id || status === undefined) {
      return res.status(StatusCode.BAD_REQUEST).json(
        createApiResponse(null, StatusCode.BAD_REQUEST, undefined, 'Missing required fields')
      );
    }

    // Validate status value
    if (![Status.ACTIVE, Status.INACTIVE, Status.PENDING, Status.DELETED].includes(status)) {
      return res.status(StatusCode.BAD_REQUEST).json(
        createApiResponse(null, StatusCode.BAD_REQUEST, undefined, 'Invalid status value')
      );
    }

    // Update status
    const [updatedRecord] = await db(tableName)
      .where('id', id)
      .update({
        status,
        updated_at: db.fn.now()
      })
      .returning('*');

    if (!updatedRecord) {
      return res.status(StatusCode.NOT_FOUND).json(
        createApiResponse(null, StatusCode.NOT_FOUND, undefined, 'Record not found')
      );
    }

    return res.status(StatusCode.OK).json(
      createApiResponse(updatedRecord, StatusCode.OK, undefined, 'Status updated successfully')
    );

  } catch (error) {
    console.error('Error in changeStatus handler:', error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
      createApiResponse(null, StatusCode.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error')
    );
  }
}
