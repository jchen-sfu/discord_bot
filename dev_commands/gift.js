const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gift')
		.setDescription('Raise amity with your waifu by offering a gift'),
	async execute(interaction) {
        // pull up gift menu
        // use points to buy gift
        // react to send a gift
        // subtracts gift from user's inventory
        // 
		await interaction.reply('Pong!');
	},
};