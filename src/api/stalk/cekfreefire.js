const axios = require('axios');

// Fungsi untuk konversi kode negara ke nama + bendera
const mooCountry = (value) => {
  const regionMap = {
    ID: 'Indonesia 🇮🇩',
    US: 'Amerika Serikat 🇺🇸',
    BR: 'Brazil 🇧🇷',
    // Tambahkan sesuai kebutuhan...
  };
  return regionMap[value] || 'Tidak diketahui';
};

// Fungsi scraping Free Fire dari kiosgamer
async function stalkFreeFire(id) {
  const data = {
    app_id: 100067,
    login_id: id
  };

  const config = {
    method: 'POST',
    url: 'https://kiosgamer.co.id/api/auth/player_id_login',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?1',
      'Origin': 'https://kiosgamer.co.id',
      'Referer': 'https://kiosgamer.co.id/'
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config);
    if (
      response.data &&
      response.data.data &&
      response.data.data.user &&
      response.data.data.user.username
    ) {
      return {
        status: true,
        nickname: response.data.data.user.username,
        region: (response.data.data.user.region || 'ID').toUpperCase()
      };
    } else {
      return {
        status: false,
        message: 'ID tidak ditemukan atau tidak valid.'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Gagal mengambil data dari kiosgamer.',
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

      if (!result.status) {
        return res.status(404).json({
          status: false,
          message: result.message || 'Data tidak ditemukan.'
        });
      }

      const regionName = mooCountry(result.region);
      const regionFlag = regionName.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';

      return res.status(200).json({
        status: true,
        nickname: result.nickname,
        region: regionName,
        region_flag: regionFlag
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan server.',
        error: error.message
      });
    }
  });
};
