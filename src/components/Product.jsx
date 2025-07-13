import React from 'react';

const Product = () => {
  const handleBuyNow = async () => {
    const orderData = {
      method: 'QRIS', // channel pembayaran
      merchant_ref: 'INV-' + Date.now(), // ID unik
      amount: 10000, // nominal (dalam Rupiah)
      customer_name: 'Venera Gwen',
      customer_email: 'venera@example.com',
      order_items: [
        {
          sku: 'SKU001',
          name: 'Produk Premium',
          price: 10000,
          quantity: 1
        }
      ],
      return_url: 'https://yourdomain.vercel.app/thanks',
      callback_url: 'https://yourdomain.vercel.app/api/callback',
      expired_time: Math.floor(Date.now() / 1000) + 86400
    };

    try {
      const res = await fetch('/api/tripay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        console.error('Respon error:', res.status);
        alert('Gagal membuat transaksi');
        return;
      }

      const result = await res.json();

      if (result.success) {
        window.location.href = result.data.checkout_url;
      } else {
        console.error('Tripay gagal:', result);
        alert('Transaksi gagal: ' + result.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Kesalahan fetch:', err);
      alert('Terjadi kesalahan saat menghubungi server.');
    }
  };

  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Produk Premium</h2>
      <p>Harga: <strong>Rp 10.000</strong></p>
      <button
        onClick={handleBuyNow}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Beli Sekarang
      </button>
    </div>
  );
};

export default Product;
