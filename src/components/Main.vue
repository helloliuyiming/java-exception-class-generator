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
          v-fit-columns
          :tree-props="{children: 'subException'}">
        <el-table-column v-for="item in config.cols" :key="item.index" min-width="300px"
                         :label="item.title">
          <template v-if="item.prop==='exceptionName'" #default="scope">
            <el-input type="text" size="small" v-model="scope.row.data[item.prop]" style="width: 120px">
              <template #append v-if="!config.settings.hiddenSuffix">{{ config.settings.suffix }}</template>
            </el-input>
            <el-button type="info" icon="el-icon-plus" plain circle size="mini" @click="insertCoeval(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-bottom-right" plain circle size="mini"
                       @click="insertSub(scope.row.id)"></el-button>
            <el-button type="info" icon="el-icon-edit-outline" plain circle size="mini" @click="changeEditExceptionDialogVisible"></el-button>
          </template>
          <template v-else #default="scope">
            <el-input type="text" size="small" v-model="scope.row.data[item.prop]">
            </el-input>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog title="收货地址" v-model="this.editExceptionDialogVisible">
        <template>
    <span class="dialog-footer">
      <el-button @click="editExceptionDialogVisible = false">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </span>
        </template>
      </el-dialog>
    </el-main>

  </el-container>




</template>

<script>
export default {
  name: "Main",
  methods: {
    queryExceptionById(id) {
      let split = id.split(":");
      let myException = this.config.exceptions;
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
    },

    queryParentExceptionById(id) {
      let index = id.lastIndexOf(":")
      if (index === -1) {
        return null;
      }
      id = id.substr(0, index);
      return this.queryExceptionById(id);
    },

    queryParentId(id) {
      let index = id.lastIndexOf(":")
      if (index === -1) {
        return null;
      }
      return id.substr(0, index);
    },
    copyExceptionStructureById(id) {
      let parentException = this.queryParentExceptionById(id);
      let length = 1;
      if (parentException == null) {
        length = this.config.exceptions.length;
      } else {
        length = parentException.subException.length;
      }
      length++;
      let newCleanException = JSON.parse(JSON.stringify(this.queryExceptionById(id)));
      newCleanException.exceptionName = null;
      newCleanException.subException = new Array();
      let parentId = this.queryParentId(id);
      if (parentId == null) {
        newCleanException.id = "l" + length;
      } else {
        newCleanException.id = parentId + ":l" + length;
      }

      newCleanException["new-fields"] = new Array();
      for (let key in newCleanException.data) {
        newCleanException.data[key] = null;
      }
      return newCleanException;
    },
    copyExceptionStructure(originException) {
      return this.copyExceptionStructureById(originException.id);
    },
    insertSub(id) {
      if (id == null||id==="") {
        console.log("插入子级失败，id为空")
        return;
      }
      let parentException = this.queryExceptionById(id);
      let newException = null;
      let index = 1;
      if (parentException.subException != null && parentException.subException.length > 0) {
        newException = this.copyExceptionStructure(parentException.subException[0]);
        index = parentException.subException.length+1;
      }else {
        parentException.subException = new Array();
        newException = this.copyExceptionStructureById(id);
      }
      newException.id = parentException.id+":"+index
      parentException.subException.push(newException);
    },
    insertCoeval(id) {
      if (id == null||id==="") {
        console.log("插入同级失败，id为空")
        return;
      }
      let newException = this.copyExceptionStructureById(id);
      let parentId = this.queryParentId(id);
      if (parentId == null) {
        this.config.exceptions.push(newException)
        return
      }
      let parentException = this.queryExceptionById(parentId);
      if (parentException.subException == null || parentException.subException.length === 0) {
        parentException.subException = new Array();
      }
      parentException.subException.push(newException);
    },
    changeEditExceptionDialogVisible(){
      this.editExceptionDialogVisible = !this.editExceptionDialogVisible
    }
  },
  data() {
    return {
      "predefine": {
        "editExceptionDialogVisible":false,
        "baseExceptions": [
          {
            "className": "Exception",
            "classPackage": "java.lang.Exception"
          },
          {
            "className": "RuntimeException",
            "classPackage": "java.lang.RuntimeException"
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
          "hiddenSuffix":true
        },
        "cols": [
          {
            "index": 0,
            "prop": "exceptionName",
            "title": "类名",
            "defaultValue":"defaultValue"
          },
          {
            "index": 1,
            "prop": "message",
            "title": "message",
            "defaultValue":"defaultValue"
          },
          {
            "index": 2,
            "prop": "httpCode",
            "title": "http状态码",
            "defaultValue":"defaultValue"
          },
          {
            "index": 3,
            "prop": "code",
            "title": "编码",
            "defaultValue":"defaultValue"
          },
          {
            "index": 4,
            "prop": "messageForClient",
            "title": "提示信息",
            "defaultValue":"defaultValue"
          },
          {
            "index": 5,
            "prop": "messageForClient",
            "title": "提示信息",
            "defaultValue":"defaultValue"
          },
          {
            "index": 6,
            "prop": "messageForClient",
            "title": "提示信息",
            "defaultValue":"defaultValue"
          },
          {
            "index": 7,
            "prop": "messageForClient",
            "title": "提示信息",
            "defaultValue":"defaultValue"
          },
          {
            "index": 8,
            "prop": "messageForClient",
            "title": "提示信息",
            "defaultValue":"defaultValue"
          }
        ],
        "exceptions": [{
          "id":"l1",
          "exceptionName": "ServerException",
          "data": {
            "message": "message",
            "httpCode": 200,
            "messageForClient": "messageForClient",
            "code": "code"
          },
          "new-fields": [
            {
              "fieldName": "newF1",
              "fieldType": "string",
              "defaultValue": "newF1"
            }
          ],
          "subException": [
            {
              "id":"l1:l1",
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
                  "fieldName": "",
                  "fieldType": "",
                  "defaultValue": ""
                }
              ]
            },
            {
              "id":"l1:l2",
              "exceptionName": "BadGatewayException",
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
        }]
      }
    };
  }
}
</script>

<style scoped>

</style>
