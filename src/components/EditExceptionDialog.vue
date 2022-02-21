<template>
  <el-dialog :close-on-click-modal='false' :close-on-press-escape='false' v-model="dialogVisible" title="编辑Exception">
    <div>
      <div>
        <p class="text-lg">settings</p>
        <div>
          <div class="mt-2">
            <div class="flex">
              <p class="w-24 align-text-bottom">name</p>
              <el-input v-model="exception.exceptionName" class="ml-4 inline"></el-input>
            </div>
            <div class="mt-1 flex">
              <p class="w-24 align-text-bottom">package</p>
              <el-input v-model="exception.config.package" :placeholder="exception.config.defaultPackage" class="ml-4 inline"></el-input>
            </div>
            <div class="mt-1 flex">
              <p class="w-24 align-text-bottom">final</p>
              <el-checkbox v-model="exception.config.final" class=""></el-checkbox>
            </div>
          </div>
          <el-divider/>
        </div>
      </div>

      <div>
        <h5 class="text-lg">继承字段</h5>
        <div class="mt-2">
          <div class="flex mt-1" v-for="item in inheritFields">
            <span class="w-24 align-text-bottom align-bottom">{{ item.fieldName }}</span>

            <el-input v-if="item.type!=='enum'" :placeholder="item.defaultValue" class="ml-4 inline" v-model="item.value"></el-input>
            <div v-else>
              <el-select v-model="item.value">

              </el-select>
            </div>

          </div>
        </div>

        <el-divider/>
      </div>

      <div>
        <p class="text-lg">fields</p>
        <div>
          <el-table :data="myFields">
            <el-table-column label="字段名" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.fieldName" :placeholder="scope.row.originField"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="类型" width="150">
              <template #default="scope">
                <el-select v-model="scope.row.type" @change="formatType(scope.row)">
                  <el-option-group label="基本类型">
                    <el-option v-for="item in types"
                               :label="item"
                               :key="item"
                               :value="item">
                    </el-option>
                    <el-option-group label="枚举">
                      <el-option v-for="e in enums"
                                 :label="e.name"
                                 :key="e.id"
                                 :value="'enum-'+e.id"></el-option>
                    </el-option-group>
                  </el-option-group>

                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="默认值" width="150">
              <template #default="scope">
                <ValueInputComponent :placeholder="scope.row.originField" :type="scope.row.type" :options-id="scope.row.options" :bind-value="scope.row.value" @change="v=>scope.row.value = (typeof v)==='object'?scope.row.value:v" :enums="enums"></ValueInputComponent>
<!--                <el-select v-if="scope.row.type.indexOf('enum-')===0"  v-model="scope.row.value" >-->
<!--                  <el-option v-for="item in loadEnumPropertiesByEnumId(scope.row.type.substring(5))"-->
<!--                             :label = "item.enum"-->
<!--                             :key="item.enum"-->
<!--                             :value="item.enum"></el-option>-->
<!--                </el-select>-->
<!--                <el-input v-else v-model="scope.row.value" :placeholder="scope.row.originField"></el-input>-->
              </template>
            </el-table-column>

            <el-table-column label="final" width="80">
              <template #default="scope">
                <el-checkbox v-model="scope.row.final"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="标题" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.comments"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="130">
              <template #default="scope">
                <el-button type="danger" @click="deleteField(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" plain class="ml-8 mt-4" @click="addField"> 添加字段</el-button>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">close</el-button>
        <el-button type="primary" @click="saveData">save</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import structuredClone from "@ungap/structured-clone";
import ValueInputComponent from "./ValueInputComponent.vue";
export default {
  name: "EditExceptionDialog",
  props:[
      "dialogVisible",
      "exception",
      "types",
      "enums",
      "settings"
  ],
  components:{ValueInputComponent},
  emits:["saveData","closeDialog"],
  created() {


  },
  data(){
    return {
      myFields:[],
      inheritFields:[],
    }
  },
  watch:{
    exception:function (newVal, oldVal) {
      newVal.subException = [];
      let inheritFields = [];
      let myFields = [];

      for (let field in newVal.fields) {
        let fieldObj = {}
        fieldObj.fieldName = field
        fieldObj.originField = field
        fieldObj.value = newVal.fields[field].value
        fieldObj.defaultValue = newVal.fields[field].defaultValue
        fieldObj.type = newVal.fields[field].type
        fieldObj.final = newVal.fields[field].final
        fieldObj.comments = newVal.fields[field].comments
        fieldObj.options = newVal.fields[field].options
        fieldObj.originExceptionId = newVal.fields[field].originExceptionId
        if (newVal.id === fieldObj.originExceptionId) {
          myFields.push(fieldObj)
        }else {
          inheritFields.push(fieldObj)
        }
      }
      for (let i = 0; i < myFields.length; i++) {
        myFields[i].id = i+1
      }
      this.$data.inheritFields = inheritFields
      this.$data.myFields = myFields

    },
  },
  methods:{
    addField(){
      let field = {
        "value": "",
        "field":"",
        "originField":"",
        "defaultValue": "",
        "type": "String",
        "final": false,
        "comments": "",
        "options": "",
        "originExceptionId": this.$props.exception.id
      }
      this.myFields.push(field)
      for (let i = 0; i < this.myFields.length; i++) {
        this.myFields[i].id = i+1
      }
    },
    deleteField(id){
      this.myFields.splice(id-1,1)
      for (let i = 0; i < this.myFields.length; i++) {
        this.myFields[i].id = i+1
      }
    },
    saveData(){
      let newException = JSON.parse(JSON.stringify(this.$props.exception));
      newException.fields = {}
      newException.fields.myFields = this.$data.myFields
      newException.fields.inheritFields = this.$data.inheritFields
      for (const myField of newException.fields.myFields) {
        if (myField.type.indexOf("enum-") === 0) {
          myField.options = myField.type.substring(5)
          myField.type = 'enum'
        }
        if (myField.comments === ""||myField.comments===null) {
          myField.comments = myField.fieldName;
        }
      }
      this.$emit("saveData",newException)
    },
    close(){
      this.$emit("closeDialog")
    },
    loadEnumPropertiesByEnumId(enumId){
      let e = this.enums.find(element=>element.id===enumId);
      if (e===null) return [];
      return e.properties;
    },
    formatType(field){
      field.options = field.type.substring(5)
      field.type = "enum"
    }
  }
}
</script>

<style scoped>

</style>