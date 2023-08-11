import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const data = await response.json();
    const { access_token } = data;

    setCookie({ res }, 'access_token', access_token, {
      maxAge: 60 * 60 * 8,
      path: '/',
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
}
