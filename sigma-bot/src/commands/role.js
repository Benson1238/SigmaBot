import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logError, log } from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('role')
  .setDescription('Assign or remove a role for a member.')
  .addSubcommand((sub) =>
    sub
      .setName('assign')
      .setDescription('Assign a role to a member.')
      .addUserOption((option) => option.setName('member').setDescription('Member to update').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Role to assign').setRequired(true))
  )
  .addSubcommand((sub) =>
    sub
      .setName('remove')
      .setDescription('Remove a role from a member.')
      .addUserOption((option) => option.setName('member').setDescription('Member to update').setRequired(true))
      .addRoleOption((option) => option.setName('role').setDescription('Role to remove').setRequired(true))
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false);

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const member = interaction.options.getMember('member');
  const role = interaction.options.getRole('role');

  if (!member || !role) {
    await interaction.reply({ content: 'Unable to resolve the member or role.', ephemeral: true });
    return;
  }

  if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
    await interaction.reply({ content: 'I need Manage Roles permission to do that.', ephemeral: true });
    return;
  }

  try {
    if (subcommand === 'assign') {
      await member.roles.add(role, `Assigned by ${interaction.user.tag}`);
      await interaction.reply({ content: `Assigned ${role.name} to ${member.displayName}.`, ephemeral: true });
      log(`Role ${role.name} assigned to ${member.user.tag} by ${interaction.user.tag}`);
    } else {
      await member.roles.remove(role, `Removed by ${interaction.user.tag}`);
      await interaction.reply({ content: `Removed ${role.name} from ${member.displayName}.`, ephemeral: true });
      log(`Role ${role.name} removed from ${member.user.tag} by ${interaction.user.tag}`);
    }
  } catch (error) {
    logError(error);
    await interaction.reply({ content: 'I could not update that role.', ephemeral: true });
  }
}
