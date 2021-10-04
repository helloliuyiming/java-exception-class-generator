
let exceptions = JSON.parse("[\n" +
    "            {\n" +
    "                \"id\": \"l1\",\n" +
    "                \"exceptionName\": \"ServerException\",\n" +
    "                \"data\": {\n" +
    "                    \"message\":{\n" +
    "                        \"value\": \"\",\n" +
    "                        \"defaultValue\": \"1\",\n" +
    "                        \"type\": \"string\"\n" +
    "                    },\n" +
    "                    \"httpCode\": {\n" +
    "                        \"value\": 200,\n" +
    "                        \"defaultValue\": 200,\n" +
    "                        \"type\": \"string\"\n" +
    "                    },\n" +
    "                    \"messageForClient\": {\n" +
    "                        \"value\": \"\",\n" +
    "                        \"defaultValue\": \"messageForClient\",\n" +
    "                        \"type\": \"string\"\n" +
    "                    },\n" +
    "                    \"code\": {\n" +
    "                        \"value\": \"code\",\n" +
    "                        \"defaultValue\": \"code\",\n" +
    "                        \"type\": \"string\"\n" +
    "                    }\n" +
    "                },\n" +
    "                \"newFields\": [\n" +
    "                    {\n" +
    "                        \"id\": \"1\",\n" +
    "                        \"title\": \"\",\n" +
    "                        \"fieldName\": \"newF1\",\n" +
    "                        \"fieldType\": \"string\",\n" +
    "                        \"defaultValue\": \"newF1\"\n" +
    "                    },\n" +
    "                    {\n" +
    "                        \"fieldName\": \"newF1\",\n" +
    "                        \"defaultValue\": \"newF1\"\n" +
    "                    }\n" +
    "                ],\n" +
    "                \"config\": {\n" +
    "                    \"inheritable\": true\n" +
    "                },\n" +
    "                \"subException\": [\n" +
    "                    {\n" +
    "                        \"id\": \"l1:l1\",\n" +
    "                        \"exceptionName\": \"BadRequestException\",\n" +
    "                        \"config\": {\n" +
    "                            \"inheritable\": true\n" +
    "                        },\n" +
    "                        \"data\": {\n" +
    "                            \"message\":{\n" +
    "                                \"value\": \"\",\n" +
    "                                \"defaultValue\": \"1\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"httpCode\": {\n" +
    "                                \"value\": 200,\n" +
    "                                \"defaultValue\": 200,\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"messageForClient\": {\n" +
    "                                \"value\": \"\",\n" +
    "                                \"defaultValue\": \"messageForClient\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"code\": {\n" +
    "                                \"value\": \"code\",\n" +
    "                                \"defaultValue\": \"code\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            }\n" +
    "                        },\n" +
    "                        \"newFields\": [\n" +
    "                            {\n" +
    "                                \"id\": \"1\",\n" +
    "                                \"title\": \"\",\n" +
    "                                \"fieldName\": \"newF1\",\n" +
    "                                \"fieldType\": \"string\",\n" +
    "                                \"defaultValue\": \"1\"\n" +
    "                            },\n" +
    "                            {\n" +
    "                                \"fieldName\": \"code\",\n" +
    "                                \"defaultValue\": \"200\"\n" +
    "                            }\n" +
    "                        ]\n" +
    "                    },\n" +
    "                    {\n" +
    "                        \"id\": \"l1:l2\",\n" +
    "                        \"exceptionName\": \"BadGatewayException\",\n" +
    "                        \"config\": {\n" +
    "                            \"inheritable\": true\n" +
    "                        },\n" +
    "                        \"data\": {\n" +
    "                            \"message\":{\n" +
    "                                \"value\": \"\",\n" +
    "                                \"defaultValue\": \"1\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"httpCode\": {\n" +
    "                                \"value\": 200,\n" +
    "                                \"defaultValue\": 200,\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"messageForClient\": {\n" +
    "                                \"value\": \"\",\n" +
    "                                \"defaultValue\": \"messageForClient\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            },\n" +
    "                            \"code\": {\n" +
    "                                \"value\": \"code\",\n" +
    "                                \"defaultValue\": \"code\",\n" +
    "                                \"type\": \"string\"\n" +
    "                            }\n" +
    "                        },\n" +
    "                        \"newFields\": [\n" +
    "                            {\n" +
    "                                \"title\": \"\",\n" +
    "                                \"fieldName\": \"newF2\",\n" +
    "                                \"fieldType\": \"string\",\n" +
    "                                \"defaultValue\": \"newF2\"\n" +
    "                            }\n" +
    "                        ]\n" +
    "                    }\n" +
    "                ]\n" +
    "            }\n" +
    "        ]");


