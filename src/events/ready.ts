import { Client, Events } from 'discord.js';

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (!client.user || !client.application) {
      return;
    }
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
