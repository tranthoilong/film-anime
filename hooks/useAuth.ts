import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { createApiResponse } from '../lib/helpers/apiResponse';

enum StatusCode {
  UNAUTHORIZED = 401
}

export async function useAuth(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies._sess_auth;
    if (!token) {
        return res.status(StatusCode.UNAUTHORIZED).json(
          createApiResponse(null, StatusCode.UNAUTHORIZED, undefined, 'Unauthorized - No token provided')
        );
    }

    try {
        const verified = await jwtVerify(
            token as string,
            new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
        );
        console.log('verified ==========> ', verified);

        return verified;
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(StatusCode.UNAUTHORIZED).json(
          createApiResponse(null, StatusCode.UNAUTHORIZED, undefined, 'Unauthorized - Invalid token')
        );
    }
}
