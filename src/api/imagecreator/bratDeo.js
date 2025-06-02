const GIFEncoder = require('gifencoder');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const ImageUploadService = require('node-upload-images');

// Register font (pastikan font ada di folder ./fonts)
registerFont(path.join(__dirname, 'fonts', 'Arial.ttf'), { family: 'Arial' });

module.exports = function app(app) {
  app.get('/imagecreator/brat-generator', async (req, res) => {
    try {
      const text = req.query.text || 'Hello World!';
      const speed = req.query.speed || 'medium';
      const animated = req.query.animated === 'true';

      const width = 512;
      const height = 512;

      if (animated) {
        const encoder = new GIFEncoder(width, height);
        const tmpPath = path.join(__dirname, `brat-${Date.now()}.gif`);
        const stream = encoder.createWriteStream();
        stream.pipe(fs.createWriteStream(tmpPath));

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(speed === 'fast' ? 40 : speed === 'slow' ? 120 : 80);
        encoder.setQuality(10);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const frameCount = 30;
        for (let i = 0; i < frameCount; i++) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 40px Arial';

          const textX = 30 + Math.sin(i * 0.3) * 20;
          const textY = height / 2 + Math.cos(i * 0.3) * 20;

          ctx.fillText(text, textX, textY);
          encoder.addFrame(ctx);
        }

        encoder.finish();

        stream.on('finish', async () => {
          try {
            const gifBuffer = fs.readFileSync(tmpPath);
            fs.unlinkSync(tmpPath); // hapus file lokal

            res.writeHead(200, {
              'Content-Type': 'image/gif',
              'Content-Length': gifBuffer.length,
            });
            res.end(gifBuffer);
          } catch (err) {
            console.error('Gagal baca GIF:', err);
            res.status(500).send('Gagal memproses GIF.');
          }
        });

      } else {
        // Gambar PNG statis
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(text, 30, height / 2);

        const buffer = canvas.toBuffer('image/png');

        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': buffer.length,
        });
        res.end(buffer);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
