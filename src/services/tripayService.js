import tripayConfig from '../config/tripay';

const generateSignature = (privateKey, merchantCode, orderId, amount) => {
  const signatureString = `${merchantCode}${orderId}${amount}`;
  const crypto = require('crypto');
  return crypto.createHmac('sha256', privateKey).update(signatureString).digest('hex');
};

export const createTransaction = async (product, method) => {
  try {
    const orderId = `ORD-${Date.now()}`;
    const amount = product.price;
    
    const signature = generateSignature(
      tripayConfig.privateKey,
      tripayConfig.merchantCode,
      orderId,
      amount
    );

    const response = await fetch(`${tripayConfig.baseUrl}/transaction/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tripayConfig.apiKey}`
      },
      body: JSON.stringify({
        method: method,
        merchant_ref: orderId,
        amount: amount,
        customer_name: 'Customer',
        customer_email: 'customer@example.com',
        customer_phone: '081234567890',
        order_items: [
          {
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ],
        callback_url: window.location.href,
        return_url: window.location.href,
        expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 jam
        signature: signature
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await fetch(`${tripayConfig.baseUrl}/merchant/payment-channel`, {
      headers: {
        'Authorization': `Bearer ${tripayConfig.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get payment methods');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
};

export const checkTransactionStatus = async (reference) => {
  try {
    const response = await fetch(`${tripayConfig.baseUrl}/transaction/detail?reference=${reference}`, {
      headers: {
        'Authorization': `Bearer ${tripayConfig.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check transaction status');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};