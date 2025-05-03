const axios = require('axios');

async function validateMobileLegends(userId, zoneId) {
  const params = { userId, zoneId };
  try {
    const response = await axios.get('https://cekid.zannstore.com/v2/first-topup', { params });
    const data = response.data;

    if (data.status === 'success') {
      const nickname = data.nickname;
      const zone = data.zone;
      const country = data.country;
      const countryFlag = data.country_flag;
      let topupInfo = '';
      data.first_topup.forEach((topup, index) => {
        topupInfo += `> *Denom:* ${topup.denom} - *Status:* ${topup.status}\n`;
      });

      return {
        status: true,
        nickname,
        zone,
        country,
        countryFlag,
        topupInfo
      };
    } else {
      return {
        status: false,
        message: 'Topup pertama tidak tersedia.'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat validasi.',
      error: error.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/mlbbdb', async (req, res) => {
    const { userId, zoneId } = req.query;

    if (!userId || !zoneId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter userId dan zoneId harus diisi.'
      });
    }

    try {
      const result = await validateMobileLegends(userId, zoneId);
      res.status(200).json({
        status: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