let baseException = JSON.parse("{" +
    "\"baseExceptionClassName\": \"Exception\",\n" +
    "            \"baseExceptionClassFullName\": \"java.lang.Exception\",\n" +
    "            \"baseExceptionFields\":[\n" +
    "                {\n" +
    "                    \"field\":\"message\",\n" +
    "                    \"type\":\"string\"\n" +
    "                }\n" +
    "            ]}");

let config = JSON.parse("{\n" +
    "        \"meta\": {\n" +
    "            \"version\": \"1.0Beta\",\n" +
    "            \"author\": \"lym\",\n" +
    "            \"create_time\": \"2021-09-14\",\n" +
    "            \"update_time\": \"2021-09-14\",\n" +
    "            \"support\": \"elementui\",\n" +
    "            \"description\": \"ceshi\"\n" +
    "        },\n" +
    "        \"settings\": {\n" +
    "            \"basePackage\": \"me.lym.exception\",\n" +
    "            \"baseExceptionClassName\": \"Exception\",\n" +
    "            \"baseExceptionClassFullName\": \"java.lang.Exception\",\n" +
    "            \"baseExceptionFields\":[\n" +
    "                {\n" +
    "                    \"field\":\"message\",\n" +
    "                    \"type\":\"string\"\n" +
    "                }\n" +
    "            ],\n" +
    "            \"useLombok\": \"true\",\n" +
    "            \"suffix\": \"Exception\",\n" +
    "            \"hiddenSuffix\": true\n" +
    "        },\n" +
    "        \"cols\": [\n" +
    "            {\n" +
    "                \"index\": 0,\n" +
    "                \"prop\": \"exceptionName\",\n" +
    "                \"title\": \"类名\",\n" +
    "                \"defaultValue\": \"defaultValue\"\n" +
    "            },\n" +
    "            {\n" +
    "                \"index\": 1,\n" +
    "                \"prop\": \"message\",\n" +
    "                \"title\": \"message\",\n" +
    "                \"defaultValue\": \"defaultValue\"\n" +
    "            },\n" +
    "            {\n" +
    "                \"index\": 2,\n" +
    "                \"prop\": \"httpCode\",\n" +
    "                \"title\": \"http状态码\",\n" +
    "                \"defaultValue\": \"defaultValue\"\n" +
    "            },\n" +
    "            {\n" +
    "                \"index\": 3,\n" +
    "                \"prop\": \"code\",\n" +
    "                \"title\": \"编码\",\n" +
    "                \"defaultValue\": \"defaultValue\"\n" +
    "            },\n" +
    "            {\n" +
    "                \"index\": 4,\n" +
    "                \"prop\": \"messageForClient\",\n" +
    "                \"title\": \"提示信息\",\n" +
    "                \"defaultValue\": \"defaultValue\"\n" +
    "            }\n" +
    "        ]}");
function findNextIndex(exceptions){
    let index = 0;
    for (let exception of exceptions) {
        let id = exception.id;
        let lastId = id.split(":").pop();
        let i = lastId.substr(1, lastId.length - 1);
        if (i > index) {
            index = i;
        }
    }
    return ++index;
}

function queryParentId(id) {
    let index = id.lastIndexOf(":")
    if (index === -1) {
        return null;
    }
    return id.substr(0, index);
}

