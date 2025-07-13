// pages/api/tripay.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const axios = require('axios');

  try {
    const response = await axios.post(
      'https://tripay.co.id/api-sandbox/transaction/create',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.TRIPAY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
}
