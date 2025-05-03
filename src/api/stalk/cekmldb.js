const axios = require('axios');

async function validateMobileLegendsGopay(userId, zoneId) {
  const params = { 
    api_req: 'deoberon', 
    user_id: userId, 
    zone_id: zoneId 
  };

  try {
    console.log('Memeriksa akaun ML dengan data:', params);
    const response = await axios.get('https://cekid.zannstore.com/v2/first-topup', { params });
    const data = response.data;

    if (data.status === 'success') {
      const nickname = data.nickname;
      const zone = data.zone;
      const country = data.country;
      const countryFlag = data.country_flag;
      let topupInfo = '';
      
      data.first_topup.forEach((topup) => {
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
        message: `Gagal mendapatkan data Mobile Legends Region! ${data.msg}`
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
      const result = await validateMobileLegendsGopay(userId, zoneId);
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
