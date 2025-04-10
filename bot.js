
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Replace with your Telegram Bot Token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Get your local development server URL
// If using ngrok or similar, replace with your HTTPS URL
const webAppUrl = process.env.WEBAPP_URL || 'https://your-ngrok-url.ngrok.io';

console.log('Bot server started...');

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Welcome to Learn & Earn Web3! Start learning about Web3 and earn tokens.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open Web3 Learning App', web_app: { url: webAppUrl } }]
      ]
    }
  });
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
