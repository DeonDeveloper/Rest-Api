// orderkuota-firebase.js
const axios = require('axios');
const qs = require('qs');
const admin = require('firebase-admin');
const fs = require('fs');

// 🔐 Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
  databaseURL: 'https://fir-69867-default-rtdb.asia-southeast1.firebasedatabase.app' // Ganti dengan Firebase Project URL kamu
});

const db = admin.firestore();
const tokenRef = db.collection('orderkuota_tokens');

const APP_REG_ID = 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ';
const APP_VERSION_CODE = '250314';
const APP_VERSION_NAME = '25.03.14';

// Fungsi login (bisa pakai password atau OTP)
async function loginOrderkuota(username, passwordOrOtp) {
  const payload = qs.stringify({
    username,
    password: passwordOrOtp,
    app_reg_id: APP_REG_ID,
    app_version_code: APP_VERSION_CODE,
    app_version_name: APP_VERSION_NAME
  });

  const res = await axios.post('https://app.orderkuota.com/api/v2/login', payload, {
    headers: {
      'Host': 'app.orderkuota.com',
      'User-Agent': 'okhttp/4.10.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const data = res.data;

  if (data.success && data.results?.otp === 'email') {
    return {
      status: 'otp_sent',
      message: `OTP dikirim ke ${data.results.otp_value}`
    };
  }

  if (data.success && data.results?.token) {
    await tokenRef.doc(username).set({ token: data.results.token, updatedAt: Date.now() });
    return {
      status: 'token_ok',
      token: data.results.token
    };
  }

  throw new Error(data?.message || 'Login gagal');
}

// Ambil mutasi QRIS
async function getMutasi(username) {
  const doc = await tokenRef.doc(username).get();
  if (!doc.exists) throw new Error("Token tidak ditemukan, login dulu.");

  const token = doc.data().token;

  const payload = qs.stringify({
    auth_token: token,
    auth_username: username,
    'requests[qris_history][jumlah]': '',
    'requests[qris_history][jenis]': '',
    'requests[qris_history][page]': 1,
    'requests[qris_history][dari_tanggal]': '',
    'requests[qris_history][ke_tanggal]': '',
    'requests[qris_history][keterangan]': '',
    'requests[0]': 'account',
    app_version_name: APP_VERSION_NAME,
    app_version_code: APP_VERSION_CODE,
    app_reg_id: APP_REG_ID
  });

  const res = await axios.post('https://app.orderkuota.com/api/v2/get', payload, {
    headers: {
      'Host': 'app.orderkuota.com',
      'User-Agent': 'okhttp/4.10.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return res.data;
}

// Route Express
module.exports = function (app) {
  app.get('/orderkuotav2/login', async (req, res) => {
    const { username, password, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey salah." });

    try {
      const result = await loginOrderkuota(username, password);
      res.json({ status: true, ...result });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  });

  app.get('/orderkuotav2/otp', async (req, res) => {
    const { username, otp, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey salah." });

    try {
      const result = await loginOrderkuota(username, otp);
      res.json({ status: true, ...result });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  });

  app.get('/orderkuotav2/mutasi', async (req, res) => {
    const { username, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey salah." });

    try {
      const result = await getMutasi(username);
      res.json({ status: true, result });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  });
};
