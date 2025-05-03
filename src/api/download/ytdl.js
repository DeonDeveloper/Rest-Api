const axios = require('axios')

async function Ytdll(url, type) {
    const headers = {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "Referer": "https://id.ytmp3.mobi/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    const randomKarakter = async (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    const initial = await axios.get(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers })
    const init = initial.data

    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1]

    let mp4_ = init.convertURL+`&v=${id}&f=mp4&_=${Math.random()}`
    let mp3_ = init.convertURL+`&v=${id}&f=mp3&_=${Math.random()}`

    const mp4__ = await axios.get(mp4_, { headers })
    const mp3__ = await axios.get(mp3_, { headers })

    let info = {}
    while (true) {
        let j = await axios.get(mp3__.data.progressURL, { headers })
        info = j.data
        if (info.progress == 3) break
    }

    return {
        title: info.title,
        mp3: mp3__.data.downloadURL, 
        mp4: mp4__.data.downloadURL
    }
}

module.exports = function (app) {
app.get('/download/ytdl', async (req, res) => {
       const { url } = req.query
        try {
            const results = await Ytdll(url);
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}