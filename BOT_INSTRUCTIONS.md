
# Telegram Bot Setup Instructions

This guide explains how to set up and run your Telegram bot with the Learn & Earn Web3 application.

## Prerequisites

- Node.js installed
- A Telegram bot token (obtained from BotFather)
- ngrok or a similar tool for HTTPS tunneling during development

## Setup Steps

1. **Configure Environment Variables**:
   Edit the `.env` file and add your Telegram bot token:

   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   WEBAPP_URL=https://your-ngrok-url.ngrok.io
   ```

2. **Start Your Web Application**:
   ```
   npm run dev
   ```

3. **Create an HTTPS Tunnel**:
   If you're using ngrok:
   ```
   ngrok http 8080
   ```
   Copy the HTTPS URL provided by ngrok.

4. **Update the WEBAPP_URL**:
   Update the `.env` file with your ngrok URL:
   ```
   WEBAPP_URL=https://your-unique-id.ngrok.io
   ```

5. **Start the Bot**:
   ```
   node bot.js
   ```

6. **Configure Your Bot in BotFather**:
   - Message @BotFather on Telegram
   - Use the /mybots command
   - Select your bot
   - Choose "Bot Settings" > "Menu Button" > "Configure menu button"
   - Set the Web App URL to your ngrok URL

## Troubleshooting

- If you get a "MODULE_NOT_FOUND" error, ensure you've installed all dependencies:
  ```
  npm install dotenv node-telegram-bot-api
  ```

- If the bot doesn't respond, check your bot token is correct.

- If the web app doesn't load in Telegram, ensure your ngrok URL is accessible and properly configured in both the `.env` file and BotFather.
