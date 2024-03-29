import type { NextApiRequest, NextApiResponse } from 'next';
import { getUnprotectedData } from '@/lib/api';

export default async function publicRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    try {
        const response = await getUnprotectedData();
        if (!response) return res.status(500).end();
        return response ? res.status(200).json(response) : res.status(404).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
