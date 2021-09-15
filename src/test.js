var newException = JSON.parse("{\n" +
    "  \"id\": \"l1:l1\",\n" +
    "  \"exceptionName\": \"BadRequestException\",\n" +
    "  \"data\": {\n" +
    "    \"message\": \"message\",\n" +
    "    \"httpCode\": 200,\n" +
    "    \"messageForClient\": \"messageForClient\",\n" +
    "    \"code\": \"code\",\n" +
    "    \"newF1\": \"newF1\"\n" +
    "  },\n" +
    "  \"new-fields\": [\n" +
    "    {\n" +
    "      \"id\": \"\",\n" +
    "      \"fieldName\": \"newF1\",\n" +
    "      \"fieldType\": \"string\",\n" +
    "      \"defaultValue\": \"1\"\n" +
    "    }\n" +
    "  ],\n" +
    "  \"inherited-fields\": [\n" +
    "    {\n" +
    "      \"fieldName\": \"message\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"fieldName\": \"httpCode\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"fieldName\": \"messageForClient\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"fieldName\": \"code\",\n" +
    "      \"defaultValue\": \"200\"\n" +
    "    }\n" +
    "  ]\n" +
    "}")

var config = JSON.parse("{\n" +
    "  \"config\": {\n" +
    "    \"meta\": {\n" +
    "        \"version\": \"1.0Beta\",\n" +
    "        \"author\": \"lym\",\n" +
    "        \"create_time\": \"2021-09-14\",\n" +
    "        \"update_time\": \"2021-09-14\",\n" +
    "        \"support\": \"elementui\",\n" +
    "        \"description\": \"ceshi\"\n" +
    "    },\n" +
    "    \"settings\": {\n" +
    "        \"basePackage\": \"me.lym.exception\",\n" +
    "        \"baseExceptionClassName\": \"Exception\",\n" +
    "        \"baseExceptionClassFullPath\": \"java.lang.Exception\",\n" +
    "        \"useLombok\": \"true\",\n" +
    "        \"suffix\": \"Exception\",\n" +
    "        \"hiddenSuffix\": true\n" +
    "    },\n" +
    "    \"cols\": [\n" +
    "        {\n" +
    "            \"index\": 0,\n" +
    "            \"prop\": \"exceptionName\",\n" +
    "            \"title\": \"类名\",\n" +
    "            \"defaultValue\": \"defaultValue\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"index\": 1,\n" +
    "            \"prop\": \"message\",\n" +
    "            \"title\": \"message\",\n" +
    "            \"defaultValue\": \"defaultValue\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"index\": 2,\n" +
    "            \"prop\": \"httpCode\",\n" +
    "            \"title\": \"http状态码\",\n" +
    "            \"defaultValue\": \"defaultValue\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"index\": 3,\n" +
    "            \"prop\": \"code\",\n" +
    "            \"title\": \"编码\",\n" +
    "            \"defaultValue\": \"defaultValue\"\n" +
    "        },\n" +
    "        {\n" +
    "            \"index\": 4,\n" +
    "            \"prop\": \"messageForClient\",\n" +
    "            \"title\": \"提示信息\",\n" +
    "            \"defaultValue\": \"defaultValue\"\n" +
    "        }\n" +
    "    ],\n" +
    "    \"exceptions\": [\n" +
    "        {\n" +
    "            \"id\": \"l1\",\n" +
    "            \"exceptionName\": \"ServerException\",\n" +
    "            \"data\": {\n" +
    "                \"message\": \"message\",\n" +
    "                \"httpCode\": 200,\n" +
    "                \"messageForClient\": \"messageForClient\",\n" +
    "                \"code\": \"code\"\n" +
    "            },\n" +
    "            \"new-fields\": [\n" +
    "                {\n" +
    "                    \"id\": \"1\",\n" +
    "                    \"fieldName\": \"newF1\",\n" +
    "                    \"fieldType\": \"string\",\n" +
    "                    \"defaultValue\": \"newF1\"\n" +
    "                },\n" +
    "                {\n" +
    "                    \"fieldName\": \"newF1\",\n" +
    "                    \"defaultValue\": \"newF1\"\n" +
    "                }\n" +
    "            ],\n" +
    "            \"config\": {\n" +
    "                \"inheritable\": true\n" +
    "            },\n" +
    "            \"subException\": [\n" +
    "                {\n" +
    "                    \"id\": \"l1:l1\",\n" +
    "                    \"exceptionName\": \"BadRequestException\",\n" +
    "                    \"config\": {\n" +
    "                        \"inheritable\": true\n" +
    "                    },\n" +
    "                    \"data\": {\n" +
    "                        \"message\": \"message\",\n" +
    "                        \"httpCode\": 200,\n" +
    "                        \"messageForClient\": \"messageForClient\",\n" +
    "                        \"code\": \"code\",\n" +
    "                        \"newF1\": \"newF1\"\n" +
    "                    },\n" +
    "                    \"new-fields\": [\n" +
    "                        {\n" +
    "                            \"id\": \"1\",\n" +
    "                            \"fieldName\": \"newF1\",\n" +
    "                            \"fieldType\": \"string\",\n" +
    "                            \"defaultValue\": \"1\"\n" +
    "                        },\n" +
    "                        {\n" +
    "                            \"fieldName\": \"code\",\n" +
    "                            \"defaultValue\": \"200\"\n" +
    "                        }\n" +
    "                    ]\n" +
    "                },\n" +
    "                {\n" +
    "                    \"id\": \"l1:l2\",\n" +
    "                    \"exceptionName\": \"BadGatewayException\",\n" +
    "                    \"config\": {\n" +
    "                        \"inheritable\": true\n" +
    "                    },\n" +
    "                    \"data\": {\n" +
    "                        \"message\": \"message\",\n" +
    "                        \"httpCode\": 200,\n" +
    "                        \"messageForClient\": \"messageForClient\",\n" +
    "                        \"code\": \"code\",\n" +
    "                        \"newF2\": \"newF2\"\n" +
    "                    },\n" +
    "                    \"new-fields\": [\n" +
    "                        {\n" +
    "                            \"fieldName\": \"newF2\",\n" +
    "                            \"fieldType\": \"string\",\n" +
    "                            \"defaultValue\": \"newF2\"\n" +
    "                        }\n" +
    "                    ]\n" +
    "                }\n" +
    "            ]\n" +
    "        }\n" +
    "    ]\n" +
    "  }\n" +
    "}");

