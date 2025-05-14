const fetch = require('node-fetch');

// Fungsi untuk mengonversi kode negara ke nama lengkap dengan bendera
const mooCountry = (value) => {
  const regionMap = {
    ID: 'Indonesia 🇮🇩',
    BR: 'Brazil 🇧🇷',
    VN: 'Vietnam 🇻🇳',
    TH: 'Thailand 🇹🇭',
    IN: 'India 🇮🇳',
    PK: 'Pakistan 🇵🇰',
    BD: 'Bangladesh 🇧🇩',
    PH: 'Filipina 🇵🇭',
    US: 'Amerika Serikat 🇺🇸',
    // Tambahkan kode negara lain yang relevan jika perlu...
  };

  return regionMap[value] || 'Tidak diketahui';
};

// Fungsi untuk stalk akun Free Fire via API SimpleBot
async function stalkFreeFire(id) {
  const url = `https://api-simplebot.vercel.app/stalk/ff?apikey=free&id=${encodeURIComponent(id)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat mengambil data.',
      error: error.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/ff', async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: 'Parameter id harus diisi.'
      });
    }

    try {
      const result = await stalkFreeFire(id);

      if (!result || !result.result || !result.result.nickname) {
        return res.status(404).json({
          status: false,
          message: 'Data tidak ditemukan. Pastikan ID Free Fire yang dimasukkan benar.'
        });
      }

      const data = result.result;
      const nickname = data.nickname || 'Tidak ditemukan';
      const regionCode = (data.region || '').toUpperCase();
      const regionFull = mooCountry(regionCode);
      const flagEmoji = regionFull.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';

      return res.status(200).json({
        status: true,
        nickname,
        region: regionFull,
        region_flag: flagEmoji
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
