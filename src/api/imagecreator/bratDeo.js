const express = require('express');
const GIFEncoder = require('gifencoder');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const ImageUploadService = require('node-upload-images');

const app = express();
const port = 3000;

// Register font (ganti dengan font favorit kamu, pastikan fontnya tersedia di folder fonts)
registerFont(path.join(__dirname, 'fonts', 'Arial.ttf'), { family: 'Arial' });

app.get('/imagecreator/brat/generator', async (req, res) => {
  const { q, speed, animated} = req.query

 /* const apikey = req.query.apikey;

  // Validasi API key
  if (!apikey || apikey !== 'wyq3Zrsd53') {
    return res.status(403).json({ status: 'error', message: 'Invalid API Key' });
  }
*/
  const width = 512;
  const height = 512;

  if (animated) {
    // Buat GIF bergerak
    const encoder = new GIFEncoder(width, height);
    const tmpPath = path.join(__dirname, `brat-${Date.now()}.gif`);
    const stream = encoder.createWriteStream();
    stream.pipe(fs.createWriteStream(tmpPath));

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(speed === 'fast' ? 40 : speed === 'slow' ? 120 : speed === 'medium' ? 80);
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

      ctx.fillText(q, textX, textY);
      encoder.addFrame(ctx);
    }

    encoder.finish();

    stream.on('finish', async () => {
      try {
        const gifBuffer = fs.readFileSync(tmpPath);

        const service = new ImageUploadService('pixhost.to');
        const { directLink } = await service.uploadFromBinary(gifBuffer, `brat-${Date.now()}.gif`);

        fs.unlinkSync(tmpPath);

        res.json({
          status: 'Success',
          code: 200,
          powered: 'Custom API via PixHost',
          result: {
            url: directLink,
            size: `${(gifBuffer.length / 1024).toFixed(2)} KB`,
            expired: '30 Menit (berdasarkan host)',
            type: 'gif',
            animated: true,
            speed: speed
          }
        });
      } catch (err) {
        console.error('Upload ke PixHost gagal:', err);
        res.status(500).json({ status: 'Error', message: 'Gagal upload ke PixHost' });
      }
    });

  } else {
    // Buat gambar statis (PNG)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(q, 30, height / 2);

    const buffer = canvas.toBuffer('image/png');

    try {
      const service = new ImageUploadService('pixhost.to');
      const { directLink } = await service.uploadFromBinary(buffer, `brat-${Date.now()}.png`);

      res.json({
        status: 'Success',
        code: 200,
        powered: 'Custom API via PixHost',
        result: {
          url: directLink,
          size: `${(buffer.length / 1024).toFixed(2)} KB`,
          expired: '30 Menit (berdasarkan host)',
          type: 'png',
          animated: false,
          speed: speed
        }
      });
    } catch (err) {
      console.error('Upload ke PixHost gagal:', err);
      res.status(500).json({ status: 'Error', message: 'Gagal upload ke PixHost' });
    }
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
