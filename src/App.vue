<template>
<div>
  <el-container>

    <el-header class="flex items-center shadow-md">
      <div style="position: relative">
        <el-input @input.native="inputChange($event)" v-model="config.settings.baseException.className"></el-input>
      </div>
      <el-row class="w-full items-end p-16" type="flex" justify="space-between">
        <a href="#">
          <div class="flex items-center space-x-4">
            <el-image class="inline" style="width: 32px;height: 32px" :src="logo"></el-image>
            <p class="inline text-lg" style="margin: 0 0 0 12px">java异常类生成器</p>
          </div>
        </a>

        <ol class="space-x-6">
          <li class="inline"><a href="#">文档</a> </li>
          <li class="inline"><a href="#">捐赠</a> </li>
          <li class="inline"><a href="#">GitHub</a> </li>
        </ol>
      </el-row>
    </el-header>

    <el-container>
      <el-aside class="p-4">
        <div class="flex justify-between w-full" >
          <p class="text-lg">Preview</p>
          <div>
            <el-button class="m-0" circle>tt</el-button>
            <el-button class="m-0" circle>tt</el-button>
            <el-button circle>tt</el-button>
          </div>
        </div>
        <el-divider style="margin:8px 0 "/>

        <el-tree-v2 :data="config.exceptions" :props="{'value':'id','label':'exceptionName', 'children':'subException'}">

        </el-tree-v2>
      </el-aside>

      <el-main class="p-4 space-y-4">
        <div>
          <h5>Setting</h5>
          <div class="flex flex-wrap gap-8 gap-y-2">

            <div class="flex items-center space-x-1">
              <p class="text-sm text-gray-500">baseException</p>
              <el-select size="default">
                <el-option v-for="item in options.baseExceptions"
                           :key="item.classFullName"
                           :label="item.className"
                           :value="item.classFullName"/>
              </el-select>
            </div>

            <div class="flex items-center space-x-1">
              <p class="text-sm text-gray-500">basePackage</p>
              <el-input v-model="config.settings.basePackage" placeholder="package"/>
            </div>

            <div class="flex items-center space-x-1">
              <p class="text-sm text-gray-500">suffix</p>
              <el-input v-model="config.settings.suffix" placeholder="package"/>
            </div>

            <div class="flex items-center space-x-1">
              <p class="text-sm text-gray-500">useLombok</p>
              <el-checkbox v-model="config.settings.useLombok"/>
            </div>

            <div class="flex items-center space-x-1">
              <p class="text-sm text-gray-500">hiddenSuffix</p>
              <el-checkbox v-model="config.settings.hiddenSuffix"/>
            </div>

          </div>
        </div>

        <div>
          <h4>Operation</h4>
          <div class="space-y-2 mt-4">
            <div class="flex justify-between">
              <div>
                <el-button type="info">导入配置</el-button>
                <el-button type="success">导出配置</el-button>
                <el-button type="danger">重置</el-button>
                <el-button type="primary">生成配置</el-button>
              </div>
              <el-button type="warning">分享配置</el-button>
            </div>
            <div>
              <el-button @click="runtime.editEnumDialogVisible = true" round type="info" plain>编辑枚举</el-button>
            </div>
          </div>

        </div>

        <el-divider></el-divider>

        <div class="space-y-2">
          <h4>配置</h4>


        </div>

        <el-table :data="config.exceptions" row-key="id" :tree-props="{'children':'subException', 'hasChildren':'true'}" border>
          <el-table-column prop="exceptionName" label="类名">
            <template #default="scope">
              <div class="inline" :class="{noSubException: (scope.row.subException === undefined || scope.row.subException === null || scope.row.subException.length===0)&&(scope.row.id.split(':').length<=1)}">
                <input v-model="scope.row.exceptionName" placeholder="类名" v-autowidth class="w-24 px-2 py-0.5" style="width:120px;min-width: 120px;max-width: 200px"/>
                <div class="inline ml-4">
                  <el-button type="info" circle @click="createSiblingException(scope.row.id)">cp</el-button>
                  <el-button v-if="!scope.row.config.final" type="primary" circle @click="createSubException(scope.row.id)">de</el-button>
                  <el-button type="success" circle @click="editException(scope.row.id)">et</el-button>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-for="column in config.cols" :prop="column.prop" :label="column.title">
            <template #default="scope">
              <div v-if="scope.row.fields[column.prop]===undefined">
                <p class="text-center">---</p>
              </div>
              <div v-else-if="scope.row.fields[column.prop].type.toLowerCase()==='string'">
                <el-input v-model="scope.row.fields[column.prop].value" :placeholder="scope.row.fields[column.prop].defaultValue"></el-input>
              </div>
              <div v-else-if="scope.row.fields[column.prop].type.toLowerCase()==='integer'">
                <el-input-number precision="0" v-model="scope.row.fields[column.prop].value" :placeholder="scope.row.fields[column.prop].defaultValue"></el-input-number>
              </div>
              <div v-else-if="scope.row.fields[column.prop].type.toLowerCase()==='boolean'">
                <el-checkbox size="large" v-model="scope.row.fields[column.prop].value"></el-checkbox>
              </div>
              <div v-else-if="scope.row.fields[column.prop].type==='enum'">

              </div>
              <div v-else>
                <span>类型不支持</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>

  <edit-exception-dialog :dialog-visible="runtime.editExceptionDialogVisible" :exception="runtime.editException" :types="options.types" :enums="config.enums" @closeDialog="runtime.editExceptionDialogVisible = false" @saveData = "saveOrUpdateException"/>
  <edit-enum-dialog  :dialog-visible="runtime.editEnumDialogVisible" :enums="config.enums" :types="options.types" :base-exception-package="config.settings.basePackage+'.enums'" @closeDialog="runtime.editEnumDialogVisible = false" @saveData="saveEnum"/>
</div>
</template>

<script>
import defaultConfig from "./data/defaultConfig";
import logo from './assets/logo.png'
import addIcon from './assets/add.svg'
import {ExceptionGenerator} from "./ExceptionGenerator";
import structuredClone from '@ungap/structured-clone';
import EditExceptionDialog from "./components/EditExceptionDialog.vue";
import EditEnumDialog from "./components/EditEnumDialog.vue";
let exceptionGenerator

export default {
  name: 'App',
  components: {EditEnumDialog, EditExceptionDialog},
  data(){
    return defaultConfig
  },
  created() {
    this.editExceptionDialogVisible = false
  },
  mounted() {
    this.logo = logo
    this.addIcon = addIcon
    exceptionGenerator = new ExceptionGenerator(this)

  },
  methods:{
    saveEnum(data){
      this.runtime.editEnumDialogVisible = false
    },
    saveOrUpdateException(newException) {
      this.runtime.editExceptionDialogVisible = false
      exceptionGenerator.updateException(newException)
    },
    inputChange(event){
      console.log(event)
    },

    createSubException(id) {
      exceptionGenerator.insertSubException(id)
    },
    createSiblingException(id){
      exceptionGenerator.insertSibling(id)
    },
    editException(id){
      let queryById = exceptionGenerator.queryById(id);
      this.runtime.editExceptionDialogVisible = true;

      // this.runtime.editException = structuredClone(queryById);
      this.runtime.editException = JSON.parse(JSON.stringify(queryById));
    },
  }
}
</script>

<style>
.noSubException{
  margin-left: 20px;
}
</style>