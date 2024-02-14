import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { changePassword } from '@/lib/api/user';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') return res.status(401).end();

    try {
        const token = await getToken({ req });
        if (!req.body.password) return res.status(400).end();
        if (!token && (!req.body.userId || !req.body.resetPasswordToken)) return res.status(401).end();

        let response;
        if (token && typeof token.id === 'string') {
            response = await changePassword(token.id, req.body.password);
        } else if (req.body.userId && req.body.resetPasswordToken) {
            response = await changePassword(req.body.userId, req.body.password, req.body.resetPasswordToken);
        } else {
            return res.status(400).end();
        }

        if (!response) return res.status(500).end();
        return response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}
