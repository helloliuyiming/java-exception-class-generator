export function adapterExceptionForEditDialog(exceptions){
    if (exceptions == null) {
        return;
    }
    exceptions = JSON.parse(JSON.stringify(exceptions));
    let newFields = exceptions['new-fields'];
    exceptions['inherited-fields'] = new Array();
    let inheritedFields = exceptions['inherited-fields'];
    let dataObj = exceptions['data']
    for (let key in dataObj) {
        let newField = newFields.find(item=>{
            if (item.fieldName === key) {
                return true;
            }
        });
        if (newField == null) {
            newField = new Object();
            newField.fieldName = key;
            inheritedFields.push(newField)
        }else if (newField['id'] == null) {
            inheritedFields.push(newField);
            let index = newFields.indexOf(newField);
            newFields.splice(index,1)
        }
    }
    return exceptions;
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
    let parentId = this.queryParentId(id);
    if (parentId == null) {
        newCleanException.id = "l" + length;
    } else {
        newCleanException.id = parentId + ":l" + length;
    }

    newCleanException["new-fields"] = [];
    for (let key in newCleanException.data) {
        newCleanException.data[key] = null;
    }
    return newCleanException;
}

export function copyExceptionStructure(exceptions,originException) {
    return copyExceptionStructureById(exceptions,originException.id);
}

export function updateExceptionById(config,newException){
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
    for (let newFieldItem of newException['new-fields']) {
        let oldCol = oldCols.find(oldColItem=>{
            return newFieldItem.fieldName === oldColItem.prop
        })

        let index = config.cols[config.cols.length-1].index+1;
        if (oldCol == null) {
            //插入到cols一个新的col
            let newCol = new Object();
            newCol.index = index;
            index++;
            newCol.prop = newFieldItem.fieldName;
            newCol.title = newFieldItem.title;
            newCol.defaultValue = newFieldItem.defaultValue
            config.cols.push(newCol);
        }else {
            //从oldCols中移除
            let delIndex = oldCols.indexOf(oldCol);
            oldCols.splice(delIndex, 1);
        }
        if (Object.prototype.hasOwnProperty.call(oldData,newFieldItem.fieldName)) {
            oldException.data[newFieldItem.fieldName] = oldData[newFieldItem.fieldName];
        }else {
            oldException.data[newFieldItem.fieldName] = newFieldItem.defaultValue;
        }
    }

    //遍历oldCols，剩下的都是上个版本有这个版本没有的，需要删除
    for (let item of oldCols) {
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
