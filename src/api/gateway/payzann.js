const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// ✅ Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'YOUR_SUPABASE_API_KEY'
);

// ✅ Konstanta ZannPay
const ZANN_MERCHANT = 'ZNPJOX532';
const ZANN_SECRET = 'Uo1QZTCGSIrhERv8';
const PIN = '111222';

module.exports = function (app) {
  // 🔐 Validasi API Key
  async function validateApikey(apikey) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('apikeys')
      .select('*')
      .eq('token', apikey)
      .gt('expired_at', now)
      .single();
    return !error && data;
  }

  // ✅ Buat Pembayaran QRIS
  app.get('/gateway/createpayment', async (req, res) => {
    const { username, amount, apikey } = req.query;
    if (!username || !amount || !apikey)
      return res.status(400).json({ status: false, message: 'Parameter kosong' });

    if (!(await validateApikey(apikey)))
      return res.status(401).json({ status: false, message: 'Apikey tidak valid/expired' });

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

  // ✅ Cek Status Pembayaran
  app.get('/gateway/paymentstatus', async (req, res) => {
    const { username, trx_id, apikey } = req.query;
    if (!username || !trx_id || !apikey)
      return res.status(400).json({ status: false, message: 'Parameter kosong' });

    if (!(await validateApikey(apikey)))
      return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const signature = crypto.createHash('sha256').update(ZANN_MERCHANT + ZANN_SECRET + trx_id).digest('hex');

    try {
      const { data: statusRes } = await axios.post('http://pay.zannstore.com/v1/', new URLSearchParams({
        merchant: ZANN_MERCHANT,
        trx_id,
        request: 'status',
        signature
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      if (statusRes.data.status !== 'Success')
        return res.json({ status: false, message: 'Belum dibayar' });

      await supabase.from('saldo_topup').update({ status: 'Success' }).eq('trx_id', trx_id);

      res.json({ status: true, message: 'Pembayaran sukses. Saldo akan tersedia dalam 24 jam.' });
    } catch (e) {
      res.status(500).json({ status: false, message: 'Gagal cek status', error: e.message });
    }
  });

  // ✅ Cek Saldo
  app.get('/gateway/ceksaldo', async (req, res) => {
    const { username, apikey } = req.query;
    if (!username || !apikey)
      return res.status(400).json({ status: false, message: 'username dan apikey wajib diisi' });

    if (!(await validateApikey(apikey)))
      return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const now = new Date();
    const { data: topups } = await supabase
      .from('saldo_topup')
      .select('amount, used, created_at')
      .eq('username', username)
      .eq('status', 'Success');

    let saldoTersedia = 0;
    let saldoTertahan = 0;

    for (const topup of topups) {
      const umurJam = (now - new Date(topup.created_at)) / (1000 * 60 * 60);
      const sisa = topup.amount - (topup.used || 0);
      if (sisa <= 0) continue;
      if (umurJam >= 24) saldoTersedia += sisa;
      else saldoTertahan += sisa;
    }

    res.json({
      status: true,
      username,
      saldo_tersedia: saldoTersedia,
      saldo_tertahan: saldoTertahan
    });
  });

  // ✅ History Topup (User)
  app.get('/gateway/history', async (req, res) => {
    const { username, apikey } = req.query;
    if (!username || !apikey)
      return res.status(400).json({ status: false, message: 'username dan apikey wajib diisi' });

    if (!(await validateApikey(apikey)))
      return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const { data } = await supabase
      .from('saldo_topup')
      .select('trx_id, amount, status, used, created_at')
      .eq('username', username)
      .order('created_at', { ascending: false });

    res.json({
      status: true,
      username,
      history: data.map(item => ({
        trx_id: item.trx_id,
        amount: item.amount,
        used: item.used || 0,
        sisa: item.amount - (item.used || 0),
        status: item.status,
        created_at: item.created_at
      }))
    });
  });

  // ✅ Withdraw (24 jam validasi + potong saldo)
  app.get('/gateway/withdraw', async (req, res) => {
    const { username, amount, tujuan, apikey } = req.query;
    if (!username || !amount || !tujuan || !apikey)
      return res.status(400).json({ status: false, message: 'Parameter kosong' });

    if (!(await validateApikey(apikey)))
      return res.status(401).json({ status: false, message: 'Apikey tidak valid' });

    const now = new Date();
    const { data: topups } = await supabase
      .from('saldo_topup')
      .select('id, amount, used, created_at')
      .eq('username', username)
      .eq('status', 'Success');

    let sisa = parseInt(amount);
    const updates = [];

    for (const topup of topups) {
      const umurJam = (now - new Date(topup.created_at)) / (1000 * 60 * 60);
      const available = (topup.amount - (topup.used || 0));
      if (umurJam >= 24 && available > 0) {
        const pakai = Math.min(available, sisa);
        updates.push({ id: topup.id, pakai });
        sisa -= pakai;
        if (sisa <= 0) break;
      }
    }

    if (sisa > 0) return res.status(400).json({ status: false, message: 'Saldo tidak cukup' });

    // Update used saldo
    for (const u of updates) {
      await supabase
        .from('saldo_topup')
        .update({ used: supabase.raw(`used + ${u.pakai}`) })
        .eq('id', u.id);
    }

    const signature = crypto.createHash('sha256').update(ZANN_MERCHANT + PIN).digest('hex');

    try {
      const { data: wdRes } = await axios.post('http://pay.zannstore.com/v1/', new URLSearchParams({
        merchant: ZANN_MERCHANT,
        pin: PIN,
        request: 'withdraw',
        amount,
        tujuan,
        signature
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      if (!wdRes.status)
        return res.status(400).json({ status: false, message: 'Withdraw gagal' });

      await supabase.from('withdraw_log').insert({
        username,
        amount: parseInt(amount),
        tujuan,
        trx_id: wdRes.trx_id
      });

      res.json({ status: true, message: 'Withdraw berhasil', trx_id: wdRes.trx_id });
    } catch (e) {
      res.status(500).json({ status: false, message: 'Withdraw error', error: e.message });
    }
  });

  // ✅ Webhook (optional, jika Zann mendukung notifikasi ke URL kamu)
  app.post('/gateway/webhook', async (req, res) => {
    const { trx_id, status } = req.body;
    if (trx_id && status === 'Success') {
      await supabase.from('saldo_topup').update({ status: 'Success' }).eq('trx_id', trx_id);
    }
    res.json({ status: true });
  });

  // ✅ Admin: semua history
  app.get('/gateway/admin/history', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey) return res.status(400).json({ status: false, message: 'apikey wajib diisi' });
    const auth = await validateApikey(apikey);
    if (!auth) return res.status(403).json({ status: false, message: 'Forbidden' });

    const { data } = await supabase
      .from('saldo_topup')
      .select('*')
      .order('created_at', { ascending: false });

    res.json({ status: true, data });
  });
};
