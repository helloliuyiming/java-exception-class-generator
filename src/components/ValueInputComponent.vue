<template>
<div style="width: 120px">
  <div v-if="type===undefined">
    <p class="text-center">---</p>
  </div>
  <div v-else-if="type.toLowerCase()==='string'">
    <el-input v-model="value" :placeholder="placeholder"></el-input>
  </div>
  <div v-else-if="type.toLowerCase()==='integer'||type.toLowerCase()==='long'">
    <el-input-number :precision='0' v-model="value" :placeholder="placeholder" size="small"></el-input-number>
  </div>
  <div v-else-if="type.toLowerCase()==='float'">
    <el-input-number :precision='4' v-model="value" :placeholder="placeholder" size="small"></el-input-number>
  </div>
  <div v-else-if="type.toLowerCase()==='double'">
    <el-input-number :precision='8' v-model="value" :placeholder="placeholder" size="small"></el-input-number>
  </div>
  <div v-else-if="type.toLowerCase()==='boolean'">
    <el-checkbox size="large" v-model="value"></el-checkbox>
  </div>
  <div v-else-if="type.toLowerCase()==='enum'">
      <el-select v-model="value" >
        <el-option v-for="item in loadEnumPropertiesByEnumId(optionsId)"
                   :label = "item.enum"
                   :key="item.enum"
                   :value="item.enum"></el-option>
      </el-select>
  </div>
  <div v-else>
    <span>类型不支持</span>
  </div>
</div>
</template>

<script>
export default {
  name: "ValueInputComponent",

  props:["type","bindValue","enums","placeholder","optionsId"],
  model:{
    prop: 'bindValue',
    event: 'change'
  },
  created() {
    this.value = this.bindValue
  },
  methods:{
    handlerInput(e){

    },
    loadEnumPropertiesByEnumId(enumId){
      let e = this.enums.find(element=>element.id===enumId);
      if (e===null) return [];
      return e.properties;
    }
  },
  data(){
    return {
      value:""
    }
  },
  watch:{
    value(newVal){
      console.log("newVal="+this.value)
      this.$emit("change",newVal)
    }
  }
}
</script>

<style scoped>

</style>