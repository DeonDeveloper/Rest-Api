module.exports = function app (app) {
app.get('/imagecreator/brat', async (req, res) => {
        try {
            const { text } = req.query
            const pedo = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${text}`)
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}