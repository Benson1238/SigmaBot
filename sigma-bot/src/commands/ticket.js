import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { log, logError } from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Create or manage support tickets.')
  .addSubcommand((sub) =>
    sub
      .setName('create')
      .setDescription('Open a new support ticket.')
      .addStringOption((option) =>
        option.setName('subject').setDescription('Brief summary of your request').setRequired(true)
      )
      .addStringOption((option) =>
        option.setName('details').setDescription('Additional details to help the support team').setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName('close')
      .setDescription('Close your latest ticket once resolved.')
      .addStringOption((option) =>
        option.setName('ticket_id').setDescription('ID of the ticket message to close').setRequired(true)
      )
  );

export async function execute(interaction) {
  if (interaction.options.getSubcommand() === 'create') {
    await handleCreate(interaction);
    return;
  }
  await handleClose(interaction);
}

async function handleCreate(interaction) {
  const subject = interaction.options.getString('subject', true);
  const details = interaction.options.getString('details') ?? 'No additional details provided.';
  const ticketChannelId = process.env.TICKET_CHANNEL_ID;
  const channel = ticketChannelId
    ? interaction.guild.channels.cache.get(ticketChannelId)
    : interaction.channel;

  if (!channel?.isTextBased()) {
    await interaction.reply({ content: 'Ticket channel is not available.', ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`New Ticket: ${subject}`)
    .setDescription(details)
    .setColor(0x3498db)
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  try {
    const message = await channel.send({
      content: `Ticket from ${interaction.user}: please assist!` +
        (interaction.member?.roles?.highest ? ` (Top role: ${interaction.member.roles.highest.name})` : ''),
      embeds: [embed],
      allowedMentions: { users: [interaction.user.id] }
    });

    await message.startThread({
      name: `${subject}`,
      autoArchiveDuration: 1440,
      reason: 'Support ticket thread'
    });

    await interaction.reply({
      content: `Your ticket has been created: ${message.url}`,
      ephemeral: true
    });

    log(`Ticket created by ${interaction.user.tag} in channel ${channel?.id ?? 'unknown'}`);
  } catch (error) {
    logError(error);
    await interaction.reply({ content: 'Unable to create a ticket right now.', ephemeral: true });
  }
}

async function handleClose(interaction) {
  const ticketId = interaction.options.getString('ticket_id', true);

  try {
    const channel = interaction.channel;
    if (!channel?.isTextBased()) {
      await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true });
      return;
    }

    const message = await channel.messages.fetch(ticketId);
    if (!message.thread) {
      await interaction.reply({ content: 'No ticket thread is associated with that message.', ephemeral: true });
      return;
    }

    if (
      interaction.member.permissions.has(PermissionFlagsBits.ManageThreads) ||
      message.author.id === interaction.user.id
    ) {
      await message.thread.setLocked(true, 'Ticket closed');
      await message.thread.setArchived(true, 'Ticket closed');
      await interaction.reply({ content: 'Ticket closed and archived.', ephemeral: true });
      log(`Ticket ${ticketId} closed by ${interaction.user.tag}`);
    } else {
      await interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });
    }
  } catch (error) {
    logError(error);
    await interaction.reply({ content: 'Unable to close that ticket.', ephemeral: true });
  }
}
