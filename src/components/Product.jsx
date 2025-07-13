import React from 'react';

const Product = () => {
  const handleBuyNow = async () => {
    const orderData = {
      method: 'QRIS', // bisa diganti dengan BCA, BNI, dll sesuai Tripay channel
      merchant_ref: 'INV-' + Date.now(), // ID unik
      amount: 10000,
      customer_name: 'Venera',
      customer_email: 'venera@example.com',
      order_items: [
        {
          sku: 'SKU001',
          name: 'Produk Premium',
          price: 10000,
          quantity: 1
        }
      ],
      return_url: 'https://yourdomain.vercel.app/thanks', // optional
      callback_url: 'https://yourdomain.vercel.app/api/callback', // optional
      expired_time: Math.floor(Date.now() / 1000) + 86400
    };

    try {
      const res = await fetch('/api/tripay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();

      if (result.success) {
        // Redirect ke halaman bayar Tripay
        window.location.href = result.data.checkout_url;
      } else {
        alert('Gagal membuat transaksi: ' + result.message);
        console.error(result);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghubungi server.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Produk Premium</h2>
      <p>Harga: Rp 10.000</p>
      <button onClick={handleBuyNow}>Beli Sekarang</button>
    </div>
  );
};

export default Product;
