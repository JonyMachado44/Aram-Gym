import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import config from "../config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { clientId, guildId, token } = config;

const commands: any[] = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  console.log(folder);
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'));
  for (const file of commandFiles) {
    console.log(file);
    const filePath = path.join(commandsPath, file);
    const command = await import(pathToFileURL(filePath).href);
    const cmd = command.default ?? command;
    if ('data' in cmd && ('execute' in cmd || 'autocomplete' in cmd)) {
      commands.push(cmd.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" and "execute/autocomplete" property.`,
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    
    rest
      .put(Routes.applicationCommands(clientId), { body: [] })
      .then(() => console.log('Successfully deleted all global commands.'))
      .catch(console.error);

    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    )) as any[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
