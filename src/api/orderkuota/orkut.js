const axios = require('axios');
const qs = require('qs');
const { createClient } = require('@supabase/supabase-js');

// ✅ Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGpkbHFxZW94dnNtaGFkb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzU3NDAsImV4cCI6MjA2NzYxMTc0MH0.eH4cOXY1w58xPrcq8IP4AyU5P3RArAZ_SXd023DsIog'
);

const APP_REG_ID = 'di309HvATsaiCppl5eDpoc:APA91bFUcTOH8h2XHdPRz2qQ5Bezn-3_TaycFcJ5pNLGWpmaxheQP9Ri0E56wLHz0_b1vcss55jbRQXZgc9loSfBdNa5nZJZVMlk7GS1JDMGyFUVvpcwXbMDg8tjKGZAurCGR4kDMDRJ';
const APP_VERSION_CODE = '250314';
const APP_VERSION_NAME = '25.03.14';

// ✅ Fungsi login dan OTP
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
    await supabase
      .from('data')
      .upsert({ username, token: data.results.token, updated_at: new Date().toISOString() });

    return {
      status: 'token_ok',
      token: data.results.token
    };
  }

  throw new Error(data?.message || 'Login gagal');
}

// ✅ Fungsi ambil mutasi QRIS
async function getMutasi(username) {
  const { data, error } = await supabase
    .from('data')
    .select('token')
    .eq('username', username)
    .single();

  if (error || !data) throw new Error('Token tidak ditemukan. Silakan login dulu.');

  const token = data.token;

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

// ✅ Route Express
module.exports = function (app) {
  // 🔐 Login / trigger OTP
  app.get('/orderkuotav2/login', async (req, res) => {
    const { username, password, apikey } = req.query;
    if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: 'Apikey tidak valid.' });
    if (!username || !password) return res.status(400).json({ status: false, message: 'Username atau password kosong.' });

    try {
      const result = await loginOrderkuota(username, password);
      if (result.status === 'otp_sent') {
        return res.json({ status: true, otp_sent: true, message: result.message });
      } else if (result.status === 'token_ok') {
        return res.json({ status: true, token: result.token });
      } else {
        return res.status(400).json({ status: false, message: 'Login gagal.' });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  });

  // 🔐 Verifikasi OTP
  app.get('/orderkuotav2/otp', async (req, res) => {
    const { username, otp, apikey } = req.query;
 if (!global.apikey.includes(apikey)) return res.status(401).json({ status: false, message: 'Apikey tidak valid.' });
  if (!username || !otp) return res.status(400).json({ status: false, message: 'Username atau OTP kosong.' });

    try {
      const result = await loginOrderkuota(username, otp);
      if (result.status === 'token_ok') {
        return res.json({ status: true, token: result.token });
      } else {
        return res.status(400).json({ status: false, message: 'OTP salah atau tidak valid.' });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  });

  // 💰 QRIS mutasi
  app.get('/orderkuotav2/mutasi', async (req, res) => {
  const { username, apikey } = req.query;
  if (!username || !apikey) return res.status(400).json({ status: false, message: 'Username atau Apikey kosong.' });
  
  const { data, error } = await supabase
    .from('apikeys')
    .select('token')
    .eq('token', apikey)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Apikey tidak ditemukan di database.' });
  }
    try {
    const result = await getMutasi(username);
    return res.json({ status: true, result });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});


};
