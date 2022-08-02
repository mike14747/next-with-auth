// this route will get all user info for a single user (but not riding data) by id if the http method is GET

import { getSession } from 'next-auth/react';
import { getUserProfile } from '../../../../lib/api';

export default async function user(req, res) {
    if (req.method !== 'GET') return res.status(401).end();
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (!req.query._id) return res.status(400).end();
    if (session.user?._id !== parseInt(req.query._id)) return res.status(401).end();

    try {
        const response = await getUserProfile(parseInt(req.query._id));
        if (!response) return res.status(500).end();
        response?.length === 1 ? res.status(200).json(response) : res.status(400).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
