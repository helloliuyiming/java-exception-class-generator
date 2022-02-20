<template>
  <div class="ml-4">

    <div class="flex items-center">
      <span class="w-24">package</span>
      <el-input v-model="enumClass.package" class="inline"></el-input>
    </div>
    <div class="flex mt-1 items-center">
      <span class="w-24 align-text-bottom">name</span>
      <el-input v-model="enumClass.name"></el-input>
    </div>
    <el-divider/>
    <h5 class="text-lg">Configuration</h5>
    <div class="flex mt-2 overflow-x-auto" style="scrollbar-width: none;">

      <div>
        <el-table class="" border :data="enumClass.properties">
          <el-table-column label="value" width="150" fixed>
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.enum"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-for="column in enumClass.cols" :label="column.name" width="120">
            <template #default="scope">
              <div v-if="column.type==='Boolean'">
                <el-checkbox v-model="scope.row[column.name]"/>
              </div>
              <div v-else>
                <el-input v-model="scope.row[column.name]" :placeholder="column.defaultValue"/>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-button class="mt-1" plain type="primary" @click="addCol">add</el-button>
      </div>
      <el-button class="mt-1" @click="addRow">add col</el-button>
    </div>

    <el-dialog v-model="addColDialogVisible" title="添加属性">
      <template #default>
        <div>
          <div class="flex mt-1 items-center">
            <span class="w-32">name</span>
            <el-input v-model="editEnum.name" size="small"></el-input>
          </div>

          <div class="flex mt-1 items-center">
            <span class="w-32">type</span>
            <el-select v-model="editEnum.type" size="small">
              <el-option v-for="item in types" :key="item" :label="item" :value="item" :disabled="item.toLowerCase()==='enum'"></el-option>
            </el-select>
          </div>

          <div class="flex mt-1 items-center">
            <span class="w-32">defaultValue</span>
            <el-input v-model="editEnum.defaultValue" size="small"></el-input>
          </div>

        </div>
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addColDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveOrUpdateCol">add</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import { nanoid } from 'nanoid'

export default {
  name: "EnumConfigurationComponent",
  props:["enumClass","types"],
  data(){
    return{
      addColDialogVisible:false,
      editEnum:{}
    }
  },
  methods:{
    getData(){
      console.log("getData invoked")
    },
    addRow(){
      let newRow = {"name":null,"defaultValue":""}
      this.editEnum = newRow
      this.addColDialogVisible = true
    },
    addCol(){
      let e = {"enum":null}
      for (const col of this.enumClass.cols) {
        e[col.name] = col.defaultValue
      }
      this.enumClass.properties.push(e)
    },
    saveOrUpdateCol(){
      if (this.editEnum.id === undefined) {
        this.editEnum.id = nanoid();
        this.enumClass.cols.push(this.editEnum)
      }else {
        let oldCol = this.enumClass.cols.find(element => element.id === this.editEnum.id);
        for (const editEnumElement in this.editEnum) {
          oldCol[editEnumElement] = this.editEnum[editEnumElement]
        }
      }

      for (const property of this.enumClass.properties) {
          property[this.editEnum.name] = this.editEnum.defaultValue
      }

      this.addColDialogVisible = false
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>