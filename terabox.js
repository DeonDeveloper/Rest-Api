const axios = require('axios')

function extractId(url) {
  const match = url.match(/(?:\/s\/|surl=)([\w-]+)/);
  return match ? match[1] : null;
}

async function terabox(url) {
  const id = extractId(url);
  if (!id) {
    throw new Error("ID tidak valid atau tidak ditemukan dalam URL.");
  }

  let config = {
    method: 'GET',
    url: `https://api.sylica.eu.org/terabox/?id=${id}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
      'accept-language': 'id-ID',
      'referer': 'https://www.kauruka.com/',
      'origin': 'https://www.kauruka.com',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'priority': 'u=0',
      'te': 'trailers'
    }
  };

  try {
    const api = await axios.request(config);

    if (api.data?.data?.message) {
      delete api.data.data.message;
    }

    return { download: `https://api.sylica.eu.org/terabox/v2/?s=${id}` };
  } catch (error) {
    throw new Error(`Gagal mengambil data: ${error.message}`);
  }
}

module.exports = function (app) {
app.get('/download/terabox', async (req, res) => {
       const { url } = req.query
        try {
            const results = await terabox(url);
            res.status(200).json({
                status: true,
                result: results.download
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}