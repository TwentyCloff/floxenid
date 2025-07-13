const tripayConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://tripay.co.id/api' 
    : 'https://tripay.co.id/api-sandbox',
  apiKey: process.env.TRIPAY_API_KEY,
  privateKey: process.env.TRIPAY_PRIVATE_KEY,
  merchantCode: process.env.TRIPAY_MERCHANT_CODE
};

export default tripayConfig;