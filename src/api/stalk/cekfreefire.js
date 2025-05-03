const axios = require('axios');

// Fungsi untuk stalk akun Free Fire dari DuniaGames
async function stalkff(id) {
  return new Promise(async (resolve) => {
    try {
      const response = await axios.post(
        'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
        new URLSearchParams({
          productId: '3',
          itemId: '353',
          catalogId: '376',
          paymentId: '1252',
          gameId: id,
          product_ref: 'CMS',
          product_ref_denom: 'REG',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: 'https://www.duniagames.co.id/',
            Accept: 'application/json',
          },
        }
      );

      resolve({
        status: 200,
        id,
        nickname: response.data.data.gameDetail.userName,
      });
    } catch (err) {
      resolve({
        status: 404,
        msg: 'User ID tidak ditemukan atau request gagal',
      });
    }
  });
}

// Route Express untuk /check/freefire
module.exports = function(app) {
  app.get('/stalk/freefire', async (req, res) => {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter gameId harus diisi.',
      });
    }

    try {
      const result = await stalkff(gameId);

      if (result.status === 200) {
        return res.status(200).json({
          status: true,
          gameId: result.id,
          nickname: result.nickname,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: result.msg,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
};
