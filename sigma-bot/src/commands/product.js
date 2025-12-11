import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../../config/config.json' assert { type: 'json' };

export const data = new SlashCommandBuilder()
  .setName('product')
  .setDescription('Display Sigma Bot product information.')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Product to show details for')
      .setRequired(true)
      .addChoices(...config.products.map((product) => ({ name: product.name, value: product.name })))
  );

export async function execute(interaction) {
  const name = interaction.options.getString('name', true);
  const product = config.products.find((item) => item.name === name);

  if (!product) {
    await interaction.reply({ content: 'Product not found.', ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(product.name)
    .setDescription(product.description)
    .addFields({ name: 'Price', value: product.price })
    .setColor(0x9b59b6);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
