<template>
  <el-dialog :title="title" :visible.sync="toggle" v-loading="loading" :element-loading-text="loadingText">
    <el-form :model="form">
      <el-form-item label="Please input the following number to confirm:">
        <span>{{form.verifyCode}}</span>
        <el-input v-model="form.inputCode" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toggle = false">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Prompts from '../mixins/Prompts'
import axios from 'axios'
export default{
  name: 'deleteform',
  mixins: [Prompts], // general handling for prompts
  props: ['deleteKey'],
  data () {
    return {
      form: {
        verifyCode: '',
        inputCode: ''
      }
    }
  },
  methods: {
    genVerifyCode () {
      // generate a simple verify code with Math.random()
      let code = parseInt(Math.random() * 1000000, 10)
      this.form.verifyCode = code > 99999 ? code : code * 10
      return code
    },
    onSubmit () {
      if (this.form.verifyCode !== this.form.inputCode * 1) {
        this.$message.error({
          message: 'Verify code not correct!'
        })
        return
      }

      // show loading
      this.showLoading('Deleting..')
      axios.delete('/api/snippets' + '?name=' + this.deleteKey)
        .then(res => {
           // stop loading
          this.stopLoading()
          if (res.status === 200) {
            // clear & hide dialog
            this.toggle = false
            // show success msg
            this.$message({
              message: 'Snippet Deleted Successfully',
              type: 'success'
            })
            this.emitUpdate()
          } else {
            // show fail msg
            this.$message.error({
              message: 'Snippet Failed to delete'
            })
          }
        })
    }
  },
  computed: {
    // override mixins to gencode
    toggle: {
      set (val) {
        this.$emit('update:show', val)
        if (val === true) {
          this.genVerifyCode()
        }
      },
      get () {
        return this.show
      }
    }
  }
}
</script>

