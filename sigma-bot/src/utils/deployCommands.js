import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { log, logError } from './logger.js';

dotenv.config({ path: resolve(process.cwd(), '.env') });
const env = process.env;

async function loadCommandData() {
  const commandsPath = resolve(process.cwd(), 'src', 'commands');
  const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  const commands = [];

  for (const file of commandFiles) {
    const filePath = resolve(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    if (commandModule?.data) {
      commands.push(commandModule.data.toJSON());
    }
  }

  return commands;
}

async function deploy() {
  if (!env.DISCORD_TOKEN || !env.CLIENT_ID || !env.GUILD_ID) {
    logError('Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in environment.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
  const commands = await loadCommandData();

  try {
    await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
      body: commands
    });
    log(`Successfully registered ${commands.length} application commands.`);
  } catch (error) {
    logError(error);
  }
}

deploy();
