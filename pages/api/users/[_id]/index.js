// this route will get all user info for a single user by id if the http method is GET

import { getSession } from 'next-auth/react';
import { getUserProfile } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'GET') return res.status(401).end();
    const session = await getSession({ req });

    // make sure the user is signed in
    if (!session) return res.status(401).end();
    // make sure a query parameter is present in the url
    if (!req.query._id) return res.status(400).end();
    // make sure the _id of the user in the session matches the _id in the query parameter
    if (session?.user?._id !== req.query._id) return res.status(401).end();

    try {
        const response = await getUserProfile(req.query._id);
        if (!response) return res.status(500).end();
        response ? res.status(200).json(response) : res.status(400).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
