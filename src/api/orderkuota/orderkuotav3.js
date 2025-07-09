// pages/api/orderkuota.js
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');

let tokenCache = {}; // cache token OTP

function generateTransactionId() {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
}

function generateExpirationTime() {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 30);
  return expirationTime;
}

// Login atau OTP ke OrderKuota (pakai endpoint /login)
async function loginOrderkuota(username, password) {
  const payload = qs.stringify({
    username,
    password,
    app_reg_id: 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ',
    app_version_code: '250314',
    app_version_name: '25.03.14'
  });

  const res = await axios.post('https://app.orderkuota.com/api/v2/login', payload, {
    headers: {
      'Host': 'app.orderkuota.com',
      'User-Agent': 'okhttp/4.10.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return res.data;
}

// Ambil mutasi QRIS
async function getMutasi(username, token) {
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
    app_version_name: '25.03.14',
    app_version_code: '250314',
    app_reg_id: 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ'
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

// Handler Next.js API, mirip struktur app.get
export default async function handler(req, res) {
  const { method, query, url } = req;
  const { username, password, otp, apikey } = query;

    if (method !== 'GET') return res.status(405).json({ status: false, message: 'Metode tidak diizinkan.' });

  try {
    if (url.includes('/login')) {
      if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: "Apikey tidak valid." });

      if (!username || !password) return res.status(400).json({ status: false, message: 'Username/password kosong' });
      const result = await loginOrderkuota(username, password);
      return res.json({ status: true, result });
    }

    if (url.includes('/otp')) {
      if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: "Apikey tidak valid." });

      if (!username || !otp) return res.status(400).json({ status: false, message: 'Username/OTP kosong' });
      const result = await loginOrderkuota(username, otp); // OTP via login juga
      if (result?.results?.token) tokenCache[username] = result.results.token;
      return res.json({ status: true, result });
    }

    if (url.includes('/mutasi')) {
      if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: "Apikey tidak valid." });

      const token = tokenCache[username];
      if (!token) return res.status(401).json({ status: false, message: 'Token tidak ditemukan. Silakan login dan OTP dulu.' });
      const result = await getMutasi(username, token);
      return res.json({ status: true, result });
    }

    return res.status(404).json({ status: false, message: 'Endpoint tidak ditemukan.' });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}
