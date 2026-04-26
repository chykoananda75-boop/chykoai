const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

app.use(cors());
app.use(express.json());

// 🔥 TEST ROUTE (biar tau server hidup)
app.get('/', (req, res) => {
    res.send("DHAN AI SERVER HIDUP 🚀");
});

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "Prompt kosong!" });
        }

        const lowPrompt = prompt.toLowerCase();

        // LOGIKA IDENTITAS
        let sysMsg = "Kamu adalah Digital Class 7.1 AI Assistant.";

        if (
            lowPrompt.includes("siapa") ||
            lowPrompt.includes("pencipta") ||
            lowPrompt.includes("pembuat")
        ) {
            sysMsg += " Jawablah: 'Saya adalah AI yang diprogram Chyko untuk menuntaskan tugas sekolah atau pertanyaan dari anda. Pencipta saya adalah Chyko.'";
        } else {
            sysMsg += " Jawablah pertanyaan user dengan cerdas, akurat, dan langsung ke intinya.";
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
        console.log("ERROR:", error.message); // 🔥 biar keliatan di terminal
        res.status(500).json({
            reply: "Ollama error / belum jalan!",
            detail: error.message
        });
    }
});

// 🔥 penting biar bisa diakses HP / ngrok
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 BACKEND DIGITAL CLASS 7.1 READY!");
});
