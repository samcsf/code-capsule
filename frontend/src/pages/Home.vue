<template>
  <el-container class='cc-home-body'>
    <el-header class='cc-home-title'>
      <div :class='rocketStyle' @click='setOnFire'>🚀</div>
      <div>Code Capsule</div>
    </el-header>
    <el-container>
      <el-aside class='cc-home-aside'>
        <div class='search-title'>Search</div>
        <form @submit.prevent='onSearch(searchText)'>
          <el-input placeholder="请输入内容" v-model="searchText" class='search-input'>
            <i slot="suffix" style='cursor:pointer' class="el-input__icon el-icon-search" @click='onSearch(searchText)'></i>
          </el-input>
        </form>
        <ul>
          <li v-for='(r, i) in allRecords' :key='"names"+i' @click='result=allRecords[i]' style='text-align:left'>{{r.name}}</li>
        </ul>
      </el-aside>
      <el-main>
        <el-card v-if='result.contents' class="cc-home-card">
          <div slot="header" class="clearfix">
            <span>{{result.name}}</span>
            <el-button style="float: right; padding: 3px 0;color: red;" type="text" @click='delFormVisible = true;genVerifyCode()'>Delete</el-button>
            <el-dialog title="Delete Snippet" :visible.sync="delFormVisible" v-loading="loading" :element-loading-text="loadingText">
              <el-form :model="delForm">
                <el-form-item label="Please input the following number to confirm:">
                  <span>{{delForm.verifyCode}}</span>
                  <el-input v-model="delForm.inputCode" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="delFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitDelete">Confirm</el-button>
              </div>
            </el-dialog>
            <el-button style="float: right; padding: 3px 0;margin-right: 8px;" type="text" @click='editFormVisible = true'>Edit</el-button>
            <el-dialog title="Edit Snippet" :visible.sync="editFormVisible" v-loading="loading" :element-loading-text="loadingText" @close='onEditClose'>
              <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="Name">
                  <el-input v-model="editForm.name" :disabled='true'></el-input>
                </el-form-item>
                <el-form-item label="Description">
                  <el-input v-model="editForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="Tag" style='text-align:left;'>
                  <el-input placeholder="请输入内容" style='width:120px;' v-model='editForm.inputTag'>
                    <i slot="suffix" style='cursor:pointer;' class="el-icon-circle-plus-outline" @click='addTagToArray(editForm)'></i>
                  </el-input>
                  <el-tag v-for='(t,i) in editForm.tags' :key='"dialog-tag"+i' closable @close='editForm.tags.splice(i,1)' style='margin-right:3px'>{{t}}</el-tag>
                </el-form-item>
                <el-form-item label="Version">
                  <el-input v-model="editForm.version"></el-input>
                </el-form-item>
                <el-form-item label="Snippet">
                  <el-input type="textarea" v-model="editForm.snippet"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit">Commit</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="card-desc">
            <span><b>Desc:</b></span>
            {{result.desc}}
          </div>
          <div class="card-tags">
            <span><b>Tags:</b></span>
            <el-tag v-for='(t,i) in result.tags' :key='"card-tag"+i' class="card-tags-item">{{t}}</el-tag>
          </div>
          <div class="card-contents">
            <div>
              <hr />
              <div>
                <span><b>Version:</b></span>
                <select v-model='currentVersion'>
                  <option v-for='(c,i) in result.contents' :key='"snippet-version"+i'>{{c.version}}</option>
                </select>
              </div>
              <div><span><b>Snippet:</b></span>
                <div v-html='snippetByCurrVersion' ></div>
              </div>
            </div>
          </div>
        </el-card>
        <div v-else>Type name to find snippet</div>
        <div class='cc-home-edit-group'>
          <el-button @click="dialogFormVisible = true" class='create-button'>Create New</el-button>
          <el-dialog title="New Snippet" :visible.sync="dialogFormVisible" v-loading="loading" :element-loading-text="loadingText">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="Name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="Description">
                <el-input v-model="form.desc"></el-input>
              </el-form-item>
              <el-form-item label="Tag" style='text-align:left;'>
                <el-input placeholder="请输入内容" style='width:120px;' v-model='form.inputTag'>
                  <i slot="suffix" style='cursor:pointer;' class="el-icon-circle-plus-outline" @click='addTagToArray(form)'></i>
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
              <el-button type="primary" @click="submitCreate">Create</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import hljs from 'highlight.js'
