const api = require("@fongsidev/scraper")

module.exports = function (app) {
app.get('/download/gdrive', async (req, res) => {
       const { url } = req.query
        try {          
            const results = await api.Drive(url);
            res.status(200).json({
                status: true,
                result: results.data
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
})
}