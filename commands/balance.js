const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, BaseClient } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your bank balance'),
	async execute(interaction) {
        fs.readFile(`userdata/${interaction.user.id}.csv`, 'utf8', (err, f) => {
            if (err) throw err;
            const userData = f.toString().split("\n");
            interaction.reply(`Your balance is ${userData[0]}`);
        })
	},
};