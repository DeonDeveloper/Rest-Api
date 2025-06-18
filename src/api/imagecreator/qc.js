const axios = require('axios');
const { Buffer } = require('buffer');

module.exports = function app(app) {
  app.get('/imagecreator/qc', async (req, res) => {
    try {
      const { text, name, avatar } = req.query;

      if (!text) {
        return res.status(400).json({ error: 'Parameter "text" wajib diisi' });
      }

      const obj = {
        type: 'quote',
        format: 'png',
        backgroundColor: '#ffffff',
        width: 512,
        height: 768,
        scale: 2,
        messages: [
          {
            entities: [],
            avatar: true,
            from: {
              id: 1,
              name: name || 'Anonymous',
              photo: {
                url: avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60',
              }
            },
            text: text,
            replyMessage: {}
          }
        ]
      };

      const response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const buffer = Buffer.from(response.data.result.image, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      });

      res.end(buffer);

    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
};
