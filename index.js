const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Söyüş siyahısı (istədiyiniz sözləri bura əlavə edə bilərsiniz)
const badWords = ["söyüş1", "söyüş2"]; 

client.on('qr', (qr) => {
    console.log('--- QR KODU SKAN EDİN ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Hens Bot uğurla aktiv oldu!');
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const text = msg.body.toLowerCase();

    // 1. Qrupda söyüş xəbərdarlığı
    if (chat.isGroup) {
        const hasBadWord = badWords.some(word => text.includes(word));
        if (hasBadWord) {
            await msg.reply('⚠️ *Hens Xəbərdarlığı:* Lütfən, qrupda nalayiq ifadələrdən istifadə etməyin!');
            return;
        }
    }

    // 2. Avtomatlaşdırılmış Dost (Hens rejim)
    if (text.startsWith('hens ')) {
        const userQuery = msg.body.slice(5);
        await msg.reply(`🤖 *Hens:* Salam! Dediklərinizi eşitdim: "${userQuery}". Tezliklə tam hazır olacağam!`);
    }
});

client.initialize();
  
