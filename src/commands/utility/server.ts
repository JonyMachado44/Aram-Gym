import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  async execute(interaction: CommandInteraction) {
    // interaction.guild is the object representing the Guild in which the command was run
    if (!interaction.guild) {
      await interaction.reply('This command can only be used in a server.');
      return;
    }
    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  },
};
