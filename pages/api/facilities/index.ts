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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch facilities data');
      }

      const facilitiesData = await response.json();

      res.status(200).json(facilitiesData);
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

      const newFacilityData = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newFacilityData),
      });

      if (!response.ok) {
        throw new Error('Failed to create a facility');
      }

      const createdTruckData = await response.json();
      res.status(201).json(createdTruckData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
