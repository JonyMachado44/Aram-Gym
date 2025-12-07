import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('BAU Pong!');
  },
};
