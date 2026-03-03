const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

app.use(cors()); 
app.use(express.json());

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt } = req.body;
        const lowPrompt = prompt.toLowerCase();

        // LOGIKA IDENTITAS: Cek kata kunci
        let sysMsg = "Kamu adalah Digital Class 7.1 AI Assistant.";
        if (lowPrompt.includes("siapa") || lowPrompt.includes("pencipta") || lowPrompt.includes("pembuat")) {
            sysMsg += " Jawablah: 'Saya adalah AI yang diprogram Chyko untuk menuntaskan tugas sekolah atau pertanyaan dari anda. Pencipta saya adalah Chyko.'";
        } else {
            sysMsg += " Jawablah pertanyaan user dengan cerdas, akurat, dan langsung ke intinya (seperti matematika). Jangan sebutkan namamu jika tidak ditanya.";
        }

        const response = await ollama.chat({
            model: 'llama3', // Pastikan sudah install llama3 di ollama
            messages: [
                { role: 'system', content: sysMsg },
                { role: 'user', content: prompt }
            ],
            options: { temperature: 0.4 }
        });

        res.json({ reply: response.message.content });
    } catch (error) {
        res.status(500).json({ error: "Ollama mati! Jalankan 'ollama serve'." });
    }
});

app.listen(3000, () => console.log("🚀 BACKEND DIGITAL CLASS 7.1 READY!"));