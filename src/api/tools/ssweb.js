module.exports = function(app) {
app.get('/tools/ssweb', async (req, res) => {
       const { url } = req.query
        try {
            let anu = await fetchJson(`https://api.pikwy.com/?tkn=125&d=3000&u=${url}&fs=0&w=1280&h=1200&s=100&z=100&f=$jpg&rt=jweb`)
            res.status(200).json({
                status: true,
                result: anu
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}