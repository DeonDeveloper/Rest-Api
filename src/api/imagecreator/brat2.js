const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

// Konstanta
const WIDTH = 512;
const HEIGHT = 512;
const MARGIN = 20;
const WORD_SPACING = 50;
const INITIAL_FONT_SIZE = 80;
const LINE_HEIGHT_MULTIPLIER = 1.3;
const FRAMES = 6;
const FONT_FAMILY = 'Sans-serif';

// Fungsi utama membentuk GIF
async function generateBratGif(text) {
  let fontSize = INITIAL_FONT_SIZE;

  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(500);
  encoder.setQuality(10);

  for (let i = 0; i < FRAMES; i++) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = i % 2 === 0 ? 'black' : '#333';

    const lines = wrapText(ctx, text, fontSize);

    // Kurangi font jika melebihi tinggi
    while (lines.length * fontSize * LINE_HEIGHT_MULTIPLIER > HEIGHT - 2 * MARGIN) {
      fontSize -= 2;
      ctx.font = `${fontSize}px ${FONT_FAMILY}`;
      lines.splice(0, lines.length, ...wrapText(ctx, text, fontSize));
    }

    drawShakyText(ctx, lines, fontSize);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}

// Fungsi membungkus teks ke beberapa baris
function wrapText(ctx, text, fontSize) {
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const spaceCount = currentLine.split(' ').length - 1;
    const lineWidth = ctx.measureText(testLine).width + (spaceCount * WORD_SPACING);

    if (lineWidth < WIDTH - 2 * MARGIN) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

// Fungsi menggambar teks dengan efek "shake"
function drawShakyText(ctx, lines, fontSize) {
  const lineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
  let y = MARGIN;

  for (const line of lines) {
    let x = MARGIN;
    const words = line.split(' ');

    for (const word of words) {
      const offsetX = Math.random() * 2;
      const offsetY = Math.random() * 2;
      ctx.fillText(word, x + offsetX, y + offsetY);
      x += ctx.measureText(word).width + WORD_SPACING;
    }

    y += lineHeight;
  }
}

// Router Express
module.exports = function (app) {
  app.get('/imagecreator/brat-generator', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).send('Parameter `text` wajib diisi.');

    try {
      const buffer = await generateBratGif(text);
      res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error: ${err.message}`);
    }
  });
};
