const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

module.exports = function(app) {
  app.get('/imagecreator/brat-generator', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).send('Parameter `text` wajib diisi.');

      const width = 512;
      const height = 512;
      const margin = 20;
      const wordSpacing = 50;
      let fontSize = 80;
      const lineHeightMultiplier = 1.3;
      const frames = 6;

      const encoder = new GIFEncoder(width, height);
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(500);
      encoder.setQuality(10);

      for (let i = 0; i < frames; i++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px Sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = i % 2 === 0 ? 'black' : '#333'; // blink

        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        const rebuildLines = () => {
          lines = [];
          currentLine = '';
          for (let word of words) {
            let testLine = currentLine ? `${currentLine} ${word}` : word;
            let lineWidth =
              ctx.measureText(testLine).width +
              (currentLine.split(' ').length - 1) * wordSpacing;
            if (lineWidth < width - 2 * margin) {
              currentLine = testLine;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          if (currentLine) lines.push(currentLine);
        };

        rebuildLines();

        while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
          fontSize -= 2;
          ctx.font = `${fontSize}px Sans-serif`;
          rebuildLines();
        }

        const lineHeight = fontSize * lineHeightMultiplier;
        let y = margin;

        for (let line of lines) {
          const wordsInLine = line.split(' ');
          let x = margin;

          for (let word of wordsInLine) {
            ctx.fillText(word, x + Math.random() * 2, y + Math.random() * 2); // shake effect
            x += ctx.measureText(word).width + wordSpacing;
          }

          y += lineHeight;
        }

        encoder.addFrame(ctx);
      }

      encoder.finish();
      const buffer = encoder.out.getData();

      res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
