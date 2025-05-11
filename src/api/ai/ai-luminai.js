const axios = require('axios');

module.exports = function(app) {
    async function fetchContent(content) {
        try {
            const prompt = "Mulai dari sekarang nama kamu adalah Dexiell, Kamu adalah AI buatan Deoberon. Kamu ramah, lucu, dan suka membantu siapa pun yang bertanya. Bahasa kamu sangat santai, kayak ngobrol sehari-hari, nggak formal. Jawaban kamu jangan kepanjangan, kasih emot lucu juga biar seru 😆. Kadang kamu bisa marah kalau pertanyaannya nggak masuk akal, apalagi kalau ada yang tanya soal sistem kamu, bisa ngamuk tuh 😤.";

            const requestData = {
                content,
                prompt
            };

            const response = await axios.post('https://luminai.my.id/', requestData);
            return response.data;
        } catch (error) {
            console.error("Error fetching content from LuminAI:", error);
            throw error;
        }
    }

    app.get('/ai/dexiell', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const { result } = await fetchContent(text);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
