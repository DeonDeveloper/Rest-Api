const axios = require('axios');

async function validateFreeFireVocagame(gameId) {
  const url = `https://api.vocagame.com/v1/order/prepare/FREEFIRE/${gameId}`; // misalnya menggunakan gameId dalam URL langsung

  try {
    console.log('Memeriksa akun Free Fire dengan ID:', gameId);
    const response = await axios.get(url);  // Tidak perlu params jika URL langsung mengandung gameId
    const data = response.data;

    if (data.message === 'Success') {
      return {
        status: true,
        nickname: data.data
      };
    } else {
      return {
        status: false,
        message: 'Username tidak ditemukan'
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat menghubungi server',
      error: error.message
    };
  }
}

module.exports = function(app) {
  app.get('/stalk/freefire', async (req, res) => {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter gameId harus diisi.'
      });
    }

    try {
      const result = await validateFreeFireVocagame(gameId);

      if (result.status) {
        return res.status(200).json({
          status: true,
          gameId,
          nickname: result.nickname
        });
      } else {
        return res.status(404).json({
          status: false,
          message: result.message
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
};
