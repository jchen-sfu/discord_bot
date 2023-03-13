const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config({path: 'thighs.env'})

// Grab commands
const dev_commands = [];
const dev_commandPath = path.join(__dirname, 'dev_commands');
const dev_commandFiles = fs.readdirSync(dev_commandPath).filter(file => file.endsWith('.js'))

for (const file of dev_commandFiles) {
	const c = require(`./dev_commands/${file}`);
	dev_commands.push(c.data.toJSON());
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const c = require(`./commands/${file}`);
	commands.push(c.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
	try {
		// Deploy commands for development
		console.log(`Started refreshing ${dev_commands.length} application (/) commands for developement.`);

		const ddata = await rest.put(
			Routes.applicationGuildCommands(process.env.DEVCLIENT_ID, process.env.DEVSERVER_ID),
			{ body: dev_commands },
		);
		console.log(`Successfully reloaded ${ddata.length} application (/) commands.`);

		// Deploy commands for public
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.DEVCLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();