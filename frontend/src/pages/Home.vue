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
          <!-- <el-input placeholder="请输入内容" v-model="searchText" class='search-input'>
            <i slot="suffix" style='cursor:pointer' class="el-input__icon el-icon-search" @click='onSearch(searchText)'></i>
          </el-input> -->
           <el-autocomplete
            class='search-input'
            v-model="searchText"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <i slot="suffix" style='cursor:pointer' class="el-input__icon el-icon-search" @click='onSearch(searchText)'></i>
          </el-autocomplete>
        </form>
        <ul>
          <li v-for='(r, i) in allRecords' :key='"names"+i' @click='result=allRecords[i]' style='text-align:left'>{{r.name}}</li>
        </ul>
      </el-aside>
      <el-main>
        <el-card v-if='result.contents' class="cc-home-card">
          <div slot="header" class="clearfix">
            <span><b>{{result.name}}</b></span>
            <el-button style="float: right; padding: 3px 0;color: red;" type="text" @click='delFormVisible = true'>Delete</el-button>
            <DeleteForm title='Delete Snippet' :show.sync="delFormVisible" :deleteKey="result.name" submitText="Confirm" @updated="refreshPage" />
            <el-button style="float: right; padding: 3px 0;margin-right: 8px;" type="text" @click='editFormVisible = true'>Edit</el-button>
            <EditForm title="Edit Snippet" :data="result" :show.sync="editFormVisible" submitText="Update" formType="edit" @updated="refreshPage"/>
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
          <el-button @click="createFormVisible = true" class='create-button'>Create New</el-button>
          <EditForm title="Create Snippet" :show.sync="createFormVisible" submitText="Create" formType="create" @updated="refreshPage"/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import hljs from 'highlight.js'
import axios from 'axios'
import EditForm from '../components/EditForm'
import DeleteForm from '../components/DeleteForm'

export default {
  name: 'home',
  data () {
    return {
      searchText: '',
      result: '',
      currentVersion: '',
      createFormVisible: false,
      editFormVisible: false,
      delFormVisible: false,
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
        .catch(err => {
          if (err) {
            console.error(err)
          }
          this.result = {}
        })
    },
    highlight (code) {
      let html = hljs.highlight('js', code)
      // todo: Detect language or another API to generate with <code> tag surrounded
      return `<div class="highlight"><pre><code class="js hljs javascript">${html.value}</code></pre></div>`
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
    refreshPage () {
      console.log('Refresh triggered..')
    },
    querySearch (qs, cb) {
      axios.get('/api/search?text=' + qs + '&resultSize=10')
        .then(res => {
          let data = res.data.data
          let names = data.map(t => {
            return {value: t.snippet_name}
          })
          console.log('Search hints: ' + JSON.stringify(names))
          cb(names)
        })
    },
    handleSelect (qs) {
      this.onSearch(qs.value)
      this.searchText = ''
    }
  },
  watch: {
    // CAN NOT USE ()=>{} ARROW FUNCTION in WATCH !!!
    result: function (val, oldVal) {
      this.currentVersion = val.contents[0].version
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
    this.setOnFire()
  },
  components: {
    EditForm,
    DeleteForm
  },
  created () {
    axios.get('/api/snippets?page=1&pageSize=10')
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
  b
  .card-tags-item
    margin-right: 5px
  .card-contents
    select
      margin-left: 5px
    code
      border-radius: 5px

.cc-home-edit-group
  position: relative
  height: 100px
  width: 100%
  .create-button
    position: absolute
    top: 15px
    right: 0
</style>