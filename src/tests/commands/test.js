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
					type: 'bool'
				}
			]

		};
	}
	async run(msg, { configAction, configOption, setting }, error, other, parsed) {
		if (error) {
			msg.channel.send(error);
			return console.log(`ERROR: ${error}\nParsed: ${parsed}`);
		}
		await msg.channel.send(`Action: ${configAction}\nOption: ${configOption}\nSetting: ${setting}\nOther: ${other}`);
		return;
	}

};
