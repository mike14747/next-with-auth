import { getSession } from 'next-auth/react';
import { checkForAvailableUsername, changeUsername } from '../../../../lib/api/user';

export default async function user(req, res) {
    if (req.method !== 'PUT') return res.status(401).end();
    const session = await getSession({ req });
    if (!session) return res.status(401).end();
    if (!req.query._id || !req.body.username) return res.status(400).end();
    if (session.user?._id !== req.query._id) return res.status(401).end();

    try {
        // first make sure the username isn't already in use
        const usernameResult = await checkForAvailableUsername(req.body.username);
        if (!usernameResult) return res.status(500).end();
        if (usernameResult.length > 0) return res.status(409).end();

        // since the username is not already in use, add the user's submission
        const response = await changeUsername(req.query._id, req.body.username);
        response?.code ? res.status(response.code).end() : res.status(500).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
