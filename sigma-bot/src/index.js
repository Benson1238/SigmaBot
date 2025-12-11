import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { loadCommands, handleInteraction } from './handlers/commandHandler.js';
import { registerEvents } from './handlers/eventHandler.js';
import { logError } from './utils/logger.js';
import config from '../config/config.json' assert { type: 'json' };

dotenv.config({ path: resolve(process.cwd(), '.env') });

const env = process.env;

if (!env.DISCORD_TOKEN) {
  logError('DISCORD_TOKEN is missing. Please set it in .env.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

async function bootstrap() {
  try {
    await loadCommands(client);
    client.interactionHandler = handleInteraction;
    registerEvents(client, config, env);
    await client.login(env.DISCORD_TOKEN);
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

bootstrap();
