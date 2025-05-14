const axios = require('axios');

// Fungsi untuk mengonversi kode negara ke nama lengkap dengan bendera
const mooCountry = (value) => {
  const regionMap = {
    ID: 'Indonesia 🇮🇩',
    SG: 'Singapura 🇸🇬',
    MY: 'Malaysia 🇲🇾',
    VN: 'Vietnam 🇻🇳',
    TH: 'Thailand 🇹🇭',
    PH: 'Filipina 🇵🇭',
    IN: 'India 🇮🇳',
    BR: 'Brazil 🇧🇷',
    US: 'Amerika Serikat 🇺🇸'
    // Tambahkan lainnya sesuai kebutuhan (jangan terlalu besar jika tidak perlu)
  };
  return regionMap[value] || 'Tidak diketahui';
};

// Fungsi untuk stalk akun Free Fire via kiosgamer
async function stalkFreeFire(id) {
  const url = 'https://kiosgamer.co.id/api/auth/player_id_login';

  const data = {
    app_id: 100067,
    login_id: id
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'https://kiosgamer.co.id/'
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    return {
      status: false,
      message: 'Gagal menghubungi kiosgamer.co.id',
      error: error.response?.data || error.message
    };
  }
}

module.exports = function (app) {
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

      if (!result || !result.data || !result.data.user_name) {
        return res.status(404).json({
          status: false,
          message: 'Data tidak ditemukan. Pastikan ID Free Fire benar.',
          detail: result.message || undefined
        });
      }

      const nickname = result.data.user_name;
      const regionCode = (result.data.area || '').toUpperCase();
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
        message: 'Terjadi kesalahan pada server.',
        error: error.message
      });
    }
  });
};
