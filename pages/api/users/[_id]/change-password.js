import { getToken } from 'next-auth/jwt';
import { changePassword } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const token = await getToken({ req });
    if (!req.body.password) return res.status(400).end();
    if (!token && (!req.body.userId  || !req.body.token)) return res.status(401).end();

    try {
        let response;
        if (token) {
            response = await changePassword(token._id, req.body.password);
        } else if (req.body.userId && req.body.token) {
            response = await changePassword(req.body.userId, req.body.password, req.body.token);
        } else {
            return res.status(400).end();
        }

        if (!response) return res.status(500).end();
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
