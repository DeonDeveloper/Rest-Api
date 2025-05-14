const axios = require('axios');

// Fungsi untuk mengonversi kode negara ke nama lengkap dengan bendera
const mooCountry = (value) => {
  const regionMap = {
    ID: 'Indonesia 🇮🇩',
    US: 'Amerika Serikat 🇺🇸',
    IN: 'India 🇮🇳',
    BR: 'Brazil 🇧🇷',
    // Tambahkan sesuai kebutuhan...
  };
  return regionMap[value] || 'Tidak diketahui';
};

// Fungsi untuk stalk akun Free Fire via kiosgamer.co.id
async function stalkFreeFire(id) {
  try {
    const response = await axios.post('https://kiosgamer.co.id/api/auth/player_id_login', {
      app_id: 100067,
      login_id: id
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?1',
        'Origin': 'https://kiosgamer.co.id',
        'Referer': 'https://kiosgamer.co.id'
      }
    });

    if (response.data && response.data.player) {
      return {
        status: true,
        result: {
          nickname: response.data.player.nickname,
          region: response.data.player.region || 'ID' // fallback ke 'ID' jika kosong
        }
      };
    } else {
      return {
        status: false,
        message: 'Data tidak ditemukan.'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat mengambil data.',
      error: error.message
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

      if (!result.status || !result.result || !result.result.nickname) {
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
