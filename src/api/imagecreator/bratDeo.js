const { createCanvas, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');
const fs = require('fs');
const ImageUploadService = require('node-upload-images');

// Daftarkan font
registerFont(path.join(__dirname, 'fonts', 'Arial.ttf'), { family: 'Arial' });

module.exports = function (app) {
  app.get('/imagecreator/brat-generator', async (req, res) => {
    const { text = 'Hello World', speed = 'normal', animated = 'false' } = req.query;
    const width = 512;
    const height = 512;

    try {
      if (animated === 'true') {
        // Buat animasi GIF
        const encoder = new GIFEncoder(width, height);
        const tmpPath = path.join(__dirname, `brat-${Date.now()}.gif`);
        const fileStream = fs.createWriteStream(tmpPath);

        encoder.createReadStream().pipe(fileStream);
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

        fileStream.on('finish', async () => {
          try {
            const buffer = fs.readFileSync(tmpPath);
            const service = new ImageUploadService('pixhost.to'); // ganti ke pibrary
            const { directLink } = await service.uploadFromBinary(buffer, `brat-${Date.now()}.gif`);
            fs.unlinkSync(tmpPath);

            res.status(200).json({
              status: true,
              animated: true,
              type: 'gif',
              result: directLink
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({ status: false, message: 'Gagal upload ke Pibrary' });
          }
        });

      } else {
        // Gambar statis PNG
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(text, 30, height / 2);

        const buffer = canvas.toBuffer('image/png');
        const service = new ImageUploadService('pixhost.to'); // ganti ke pibrary
        const { directLink } = await service.uploadFromBinary(buffer, `brat-${Date.now()}.png`);

        res.status(200).json({
          status: true,
          animated: false,
          type: 'png',
          result: directLink
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  });
};
