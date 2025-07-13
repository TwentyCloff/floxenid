const tripayConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://tripay.co.id/api' 
    : 'https://tripay.co.id/api-sandbox',
  apiKey: process.env.NEXT_PUBLIC_TRIPAY_API_KEY, // Pastikan di .env.local
  privateKey: process.env.NEXT_PUBLIC_TRIPAY_PRIVATE_KEY,
  merchantCode: process.env.NEXT_PUBLIC_TRIPAY_MERCHANT_CODE
};
<<<<<<< HEAD
=======
export default tripayConfig;
>>>>>>> e86e31f (add)
