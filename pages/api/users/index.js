// GET method: gets all users... only if the user is logged in with the role of admin
// POST: registers a new user

import { getToken } from 'next-auth/jwt';
import { getInfoForAllUsers, registerNewUser } from '../../../lib/api/user';

export default async function users(req, res) {
    if (req.method === 'GET') {
        const token = await getToken({ req });
        if (token?.role !== 'admin') return res.status(401).end();

        try {
            const response = await getInfoForAllUsers();
            return response ? res.status(200).json(response) : res.status(500).end();
        } catch (error) {
            console.log(error);
            res.status(500).end();
        }
    } else if (req.method === 'POST') {
        if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end();

        try {
            const response = await registerNewUser(req.body.username, req.body.password, req.body.email);
            response?.code ? res.status(response.code).end() : res.status(500).end();
        } catch (error) {
            console.log(error);
            res.status(500).end();
        }
    } else {
        res.status(401).end();
    }
}
