# Sigma Bot

Sigma Bot is a Discord bot built with `discord.js` v14 focused on safe server management tasks: ticketing, support assistance, product information, role assignment, automation helpers, and logging.

## Features
- Ticket workflow with thread creation for each request.
- Guided support responses for common topics.
- Product catalog lookup via slash command.
- Role assignment/removal with permission checks.
- Automation helper for announcements and quick task summary.
- Logging of key events and errors to `logs/bot.log`.

## Installation
1. Ensure you are using Node.js 18.17.0 or newer.
2. From the project root, install dependencies:
   ```bash
   cd sigma-bot
   npm install
   ```

## Environment setup
1. Copy `.env.example` to `.env` inside `sigma-bot/`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the values:
   - `DISCORD_TOKEN`: Your bot token from the Discord Developer Portal.
   - `CLIENT_ID`: Your application (bot) client ID.
   - `GUILD_ID`: The guild ID where you will deploy slash commands during development.
   - `LOG_CHANNEL_ID`: (Optional) Channel ID for sending log messages; `bot.log` is always written locally.
   - `TICKET_CHANNEL_ID`: Channel ID where tickets are posted (falls back to the current channel if omitted).
   - `WELCOME_CHANNEL_ID`: Channel ID for welcome messages on member join events.

## Slash command deployment
Run the deploy script after updating commands or changing environments:
```bash
npm run deploy
```
This registers guild commands using the IDs from your `.env` file.

## Running the bot
Start the bot with:
```bash
npm start
```
You should see a console log confirming the bot is online.

## Optional test commands
- `/ping` – basic responsiveness check.
- `/automation status` – shows available automation tasks.
- `/product name:<product>` – returns product details defined in `config/config.json`.

## Logging
Runtime logs are written to `sigma-bot/logs/bot.log`. Errors are mirrored to the console for quick debugging.
