<template>
  <el-dialog :title="title" :visible.sync="toggle" v-loading="loading" :element-loading-text="loadingText" @close="onClose">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="Tag" style='text-align:left;'>
        <el-input placeholder="请输入内容" style='width:120px;' v-model='form.inputTag'>
          <i slot="suffix" style='cursor:pointer;' class="el-icon-circle-plus-outline" @click="addTagToArray(form)"></i>
        </el-input>
        <el-tag v-for='(t,i) in form.tags' :key='"dialog-tag"+i' closable @close='form.tags.splice(i,1)' style='margin-right:3px'>{{t}}</el-tag>
      </el-form-item>
      <el-form-item label="Contents">
        <el-tabs v-model="form.selectedVersion" type="card" editable @edit="handleTabsEdit">
          <el-tab-pane
            v-for="(item, index) in form.contents"
            :key="'content'+index"
            :label="item.version"
            :name="index+''" >
            <div style="text-align:left;">
              <el-form-item label="Version">
                <el-input placeholder="Edit version" style='width:180px;' v-model='item.version'></el-input>
              </el-form-item>
              <el-form-item label="Snippet">
                <el-input type="textarea" placeholder="Inuput snippet" v-model="item.snippet"></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit" >{{submitText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import Prompts from '../mixins/Prompts'
export default{
  name: 'editform',
  mixins: [Prompts], // general handling for prompts
  props: ['data', 'formType'],
  data () {
    return {
      form: {
        name: '',
        desc: '',
        tags: [],
        contents: [{version: 'Default', snippet: ''}]
      }
    }
  },
  methods: {
    handleTabsEdit (targetName, action) {
      console.log('Before handle: ' + JSON.stringify(this.form.contents))
      let newSize = 0
      if (action === 'add') {
        console.log('Add version +')
        let newVersion = 'NewVersion'
        newSize = this.form.contents.push({
          version: newVersion,
          snippet: ''
        })
      }
      if (action === 'remove') {
        console.log('Remove version -')
        this.form.contents.splice(this.form.selectedVersion, 1)
        newSize = this.form.contents.length
      }
      console.log('After handle: ' + JSON.stringify(this.form.contents))
      this.form.selectedVersion = newSize - 1 + ''
    },
    initForm (newForm) {
      let form = this.form
      if (newForm === undefined) {
        form.name = ''
        form.desc = ''
        form.tags = []
        form.contents = [{version: 'Default', snippet: ''}]
        return
      }
      form.name = newForm.name
      form.desc = newForm.desc
      form.tags = _.cloneDeep(newForm.tags)
      form.contents = _.cloneDeep(newForm.contents)
    },
    addTagToArray (form) {
      if (form.inputTag !== '') {
        form.tags.push(form.inputTag)
      }
      form.inputTag = ''
    },
    onSubmit () {
      let opts = {
        method: this.formType === 'create' ? 'POST' : 'PUT',
        url: '/api/snippets',
        data: this.form
      }
      console.log('Requesting with ' + JSON.stringify(opts))
      this.showLoading('Submiting request..')
      axios.request(opts)
        .then(res => {
          // stop UI loading
          this.stopLoading()
          if (res.status === 200) {
            // clear & hide dialog
            this.initForm()
            this.toggle = false
            // show success msg
            this.$message({
              message: 'Action commited',
              type: 'success'
            })
            // notify the parent to update
            this.emitUpdate()
          } else {
            // show fail msg
            this.$message.error({
              message: 'Action failed, please retry.'
            })
          }
        })
        .catch(err => {
          console.error(err)
          this.stopLoading()
          this.$message.error({
            message: 'Server error.'
          })
        })
    },
    onClose () {
      switch (this.formType) {
        case 'create':
          this.initForm()
          break
        case 'edit':
          this.initForm(this.data)
          break
      }
    }
  },
  watch: {
    data (val) {
      if (this.formType === 'edit') {
        this.initForm(val)
      }
    }
  },
  mounted () {
    if (this.formType === 'edit') {
      this.initForm(this.data)
    }
  }
}
</script>