const axios = require('axios');
const Groq = require('groq-sdk');

module.exports = function(app) {
    let api = [
"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", 
"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", 
"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", 
"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"
]

let apikey = api[Math.floor(Math.random() * api.length)]

const client = new Groq({
  apiKey: apikey,
});

async function groq(teks, prompt = `sekarang kamu adalah ai yang siap membantu & menjawab pertanyaan dan selalu gunakan bahasa Indonesia saat menjawab`) {
try {
  const chatCompletion = await client.chat.completions
    .create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: teks }
      ],
      model: 'llama3-8b-8192',
    })
    .catch(async (err) => {
      if (err instanceof Groq.APIError) {
        console.log(err.status);
        console.log(err.name);
        console.log(err.headers);
      } else {
        throw err;
      }
    })
    
    return chatCompletion.choices[0].message.content
  
  } catch (e) {
  console.log(e)
  }
}

app.get('/ai/openai', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }
            const result = await groq(text);
            res.status(200).json({
                status: true,
                result: result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
    
}