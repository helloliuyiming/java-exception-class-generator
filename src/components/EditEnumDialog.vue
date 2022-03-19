<template>
  <el-dialog :close-on-click-modal='false' :close-on-press-escape='false' v-model="dialogVisible" title="编辑Enum">
    <div class="flex">
      <el-tabs tab-position="left" closable @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="item in enums" :label="item.name" :name="item.id" :key="item.id">
          <template #label>
            <el-input v-model="item.name" placeholder="枚举类名" style="width: 150px"/>
          </template>
          <enum-configuration-component :enum-class="item" :ref="item.id" :types="types" :baseExceptionPackage="baseExceptionPackage"> </enum-configuration-component>
        </el-tab-pane>
      </el-tabs>

    </div>

    <template #footer>
      <div class="flex justify-between">
        <el-button type="primary" @click="addEnum">Add</el-button>

        <span class="dialog-footer">
        <el-button @click="closeDialog">close</el-button>
        <el-button type="primary" @click="saveData">save</el-button>
      </span>
      </div>

    </template>
  </el-dialog>
</template>

<script>
import EnumConfigurationComponent from "./EnumConfigurationComponent.vue";
import { nanoid } from 'nanoid'

export default {
  name: "EditEnumDialog",
  components:{EnumConfigurationComponent},
  props:["dialogVisible","enums","baseExceptionPackage","types"],
  emits:["saveData","closeDialog"],
  data(){
    return {
      activeEnum:{}
    }
  },
  methods:{
    closeDialog(){
      this.$emit("closeDialog")
    },
    saveData(){
      for (let e of this.enums) {
        if (e.package == null || e.package === '') {
          e.package = this.$props.baseExceptionPackage
        }
      }
      this.$emit("saveData",this.enums)
    },
    tabClick(){

    },
    tabRemove(key){
      console.log(key+" removed")
      for (let i = 0; i < this.enums.length; i++) {
        let e = this.enums[i];
        if (e.id === key) {
          this.enums.splice(i,i+1)
          break
        }
      }
    },
    addEnum(){
      let e = {
        "id":nanoid(),
      "name":null,
      "package":null,
        "cols":[],
        "properties":[]
      }

      this.enums.push(e)

    }
  }
}
</script>

<style scoped>

</style>