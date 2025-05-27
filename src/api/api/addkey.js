// src/routes/addkey
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(process.cwd(), 'src/settings.json');

module.exports = function (app) {
  app.post('/api/addkey', async (req, res) => {
    const { newKey } = req.body;

    if (!newKey || typeof newKey !== 'string') {
      return res.status(400).json({ status: false, message: 'Parameter newKey tidak valid' });
    }

    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

      if (settings.apiSettings.apikey.includes(newKey)) {
        return res.status(409).json({ status: false, message: 'API key sudah terdaftar' });
      }

      settings.apiSettings.apikey.push(newKey);
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

      return res.status(200).json({
        status: true,
        message: 'API key berhasil ditambahkan',
        apikeys: settings.apiSettings.apikey
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Gagal menulis ke settings.json', error: error.message });
    }
  });
};
