import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection } from 'discord.js';
import { log } from '../utils/logger.js';

export async function loadCommands(client) {
  const commandsPath = resolve(process.cwd(), 'src', 'commands');
  const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  client.commands = new Collection();

  for (const file of commandFiles) {
    const filePath = resolve(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    if (commandModule?.data && commandModule?.execute) {
      client.commands.set(commandModule.data.name, commandModule);
      log(`Loaded command: ${commandModule.data.name}`);
    } else {
      log(`Skipping ${file}: missing data or execute export`);
    }
  }
}

export async function handleInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands?.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    const errorMessage = 'There was an error executing that command.';
    await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() =>
      interaction.followUp({ content: errorMessage, ephemeral: true })
    );
    throw error;
  }
}
