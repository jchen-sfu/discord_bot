const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config({path: 'thighs.env'})

// Grab commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// Deploy commands for development
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.DEVCLIENT_ID, process.env.DEVSERVER_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();