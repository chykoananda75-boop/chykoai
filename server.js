const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.send("DHAN AI SERVER HIDUP 🚀");
});

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "Prompt kosong!" });
        }

        const response = await ollama.chat({
            model: 'llama3',
            messages: [
                { role: 'user', content: prompt }
            ]
        });

        res.json({ reply: response.message.content });

    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ reply: "Server error: " + err.message });
    }
});

// buka ke luar (buat ngrok / HP)
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 SERVER DHAN AI JALAN DI PORT 3000");
});
