import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getUserProfile } from '../../../../lib/api/user';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();
    const token = await getToken({ req });

    if (!token) return res.status(401).end();
    if (!req.query.id || typeof req.query.id !== 'string') return res.status(400).end();
    if (token.id !== req.query.id) return res.status(400).end();

    try {
        const response = await getUserProfile(req.query.id);
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}
