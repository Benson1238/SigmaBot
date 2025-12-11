import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('support')
  .setDescription('Get support guidance or escalate to the team.')
  .addStringOption((option) =>
    option
      .setName('topic')
      .setDescription('What do you need help with?')
      .setRequired(true)
      .addChoices(
        { name: 'Setup help', value: 'setup' },
        { name: 'Billing question', value: 'billing' },
        { name: 'Bug report', value: 'bug' },
        { name: 'Other', value: 'other' }
      )
  )
  .addStringOption((option) => option.setName('details').setDescription('Add more context').setRequired(false));

const guidance = {
  setup: 'We can help configure roles, channels, and automation. Share what you want automated.',
  billing: 'For billing questions, please include any reference IDs. A support lead will review.',
  bug: 'Thanks for catching that! Please describe the steps to reproduce the issue.',
  other: 'Tell us how we can help and we will route your request.'
};

export async function execute(interaction) {
  const topic = interaction.options.getString('topic', true);
  const details = interaction.options.getString('details') ?? 'No extra details provided.';

  const embed = new EmbedBuilder()
    .setTitle('Support Request Received')
    .setColor(0x2ecc71)
    .addFields(
      { name: 'Topic', value: interaction.options.getString('topic', true) },
      { name: 'Guidance', value: guidance[topic] },
      { name: 'Details', value: details }
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
