module.exports = function(app) {
app.get('/tools/ocr', async (req, res) => {
       const { url } = req.query
        try {
const { ocrSpace } = require('ocr-space-api-wrapper');
const anuin = await ocrSpace(url)
      const anu = anuin.ParsedResults[0].ParsedText
            res.status(200).json({
                status: true,
                result: anu.toString()
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}