/*          Imports         */
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config({path: 'thighs.env'})

/*      Initialization      */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Grab commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const dev_commandsPath = path.join(__dirname, 'dev_commands');
const dev_commandFiles = fs.readdirSync(dev_commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Put commands in collection
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

for (const file of dev_commandFiles) {
	const filePath = path.join(dev_commandsPath, file);
	const command = require(filePath);
	// Put commands in collection
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}`);
});

/*          Login           */
(async () => {
	try {
		console.log('Waking up...')
		client.login(process.env.DISCORD_TOKEN);
	} catch (error) {
		console.log('Bot dead.');
		console.error(error);
	}
})();

/*          Handler           */
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const __userPath = path.join(__dirname, 'userdata');
	fs.open(`${__userPath}/${interaction.user.id}.csv`, 'r+', (err) => {
		if (err) {
			fs.writeFile(`${__userPath}/${interaction.user.id}.csv`, '0', (err) => {if (err) throw err});
			console.log('new user detected');
		}
	});


	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});