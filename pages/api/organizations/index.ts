import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cookies = nookies.get({ req });
      const accessToken = cookies.access_token;

      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organizations data');
      }

      const organizationsData = await response.json();
      res.status(200).json(organizationsData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else if (req.method === 'POST') {
    try {
      const cookies = nookies.get({ req });
      const accessToken = cookies.access_token;

      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' });
        return;
      }

      const newOrganizationData = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newOrganizationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create an organization');
      }

      const createdOrganizationData = await response.json();
      res.status(201).json(createdOrganizationData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
