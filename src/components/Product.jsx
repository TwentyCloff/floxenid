import React from 'react';

const Product = () => {
  const handleBuy = async () => {
    const order = {
      method: 'BRIVA', // metode dari daftar channel Tripay (VA BRI)
      merchant_ref: 'INV-' + Date.now(),
      amount: 10000,
      customer_name: 'Venera',
      customer_email: 'venera@example.com',
      customer_phone: '081234567890',
      order_items: [
        {
          sku: 'PRODUK1',
          name: 'Nama Produk 1',
          price: 10000,
          quantity: 1,
          product_url: 'https://tokomu.vercel.app/product/1',
          image_url: 'https://via.placeholder.com/100'
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
        body: JSON.stringify(order)
      });

      const result = await res.json();

      if (result.success) {
        window.location.href = result.data.checkout_url;
      } else {
        console.error(result);
        alert('Transaksi gagal: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Kesalahan jaringan:', err);
      alert('Tidak bisa terhubung ke server.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Nama Produk</h2>
      <p>Harga: Rp 10.000</p>
      <button onClick={handleBuy}>Beli Sekarang</button>
    </div>
  );
};

export default Product;
