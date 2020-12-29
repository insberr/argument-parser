module.exports = class Try {

	constructor() {
		this.cmdConfig = {
			name: 'try',
			aliases: ['do', 'tee'],
			description: 'Configure guild settings',
			useage: 'action option setting value',
			guildOnly: true,
			perms: ['ADMINISTRATOR'],
			args: [
				{
					key: 'nice',
					type: 'string',
					options: ['edit', 'reset', 'show'],
					required: true
				},
				{
					key: 'two',
					type: 'string',
					options: ['guild', 'user', 'bot', 'all'],
					required: true
				},
				{
					key: 'three',
					type: 'string'
				}
			]

		};
	}
	async run(msg, { nice, two, three }, error, other, parsed) {
		if (error) {
			msg.channel.send(error);
			return console.log(`ERROR: ${error}\nParsed: ${parsed}`);
		}
		await msg.channel.send(`Nice: ${nice}\nTwo: ${two}\nThree: ${three}\nOther: ${other}`);
		return;
	}

};
