const fetch = require('node-fetch');

// Fungsi untuk mengonversi kode negara ke nama lengkap dengan bendera
const mooCountry = (value) => {
  const regionMap = {
    AF: 'Afganistan 🇦🇫',
    AX: 'Kepulauan Aland 🇦🇽',
    AL: 'Albania 🇦🇱',
    // Daftar negara lainnya...
    ID: 'Indonesia 🇮🇩',
    MY: 'Malaysia 🇲🇾',
    SG: 'Singapura 🇸🇬',
    // Daftar negara lainnya...
  };

  // Mengembalikan nama region dengan bendera jika ditemukan, atau 'Tidak diketahui' jika tidak
  return regionMap[value] || 'Tidak diketahui';
};

// Fungsi untuk validasi akun MLBB via GoPay
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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

      // Mendapatkan data username dan negara dari response
      const data = result?.result?.data || {};
      const username = data.username || 'Tidak ditemukan';
      const countryCode = (data.countryOrigin || '').toUpperCase();
      const countryName = mooCountry(countryCode);  // Menambahkan bendera negara

      return res.status(200).json({
        status: true,
        username,
        country: countryName
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
