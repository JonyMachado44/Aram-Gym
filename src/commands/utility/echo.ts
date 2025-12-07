import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to echo back')
        .setMaxLength(2_000),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to echo into')
        .addChannelTypes(ChannelType.GuildText),
    )
    .addBooleanOption((option) =>
      option
        .setName('embed')
        .setDescription('Whether or not the echo should be embedded'),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.getString('input');
    const channel =
      interaction.options.getChannel('channel') || interaction.channel;
    const embed = interaction.options.getBoolean('embed') || false;
    console.log('input', input, 'embed', embed);
    if (!input) {
      await interaction.reply({
        content: 'You need to provide an input to echo back!',
        ephemeral: true,
      });
      return;
    }
    if (channel && 'send' in channel) {
      if (embed) {
        await channel.send({ embeds: [{ description: input }] });
      } else {
        await channel.send(input);
      }
    }
    await interaction.reply({
      content: `Echoed your input in ${channel?.toString()}`,
      ephemeral: true,
    });
  },
};
