const fetch = require("node-fetch")

module.exports = function (app) {
app.get('/download/spotify', async (req, res) => {
       const { url } = req.query
        try {
            var anu = await fetch('https://spotifydown.app/api/download?link='+url, {headers:{Referer:'https://spotifydown.app/'}})
		   const links = await anu.json();
            res.status(200).json({
                status: true,
                result: links.data.link
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});

app.get('/download/playspotify', async (req, res) => {
       const { q } = req.query
        try {
        
const Spotify = {
	async search(que){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+que, {method: 'POST'})
		return r.json();
	},
	async details(que){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+que, {method: 'POST'})
		return r.json();
	},
	async download(que){
		const r = await fetch('https://spotifydown.app/api/download?link='+que, {headers:{Referer:'https://spotifydown.app/'}})
		return r.json();
	}
}
async function start() {
	const cari = await Spotify.search(q)
	const detail = await Spotify.details(cari.data.tracks[0].link)
	const download = await Spotify.download(detail.data.link)
	return {
	metadata: detail.data, 
	download: download.data
}}
const links = await start()          
            res.status(200).json({
                status: true,
                result: links
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}