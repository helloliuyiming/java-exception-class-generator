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
                    <el-select v-model="temp.baseException" filterable placeholder="请选择" @change="changeBaseException">
                        <el-option
                            v-for="item in predefine.baseExceptions"
                            :key="item.classFullName"
                            :label="item.className"
                            :value="item.classFullName">
                            <span style="float: left">{{ item.className }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.classFullName }}</span>
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
                                 :label="item.title" >
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
                        <el-input type="text" v-if="scope.row.data[item.prop] !== undefined" size="small" v-model="scope.row.data[item.prop].value" :placeholder="scope.row.data[item.prop].defaultValue">
                        </el-input>
                        <span v-else></span>
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
                        <el-table :data="temp.editExceptionCache['newFields']">
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
                                    <el-select v-model="scope.row.fieldType" placeholder="请选择" @change="scope.row.updateFlag = true">
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
                                    <el-input style="width: 200px" v-model="scope.row.defaultValue" @change="scope.row.updateFlag = true"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="非空" #default="scope">
                                <template>
                                    <el-checkbox style="width: 200px" v-model="scope.row.isNullAble" @change="scope.row.updateFlag = true"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" #default="scope">
                                <template>
                                    <el-button type="danger" @click="scope.row.deleteFlag = !scope.row.deleteFlag">删除</el-button>
                                    <span v-if="scope.row.deleteFlag">已删除</span>
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


        <el-dialog title="异常基类编辑器" :visible.sync="predefine.editBaseExceptionDialogVisible">
            <template>
                <el-form>
                    <el-form-item>
                        <el-input type="text" label="基类全限定名" style="width: 150px"/>
                    </el-form-item>

                </el-form>
                <span class="dialog-footer">
                    <el-button @click="predefine.editBaseExceptionDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="predefine.editBaseExceptionDialogVisible = false">保 存</el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
import * as configUtil from '../util/config-util'
import {configData} from "@/data/config";
export default {
    name: "Main",
    methods: {
        changeBaseException(item){
            console.log(item)
            if (item == null) {
                this.predefine.editBaseExceptionDialogVisible = true
            }else {
                this.config.settings.baseExceptionClassFullName = item.classFullName
            }
        },
        insertSub(id) {
            if (id == null || id === "") {
                console.log("插入子级失败，id为空")
                return;
            }
            configUtil.insertSub(this,id)
        },
        insertCoeval(id) {
            if (id == null || id === "") {
                console.log("插入同级失败，id为空")
                return;
            }
            configUtil.insertCoeval(this,id)
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
            configUtil.updateExceptionById(this,exception)
            console.log("newException")
            console.log(configUtil.queryExceptionById(this.config.exceptions,exception.id))
            console.log("newConfigData")
            console.log(JSON.stringify(this.config,null,2))
            this.predefine.editExceptionDialogVisible = false;
        },
        addNewField() {
            console.log("addNewFiled")
            let newFieldObj = new Object();
            newFieldObj['id'] = null;
            newFieldObj['title'] = '';
            newFieldObj['fieldName'] = ""
            newFieldObj.newFlag = true;
            newFieldObj.deleteFlag = false;
            newFieldObj.updateFlag = false;
            this.temp.editExceptionCache['newFields'].push(newFieldObj)
        }
    },
    data() {
        return configData
    }
}
</script>

<style scoped>

</style>
