// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

type Data = {
    name?: string;
    message?: string;
    token?: string;
};
const authenticated = (username, password) =>
    username === 'admin' && password === 'admin';
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { username, password } = req.body;
    if (!(username && password)) res.status(400).send({});
    if (authenticated(username, password)) {
        const token = jwt.sign(
            { username: username },
            process.env.jwt_secret!,
            {
                expiresIn: '7d',
            }
        );
        res.json({
            message: 'logged in',
            token: token,
        });
    } else {
        res.json({
            message: 'username or password not matched',
        });
    }
}
