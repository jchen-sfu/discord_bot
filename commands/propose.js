const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('propose')
		.setDescription('Proposes to your waifu'),
	async execute(interaction) {
        // wins title if amity score is greatest on server
        // otherwise gives info on who is leading
		await interaction.reply('Pong!');
	},
};