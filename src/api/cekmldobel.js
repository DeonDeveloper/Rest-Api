const axios = require('axios');

async function validateMobileLegendsGopay(userId, zoneId) {
  const params = {
    api_req: 'deoberon'
    user_id: userId, 
    zone_id: zoneId 
  };

  try {
    console.log('Memeriksa akun ML dengan data:', params);
    const response = await axios.get('https://cekid.zannstore.com/v2/first-topup', { params });
    const data = response.data;

    if (data.status === 'success') {
      const { nickname, zone, country, country_flag, first_topup } = data;
      let topupInfo = '';

      if (Array.isArray(first_topup)) {
        first_topup.forEach((topup) => {
          topupInfo += `> *Denom:* ${topup.denom} - *Status:* ${topup.status}\n`;
        });
      }

      return {
        status: true,
        nickname,
        zone,
        country,
        countryFlag: country_flag,
        topupInfo
      };
    } else {
      return {
        status: false,
        message: `Gagal mendapatkan data Mobile Legends! ${data.msg || 'Tidak diketahui'}`
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat validasi.',
      error: error.response?.data || error.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/mlbbdouble', async (req, res) => {
    const { userId, zoneId } = req.query;

    if (!userId || !zoneId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter userId dan zoneId harus diisi.'
      });
    }

    try {
      const result = await validateMobileLegendsGopay(userId, zoneId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
