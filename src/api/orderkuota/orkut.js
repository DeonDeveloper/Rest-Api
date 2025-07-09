const axios = require('axios');
const qs = require('qs');
const admin = require('firebase-admin');
const crypto = require('crypto');
require('dotenv').config();

// 🔐 Inisialisasi Firebase dari ENV BASE64
const base64 = process.env.FIREBASE_CREDENTIAL_BASE64;
if (!base64) throw new Error("FIREBASE_CREDENTIAL_BASE64 belum disetel di .env");

const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://fir-69867-default-rtdb.asia-southeast1.firebasedatabase.app`
});

const db = admin.firestore();
const tokenRef = db.collection('orderkuota_tokens');

// 🔧 Konstanta
const APP_REG_ID = 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ';
const APP_VERSION_CODE = '250314';
const APP_VERSION_NAME = '25.03.14';

// 🔐 Fungsi Login/OTP
async function loginOrderkuota(username, password) {
  const payload = qs.stringify({
    username,
    password,
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
      message: `OTP dikirim ke ${data.results.otp_value}`,
      raw: data
    };
  }

  if (data.success && data.results?.token) {
    await tokenRef.doc(username).set({
      token: data.results.token,
      updatedAt: Date.now()
    });
    return {
      status: 'token_ok',
      token: data.results.token,
      raw: data
    };
  }

  throw new Error(data?.message || 'Login gagal');
}

// 🧾 Ambil Mutasi QRIS
async function getMutasi(username) {
  const doc = await tokenRef.doc(username).get();
  if (!doc.exists) throw new Error("Token tidak ditemukan. Silakan login dan OTP terlebih dahulu.");

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

// 🌐 Express Route
module.exports = function (app) {
  // Login
  app.get('/orderkuotav2/login', async (req, res) => {
    const { username, password, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey tidak valid." });
    if (!username || !password) return res.status(400).json({ status: false, message: "Username atau password kosong." });

    try {
      const result = await loginOrderkuota(username, password);
      if (result.status === 'otp_sent') {
        return res.json({ status: true, otp_sent: true, message: result.message });
      } else if (result.status === 'token_ok') {
        return res.json({ status: true, token: result.token });
      } else {
        return res.status(400).json({ status: false, message: "Login gagal." });
      }
    } catch (e) {
      return res.status(500).json({ status: false, message: e.message });
    }
  });

  // OTP
  app.get('/orderkuotav2/otp', async (req, res) => {
    const { username, otp, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey tidak valid." });
    if (!username || !otp) return res.status(400).json({ status: false, message: "Username atau OTP kosong." });

    try {
      const result = await loginOrderkuota(username, otp);
      if (result.status === 'token_ok') {
        return res.json({ status: true, token: result.token });
      } else {
        return res.status(400).json({ status: false, message: "OTP salah atau tidak valid." });
      }
    } catch (e) {
      return res.status(500).json({ status: false, message: e.message });
    }
  });

  // Mutasi
  app.get('/orderkuotav2/mutasi', async (req, res) => {
    const { username, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(403).json({ status: false, message: "Apikey tidak valid." });

    try {
      const result = await getMutasi(username);
      return res.json({ status: true, result });
    } catch (e) {
      return res.status(500).json({ status: false, message: e.message });
    }
  });
};
