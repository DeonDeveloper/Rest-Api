const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// ✅ Inisialisasi Supabase
const supabase = createClient(
  'https://yohjdlqqeoxvsmhadoqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGpkbHFxZW94dnNtaGFkb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzU3NDAsImV4cCI6MjA2NzYxMTc0MH0.eH4cOXY1w58xPrcq8IP4AyU5P3RArAZ_SXd023DsIog'
);

module.exports = function (app) {
  app.get('/stalk/supersus', async (req, res) => {
    try {
      const { apikey, id } = req.query;
      if (!id) return res.status(400).json({ error: 'Parameter "id" wajib diisi' });
      const now = new Date().toISOString();  
  const { data, error } = await supabase
    .from('apikeys')
    .select('token')
    .eq('token', apikey)
    .gt('expired_at', now)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Apikey tidak ditemukan atau sudah expired' });
  }
      const url = `https://api.vocagame.com/v1/order/prepare/SUPER_SUS?userId=${id}&zoneId=undefined`;
      const response = await fetch(url);
      const dataa = await response.json();

      if (dataa.message === 'Success') {
        res.json({ status: true, id, nickname: dataa.data });
      } else {
        res.status(404).json({ error: 'Username tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  });

  app.get('/stalk/hok', async (req, res) => {
    try {
      const { apikey, id } = req.query;
      if (!id) return res.status(400).json({ error: 'Parameter "id" wajib diisi' });
      const now = new Date().toISOString();  
  const { data, error } = await supabase
    .from('apikeys')
    .select('token')
    .eq('token', apikey)
    .gt('expired_at', now)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Apikey tidak ditemukan atau sudah expired' });
  }
      const url = `https://api.vocagame.com/v1/order/prepare/HOK?userId=${id}&zoneId=undefined`;
      const response = await fetch(url);
      const dataa = await response.json();

      if (dataa.message === 'Success') {
        res.json({ status: true, id, nickname: dataa.data });
      } else {
        res.status(404).json({ error: 'Username tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  });

  app.get('/stalk/pubg', async (req, res) => {
    try {
      const { apikey, id } = req.query;
      if (!id) return res.status(400).json({ error: 'Parameter "id" wajib diisi' });
      const now = new Date().toISOString();  
  const { data, error } = await supabase
    .from('apikeys')
    .select('token')
    .eq('token', apikey)
    .gt('expired_at', now)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: false, message: 'Apikey tidak ditemukan atau sudah expired' });
  }
      
      const url = `https://api.vocagame.com/v1/order/prepare/PUBGM?userId=${id}&zoneId=undefined`;
      const response = await fetch(url);
      const dataa = await response.json();

      if (dataa.message === 'Success') {
        res.json({ status: true, id, nickname: dataa.data });
      } else {
        res.status(404).json({ error: 'Username tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
