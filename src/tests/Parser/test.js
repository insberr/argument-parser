const Discord = require('discord.js');
const client = new Discord.Client();
const { TOKEN } = require('../../../config.json');

const fs = require('fs');

const { Parser } = require('../../../index.js');
const parser = new Parser(client, {
	prefix: '&'
});


var commands = [];
var files = fs.readdirSync('./src/tests/commands/');
files.forEach((command) => {
	let Command = require(`./commands/${command}`);
	let { cmdConfig } = new Command();
	commands.push({ name: cmdConfig.name, aliases: cmdConfig.aliases || [] });
});
console.log(commands);

client.on('ready', () => {
	console.log('Bot Ready as ', client.user.username);
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	commands.forEach((cmd) => {
		client.commands.set(cmd.name, cmd);
		if (cmd.aliases) {
			cmd.aliases.forEach(alias => {
				client.aliases.set(alias, cmd);
			});
		}
	});
});

client.on('message', async (msg) => {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(parser.prefix)) return;
	let cmd = '';
	let used = msg.content.split(' ')[0].replace(parser.prefix, '');
	if (client.commands.has(used)) {
		cmd = client.commands.get(used).name;
	} else if (client.aliases.has(used)) {
		cmd = client.commands.get(client.aliases.get(used).name).name;
	}

	let Command = require(`./commands/${cmd}.js`);
	let command = new Command();
	let { cmdConfig } = command;

	let parsed = await parser.parse(msg, cmdConfig)
		.then((value) => value)
		// eslint-disable-next-line arrow-body-style
		.catch((err) => {
			return console.log(err);
		});
	let { args, error, other } = parsed;
	await command.run(msg, args, error, other, parsed);
	return;
});

client.login(TOKEN);
