<template>
  <el-dialog :title="title" :visible="showDialog" v-loading="loading" :element-loading-text="loadingText">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="Tag" style='text-align:left;'>
        <el-input placeholder="请输入内容" style='width:120px;' v-model='form.inputTag'>
          <i slot="suffix" style='cursor:pointer;' class="el-icon-circle-plus-outline" @click='addTagAction'></i>
        </el-input>
        <el-tag v-for='(t,i) in form.tags' :key='"dialog-tag"+i' closable @close='form.tags.splice(i,1)' style='margin-right:3px'>{{t}}</el-tag>
      </el-form-item>
      <el-form-item label="Version">
        <el-input v-model="form.version"></el-input>
      </el-form-item>
      <el-form-item label="Snippet">
        <el-input type="textarea" v-model="form.snippet"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAction">Create</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default{
  name: 'editform',
  props: ['title', 'data', 'loading', 'loadingText', 'addTagAction', 'submitAction', 'show'],
  data () {
    return {
      form: JSON.parse(JSON.stringify(this.data)),
      showDialog: false
    }
  },
  computed: {
    // formVisible: {
    //   get: function () {
    //     return this.showDialog
    //   },
    //   set: function (val) {
    //     return val
    //   }
    // }
  },
  mounted () {
    // setTimeout(() => { this.showDialog = true }, 3000)
  },
  watch: {
    show (cur, old) {
      console.log('changed')
      if (cur !== this.showDialog) {
        this.showDialog = cur
      }
    }
  }
}
</script>

<style lang="sass">
  
</style>