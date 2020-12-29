module.exports = class Test {

	constructor() {
		this.cmdConfig = {
			name: 'test',
			aliases: ['testing'],
			description: 'Configure guild settings',
			useage: 'action option setting value',
			guildOnly: true,
			perms: ['ADMINISTRATOR'],
			args: [
				{
					key: 'configAction',
					type: 'string',
					options: ['edit', 'reset', 'show'],
					required: true
				},
				{
					key: 'configOption',
					type: 'string',
					options: ['guild', 'user', 'bot', 'all'],
					required: true
				},
				{
					key: 'setting',
					type: 'json'
				}
			]

		};
	}
	async run(msg, { configAction, configOption, setting }, error, other, parsed) {
		if (error) {
			msg.channel.send(error);
			return console.log(`ERROR: ${error}\nParsed: \`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``);
		}
		switch (configOption) {
			case 'edit': {
				return msg.channel.send('edit');
			}
			case 'show': {
				return msg.channel.send('show');
			}
			case 'reset': {
				return msg.channel.send('reset');
			}
			case error: {
				return msg.channel.send('Missing argument `configOption`');
			}
			default: {
				if (configAction.error) return msg.channel.send('Missing argument `configOption`');
			}
		}
		await msg.channel.send(`Action: ${configAction}\nOption: ${configOption}\nSetting: ${JSON.stringify(setting)}\nOther:  \`\`\`json\n${JSON.stringify(other, null, 2)}\n\`\`\``);
		return;
	}

};
