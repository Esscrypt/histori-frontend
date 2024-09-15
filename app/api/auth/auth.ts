import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    if (email === 'user@example.com' && password === 'password123') {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader(
            'Set-Cookie',
            serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                maxAge: 3600,
                path: '/',
            })
        );

        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}
