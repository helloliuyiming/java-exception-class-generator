import structuredClone from '@ungap/structured-clone';
import {template} from './exceptionTemplate'
import {enumTemplate} from './enumTemplate'
import JSZip from "jszip";
import { saveAs } from 'file-saver';

export class ExceptionGenerator{

    manifest;
    constructor(manifest) {
        this.manifest = manifest
    }

    addCol(col) {
        let cols = this.manifest.config.cols;
        let index = cols.length;
        for (let i = 0; i < cols.length; i++) {
            if (col.originExceptionId.split(":") < cols[i].originExceptionId.split(":")) {
                index = i;
                break
            }
        }
        col.index = index+1;
        cols.splice(index,0,col)
        for (let i = index; i < cols.length; i++) {
            cols[i].index = i + 1;
        }
    }

    deleteColByExceptionId(id) {

    }


    queryById(id) {
        let exceptions = this.manifest.config.exceptions;
        let ids = id.split(":");
        let exception = null;
        let currentId = ""
        for (let i = 0; i < ids.length; i++) {
            if (currentId!=="") currentId+=":"
            currentId+=ids[i]
            exception = exceptions.find(function (element){
                return element.id===currentId
            })
            if (exception == null) {
                return null;
            }
            exceptions = exception.subException;
        }
        return exception;
    }

    updateById(oldId,newException) {

    }

    deleteById(id) {
        let parentExceptionId = id.substring(0, id.lastIndexOf(":"));
        let exceptions
        if (parentExceptionId === "") {
            exceptions = this.manifest.config.exceptions;
        }else {
            exceptions = this.queryById(parentExceptionId).subException
        }
        exceptions.map((value,index)=>{
            if (value.id === id) {
                exceptions.splice(index,1)
            }
        })

        console.log(exceptions)
    }


    generateSibling(id) {
        let parentExceptionId = id.substring(0, id.lastIndexOf(":"));
        if (parentExceptionId === "") {
            return this.generateBaseException()
        }else {
            return this.generateSubException(parentExceptionId)
        }
    }

    generateBaseException(){
        let baseException = Object();
        baseException.id = "l"+this.manifest.config.settings.nextId
        baseException.exceptionName = "";
        baseException.nextId = 1;
        baseException.config = Object();
        baseException.config.final = false;
        baseException.config.package = "";
        baseException.config.defaultPackage = this.manifest.config.settings.basePackage;
        baseException.fields = Object();
        let baseExceptionFields = this.manifest.config.settings.baseException.fields;
        for (let baseField of baseExceptionFields) {
            baseException.fields[baseField.field] = Object()
            baseException.fields[baseField.field].type = baseField.type;
        }

        baseException.subException = Array()
        this.manifest.config.settings.nextId++
        return baseException;
    }

    generateSubException(id) {
        let parentException = this.queryById(id);
        if (parentException == null) {
            throw "不能生成子异常类，不能找到id为"+id+"的父异常类"
        }
        if (parentException.config.final) {
            throw parentException.exceptionName + "类final修饰，不可被继承";
        }
        let newException = Object();
        newException.id = parentException.id+":l"+parentException.nextId;
        parentException.nextId++;
        newException.exceptionName = "";
        newException.nextId = 1
        newException.fields = Object();
        for (let field in parentException.fields) {
            if (field.final !== null && field.final) {
                continue
            }

            let newField = JSON.parse(JSON.stringify(parentException.fields[field]));
            // let newField = structuredClone(parentException.fields[field]);
            if (newField.originExceptionId == null || newField.originExceptionId === parentException.id) {
                newField.originExceptionId = parentException.id;
            }
            newField.value = "";
            newException.fields[field] = newField
        }
        newException.config = Object();
        newException.config.final = false;
        newException.config.package = null;
        console.log("parentException.config.package:"+parentException.config.package)
        console.log("parentException.config.defaultPackage:"+parentException.config.defaultPackage)
        if (parentException.config.package != null&&parentException.config.package !== '') {
            newException.config.defaultPackage = parentException.config.package;
        }else {
            newException.config.defaultPackage = parentException.config.defaultPackage;
        }
        newException.subException = Array()
        return newException;
    }


    insertSibling(id) {
        let parentExceptionId = id.substring(0, id.lastIndexOf(":"));
        if (parentExceptionId === "") {
            let baseException = this.generateBaseException();
            this.manifest.config.exceptions.push(baseException)
        }else {
            let parentException = this.queryById(parentExceptionId);
            if(parentException.subException === undefined){
            parentException.subException = Array()
            }
        parentException.subException.push(this.generateSubException(parentExceptionId));
        }
    }

    insertSubException(id) {
        let parentException = this.queryById(id)
        if (parentException.subException === undefined) {
            parentException.subException = Array();
        }
        parentException.subException.push(this.generateSubException(id));
    }

