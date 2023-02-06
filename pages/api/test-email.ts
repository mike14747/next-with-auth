import type { NextApiRequest, NextApiResponse } from 'next';

import { testEmail } from '../../lib/api/user';

export default async function settings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(401).end();

    try {
        const response = await testEmail();
        return response ? res.status(200).json(response) : res.status(500).end();
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
}
