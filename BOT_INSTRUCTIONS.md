
# Telegram Bot Setup Instructions

This guide explains how to set up and run your Telegram bot with the Learn & Earn Web3 application.

## Prerequisites

- Node.js installed
- A Telegram bot token (obtained from BotFather)

## Setup Options

### Option 1: Using ngrok (Recommended for full functionality)

1. **Install ngrok** from https://ngrok.com/download
2. **Start Your Web Application**: `npm run dev`
3. **Create an HTTPS Tunnel**: `ngrok http 8080`
4. **Update the WEBAPP_URL**: In `.env` file with your ngrok URL
5. **Start the Bot**: `node bot.js`

### Option 2: Local Development Mode (Without ngrok)

If you cannot install ngrok, you can still test the bot functionality:

1. **Configure Environment Variables**:
   Edit the `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   WEBAPP_URL=https://t.me/your_bot_username
   LOCAL_DEV_MODE=true
   ```

2. **Start the Bot**: `node bot.js`

3. **Configure Your Bot Manually in BotFather**:
   - Message @BotFather on Telegram
   - Use the /mybots command
   - Select your bot
   - Choose "Bot Settings" > "Menu Button" > "Configure menu button"
   - Either:
     - Set the Web App URL to your bot's t.me URL for minimal testing
     - Or deploy your app to a hosting service for full functionality

## Troubleshooting

- If you get a "MODULE_NOT_FOUND" error, ensure you've installed all dependencies:
  ```
  npm install dotenv node-telegram-bot-api
  ```

- If the bot doesn't respond, check your bot token is correct.

- For production deployment, you'll need to host your web application on a service that provides HTTPS.
