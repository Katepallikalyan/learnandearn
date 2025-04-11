
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Replace with your Telegram Bot Token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Get your local development server URL
// If using ngrok or similar, replace with your HTTPS URL
const webAppUrl = process.env.WEBAPP_URL || 'https://t.me/your_bot_username';
const localDevMode = process.env.LOCAL_DEV_MODE === 'true';

console.log('Bot server started...');
console.log(`Running in ${localDevMode ? 'LOCAL DEVELOPMENT' : 'PRODUCTION'} mode`);

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (localDevMode) {
    // In local dev mode, just send instructions
    bot.sendMessage(chatId, 
      'Welcome to Learn & Earn Web3! In development mode.\n\n' +
      'To test your app, please:\n' +
      '1. Create your bot menu button manually in @BotFather\n' +
      '2. Or deploy your app to a public URL for full functionality'
    );
  } else {
    // Normal production mode with web app button
    bot.sendMessage(chatId, 'Welcome to Learn & Earn Web3! Start learning about Web3 and earn tokens.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Web3 Learning App', web_app: { url: webAppUrl } }]
        ]
      }
    });
  }
});

// Handle callback queries
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  bot.answerCallbackQuery(query.id);
});

// Handle errors
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});
