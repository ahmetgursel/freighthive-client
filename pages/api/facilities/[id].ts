import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const cookies = nookies.get({ req });
      const accessToken = cookies.access_token;

      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch facility data');
      }

      const facilityDetails = await response.json();
      res.status(200).json(facilityDetails);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else if (method === 'PATCH') {
    try {
      const cookies = nookies.get({ req });
      const accessToken = cookies.access_token;

      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' });
      }

      const updatedFacilityData = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedFacilityData),
      });

      if (!response.ok) {
        throw new Error('Failed to update facility data');
      }

      const updatedFacilityDetails = await response.json();

      res.status(200).json(updatedFacilityDetails);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else if (method === 'DELETE') {
    try {
      const cookies = nookies.get({ req });
      const accessToken = cookies.access_token;

      if (!accessToken) {
        res.status(401).json({ error: 'Access token not found' });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete facility data');
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
