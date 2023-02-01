import type { NextApiRequest, NextApiResponse } from 'next';
import { forgotUsername } from '../../../lib/api/user';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(401).end();
    if (!req.body.email) return res.status(400).end();

    try {
        const response = await forgotUsername(req.body.email);
        return response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
