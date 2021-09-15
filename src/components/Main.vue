<template>
    <el-container>
        <el-aside style="background: #EBEEF5">

        </el-aside>
        <el-main>
            <h3>配置项</h3>

            <el-form :inline="true">

                <el-form-item label="basePackage">
                    <el-input v-model="config.settings.basePackage"></el-input>
                </el-form-item>

                <el-form-item label="suffix">
                    <el-input placeholder="Exception" v-model="config.settings.suffix"></el-input>
                </el-form-item>

                <el-form-item label="baseException">
                    <el-select v-model="config.settings.baseExceptionClassFullPath" placeholder="请选择">
                        <el-option
                            v-for="item in predefine.baseExceptions"
                            :key="item.className"
                            :label="item.className"
                            :value="item.classPackage">
                            <span style="float: left">{{ item.className }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.classPackage }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-checkbox v-model="config.settings.useLombok">lombok</el-checkbox>
                <el-checkbox v-model="config.settings.hiddenSuffix">hiddenSuffix</el-checkbox>

            </el-form>
            <el-button type="info">导入配置</el-button>
            <el-button type="success">导出配置</el-button>
            <el-button type="danger">
                重置
            </el-button>
            <el-button type="primary">
                生成
            </el-button>
            <h3>数据</h3>
            <el-table
                :data="config.exceptions"
                style="width: 100%"
                row-key="id"
                border
                lazy
                :tree-props="{children: 'subException'}">
                <el-table-column v-for="item in config.cols" :key="item.index" min-width="300px"
                                 :label="item.title">
                    <template v-if="item.prop==='exceptionName'" #default="scope">
                        <el-input type="text" size="small" v-model="scope.row['exceptionName']" style="width: 180px">
                            <template #append v-if="!config.settings.hiddenSuffix">{{
                                    config.settings.suffix
                                }}
                            </template>
                        </el-input>
                        <el-button type="info" icon="el-icon-plus" plain circle size="mini"
                                   @click="insertCoeval(scope.row.id)"></el-button>
                        <el-button type="warning" icon="el-icon-bottom-right" plain circle size="mini"
                                   @click="insertSub(scope.row.id)"></el-button>
                        <el-button type="info" icon="el-icon-edit-outline" plain circle size="mini"
                                   @click="changeEditExceptionDialogVisible(scope.row)"></el-button>
                    </template>
                    <template v-else #default="scope">
                        <el-input type="text" size="small" v-model="scope.row.data[item.prop]">
                        </el-input>
                    </template>
                </el-table-column>

            </el-table>


        </el-main>
        <el-dialog title="类结构编辑" :visible.sync="predefine.editExceptionDialogVisible">
            <template>

                <el-form>
                    <div style="margin: 10px">
                        <h4>继承字段</h4>
                        <el-form-item v-for="item in this.temp.editExceptionCache['inherited-fields']" :key="item.fieldName" :label="item.fieldName">
                            <el-input placeholder="继承" style="width: 200px" v-model="item.defaultValue"></el-input>
                        </el-form-item>
                    </div>

                    <div>
                        <h4>配置</h4>
                        <el-form-item label="异常类名">
                            <el-input style="width: 200px" v-model="temp.editExceptionCache.exceptionName"/>
                        </el-form-item>
                        <el-form :inline="true">
                            <el-form-item label="包" size="small">
                                <el-input v-model="temp.editExceptionCache.package"/>
                            </el-form-item>
                            <el-checkbox label="允许继承" name="type" v-model="temp.editExceptionCache.config.inheritable"></el-checkbox>

                        </el-form>

                    </div>
                    <div>
                        <h4>添加字段</h4>
                        <el-table :data="temp.editExceptionCache['new-fields']">
                            <el-table-column label="标题" #default="scope">
                                <template>
                                    <el-input style="width: 200px" v-model="scope.row.title"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="字段名" #default="scope">
                                <template>
                                    <el-input style="width: 200px" v-model="scope.row.fieldName"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="类型" #default="scope">
                                <template>
                                    <el-select v-model="scope.row.fieldType" placeholder="请选择">
                                        <el-option
                                            v-for="item in predefine.parameterTypeList"
                                            :key="item.className"
                                            :label="item.className"
                                            :value="item.className">
                                            <span style="float: left">{{ item.className }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.package }}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="默认值" #default="scope">
                                <template>
                                    <el-input style="width: 200px" v-model="scope.row.defaultValue"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template>
                                    <el-button type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="primary" plain size="small" @click="addNewField()">添加字段<i class="el-icon-plus el-icon--right"></i>
                        </el-button>
                    </div>
                </el-form>
                <span class="dialog-footer">
                    <el-button @click="predefine.editExceptionDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateExceptionById(temp.editExceptionCache)">保 存</el-button>
                    <el-checkbox label="更改子类默认字段"></el-checkbox>
                </span>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
