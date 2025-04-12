
/**
 * Learn & Earn Web3 Telegram Bot
 * 
 * Setup: npm install dotenv node-telegram-bot-api
 */

// Load dependencies
try {
  require('dotenv').config();
  const TelegramBot = require('node-telegram-bot-api');
  
  // Bot configuration
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webAppUrl = process.env.WEBAPP_URL || 'https://t.me/your_bot_username';
  const localDevMode = process.env.LOCAL_DEV_MODE === 'true';
  
  // Validate token
  if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN') {
    throw new Error('TELEGRAM_BOT_TOKEN is not set in your .env file');
  }
  
  // Create bot instance
  const bot = new TelegramBot(token, { polling: true });
  
  console.log(`Bot started in ${localDevMode ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  console.log(`Web App URL: ${webAppUrl}`);
  
  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    if (localDevMode) {
      bot.sendMessage(chatId, 'Welcome to Learn & Earn Web3! In development mode.');
    } else {
      bot.sendMessage(chatId, 'Welcome to Learn & Earn Web3! Start learning about Web3 and earn tokens.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Web3 Learning App', web_app: { url: webAppUrl } }]
          ]
        }
      });
    }
  });
  
  // Handle /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
      'Learn & Earn Web3 Bot Help:\n\n' +
      '/start - Start the bot and open the web app\n' +
      '/help - Show this help message'
    );
  });
  
  // Handle callback queries
  bot.on('callback_query', (query) => {
    bot.answerCallbackQuery(query.id);
  });
  
  // Handle errors
  bot.on('polling_error', (error) => {
    console.log('Polling error:', error);
  });
  
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  console.error('Make sure you have installed: npm install dotenv node-telegram-bot-api');
  process.exit(1);
}

