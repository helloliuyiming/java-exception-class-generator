import defaultConfig from "./data/defaultConfig.js";
import structuredClone from '@ungap/structured-clone';
let ejs = require('ejs')

import {ExceptionGenerator} from "./ExceptionGenerator.js";

//  "type": "module",

const exceptionGenerator = new ExceptionGenerator(defaultConfig)
let newExcepton = JSON.parse('{\n' +
    '    "id": "l1",\n' +
    '    "exceptionName": "Server",\n' +
    '    "fields": {\n' +
    '        "myFields": [\n' +
    '            {\n' +
    '                "value": "",\n' +
    '                "field": "",\n' +
    '                "originField": "",\n' +
    '                "defaultValue": "",\n' +
    '                "type": "String",\n' +
    '                "final": false,\n' +
    '                "comments": "",\n' +
    '                "options": "",\n' +
    '                "originExceptionId": "l1",\n' +
    '                "id": 1,\n' +
    '                "fieldName": "nt1"\n' +
    '            },\n' +
    '            {\n' +
    '                "value": "",\n' +
    '                "field": "",\n' +
    '                "originField": "",\n' +
    '                "defaultValue": "",\n' +
    '                "type": "String",\n' +
    '                "final": false,\n' +
    '                "comments": "",\n' +
    '                "options": "",\n' +
    '                "originExceptionId": "l1",\n' +
    '                "id": 2,\n' +
    '                "fieldName": "nt2"\n' +
    '            },\n' +
    '            {\n' +
    '                "value": "",\n' +
    '                "field": "",\n' +
    '                "originField": "",\n' +
    '                "defaultValue": "",\n' +
    '                "type": "String",\n' +
    '                "final": false,\n' +
    '                "comments": "",\n' +
    '                "options": "",\n' +
    '                "originExceptionId": "l1",\n' +
    '                "id": 3,\n' +
    '                "fieldName": "nt3"\n' +
    '            }\n' +
    '        ],\n' +
    '        "inheritFields": [\n' +
    '            {\n' +
    '                "fieldName": "message",\n' +
    '                "originField": "message",\n' +
    '                "value": "",\n' +
    '                "defaultValue": "1",\n' +
    '                "type": "String",\n' +
    '                "final": false,\n' +
    '                "comments": "",\n' +
    '                "options": "",\n' +
    '                "originExceptionId": "baseException"\n' +
    '            }\n' +
    '        ]\n' +
    '    },\n' +
    '    "config": {\n' +
    '        "final": false,\n' +
    '        "package": "me.lym.exception",\n' +
    '        "defaultPackage": "me.lym.exception"\n' +
    '    },\n' +
    '    "subException": []\n' +
    '}')

// let backupNewException = JSON.parse(JSON.stringify(newExcepton));
// exceptionGenerator.updateException(newExcepton)
//
// backupNewException.fields.myFields.splice(2,3)
// exceptionGenerator.updateException(backupNewException)


exceptionGenerator.generate()