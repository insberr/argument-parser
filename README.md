> *Discord command argument parser*  
> *Working progress*

[![Total alerts](https://img.shields.io/lgtm/alerts/g/SpiderGamin/djs-argument-parser.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SpiderGamin/djs-argument-parser/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/SpiderGamin/djs-argument-parser.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SpiderGamin/djs-argument-parser/context:javascript)

# djs-argument-parser
Discord bot command argument parser since none exist.  

[Documentation]() (Not created yet [Looking for help on this])


### To Do
- Make a support discord server
- Add all types

## Parser Example
Files for the exaples can be found in [`/src/tests/`](/src/tests/)

This example can be found in [`/src/tests/Parser`](/src/tests/Parser/)  
Bot file (Usually the `index.js` file) 
```js
// Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

// Argument parser
const { Parser } = require('djs-argument-parser');
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
		prefix -> useful if you have custom guild prefixes. If no prefix is defined, the default prefix (above) will be used.

		Example: input message -> '!test edit no true'
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

The [`/src/Parser/commands/test.js`](/src/tests/Parser/commands/test.js) file:  
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

	//  msg, args (named as they key), error, other (has stuff like the prefix used, command and more), parsed (parsed full contents)
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

Note: The command handler may be moved to a new git repo since it is not part of the argument parser.


## Maintainers
- [SpiderGamin](https://github.com/SpiderGamin/)


## License
**djs-argument-parser** is released under the MIT License. Read [here](/LICENSE) for more information.