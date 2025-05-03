const { ytdlv2, ytmp3, ytmp4 } = require('@vreden/youtube_scraper') 

module.exports = function (app) {
app.get('/download/ytdl-v2', async (req, res) => {
       const { url } = req.query
        try {
            const anu = await ytdlv2(url);
            res.status(200).json({
                status: true,
                result: {
                metadata: anu.details, 
                download: anu.downloads
                }
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}