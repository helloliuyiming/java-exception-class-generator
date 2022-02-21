export default {
    "runtime": {
        "exceptionsRefresh":true,
        "exceptionNameColumnWidth":340,
        "exceptionNameInputWidth":120,
        "exceptionNameInputTextAlign":'center',
        "exceptionNameColumnSuffixWidth":340,
         "editEnumDialogVisible": false,
         "editExceptionDialogVisible": false,
        "editException":{},
        "fields":[],
        "activeEnum":{
            "name":"enum1",
            "package":"",
            "cols":[
                {
                    "name":"V",
                    "type":"",
                    "defaultValue":""
                }
            ],
            "properties":[
                {
                    "enum_property":"",
                    "name":"h1"
                }
            ]
        }
    },

    "options":{
        "baseExceptions": [
            {
                "className": "Exception",
                "classFullName": "java.lang.Exception",
                "classFields":[
                    {
                        "field":"message",
                        "type":"String"
                    }
                ]
            },
            {
                "className": "RuntimeException",
                "classFullName": "java.lang.RuntimeException",
                "classFields":[
                    {
                        "field":"message",
                        "type":"String"
                    }
                ]
            }
        ],
        "types": ["Integer","String","Float","Double","Boolean","Long"]
    },

     "config": {
         "meta": {
             "version": "1.0Beta",
             "author": "lym",
             "create_time": "2021-09-14",
             "update_time": "2021-09-14",
             "support": "elementui",
             "description": "ceshi"
         },

         "settings": {
             "basePackage": "me.lym.exception",
             "nextId":3,
             "baseException": {
                 "className": "Exception",
                 "classFullName": "java.lang.Exception",
                 "fields":[
                     {
                         "field":"message",
                         "type":"String"
                     }
                     ]
             },
             "useLombok": "true",
             "suffix": "Exception",
             "hiddenSuffix": true
         },

         "enums":[
             {
                 "id":"id1",
                 "name":"enum1",
                 "package":"",
                 "cols":[

                 ],
                 "properties":[
                     {
                         "enum":"ENUM_VALUE_1"
                     }
                 ]
             },
             {
                 "id":"id2",
                 "name":"enum1",
                 "package":"",
                 "cols":[
                     {
                         "name":"status",
                         "type":"String",
                         "defaultValue":"200"
                     }
                 ],
                 "properties":[
                     {
                         "status":"200",
                         "enum":"ENUM_VALUE_1"
                     }
                 ]
             }
         ],
         "cols": [
             {
                 "index": 1,
                 "prop": "message",
                 "title": "message",
                 "originExceptionId": "l1:l2"
             }
         ],

         "exceptions": [
             {
                 "id": "l1",
                 "exceptionName": "Server",
                 "fields": {
                     "message":{
                         "value": "",
                         "defaultValue": "1",
                         "type": "String",
                         "final": false,
                         "comments": "",
                         "options": "",
                         "originExceptionId": "baseException"
                     }
                 },
                 "config": {
                     "final": false,
                     "package": "me.lym.exception",
                     "defaultPackage": "me.lym.exception"
                 },
                 "subException": [
                     {
                         "id": "l1:l1",
                         "exceptionName": "BadRequest",
                         "config": {
                             "final": false,
                             "package": "",
                             "defaultPackage": "me.lym.exception"
                         },
                         "fields": {
                             "message":{
                                 "value": "",
                                 "defaultValue": "1",
                                 "type": "String",
                                 "final": false,
                                 "comments": "",
                                 "options": "",
                                 "originExceptionId": "baseException"
                             }
                         },
                     },
                     {
                         "id": "l1:l2",
                         "exceptionName": "BadGateway",
                         "config": {
                             "final": true,
                             "package": "",
                             "defaultPackage": "me.lym.exception"
                         },
                         "fields": {
                             "message":{
                                 "value": "",
                                 "defaultValue": "1",
                                 "type": "String",
                                 "final": false,
                                 "comments": "",
                                 "options": "",
                                 "originExceptionId": "baseException"
                             }
                         },
                     }
                 ]
             },
             {
                 "id": "l2",
                 "exceptionName": "Server",
                 "fields": {
                     "message":{
                         "value": "",
                         "defaultValue": "1",
                         "type": "String",
                         "final": false,
                         "comments": "",
                         "options": "",
                         "originExceptionId": ""
                     }
                 },
                 "config": {
                     "final": false,
                     "package": "me.lym.exception",
                     "defaultPackage": "me.lym.exception"
                 },
                 "subException": [
                     {
                         "id": "l2:l1",
                         "exceptionName": "BadRequest",
                         "config": {
                             "final": false,
                             "package": "",
                             "defaultPackage": "me.lym.exception"
                         },
                         "fields": {
                             "message":{
                                 "value": "",
                                 "defaultValue": "1",
                                 "type": "String",
                                 "final": false,
                                 "comments": "",
                                 "options": "",
                                 "originExceptionId": "baseException"
                             }
                         },
                     },
                     {
                         "id": "l2:l2",
                         "exceptionName": "BadGateway",
                         "config": {
                             "final": true,
                             "package": "",
                             "defaultPackage": "me.lym.exception"
                         },
                         "fields": {
                             "message":{
                                 "value": "",
                                 "defaultValue": "1",
                                 "type": "String",
                                 "final": false,
                                 "comments": "",
                                 "options": "",
                                 "originExceptionId": "baseException"
                             }
                         },
                     }
                 ]
             }
         ]
     }
 }




