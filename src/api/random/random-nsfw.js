module.exports = function(app) {
    async function anim() {
        try {
            let type = ["blowjob", "neko", "trap", "waifu"]
            let rn = type[Math.floor(Math.random() * type.length)]
            const data = await fetchJson(`https://api.waifu.pics/nsfw/${rn}`)
            const response = await getBuffer(data.url)
            return response
        } catch (error) {
            throw error;
        }
    }
    app.get('/random/nsfw', async (req, res) => {
        try {
            const pedo = await anim();
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
