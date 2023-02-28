import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { changeEmail } from '../../../../lib/api/user';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(401).end();

    try {
        const token = await getToken({ req });
        if (!token) return res.status(401).end();
        if (!req.query.id || typeof req.query.id !== 'string' || !req.body.email) return res.status(400).end();
        if (token?.id !== req.query.id) return res.status(401).end();

        const response = await changeEmail(req.query.id, req.body.email);
        return response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}
