const JSON5 = require('json5');

module.exports = class Parser {

	/**
	 * The parser class
	 * @param {Object} client Discord client
	 * @param {Object} options Parser options
	 * @param {string} options.prefix Default prefix
	 */
	constructor(client, options) {
		this.client = client;
		this.prefix = options?.prefix || null;
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

		if (prefix === null || prefix === undefined) throw Error('No prefix was defined');

		const { usedReg, usedCommand } = await this.getCommandUsed(content, prefix, cmdConf);

		const splits = await this.regSplitter(content, usedReg);
		if (splits.every.length <= 0) return { error: 'No args provided', noArgs: true };

		let parsedArgs = {};
		await argStructure.forEach((arg, index) => {
			let value = this.typeChecker(splits, arg, index);
			parsedArgs[arg.key] = value;
		});
		return this.returnParsed(parsedArgs, usedCommand, cmdConf, prefix, splits);
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
				try {
					return parseFloat(splits.all[index]);
				} catch (err) { return { error: err, expected: 'float', value: splits.all[index] }; }
			}
			case 'bool': case 'boolean': {
				if (splits.all[index].toLowerCase !== 'true' || splits.all[index].toLowerCase !== 'false') return undefined;
				return Boolean(splits.all[index]);
			}
			case 'json': {
				try {
					return JSON5.parse(splits.all[index]);
				} catch (err) { return { error: err, expected: 'json', value: splits.all[index] }; }
			}
			default: {
				return undefined;
			}
		}
	}
	returnParsed(parsedArgs, commandUsed, cmdConfig, prefix, splits, error) {
		return {
			error: error || false,
			args: parsedArgs,
			other: {
				cmdConfig: cmdConfig,
				cmdUsed: commandUsed,
				prefix: prefix,
				parsedValues: splits
			}
		};
	}

};
