const axios = require('axios');

module.exports = function(app) {
app.get('/ai/deepseek', async (req, res) => {
        try {
const { text } = req.query;
let { data } = await axios.post("https://ai.clauodflare.workers.dev/chat", {
"model": "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
"messages": [{
"role": "user",
"content": text
}]
})
let response = data.data.response.split("</think>").pop().trim();
            const result = response
            res.status(200).json({
                status: true,
                result: result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
    
}