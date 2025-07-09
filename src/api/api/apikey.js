
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'YOUR_SUPABASE_SERVICE_ROLE_KEY' // Ganti dengan Service Role Key dari Supabase
);

// 🔐 Tambah Apikey (valid 30 hari)
module.exports = function (app) {
app.get('/apikey/add', async (req, res) => {
  const { nomor_wa, apikey } = req.query;

  if (!nomor_wa || !apikey)
    return res.status(400).json({ status: false, message: 'nomor_wa dan apikey wajib diisi' });

  const expired_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('apikeys')
    .upsert({ nomor_wa, apikey, expired_at });

  if (error) {
    return res.status(500).json({ status: false, message: 'Gagal menyimpan apikey' });
  }

  return res.json({ status: true, message: 'Apikey berhasil ditambahkan', apikey, expired_at });
});

// 🔄 Perpanjang Apikey (tambah 30 hari dari expired saat ini)
app.get('/apikey/perpanjang', async (req, res) => {
  const { apikey } = req.query;

  if (!apikey)
    return res.status(400).json({ status: false, message: 'apikey wajib diisi' });

  const { data, error } = await supabase
    .from('apikeys')
    .select('expired_at')
    .eq('apikey', apikey)
    .single();

  if (error || !data)
    return res.status(404).json({ status: false, message: 'Apikey tidak ditemukan' });

  const now = new Date();
  const expiredAt = new Date(data.expired_at);
  const base = now > expiredAt ? now : expiredAt;
  const newExpired = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error: updateError } = await supabase
    .from('apikeys')
    .update({ expired_at: newExpired })
    .eq('apikey', apikey);

  if (updateError)
    return res.status(500).json({ status: false, message: 'Gagal memperpanjang apikey' });

  return res.json({ status: true, message: 'Apikey diperpanjang', expired_at: newExpired });
});

// 🔎 Cek Validitas Apikey
app.get('/apikey/cek', async (req, res) => {
  const { apikey } = req.query;

  if (!apikey)
    return res.status(400).json({ status: false, message: 'apikey wajib diisi' });

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('apikeys')
    .select('*')
    .eq('apikey', apikey)
    .gt('expired_at', now)
    .maybeSingle();

  if (error || !data)
    return res.status(403).json({ status: false, message: 'Apikey tidak valid atau sudah expired' });

  return res.json({ status: true, message: 'Apikey masih aktif', expired_at: data.expired_at });
});
};
