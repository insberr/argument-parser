> *Discord command argument parser*  
> *Working progress*

# djs-argument-parser
Discord bot command argument parser since none exist.  

[Documentation]() (none yet)

### Plans
- Add a command handler

## Example
Files for the exaples can be found in `src/tests/test.js`  
Bot file (Usually the `index.js` file) 
```js
// Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

// Argument parser
const { Parser } = require('../../index.js');
const parser = new Parser(client, {
	prefix: '!' // Default prefix (optional)
});

const prefix = '!';

client.on('ready', () => {
	console.log('Bot Ready as ', client.user.username);
});

client.on('message', async (msg) => {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(prefix)) return;
	
	// Require the command (In this case the test command)
	let Command = require(`./commands/test.js`);
	let command = new Command();
	let { cmdConfig } = command;

	/*
		parser.parse(message, commandConfig, prefix?)
		prefix, useful if you have custom guild prefixes. If no prefix is defined, the default prefix (above) will be used.

		input message '!test edit no true'
	*/
	let parsed = await parser.parse(msg, cmdConfig).then((value) => value);

	let { args, error, other } = parsed;
	/*
		output: 
		{
			"error": false,
			"args": {
				"configAction": "edit",
				"configOption": "no",
				"setting": true
			},
			"other": {
				"cmd": "test",
				"prefix": "&"
			}
		}
	*/
	// run the command
	await command.run(msg, args, error, other, parsed);
	return;
});

client.login(TOKEN);

```

The `commands/test.js` file:
```js
module.exports = class Test {

	constructor() {
		this.cmdConfig = {
			name: 'test',
			aliases: ['testing'],
			description: 'Test the parser',
			useage: 'action option setting value',
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

	//  msg, args (named as they key), error, other (has stuff like the prefix used, command and more), parser (parser full contents)
	async run(msg, { configAction, configOption, setting }, error, other, parsed) {
		if (error) {
			msg.channel.send(error);
			return console.log(`ERROR: ${error}\nParsed: ${parsed}`);
		}
		await msg.channel.send(`Action: ${configAction}\nOption: ${configOption}\nSetting: ${setting}\nOther: ${JSON.stringify(other)}`);
		return;
	}

};
```

## Maintainers
- [SpiderGamin](https://github.com/SpiderGamin/)


## License
**djs-command-parser** is released under the MIT License. Read [here](/LICENSE) for more information.