function queryExceptionById(id) {
    let split = id.split(":");
    let myException = exceptions;
    let splitElement = "";
    for (var i = 0; i < split.length; i++) {
        if (splitElement !== "") {
            splitElement += ":";
        }
        splitElement = splitElement + split[i];
        let newMyException = myException.find(function (x) {
            if (x.id === splitElement) {
                return true
            }
        })
        if (i < split.length - 1) {
            myException = newMyException.subException;
        } else {
            myException = newMyException;
        }

    }
    return myException;
}

function queryParentExceptionById(id) {
    let index = id.lastIndexOf(":")
    if (index === -1) {
        return null;
    }
    id = id.substr(0, index);
    return queryExceptionById(id);
}

function queryBaseExceptionStructure(){
    let exception = {};
    exception.exceptionName = null;
    exception.subException = new Array();
    exception.data = {};
    exception.config = {"inheritable": true};
    exception.newFields = new Array();

    for(let baseExceptionField of baseException.baseExceptionFields){
        let field = new Object();
        field.type = baseExceptionField.type
        exception.data[baseExceptionField.field] = field
    }
    return exception;
}

function queryExceptionStructureById(id) {
    if (id == null) {
        return null;
    }

    let exception = queryBaseExceptionStructure();

    let splits = id.split(":");
    id = null;
    let currentException = null;
    for (let split of splits) {
        if (id == null) {
            id = split;
            currentException = exceptions.find(item=>{
                return item.id === id;
            });
        }else {
            id = id + ":" + split;
            currentException = currentException.subException.find(item=>{
                return item.id === id;
            });
        }

        for (let newField of currentException.newFields) {
            let oldData = exception.data[newField.fieldName]
            if (oldData == null) {
                oldData = {"defaultValue":newField.defaultValue,"type":newField.fieldType}
                exception.data[newField.fieldName] = oldData
            }else {
                oldData.defaultValue = newField.defaultValue
            }
        }

    }
    return exception;
}

function deleteExceptionById(id){
    let split = id.split(":");
    if (split.length === 1) {
        let index = exceptions.indexOf(queryExceptionById(id));
        exceptions.splice(index, 1)
        return;
    }
    let parentException = queryExceptionById(queryParentId(id))
    let index = parentException.subException.indexOf(queryExceptionById(id));
    parentException.subException.splice(index, 1);
}


function insertCoeval(id){
    let split = id.split(":");
    let exception = null;
    let index = 0;
    if (split.length === 1) {
        exception = queryBaseExceptionStructure();
        index = findNextIndex(exceptions) + 1;

    }else {
        exception = queryExceptionStructureById(queryParentId(id));
        index = findNextIndex(queryParentExceptionById(id).subException);
    }
    exception.id = queryParentId(id) + ":l" + index;
    queryParentExceptionById(id).subException.push(exception);
}

function insertSub(id) {
    let split = id.split(":");
    let exception = queryExceptionStructureById(id);
    let index = findNextIndex(queryExceptionById(id).subException)+1;

    exception.id =id + ":l" + index;
    queryExceptionById(id).subException.push(exception);
}

function adapterExceptionForEditDialog(originException){
    if (originException == null) {
        return;
    }
    let newException = JSON.parse(JSON.stringify(originException));
    let newFields = newException['newFields'];
    newException['inherited-fields'] = new Array();
    let inheritedFields = newException['inherited-fields'];
    let dataObj = newException['data']
    for (let key in dataObj) {
        let newField = newFields.find(item=>{
            if (item.fieldName === key) {
                return true;
            }
        });
        if (newField == null) {
            newField = new Object();
            newField.fieldName = key;
            newField.defaultValue = dataObj[key].defaultValue;
            newField.fieldType = dataObj[key].fieldType;
            inheritedFields.push(newField)
        }else if (newField['title'] === undefined) {
            inheritedFields.push(newField);
            let index = newFields.indexOf(newField);
            newFields.splice(index,1)
        }
    }
    for (let newField of newFields) {
        newField.updateFlag = false;
        newField.deleteFlag = false;
        newField.newFlag = false;
    }
    return newException;
}

