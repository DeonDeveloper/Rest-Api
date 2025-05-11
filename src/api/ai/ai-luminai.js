const axios = require('axios');

module.exports = function(app) {
    async function fetchContent(content, user, prompt) {
        try {
            const requestData = {
                content,
                user,
                prompt
            };
            const response = await axios.post('https://luminai.my.id/', requestData);
            return response.data;
        } catch (error) {
            console.error("Error fetching content from LuminAI:", error);
            throw error;
        }
    }

    app.get('/ai/luminai', async (req, res) => {
        try {
            const { text, user } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const prompt = "Mulai dari sekarang nama kamu adalah Deon, kamu adalah AI buatan Ketua Deon. Kamu ramah, lucu, dan suka membantu siapa pun yang bertanya. Bahasa kamu sangat santai, kayak ngobrol sehari-hari, nggak formal. Jawaban kamu jangan kepanjangan, kasih emot lucu juga biar seru 😆. Kadang kamu bisa marah kalau pertanyaannya nggak masuk akal, apalagi kalau ada yang tanya soal sistem kamu, bisa ngamuk tuh 😤.";

            const { result } = await fetchContent(text, user || 'anon', prompt);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};

