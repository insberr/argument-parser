module.exports = class Parser {

	/**
	 * @param {Object} client Discord client
	 * @param {Object} options Parser options
	 */
	constructor(client, options) {
		this.client = client;
		this.prefix = options?.prefix;
	}
	getCommandUsed(content, prefix, cmdConf) {
		let usedReg = RegExp(`${prefix} *?(${cmdConf.name} *|${cmdConf.aliases.join(' *|')} *)`);
		let usedCommand = content.match(usedReg);
		return { usedReg: usedReg, usedCommand: usedCommand, cmdNoPrefix: usedCommand[1] };
	}
	regSplitter(content, usedReg) {
		let newContent = content.replace(usedReg, '');
		let splitBySpaces = newContent.split(/ /g);
		let splitByJSON = newContent.match(/({([^{]|\\{)*})/g);
		let splitByQuotes = newContent.match(/("([^"]|\\")*")|('([^']|\\')*')/g);
		let splitByAllArgTypes = newContent.match(/[^ '"{}\n]+|(("([^"]|\\")*")|('([^']|\\')*')|({([^{]|\\{)*}))/g);
		let splitByEveryCharacter = newContent.split('');
		return {
			spaces: splitBySpaces,
			JSON: splitByJSON,
			quotes: splitByQuotes,
			all: splitByAllArgTypes,
			every: splitByEveryCharacter
		};
	}
	async parse(msg, cmdConf, prefix) {
		const { content } = msg;
		prefix = prefix || this.prefix;
		const argStructure = cmdConf.args;
		const commandName = cmdConf.name;

		const { usedReg } = await this.getCommandUsed(content, prefix, cmdConf);

		const splits = await this.regSplitter(content, usedReg);
		if (splits.every.length <= 0) return { error: 'No arguments provided' };

		let parsedArgs = {};
		await argStructure.forEach((arg, index) => {
			let value = this.typeChecker(splits, arg, index);
			parsedArgs[arg.key] = value;
		});
		return {
			error: false,
			args: parsedArgs,
			other: {
				cmd: commandName,
				prefix: prefix
			}
		};
	}
	typeChecker(splits, arg, index) {
		switch (arg.type.toLowerCase()) {
			case 'string': case 'str': case 'text': case 'quote': {
				return String(splits.all[index]);
			}
			case 'integer': case 'int': {
				return parseInt(splits.all[index]);
			}
			case 'float': case 'number': {
				return parseFloat(splits.all[index]);
			}
			case 'bool': case 'boolean': {
				return Boolean(splits.all[index]);
			}
			case 'json': {
				return JSON.parse(splits.all[index]);
			}
			default: {
				return undefined;
			}
		}
	}

};