import * as configUtil from '../util/config-util'
export default {
    name: "Main",
    methods: {
        insertSub(id) {
            if (id == null || id === "") {
                console.log("插入子级失败，id为空")
                return;
            }
            let parentException = configUtil.queryExceptionById(this.config.exceptions,id);
            console.log(2)
            let newException = null;
            let index = 1;
            if (parentException.subException != null && parentException.subException.length > 0) {
                newException = configUtil.copyExceptionStructure(this.config.exceptions,parentException.subException[0]);
                index = parentException.subException.length + 1;
            } else {
                parentException.subException = [];
                newException = configUtil.copyExceptionStructureById(this.config.exceptions,id);
            }
            console.log(3)
            newException.id = parentException.id + ":" + index
            parentException.subException.push(newException);
        },
        insertCoeval(id) {
            if (id == null || id === "") {
                console.log("插入同级失败，id为空")
                return;
            }
            let newException = configUtil.copyExceptionStructureById(this.config.exceptions,id);
            let parentId = configUtil.queryParentId(id);
            if (parentId == null) {
                this.config.exceptions.push(newException)
                return
            }
            let parentException = configUtil.queryExceptionById(this.config.exceptions,parentId);
            if (parentException.subException == null || parentException.subException.length === 0) {
                parentException.subException = [];
            }
            parentException.subException.push(newException);
        },
        changeEditExceptionDialogVisible(exception) {
            if (this.predefine.editExceptionDialogVisible === false) {
                this.temp.editExceptionCache = configUtil.adapterExceptionForEditDialog(exception)
            }
            this.predefine.editExceptionDialogVisible = !this.predefine.editExceptionDialogVisible;
        },
        updateExceptionById(exception){
            if (exception == null) {
                console.log("更新异常信息失败，exception为空")
            }
            console.log("oldException")
            console.log(exception)
            configUtil.updateExceptionById(this.config,exception)
            console.log("newException")
            console.log(configUtil.queryExceptionById(this.config.exceptions,exception.id))
            this.predefine.editExceptionDialogVisible = false;
        },
        addNewField() {
            console.log("addNewFiled")
            let newFieldObj = new Object();
            newFieldObj['id'] = null;
            newFieldObj['title'] = '';
            newFieldObj['fieldName'] = ""
            this.temp.editExceptionCache['new-fields'].push(newFieldObj)
        }
    },
    data() {
        return {
            "temp": {
                "editExceptionCache": {
                    "id": "l1:l1",
                    "exceptionName": "BadRequestException",
                    "data": {
                        "message": "message",
                        "httpCode": 200,
                        "messageForClient": "messageForClient",
                        "code": "code",
                        "newF1": "newF1"
                    },
                    "new-fields": [
                        {
                            "id": "",
                            "fieldName": "newF1",
                            "fieldType": "string",
                            "defaultValue": "1"
                        }
                    ],
                    "config":{
                      "inheritable":true
                    },
                    "inherited-fields": [
                        {
                            "fieldName": "message"
                        },
                        {
                            "fieldName": "httpCode"
                        },
                        {
                            "fieldName": "messageForClient"
                        },
                        {
                            "fieldName":"code","defaultValue":"200"}]}
            },
            "predefine": {
                "editExceptionDialogVisible": false,
                "baseExceptions": [
                    {
                        "className": "Exception",
                        "classPackage": "java.lang.Exception"
                    },
                    {
                        "className": "RuntimeException",
                        "classPackage": "java.lang.RuntimeException"
                    }
                ],
                "parameterTypeList":[
                    {
                        "className":"String",
                        "package":"java.lang.String"
                    },
                    {
                        "className":"Integer",
                        "package":"java.lang.Integer"
                    },
                    {
                        "className":"Float",
                        "package":"java.lang.Float"
                    },
                    {
                        "className":"Double",
                        "package":"java.lang.Double"
                    }
                ]
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
                    "baseExceptionClassName": "Exception",
                    "baseExceptionClassFullPath": "java.lang.Exception",
                    "useLombok": "true",
                    "suffix": "Exception",
                    "hiddenSuffix": true
                },
                "cols": [
                    {
                        "index": 0,
                        "prop": "exceptionName",
                        "title": "类名",
                        "defaultValue": "defaultValue"
                    },
                    {
                        "index": 1,
                        "prop": "message",
                        "title": "message",
                        "defaultValue": "defaultValue"
                    },
                    {
                        "index": 2,
                        "prop": "httpCode",
                        "title": "http状态码",
                        "defaultValue": "defaultValue"
                    },
                    {
                        "index": 3,
                        "prop": "code",
                        "title": "编码",
                        "defaultValue": "defaultValue"
                    },
                    {
                        "index": 4,
                        "prop": "messageForClient",
                        "title": "提示信息",
                        "defaultValue": "defaultValue"
                    }
                ],
                "exceptions": [
                    {
                        "id": "l1",
                        "exceptionName": "ServerException",
                        "data": {
                            "message": "message",
                            "httpCode": 200,
                            "messageForClient": "messageForClient",
                            "code": "code"
                        },
                        "new-fields": [
                            {
                                "id": "1",
                                "fieldName": "newF1",
                                "fieldType": "string",
                                "defaultValue": "newF1"
                            },
                            {
                                "fieldName": "code",
                                "defaultValue": "3"
                            }
                        ],
                        "config": {
                            "inheritable": true
                        },
                        "subException": [
                            {
                                "id": "l1:l1",
                                "exceptionName": "BadRequestException",
                                "config": {
                                    "inheritable": true
                                },
                                "data": {
                                    "message": "message",
                                    "httpCode": 200,
                                    "messageForClient": "messageForClient",
                                    "code": "code",
                                    "newF1": "newF1"
                                },
                                "new-fields": [
                                    {
                                        "id": "1",
                                        "fieldName": "newF1",
                                        "fieldType": "string",
                                        "defaultValue": "1"
                                    },
                                    {
                                        "fieldName": "code",
                                        "defaultValue": "200"
                                    }
                                ]
                            },
                            {
                                "id": "l1:l2",
                                "exceptionName": "BadGatewayException",
                                "config": {
                                    "inheritable": true
                                },
                                "data": {
                                    "message": "message",
                                    "httpCode": 200,
                                    "messageForClient": "messageForClient",
                                    "code": "code",
                                    "newF2": "newF2"
                                },
                                "new-fields": [
                                    {
                                        "fieldName": "newF2",
                                        "fieldType": "string",
                                        "defaultValue": "newF2"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
    }
}
</script>

<style scoped>

</style>