import axios from 'axios'
import EditForm from '../components/EditForm'

export default {
  name: 'home',
  data () {
    return {
      searchText: '',
      result: '',
      currentVersion: '',
      form: {
        name: '',
        desc: '',
        inputTag: '',
        tags: [],
        snippet: '',
        version: ''
      },
      editForm: {
        name: '',
        desc: '',
        inputTag: '',
        tags: [],
        snippet: '',
        version: ''
      },
      delForm: {
        verifyCode: '',
        inputCode: ''
      },
      dialogFormVisible: false,
      editFormVisible: false,
      delFormVisible: false,
      loading: false,
      loadingText: '',
      rocketStyle: '',
      allRecords: {}
    }
  },
  methods: {
    onSearch (text) {
      axios.get('/api/snippets' + '?name=' + text)
        .then(res => {
          let data = res.data.data[0]
          let record = {
            name: data.snippet_name,
            desc: data.snippet_desc,
            tags: data.snippet_tags,
            contents: data.snippet_contents
          }
          this.result = record
        })
    },
    highlight (code) {
      let html = hljs.highlight('js', code)
      // todo: Detect language or another API to generate with <code> tag surrounded
      return `<div class="highlight"><pre><code class="js hljs javascript">${html.value}</code></pre></div>`
    },
    addTagToArray (form) {
      if (form.inputTag !== '') {
        form.tags.push(form.inputTag)
      }
      form.inputTag = ''
    },
    submitCreate () {
      // show loading
      this.loadingText = 'Creating Snippet..'
      this.loading = true

      let form = this.form
      let record = {
        name: form.name,
        desc: form.desc,
        tags: form.tags,
        contents: [{version: form.version, snippet: form.snippet}]
      }
      axios.post('/api/snippets', record)
        .then(res => {
          // stop loading
          this.stopLoading()
          if (res.status === 200) {
            // clear & hide dialog
            this.initForm()
            this.dialogFormVisible = false
            // show success msg
            this.$message({
              message: 'Snippet Created Successfully',
              type: 'success'
            })
          } else {
            // show fail msg
            this.$message.error({
              message: 'Snippet Failed to create'
            })
          }
        })
        .catch(err => {
          console.error(err)
          this.stopLoading()
          this.$message.error({
            message: 'Snippet Failed to create'
          })
        })
    },
    showLoading (text) {
      if (text !== '') {
        this.loadingText = text
      }
      this.loading = true
    },
    stopLoading () {
      this.loadingText = ''
      this.loading = false
    },
    initForm () {
      this.form.name = ''
      this.form.desc = ''
      this.form.inputTag = ''
      this.form.tags = []
      this.form.version = ''
      this.form.snippet = ''
    },
    setOnFire () {
      if (this.rocketStyle === '') {
        this.rocketStyle = 'fire'
        // remove animation for next trigger
        setTimeout(() => {
          this.rocketStyle = ''
        }, 2500)
      }
    },
    submitEdit () {
      // show loading
      this.loadingText = 'Updating..'
      this.loading = true

      let form = this.editForm
      let record = {
        name: form.name,
        desc: form.desc,
        tags: form.tags,
        contents: [{version: form.version, snippet: form.snippet}]
      }
      axios.put('/api/snippets', record)
        .then(res => {
          // stop loading
          this.stopLoading()
          if (res.status === 200) {
            // hide dialog
            this.editFormVisible = false
            // show success msg
            this.$message({
              message: 'Snippet Updated!',
              type: 'success'
            })
            this.onSearch(record.name)
          } else {
            // show fail msg
            this.$message.error({
              message: 'Snippet Failed to update'
            })
          }
        })
        .catch(err => {
          console.error(err)
          this.stopLoading()
          this.$message.error({
            message: 'Snippet Failed to update'
          })
        })
    },
    initEditForm (newForm) {
      let form = this.editForm
      if (newForm === undefined) {
        form.name = ''
        form.desc = ''
        form.tags = []
        form.version = ''
        form.snippet = ''
        return
      }
      form.name = newForm.name
      form.desc = newForm.desc
      form.tags = []
      Object.assign(form.tags, newForm.tags)
      form.version = newForm.contents[0].version
      form.snippet = newForm.contents[0].snippet
    },
    onEditClose () {
      // reset the form
      this.initEditForm(this.result)
    },
    genVerifyCode () {
      let code = parseInt(Math.random() * 1000000, 10)
      this.delForm.verifyCode = code > 99999 ? code : code * 10
      return code
    },
    submitDelete () {
      if (this.delForm.verifyCode !== this.delForm.inputCode * 1) {
        this.$message.error({
          message: 'Verify code not correct!'
        })
        return
      }

      // show loading
      this.loadingText = 'Deleting..'
      this.loading = true
      axios.delete('/api/snippets' + '?name=' + this.result.name)
        .then(res => {
           // stop loading
          this.stopLoading()
          if (res.status === 200) {
            // clear & hide dialog
            this.delFormVisible = false
            this.result = {}
            // show success msg
            this.$message({
              message: 'Snippet Deleted Successfully',
              type: 'success'
            })
          } else {
            // show fail msg
            this.$message.error({
              message: 'Snippet Failed to delete'
            })
          }
        })
    }
  },
  watch: {
    // CAN NOT USE ()=>{} ARROW FUNCTION in WATCH !!!
    result: function (val, oldVal) {
      this.currentVersion = val.contents[0].version
      this.initEditForm(val)
    }
  },
  computed: {
    snippetByCurrVersion () {
      if (!this.result.contents) {
        return ''
      }
      let version = this.currentVersion
      let contents = this.result.contents
      let currSnippet = contents.filter(c => c.version === version)[0].snippet
      return this.highlight(currSnippet)
    }
  },
  mounted () {
    hljs.initHighlightingOnLoad()
  },
  components: {
    EditForm
  },
  created () {
    axios.get('/api/snippets')
        .then(res => {
          let data = res.data.data
          this.allRecords = data.map(d => {
            return {
              name: d.snippet_name,
              desc: d.snippet_desc,
              tags: d.snippet_tags,
              contents: d.snippet_contents
            }
          })
        })
  }
}
</script>

