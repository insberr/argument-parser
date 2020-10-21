module.exports = {
	splitArgsAndParenBrackets: /[^ '"{}\n]+|(("([^"]|\\")*")|('([^']|\\')*')|({([^{]|\\{)*}))/g,
	splitAllButSeperators: /[^ '"{}\n]+/g,
	splitAllQuotes: /("([^"]|\\")*")|('([^']|\\')*')/g,
	splitAllJSON: /({([^{]|\\{)*})/g
};
