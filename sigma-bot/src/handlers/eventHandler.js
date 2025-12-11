import { Events, ActivityType } from 'discord.js';
import { log, logError } from '../utils/logger.js';

async function sendLogChannel(client, env, message) {
  if (!env.LOG_CHANNEL_ID) return;
  try {
    const channel = await client.channels.fetch(env.LOG_CHANNEL_ID);
    if (channel?.isTextBased()) {
      await channel.send(message);
    }
  } catch (error) {
    logError(error);
  }
}

export function registerEvents(client, config, env) {
  client.once(Events.ClientReady, (readyClient) => {
    log(`Bot is online as ${readyClient.user.tag}`);
    readyClient.user.setActivity(config.botStatus ?? 'Assisting', { type: ActivityType.Playing });
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      const handler = client.interactionHandler;
      if (handler) {
        await handler(interaction);
      }
    } catch (error) {
      logError(error);
    }
  });

  client.on(Events.GuildMemberAdd, async (member) => {
    try {
      const welcomeChannelId = env.WELCOME_CHANNEL_ID;
      const channel = welcomeChannelId
        ? member.guild.channels.cache.get(welcomeChannelId)
        : null;
      if (channel) {
        await channel.send(`Welcome to the server, ${member}! Feel free to create a ticket if you need help.`);
      }
      const logMessage = `Member joined: ${member.user.tag}`;
      log(logMessage);
      await sendLogChannel(client, env, logMessage);
    } catch (error) {
      logError(error);
    }
  });

  client.on(Events.GuildMemberRemove, async (member) => {
    const logMessage = `Member left: ${member.user.tag}`;
    log(logMessage);
    await sendLogChannel(client, env, logMessage);
  });
}