function updateExceptionById(configData,newException){

    if (newException == null || newException.id == null) {
        return;
    }

    let oldException = queryExceptionById(newException.id);

    let tempExceptionArray = new Array();

    //更改newException及其子类下所有默认值
    for (let inheritField of newException['inherited-fields']) {
        tempExceptionArray.push(oldException)
        while (tempExceptionArray.length !== 0) {
            let tempException = tempExceptionArray.pop();
            if (tempException.subException != null) {
                for (let e of tempException.subException) {
                    tempExceptionArray.push(e);
                }
            }
            tempException.data[inheritField.fieldName].defaultValue = inheritField.defaultValue
        }
    }

    for (let newField of newException['newFields']) {
        //新增又给删了，所以没什么意义不处理
        if (newField.newFlag && newField.deleteFlag) {
            continue;
        }

        //新增字段
        if (newField.newFlag && !newField.deleteFlag) {
            //增加一列到cols
            let colObj = {"index":config.cols.length+1,"prop":newField.fieldName,"title":newField.title};
            config.cols.push(colObj);
            //给当前exception及其子类data添加数据域
            let newDataObj = {"defaultValue": newField.defaultValue, "type": newField.fieldType, "value": null};
            let field = {
                "title": newField.title,
                "fieldName": newField.fieldName,
                "fieldType": newField.fieldType,
                "defaultValue": newField.defaultValue
            };
            oldException.newFields.push(field);
            tempExceptionArray.push(oldException)
            while (tempExceptionArray.length !== 0) {
                let tempException = tempExceptionArray.pop();
                tempException.data[newField.fieldName] = newDataObj
                if (tempException.subException != null) {
                    for (let e of tempException.subException) {
                        tempExceptionArray.push(e);
                    }
                }
            }
            continue;
        }

        //删除字段
        if (!newField.newFlag && newField.deleteFlag) {
            //删除cols数据
            let deleteCol = config.cols.find(col=>{
                return col.prop === newField.fieldName
            })
            let deleteIndex = config.cols.indexOf(deleteCol);
            config.cols.splice(deleteCol, 1);
            for (let index = 0; index < config.cols.length; index++) {
                config.cols[index].id = index
            }
            //删除newField数据
            let deleteField = oldException.newFields.find(item=>{
                return item.fieldName = newField.fieldName
            })
            deleteIndex = oldException.indexOf(deleteField);
            oldException.newFields.splice(deleteIndex, 1);

            //删除exception及其子类data数据
            tempExceptionArray.push(oldException)
            while (tempExceptionArray.length !== 0) {
                let tempException = tempExceptionArray.pop();
                delete tempException.data[newField.fieldName]
                if (tempException.subException != null) {
                    for (let e of tempException.subException) {
                        tempExceptionArray.push(e);
                    }
                }
            }
            continue;
        }

        //更新字段
        if (!newField.newFlag && newField.updateFlag) {
            //更新col
            let oldCol = config.cols.find(item=>{
                return item.prop===newField.originFieldName
            })
            oldCol.prop = newField.fieldName
            oldCol.title = newField.title

            //更新newFields
            let oldField = oldException.newFields.find(item=>{
                return item.fieldName === newField.fieldName;
            })
            oldField.fieldName = newField.fieldName
            oldField.defaultValue = newField.defaultValue
            oldField.fieldType = newField.fieldType

            //更新data
            tempExceptionArray.push(oldException);
            while (tempExceptionArray.length !== 0) {
                let tempException = tempExceptionArray.pop();
                if (tempException.subException != null) {
                    for (let e of tempException.subException) {
                        tempExceptionArray.push(e);
                    }
                }
                tempException.data[newField.fieldName] = {"value":tempException.data[newField.originFieldName].value}
                delete tempException.data[newField.originFieldName]
                tempException.data[newField.fieldName].defaultValue = newField.defaultValue
                tempException.data[newField.fieldName].type = newField.fieldType
            }
            continue;
        }
    }

}

function configUtil(){

}


