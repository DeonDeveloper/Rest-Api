const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// ✅ Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGpkbHFxZW94dnNtaGFkb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzU3NDAsImV4cCI6MjA2NzYxMTc0MH0.eH4cOXY1w58xPrcq8IP4AyU5P3RArAZ_SXd023DsIog'
);

// ✅ Konstanta ZannPay
const ZANN_MERCHANT = 'ZNxxxx';
const ZANN_SECRET = 'RAHASIA';

module.exports = function (app) {
  // 🔐 Buat pembayaran
  app.get('/zannpay/createpayment', async (req, res) => {
    const { username, amount, apikey } = req.query;
    if (!username || !amount || !apikey) return res.status(400).json({ status: false, message: 'Parameter kosong' });

    const now = new Date().toISOString();
    const { data, error } = await supabase.from('apikeys').select('*').eq('token', apikey).gt('expired_at', now).single();
    if (error || !data) return res.status(401).json({ status: false, message: 'Apikey tidak valid/expired' });

    const trx_id = `TRX-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    const signature = crypto.createHash('sha256').update(ZANN_MERCHANT + ZANN_SECRET + trx_id).digest('hex');

    try {
      const { data: result } = await axios.post('http://pay.zannstore.com/v1/', new URLSearchParams({
        merchant: ZANN_MERCHANT,
        trx_id,
        request: 'new',
        payment: 'qris',
        amount,
        note: `Topup by ${username}`,
        expired_time: '5m',
        type_fee: 'user',
        signature
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      if (!result.status) return res.status(400).json({ status: false, message: result.message });

      await supabase.from('saldo_topup').insert({ username, trx_id, amount, status: 'Pending' });

      res.json({ status: true, message: 'Tagihan dibuat', trx_id, qr_url: result.data.qr_url });
    } catch (e) {
      res.status(500).json({ status: false, message: 'Gagal membuat tagihan', error: e.message });
    }
  });

  // ✅ Cek status
  app.get('/zannpay/paymentstatus', async (req, res) => {
    const { username, trx_id, apikey } = req.query;
    if (!username || !trx_id || !apikey) return res.status(400).json({ status: false, message: 'Parameter kosong' });

    const now = new Date().toISOString();
    const { data, error } = await supabase.from('apikeys').select('*').eq('token', apikey).gt('expired_at', now).single();
    if (error || !data) return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const signature = crypto.createHash('sha256').update(ZANN_MERCHANT + ZANN_SECRET + trx_id).digest('hex');

    try {
      const { data: statusRes } = await axios.post('http://pay.zannstore.com/v1/', new URLSearchParams({
        merchant: ZANN_MERCHANT,
        trx_id,
        request: 'status',
        signature
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      if (statusRes.data.status !== 'Success') return res.json({ status: false, message: 'Belum dibayar' });

      const { data: userData } = await supabase.from('users').select('*').eq('username', username).single();
      const saldoNow = userData?.saldo || 0;

      await supabase.from('users').upsert({ username, saldo: saldoNow + parseInt(statusRes.data.amount) });
      await supabase.from('saldo_topup').update({ status: 'Success' }).eq('trx_id', trx_id);

      res.json({ status: true, message: 'Pembayaran sukses & saldo ditambahkan' });
    } catch (e) {
      res.status(500).json({ status: false, message: 'Gagal cek status', error: e.message });
    }
  });

  // 💸 Penarikan
  app.get('/zannpay/withdraw', async (req, res) => {
    const { username, amount, tujuan, pin, apikey } = req.query;
    if (!username || !amount || !tujuan || !pin || !apikey) return res.status(400).json({ status: false, message: 'Parameter kosong' });

    const now = new Date().toISOString();
    const { data, error } = await supabase.from('apikeys').select('*').eq('token', apikey).gt('expired_at', now).single();
    if (error || !data) return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const { data: userData } = await supabase.from('users').select('*').eq('username', username).single();
    if (!userData || (userData.saldo || 0) < parseInt(amount)) return res.status(400).json({ status: false, message: 'Saldo tidak cukup' });

    const signature = crypto.createHash('sha256').update(ZANN_MERCHANT + pin).digest('hex');

    try {
      const { data: wdRes } = await axios.post('http://pay.zannstore.com/v1/', new URLSearchParams({
        merchant: ZANN_MERCHANT,
        pin,
        request: 'withdraw',
        amount,
        tujuan,
        signature
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      if (!wdRes.status) return res.status(400).json({ status: false, message: 'Withdraw gagal' });

      await supabase.from('users').update({ saldo: userData.saldo - parseInt(amount) }).eq('username', username);
      await supabase.from('withdraw_log').insert({ username, amount, tujuan, trx_id: wdRes.trx_id });

      res.json({ status: true, message: 'Withdraw berhasil diproses', trx_id: wdRes.trx_id });
    } catch (e) {
      res.status(500).json({ status: false, message: 'Withdraw error', error: e.message });
    }
  });
};
