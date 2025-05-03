const FormData = require("form-data")
const axios = require("axios")
const cheerio = require("cheerio")
 
const BASE_URL = "https://soundcloudmp3.co";
 
const souncloudDl = {
  process: async (url) => {
    try {
      const form = new FormData();
      form.append("url", url);
 
      const config = {
        headers: {
          ...form.getHeaders(),
        },
      };
 
      const { data: htmlPage } = await axios.post(`${BASE_URL}/result.php`, form, config);
 
      const $ = cheerio.load(htmlPage);
 
      const audioLinkRaw = $(".chbtn").attr("href");
      const audioLink = `${BASE_URL}${audioLinkRaw.replace(/title=([^&]+)/, (match, title) => {
        return `title=${title.replace(/\s+/g, "+")}`;
      })}`;
 
      const artworkLinkRaw = $(".chbtn2").attr("href");
      const artworkLink = `${BASE_URL}${artworkLinkRaw}`;
 
      const result = {
        title: $(".text-2xl").text().trim(),
        audioBase: $("audio source").attr("src"),
        image: artworkLink,
        download: audioLink,
      };
 
      return result;
    } catch (error) {
      throw new Error(`Gagal dapetin data: ${error.message}`);
    }
  },
};

module.exports = function (app) {
app.get('/download/soundcloud', async (req, res) => {
       const { url } = req.query
        try {
            const results = await souncloudDl.process(url);
            res.status(200).json({
                status: true,
                result: results
            });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}