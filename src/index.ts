import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import config from '../config.json' with { type: "json" };

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
    cooldowns: Collection<string, any>;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { token } = config;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

(async () => {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(pathToFileURL(filePath).href);
      const cmd = command.default || command;
      if ('data' in cmd && ('execute' in cmd || 'autocomplete' in cmd)) {
        client.commands.set(cmd.data.name, cmd);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" and "execute/autocomplete" property.`,
        );
      }
    }
  }

  console.log(
    'Loaded commands:',
    client.commands.map((cmd) => cmd.data.name),
  );

  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(pathToFileURL(filePath).href);
    const evt = event.default || event;
    if (evt.once) {
      client.once(evt.name, (...args) => evt.execute(...args));
    } else {
      client.on(evt.name, (...args) => evt.execute(...args));
    }
  }

  await client.login(token);
})();
