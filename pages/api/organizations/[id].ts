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
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization data');
      }

      const organizationDetails = await response.json();

      res.status(200).json(organizationDetails);
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

      const updatedOrganizationData = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedOrganizationData),
      });

      if (!response.ok) {
        throw new Error('Failed to update organization data');
      }

      const updatedOrganization = await response.json();

      res.status(200).json(updatedOrganization);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete organization');
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
