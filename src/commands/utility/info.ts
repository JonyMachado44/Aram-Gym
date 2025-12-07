import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Info about a user')
        .addUserOption((option) =>
          option.setName('target').setDescription('The user'),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('server').setDescription('Info about the server'),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'user') {
      const user = interaction.options.getUser('target') || interaction.user;
      await interaction.reply(
        `User info:\n- Username: ${user.username}\n- ID: ${user.id}`,
      );
    } else if (interaction.options.getSubcommand() === 'server') {
      const guild = interaction.guild;
      if (guild) {
        await interaction.reply(
          `Server info:\n- Name: ${guild.name}\n- ID: ${guild.id}\n- Member Count: ${guild.memberCount}`,
        );
      } else {
        await interaction.reply('This command can only be used in a server.');
      }
    }
  },
};