function queryExceptionById(exceptions,id) {
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


function updateExceptionById(config,newException){
    let allException = config.exceptions
    if (newException == null || newException.id == null) {
        return;
    }

    let oldException = queryExceptionById(allException, newException.id);
    let oldData = oldException.data
    let oldCols = [];
    for (let item of oldException['new-fields']) {
        var oc = config.cols;
        var oldCol = oc.find(function (x){
            return x.prop===item.fieldName
        })
        if (oldCol != null) {
            oldCols.push(oldCol);
        }
    }
    oldException.config = newException.config;
    oldException.exceptionName = newException.exceptionName;
    //删除oldException所有data，new-fields数据
    oldException.data = {};
    oldException['new-fields'] = newException['new-fields'];
    //遍历新的继承列表：添加到oldException.data里面，有默认值添加到new-fields，并为data赋值
    for (let item of newException['new-fields']) {
        let oldCol = oldCols.find(x=>{
            return item.fieldName === x.prop
        })

        let index = config.cols[config.cols.length-1].index+1;
        if (oldCol == null) {
            //插入到cols一个新的col
            let newCol = new Object();
            newCol.index = index;
            index++;
            newCol.prop = item.fieldName;
            newCol.title = item.title;
            newCol.defaultValue = item.defaultValue
            config.cols.push(newCol);
        }else {
            //从oldCols中移除
            let delIndex = oldCol.indexOf(oldCol);
            oldCol.splice(delIndex, 1);
        }
        if (Object.prototype.hasOwnProperty.call(oldData,item.fieldName)) {
            oldException.data[item.fieldName] = oldData[item.fieldName];
        }else {
            oldException.data[item.fieldName] = item.defaultValue;
        }
    }

    //遍历oldCols，剩下的都是上个版本有这个版本没有的，需要删除
    for (item of oldCols) {
        let delIndex = config.cols.indexOf(item);
        config.cols.splice(delIndex, 1);
    }
    for (let item in newException['inherited-fields']) {
        if (item.defaultValue != null) {
            oldException['new-fields'].push(item);
        }
        item = newException['inherited-fields'][item];
        if (Object.prototype.hasOwnProperty.call(oldData,item.fieldName)) {
            oldException.data[item.fieldName] = oldData[item.fieldName];
        }else {
            oldException.data[item.fieldName] = item.defaultValue;
        }
    }
}

console.log("update-before:")
console.log(config.config)
console.log("-------------------------")
console.log(newException)
console.log("====================================")
updateExceptionById(config.config, newException);
console.log("update-after:")
console.log(config.config)
console.log("-------------------------")
console.log(JSON.stringify(config.config.exceptions))
