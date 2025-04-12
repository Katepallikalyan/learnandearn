
/**
 * Learn & Earn Web3 Telegram Bot
 * 
 * BEFORE RUNNING THIS BOT:
 * 1. Install required dependencies by running:
 *    npm install dotenv node-telegram-bot-api
 * 
 * 2. Make sure your .env file is properly configured with:
 *    - TELEGRAM_BOT_TOKEN (from BotFather)
 *    - WEBAPP_URL (your Vercel deployment URL)
 *    - LOCAL_DEV_MODE (set to false for production)
 */

// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  console.error('ERROR: dotenv package is missing. Please run: npm install dotenv');
  console.error('Exiting process...');
  process.exit(1);
}

// Check for telegram bot api
let TelegramBot;
try {
  TelegramBot = require('node-telegram-bot-api');
} catch (error) {
  console.error('ERROR: node-telegram-bot-api package is missing. Please run: npm install node-telegram-bot-api');
  console.error('Exiting process...');
  process.exit(1);
}

// Validate environment variables
if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is not set in your .env file. Please add your bot token from BotFather.');
  process.exit(1);
}

// Replace with your Telegram Bot Token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Get your web app URL
const webAppUrl = process.env.WEBAPP_URL || 'https://t.me/your_bot_username';
const localDevMode = process.env.LOCAL_DEV_MODE === 'true';

console.log('Bot server started...');
console.log(`Running in ${localDevMode ? 'LOCAL DEVELOPMENT' : 'PRODUCTION'} mode`);
console.log(`Web App URL: ${webAppUrl}`);

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

// Add a simple help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    'Learn & Earn Web3 Bot Help:\n\n' +
    '/start - Start the bot and open the web app\n' +
    '/help - Show this help message'
  );
});
