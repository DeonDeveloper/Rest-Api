const axios = require('axios');

module.exports = function(app) {
  app.get('/stalk/mlbb2', async (req, res) => {
    const { userId, zoneId } = req.query;

    if (!userId || !zoneId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter userId dan zoneId harus diisi.'
      });
    }

    const params = {
      api_req: 'deoberon',
      user_id: userId,
      zone_id: zoneId
    };

    try {
      const response = await axios.get('https://cekid.zannstore.com/v2/first-topup', { params });
      const data = response.data;

      if (data.status !== 'success') {
        return res.status(404).json({
          status: false,
          message: data.message || 'Akun tidak ditemukan'
        });
      }

      const result = {
        status: true,
        nickname: data.nickname,
        zone: data.zone,
        country: data.country,
        topup_history: data.first_topup || []
      };

      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
