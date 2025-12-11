import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { log, logError } from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('automation')
  .setDescription('Server automation helpers')
  .addSubcommand((sub) =>
    sub
      .setName('announce')
      .setDescription('Send a templated announcement to a channel.')
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Target text channel for the announcement')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('message')
          .setDescription('Announcement content to broadcast')
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName('status')
      .setDescription('Review automated tasks Sigma Bot can handle.')
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDMPermission(false);

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'announce') {
    await sendAnnouncement(interaction);
    return;
  }

  await interaction.reply({
    content:
      'Automation tasks available: announcements, ticket reminders, and role onboarding. Use /ticket and /support to get started.',
    ephemeral: true
  });
}

async function sendAnnouncement(interaction) {
  const channel = interaction.options.getChannel('channel', true);
  const messageContent = interaction.options.getString('message', true);

  if (!channel.isTextBased()) {
    await interaction.reply({ content: 'Please pick a text channel.', ephemeral: true });
    return;
  }

  try {
    await channel.send({
      content: `📢 Automated notice from ${interaction.user}: ${messageContent}`,
      allowedMentions: { parse: [] }
    });
    await interaction.reply({ content: 'Announcement sent.', ephemeral: true });
    log(`Automation announcement sent to ${channel.id} by ${interaction.user.tag}`);
  } catch (error) {
    logError(error);
    await interaction.reply({ content: 'Could not send the announcement.', ephemeral: true });
  }
}
