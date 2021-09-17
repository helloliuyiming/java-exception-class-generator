
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

export function adapterExceptionForEditDialog(originException){
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

function queryBaseExceptionStructure(configData){
    let baseException = configData.config.settings
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




export function queryExceptionById(exceptions,id) {
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

export function queryParentExceptionById(exceptions,id) {
    let index = id.lastIndexOf(":")
    if (index === -1) {
        return null;
    }
    id = id.substr(0, index);
    return queryExceptionById(exceptions,id);
}

export function queryParentId(id) {
    let index = id.lastIndexOf(":")
    if (index === -1) {
        return null;
    }
    return id.substr(0, index);
}

export function copyExceptionStructureById(exceptions, id) {
    let parentException = queryParentExceptionById(exceptions,id);
    let length = 1;
    if (parentException == null) {
        length = exceptions.length;
    } else {
        length = parentException.subException.length;
    }
    length++;
    let newCleanException = JSON.parse(JSON.stringify(queryExceptionById(exceptions,id)));
    newCleanException.exceptionName = null;
    newCleanException.subException = [];
    let parentId = queryParentId(id);
    if (parentId == null) {
        newCleanException.id = "l" + length;
    } else {
        newCleanException.id = parentId + ":l" + length;
    }

    newCleanException["newFields"] = [];
    for (let key in newCleanException.data) {
        newCleanException.data[key] = null;
    }
    return newCleanException;
}

export function copyExceptionStructure(exceptions,originException) {
    return copyExceptionStructureById(exceptions,originException.id);
}

export function updateExceptionById(configData,newException){

    let config = configData.config
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


function queryExceptionStructureById(exceptions,id) {
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

export function insertCoeval(configData,id){
    let exceptions = configData.config.exceptions
    let split = id.split(":");
    let exception = null;
    let index = 0;
    if (split.length === 1) {
        exception = queryBaseExceptionStructure(configData);
        index = findNextIndex(exceptions) + 1;
        exception.id = queryParentId(id) + ":l" + index;
        exceptions.push(exception)
        return
    }else {
        exception = queryExceptionStructureById(exceptions,queryParentId(id));
        index = findNextIndex(queryParentExceptionById(id).subException);
    }
    exception.id = queryParentId(id) + ":l" + index;
    queryParentExceptionById(exceptions,id).subException.push(exception);
}

export function insertSub(exceptions,id) {
    // let split = id.split(":");
    let exception = queryExceptionStructureById(exceptions, id);
    let index = findNextIndex(queryExceptionById(exceptions,id).subException)+1;

    exception.id =id + ":l" + index;
    queryExceptionById(id).subException.push(exception);
}
