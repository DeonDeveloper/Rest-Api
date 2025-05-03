const fetch = require('node-fetch');

async function validateMobileLegendsGopay(userId, zoneId) {
  const url = 'https://gopay.co.id/games/v1/order/user-account';
  const payload = {
    code: 'MOBILE_LEGENDS',
    data: {
      userId,
      zoneId
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: false,
      message: 'Terjadi kesalahan saat validasi.',
      error: error.message
    };
  }
}

module.exports = function(app) {
  app.get('/check/mlbb', async (req, res) => {
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
