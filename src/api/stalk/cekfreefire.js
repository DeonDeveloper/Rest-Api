const axios = require('axios');

// Fungsi untuk mengambil data dari URL
async function fetchGameData(url, gameId, serverId = null) {
  let fullUrl = serverId 
    ? `${url}?userId=${gameId}&zoneId=${serverId}` 
    : `${url}?userId=${gameId}&zoneId=undefined`;

  try {
    const response = await axios.get(fullUrl);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching game data:", error.message);
    return { status: false, message: error.message };
  }
}

// Fungsi untuk memvalidasi Free Fire
async function validateFreeFireVocagame(gameId) {
  const url = 'https://api.vocagame.com/v1/order/prepare/FREEFIRE';
  return await fetchGameData(url, gameId);
}

// Express.js route untuk memeriksa Free Fire
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

      if (result.status && result.message === 'Success') {
        return res.status(200).json({
          status: true,
          gameId,
          nickname: result.data
        });
      } else {
        return res.status(404).json({
          status: false,
          message: result.message || 'Username tidak ditemukan'
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
