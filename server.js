const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();

// ganti 127.0.0.1 → 0.0.0.0
const ollama = new Ollama({ host: 'http://0.0.0.0:11434' });

app.use(cors()); 
app.use(express.json());

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt } = req.body;
        const lowPrompt = prompt.toLowerCase();

        let sysMsg = "Kamu adalah DHAN AI.";
        if (lowPrompt.includes("siapa") || lowPrompt.includes("pencipta") || lowPrompt.includes("pembuat")) {
            sysMsg += " Jawablah: 'Saya adalah DHAN AI yang diprogram Chyko. Pencipta saya adalah Chyko.'";
        } else {
            sysMsg += " Jawablah dengan cerdas, singkat, dan jelas.";
        }

        const response = await ollama.chat({
            model: 'llama3',
            messages: [
                { role: 'system', content: sysMsg },
                { role: 'user', content: prompt }
            ],
            options: { temperature: 0.4 }
        });

        res.json({ reply: response.message.content });
    } catch (error) {
        res.status(500).json({ error: "Ollama error / belum jalan!" });
    }
});

// 🔥 penting!
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 DHAN AI BACKEND READY!");
});
