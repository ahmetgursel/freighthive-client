import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
      // Burada accessToken'ı kontrol ederek kullanıcıyı kimliklendirin
      const decodedData = await jwt.decode(accessToken);
      // Eğer kullanıcı oturum açmışsa 200 OK döndürün, aksi halde 401 Unauthorized
      return res.status(200).json({ isAuthenticated: true, user: decodedData });
    }

    return res.status(200).json({ isAuthenticated: false });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
}
