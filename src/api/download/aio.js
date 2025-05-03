const axios = require('axios');
const cheerio = require('cheerio');
 
async function aioRetatube(url) {
    try {
        const header = () => ({
              'Content-Type': 'application/x-www-form-urlencoded',
              'authority': 'retatube.com',
              'accept': '*/*',
              'accept-language': 'id-ID,id;q=0.9',
              'hx-current-url': 'https://retatube.com/',
              'hx-request': 'true',
              'hx-target': 'aio-parse-result',
              'hx-trigger': 'search-btn',
              'origin': 'https://retatube.com',
              'referer': 'https://retatube.com/',
              'user-agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    });
    
        const respons = await axios.get('https://retatube.com/api/v1/aio/index?s=retatube.com', {
         headers: header()
});
        const $ = cheerio.load(respons.data);
        const prefix = $('input[name="prefix"]').val();
        if (!prefix) {
              throw 'gagal mendapatkan token'
        }
        const token = await prefix || 'ctmsVx0cYcXR1YmUuY29tMTc0MDI1MzYxOAO0O0OO0O0O';
 
        const response = await axios.post('https://retatube.com/api/v1/aio/search', `prefix=${encodeURIComponent(token)}&vid=${encodeURIComponent(url)}`, {
            headers: header()
        });
        const $$ = cheerio.load(response.data);
        
        const title = $$('#text-786685718 p').eq(0).text().replace('Title：', '').trim();
        const owner = $$('#text-786685718 p').eq(1).text().replace('Owner：', '').trim();
        const thumbnail = $$('.icon-inner img').attr('src');
        const hdUrl = $$('#col-1098044499 a').eq(0).attr('href');
        const sdUrl = $$('#col-1098044499 a').eq(1).attr('href');
        const wmUrl = $$('#col-1098044499 a').eq(2).attr('href');
        const audioUrl = $$('#col-1098044499 a.custom_green_color').attr('href');

        if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w\-]{11})(?:\?[\S]*)?$/i.test(url)) {
            var results = {
                title: title || null,
                thumb: thumbnail || null
            };
         } else if (/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/i.test(url)) {
            var results = {
                title: title || null,
                owner: owner || null,
                thumb: thumbnail || null,
                video: hdUrl || null
            };
         } else if (/^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|v\.|t\.)?(?:(tiktok|douyin)\.com\/)(?:\S+)?$/i.test(url)) {
            var results = {
                title: title || null,
                owner: owner || null,
                thumb: thumbnail || null,
                video: hdUrl || null,
                audio: audioUrl || null
            };
         } else if (/^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/i.test(url)) {
            var results = {
                title: title || null,
                thumb: thumbnail || null,
                video: {
                    hd: hdUrl || null,
                    sd: sdUrl || null
                }
            };
         } else if (/^(?:https?:\/\/)?(?:www\.)?(?:(twitter|x)\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)(?:\?[^#]*)?(?:#.*)?$/i.test(url)) {
            var results = {
                title: title || null,
                owner: owner || null,
                thumb: thumbnail || null,
                video: hdUrl || null
            };
         } else if (/^(?:https?:\/\/)?(?:[a-z]{2}\.)?pinterest\.com\/pin\/(\d+)\/?$/i.test(url) || /^(?:https?:\/\/)?(?:pin\.it)\/([a-zA-Z0-9]+)$/i.test(url)) {
            var results = {
                image: audioUrl || null
            };
         } else if (/^https:\/\/www\.capcut\.com\/(t\/[A-Za-z0-9_-]+\/?|template-detail\/\d+\?(?:[^=]+=[^&]+&?)+)$/i.test(url)) {
            var results = {
                title: title || null,
                thumb: thumbnail || null,
                video: {
                    hd: hdUrl || null,
                    sd: sdUrl || null,
                    wm: wmUrl || null
                }
            };
         } else if (/^(?:https?:\/\/)?(?:open\.spotify\.com\/track\/)([a-zA-Z0-9]+)(?:\S+)?$/i.test(url)) {
            var results = {
                title: title || null,
                thumb: thumbnail || null,
                audio: audioUrl || null
            };
         } else if (/(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/.test(url)) {
            var results = {
                title: title || null,
                thumb: thumbnail || null,
                audio: audioUrl || null
            };
         }
 
        return results;
    } catch (error) {
        return error.message;
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

module.exports = function (app) {
app.get('/download/aio', async (req, res) => {
       const { url } = req.query
        try {
            const anu = await aioRetatube(url);
            res.status(200).json({
                status: true,
                result: anu
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}