    updateException(newException) {
        if (newException==null) throw "newExceptionId不能为空"
        let oldException = this.queryById(newException.id);
        if (oldException==null) throw "未找到id为"+newException.id+"的记录"

        oldException.exceptionName = newException.exceptionName
        oldException.config = newException.config

        let cols = this.manifest.config.cols;
        let newCols = cols.filter((item)=>{
            return item.originExceptionId !== newException.id
        })
        this.manifest.config.cols = newCols

        let myFields = newException.fields.myFields;
        let inheritFields = newException.fields.inheritFields;
        for (const myField of myFields) {
            newException.fields[myField.fieldName] = myField
            let col = {"prop":myField.fieldName,"title":myField.comments,"originExceptionId":oldException.id}
            if (col.title === null || col.title === '') {
                col.title = myField
            }
            this.addCol(col);
        }
        delete newException.fields.myFields
        for (const inheritField of inheritFields) {
            newException.fields[inheritField.fieldName] = inheritField
        }
        delete newException.fields.inheritFields;
        oldException.fields = newException.fields
        this.sortCols()
        this.updateSubExceptionFields(oldException)

        console.log(this.manifest.config)

    }

    updateSubExceptionFields(newParentException) {
        let subExceptions = newParentException.subException;
        if (subExceptions==null||subExceptions.length===0) return
        for (let i = 0; i < subExceptions.length; i++) {

            let exception = subExceptions[i];

            //删除子类中父类已经删除的字段
            for (let fieldsKey in exception.fields) {
                if (exception.fields[fieldsKey].originExceptionId === exception.id) {
                    continue
                }
                if (exception.fields[fieldsKey].originExceptionId === newParentException.id) {
                    let existField = null;
                    for (const newFieldsKey in newParentException.fields) {
                        if (newFieldsKey === fieldsKey||(newParentException.fields[newFieldsKey].originField!==undefined&&newParentException.fields[newFieldsKey].originField===fieldsKey)) {
                            existField = newParentException.fields[newFieldsKey];
                            break
                        }
                    }

                    if (existField == null) {
                        console.log("delete")
                        delete exception.fields[fieldsKey]
                    }else if (existField.originField!==undefined){
                        console.log(existField)
                        exception.fields[existField.field] = exception.fields[fieldsKey]
                        delete exception.fields[fieldsKey]
                    }
                }
            }


            //使用父类字段对子类进行更新
            for (let parentFieldKey in newParentException.fields) {

                if (exception.fields[parentFieldKey] == null) {
                    exception.fields[parentFieldKey] = {
                        "value":null
                    }
                }
                exception.fields[parentFieldKey].defaultValue = newParentException.fields[parentFieldKey].value
                for (const fieldKey in newParentException.fields[parentFieldKey]) {
                    if (fieldKey==="value"||fieldKey==="defaultValue") continue
                    exception.fields[parentFieldKey][fieldKey] = newParentException.fields[parentFieldKey][fieldKey]
                }
            }

            //递归调用对子类的子类进行处理
            this.updateSubExceptionFields(exception)
        }
    }

    sortCols(){

    }

    generateException(exception) {

    }

    exportConfig(){
        let blob = new Blob([JSON.stringify(this.manifest)], {type: 'text/json'});
        let fileName = 'config.json'; // 文件名称
        const link = document.createElement('a'); // 创建a标签
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click(); // 模拟点击a标签
        window.URL.revokeObjectURL(link.href);
    }

    generate(){

        let zip = new JSZip();
        nunjucks.configure({ autoescape: true });

        let enums = this.manifest.config.enums;
        for (const enumItem of enums) {
            if (enumItem.package === undefined || enumItem.package === "") {
                enumItem.package = this.manifest.config.settings.basePackage+'.enums'
            }
            let result = nunjucks.renderString(enumTemplate,enumItem);
            let filePath = enumItem.package.replaceAll(".","/")+"/"+enumItem.name+".java";
            zip.file(filePath,result)
        }

        let exceptions = Array()
        for (let exception of this.manifest.config.exceptions) {
            exceptions.push(JSON.parse(JSON.stringify(exception)))
        }

        while (exceptions.length > 0) {
            let exception = exceptions.pop();
            if(exception.exceptionName===null || exception.exceptionName === '') continue;
            if (exception.subException !== undefined && exception.subException !== null) {
                for (let i = 0; i < exception.subException.length; i++) {
                    exceptions.push(JSON.parse(JSON.stringify(exception.subException[i])));
                }
            }


            let outFields = Array();
            for (const fieldsKey in exception.fields) {
                let field = {
                    field:fieldsKey,
                    type:exception.fields[fieldsKey].type,
                    final:exception.fields[fieldsKey].final,
                    value:exception.fields[fieldsKey].value
                }
                if (field.value === undefined || field.value === null) {
                    field.value = exception.fields[fieldsKey].defaultValue;
                }
                outFields.push(field)
            }
            exception.fields = outFields
            exception.requireGetter = true
            exception.requireSetter = true
            exception.config.suffix = this.manifest.config.settings.suffix
            let parentExceptionId = exception.id.substring(0, exception.id.lastIndexOf(":"));
            if (parentExceptionId === "") {
                exception.parentException = this.manifest.config.settings.baseException.className
            }else {
                exception.parentException = this.queryById(parentExceptionId).exceptionName+exception.config.suffix;
            }
            if (exception.config.package == null||exception.config.package==="") {
                exception.config.package = exception.config.defaultPackage
            }
            exception.exceptionName = exception.exceptionName+exception.config.suffix;

            console.log("================================================================")
            const result = nunjucks.renderString(template, exception);
            console.log("generate:"+result)
            let filePath = exception.config.package.replaceAll(".","/")+"/"+exception.exceptionName+".java"
            zip.file(filePath,result)
        }
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, "exceptions.zip");
            });

    }
}