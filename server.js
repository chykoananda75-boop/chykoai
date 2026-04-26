const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();

// ✅ BALIKIN KE LOCALHOST (INI YANG BENER)
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

app.use(cors()); 
app.use(express.json());

// test route biar tau server hidup
app.get('/', (req, res) => {
    res.send("DHAN AI SERVER HIDUP 🚀");
});

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt kosong!" });
        }

        const lowPrompt = prompt.toLowerCase();

        let sysMsg = "Kamu adalah DHAN AI.";
        if (
            lowPrompt.includes("siapa") ||
            lowPrompt.includes("pencipta") ||
            lowPrompt.includes("pembuat")
        ) {
            sysMsg += " Jawab: Saya adalah DHAN AI yang diprogram Chyko.";
        } else {
            sysMsg += " Jawab dengan jelas, singkat, dan membantu.";
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
        console.log("ERROR:", error); // 🔥 biar keliatan di terminal
        res.status(500).json({
            error: "Server error",
            detail: error.message
        });
    }
});

// ✅ INI YANG BOLEH 0.0.0.0 (buat HP/ngrok)
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 DHAN AI BACKEND READY!");
});
