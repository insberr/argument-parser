const JSON5 = require('json5');

var json = '{ "test": "hello" }';

let obj = JSON5.parse(json);
console.log(obj);