<style lang="sass">

.fire
  animation: rocketFire 2s 

@keyframes rocketFire
  0%   
    transform: rotate(10deg)
    opacity: 1
  10%  
    transform: rotate(-20deg)
    opacity: 1
  15%  
    transform: rotate(20deg)
    opacity: 1
  20%  
    transform: rotate(-20deg)
    opacity: 1
  25%  
    transform: rotate(10deg)
    opacity: 1
  30%  
    transform: translate(50px,-50px)
    opacity: 1
  40%
    transform: translate(45px,-45px)
    opacity: 0
  60%
    transform: translate(0px,0px)
    opacity: 0
  100%
    opacity: 1

.cc-home-title
  display: flex
  align-items: center
  justify-content: center
  background-color: #B3C0D1
  color: white
  background: url('../../static/bg.jpg')
  div,span
    margin-top: auto
    margin-bottom: auto
    font-family: Avenir
    font-size: 30px

.cc-home-body
  height: 100%

.cc-home-aside
  background-color: #D3DCE6
  width: 300px
  .search-title
    margin-top: 5px
    margin-left: 20px
    text-align: left
  .search-input
    width: 280px
    margin: 5px auto
    input
      border-radius: 20px

.cc-home-card
  text-align: left
  .card-tags-item
    margin-right: 5px
  .card-contents
    select
      margin-left: 5px

.cc-home-edit-group
  position: relative
  height: 100px
  width: 100%
  .create-button
    position: absolute
    top: 15px
    right: 0
</style>