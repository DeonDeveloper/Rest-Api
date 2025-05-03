var gis = require('async-g-i-s');

module.exports = function (app) {
app.get('/search/gimage', async (req, res) => {
       const { q } = req.query
        try {
            const results = await gis(q);  
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}