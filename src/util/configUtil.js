
function findNextIndex(exceptions){
    if (exceptions === undefined || exceptions == null) {
        return 1;
    }

    let index = 0;
    for (let exception of exceptions) {
        let id = exception.id;
        let lastId = id.split(":").pop();
        let i = lastId.substr(1, lastId.length - 1);
        i = parseInt(i);
        console.log("lastId="+lastId+" ;i="+i)
        if (i > index) {
            index = i;
        }
    }
    return parseInt(index)+1;
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
    let baseException = configData.config.settings.baseException
    let exception = {};
    exception.exceptionName = null;
    exception.subException = new Array();
    exception.data = {};
    exception.config = {"inheritable": true};
    exception.newFields = new Array();

    for(let baseExceptionField of baseException.Fields){
        let field = new Object();
        field.type = baseExceptionField.type
        field.defaultValue = ""
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


    let oldException = queryExceptionById(configData.config.exceptions, newException.id);

    oldException.config = newException.config
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

            let colObj = new Object();
            colObj.index = config.cols.length+1
            colObj.prop = newField.fieldName
            colObj.title = newField.title
            config.cols.push(colObj);
            //给当前exception及其子类data添加数据域
            let newDataObj = new Object();
            newDataObj.defaultValue = newField.defaultValue
            newDataObj.type = newField.fieldType
            newDataObj.value = ""
            let field = new Object();
            field.title = newField.title
            field.fieldName = newField.fieldName
            field.fieldType = newField.fieldType
            field.defaultValue = newField.defaultValue
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


function queryExceptionStructureById(configData,id) {
    if (id == null) {
        return null;
    }
    let exceptions = configData.config.exceptions
    let exception = queryBaseExceptionStructure(configData);

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
        index = findNextIndex(exceptions);
        exception.id = "l" + index;

        exceptions.push(exception)
        return
    }else {
        exception = queryExceptionStructureById(configData,queryParentId(id));
        index = findNextIndex(queryParentExceptionById(exceptions,id).subException);
    }
    exception.id = queryParentId(id) + ":l" + index;
    let parentException = queryParentExceptionById(exceptions,id);
    exception.config.inheritable = true;
    exception.config.package = parentException.config.package
    parentException.subException.push(exception);
}

export function insertSub(configData,id) {
    let split = id.split(":");
    let index = 0;
    let parentException = queryExceptionById(configData.config.exceptions,id)
    if (split.length === 1) {
        index = findNextIndex(configData.config.exceptions)+1
    }else {
        index = findNextIndex(parentException.subException)+1;
    }
    let exception = queryExceptionStructureById(configData, id);


    exception.id =id + ":l" + index;
    exception.config.inheritable = true;
    exception.config.package = parentException.config.package
    if (parentException.subException == null) {
        parentException.subException = new Array();
    }
    parentException.subException.push(exception);
}

import defaultConfigData from '../data/defaultConfig.json'

export function loadConfigData(){
    let localStorage = window.localStorage;
    if (localStorage == null) {
        console.error("浏览器不支持localStorage")
        return null;
    }
    let configData = localStorage.getItem("configData");
    if (configData != null) {
        return configData;
    }
    return defaultConfigData;
}


export function saveConfigData(){
    // let localStorage = window.localStorage;
    // localStorage.setItem("configData",JSON.stringify(configData,null,2))
    console.log("保存configData成功");
}

import JsZip from 'jszip'
import { saveAs } from 'file-saver'
import Formatter from "auto-format"

export function generate(configData){

    let packageObj = new Array();
    configData = JSON.parse(JSON.stringify(configData,null,2))

    let parentException = configData.config.settings.baseException.className
    let parentExceptionFullName = configData.config.settings.baseException.classFullName;
    let parentExceptionPackage = getClassPackageByFullName(parentExceptionFullName);
    let suffix = configData.config.settings.suffix

    let exceptionArray = new Array();
    for (let e of configData.config.exceptions) {
        e.parentException = parentException
        e.parentExceptionFullName = parentExceptionFullName
        e.parentExceptionPackage = parentExceptionPackage;
        exceptionArray.push(e);
    }
    let zip = new JsZip();
    var indentToken = "\t";
    var javaFormatter = Formatter.createJavaFormatter(indentToken);

    while (exceptionArray.length !== 0) {
        let exception = exceptionArray.pop();
        if (exception.exceptionName == null) {
            continue;
        }

        let importSet = new Set();
        importSet.add(exception.parentExceptionFullName);
        let classPackageInfo = "package ";
        if (exception.config.package != null&&exception.config.package!=="") {
            classPackageInfo+=exception.config.package+";";
        }else {
            classPackageInfo+=exception.config.defaultPackage+";";
        }
        let classConstructorInfo = "";
        let classFieldInfo = "";
        let classMethodInfo = "";
        let classCodeInfo = "public class "+exception.exceptionName+suffix+" extends "+exception.parentException;
        if (exception.id.split(":").length>1){
            classCodeInfo += suffix;
        }

        classCodeInfo += " { \n";
        let defaultConstructor = "public "+exception.exceptionName+suffix+"() {}\n";
        let fullParameterStatement = "public "+exception.exceptionName+suffix+"(";
        let fullParameterConstructorBody = "";
        for (let field in exception.data) {

            fullParameterStatement+= exception.data[field].type+" "+field+", ";
            fullParameterConstructorBody+="\nthis."+field+" = "+field+";"

            let newNewField = exception.newFields.find(item=>{
                return item.fieldName === field;
            })
            let isInherit = !(newNewField != null && newNewField.fieldType !=null)

            let fieldData = exception.data[field];
            classFieldInfo += "private "+fieldData.type+" "+field+" = "
            if (fieldData.value != null) {
                classFieldInfo+=fieldData.value+" ;\n"
            }else {
                classFieldInfo+=fieldData.defaultValue+" ;\n"
            }
            if (isInherit) {
                classMethodInfo += "@Override\n";
            }
            classMethodInfo += "public "+fieldData.type+" get"+field.charAt(0).toUpperCase()+field.slice(1)+"(){\n" +
                "return this."+field+";\n" +
                "}\n\n";
        }

        if (exception.subException != null) {
            for (let subException of exception.subException) {
                subException.parentException = exception.exceptionName;
                subException.parentExceptionFullName = exception.config.package+"."+exception.exceptionName;
                subException.parentExceptionPackage = getClassPackageByFullName(subException.parentExceptionFullName);
                exceptionArray.push(subException);
            }
        }

        if (fullParameterStatement.charAt(fullParameterStatement.length - 2) === ',') {
            fullParameterStatement = fullParameterStatement.substr(0, fullParameterStatement.length - 2);
        }

        let fullParameterConstructor = fullParameterStatement+"){"+fullParameterConstructorBody+"\n}\n";

        classConstructorInfo+=defaultConstructor+"\n"+fullParameterConstructor;
        classCodeInfo+=classFieldInfo+"\n"+classConstructorInfo+"\n"+classMethodInfo+"\n}"
        let classFile = classPackageInfo + "\n" + classCodeInfo
        let formattedCode = javaFormatter.format(classFile);
        formattedCode = classFile;

        if (exception.config.package != null &&exception.config.package!=="" && packageObj[exception.config.package] == null) {
            packageObj[exception.config.package] = new Array();
        }else if (packageObj[exception.config.defaultPackage] == null) {
            packageObj[exception.config.defaultPackage] = new Array();
        }
        let fileObj = new Object();
        fileObj.fileName = exception.exceptionName +suffix+ ".java";
        fileObj.formattedCode = formattedCode;
        if (exception.config.package != null&&exception.config.package!=="") {
            packageObj[exception.config.package].push(fileObj);
        }else {
            packageObj[exception.config.defaultPackage].push(fileObj);
        }

    }

    for (let packageInfo in packageObj) {
        let folder = zip.folder(packageInfo.replaceAll(".","/"));
        for (let fileDataObj of packageObj[packageInfo]) {
            folder.file(fileDataObj.fileName,fileDataObj.formattedCode)
        }
    }

    zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, "exceptions.zip");
        });

}

function getClassPackageByFullName(classFullName) {
    if (classFullName===null) return null;
    let splites = classFullName.split(".");
    if (splites.length<=1) return "";
    return classFullName.substr(0,classFullName.length-splites[splites.length-1].length-1);
}
