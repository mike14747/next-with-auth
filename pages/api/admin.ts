import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getAdminData } from '../../lib/api';

export default async function adminRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    const token = await getToken({ req });
    if (token?.role !== 'admin') return res.status(401).end();

    try {
        const response = await getAdminData();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
