const Parser = require('../arguments/Parser');
const fs = require('fs');
const path = require('path');

module.exports = class Handler {

	constructor(client, Discord, options) {
		if (typeof client !== 'object') throw Error('Client not provided');
		if (Discord === undefined) throw Error('The property `Discord` was not provided');
		this.client = client;
		this.Discord = Discord;
		if (options !== undefined) {
			this.defaultPrefix = options.defaultPrefix || null;

			this.commandsFolder = options.commandsFolder || './commands/';
			if (!this.commandsFolder.endsWith('/')) this.commandsFolder += '/';

			/**
			 * Automatically Initialize all of the commands
			 */
			this.autoInit = options.autoInit || false;

			// this.commandCategories = options.commandCategories || false;
		}
		if (this.autoInit === true) this.init();
	}
	init(reload) {
		if (reload === true) {
			this.client.commands = null;
			this.client.aliases = null;
		}

		let commands = [];
		let commandFiles = fs.readdirSync(path.join(__dirname, this.commandsFolder));
		commandFiles.forEach((command) => {
			let Command = require(this.commandsFolder + command);
			let { cmdConfig } = new Command();
			commands.push({ name: cmdConfig.name, aliases: cmdConfig.aliases || [] });
		});

		this.client.commands = new this.Discord.Collection();
		this.client.aliases = new this.Discord.Collection();
		commands.forEach((cmd) => {
			this.client.commands.set(cmd.name, cmd);
			if (cmd.aliases) {
				cmd.aliases.forEach(alias => {
					this.client.aliases.set(alias, cmd);
				});
			}
		});
	}
	async runCommand(msg, prefix) {
		prefix = prefix || this.defaultPrefix;

		let cmd = '';
		let used = msg.content.split(' ')[0].replace(RegExp(`${prefix} *`), '');
		if (this.client.commands.has(used)) {
			cmd = this.client.commands.get(used).name;
		} else if (this.client.aliases.has(used)) {
			cmd = this.client.commands.get(this.client.aliases.get(used).name).name;
		}

		let Command = require(`${this.commandsFolder}${cmd}.js`);
		let command = new Command();
		let { cmdConfig } = command;

		let parser = new Parser(this.client, { prefix: prefix });
		let parsed = await parser.parse(msg, cmdConfig)
			.then((value) => value)
			// eslint-disable-next-line arrow-body-style
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.trace(err);
				throw Error(err);
			});
		let { args, error, other } = parsed;
		await command.run(msg, args, error, other, parsed);
		return;
	}
	Parser() {
		return new Parser();
	}

};
