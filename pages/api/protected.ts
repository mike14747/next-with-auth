import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getProtectedData } from '../../lib/api';

export default async function protectedRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    const token = await getToken({ req });
    if (!token) return res.status(401).end();

    try {
        const response = await getProtectedData();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
