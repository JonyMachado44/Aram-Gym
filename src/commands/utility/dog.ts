import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({
      pl: 'pies',
      de: 'hund',
    })
    .setDescription('Get a cute picture of a dog!')
    .setDescriptionLocalizations({
      pl: 'Słodkie zdjęcie pieska!',
      de: 'Poste ein niedliches Hundebild!',
    })
    .addStringOption((option) =>
      option
        .setName('breed')
        .setDescription('Breed of dog')
        .setNameLocalizations({
          pl: 'rasa',
          de: 'rasse',
        })
        .setDescriptionLocalizations({
          pl: 'Rasa psa',
          de: 'Hunderasse',
        }),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const breed = interaction.options.getString('breed');
    let url = 'https://dog.ceo/api/breeds/image/random';
    if (breed) {
      url = `https://dog.ceo/api/breed/${breed}/images/random`;
    }
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'success') {
      await interaction.reply({ content: data.message });
    } else {
      await interaction.reply({
        content: 'Could not find a dog image for that breed.',
        ephemeral: true,
      });
    }
  },
};
