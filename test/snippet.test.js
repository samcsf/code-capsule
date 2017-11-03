const assert = require('assert')
const Fastify = require('fastify')
const request = require('request')
const MongoClient = require('mongodb').MongoClient
const snippet = require('../snippet')
const TEST_DB_URL = 'mongodb://localhost/code-capsule-test'
const TEST_PORT = 8808
let TEST_URI = 'http://localhost:' + TEST_PORT +'/snippets'

describe('Snippet module testing.', function(){
  before('Drop Mongo data', ()=>{
    return MongoClient.connect(TEST_DB_URL)
      .then(client=>{
        client.unref()
        return client.dropDatabase()
      })
  })

  before('Start up Fastify Server.', ()=>{
    let app = Fastify()
    app.register(snippet, {DB_URL:TEST_DB_URL})
    app.listen(TEST_PORT)
  })

  it('Case 1: Create Snippet', (done)=>{
    let record = {
      name : 'UnitTest',
      desc : 'Test update result!!',
      tags : ['will','it','success?'],
      contents : [{'version':'v0.0.1', 'snippet':'function(){console.log(\'hello world\')}'}]
    }
    request({
      method: 'POST',
      uri: TEST_URI,
      json : record
    }, (err, response, body)=>{
      if(err) throw err
      let {data} = body
      assert.deepEqual(data.snippet_name, record.name)
      assert.deepEqual(data.snippet_desc, record.desc)
      assert.deepEqual(data.snippet_tags, record.tags)
      assert.deepEqual(data.snippet_contents, record.contents)
      done()
    })
  })

  it('Case 2: Retrieve Snippet', (done)=>{
    let record = {
      name : 'UnitTest',
      desc : 'Test update result!!',
      tags : ['will','it','success?'],
      contents : [{'version':'v0.0.1', 'snippet':'function(){console.log(\'hello world\')}'}]
    }
    request({
      method: 'GET',
      uri: TEST_URI,
      qs: {name: record.name},
    }, (err, response, body)=>{
      if(err) throw err
      let {data} = JSON.parse(body) //GET returning JSON instead of Object?? (unlike POST)
      assert.deepEqual(data.snippet_name, record.name)
      assert.deepEqual(data.snippet_desc, record.desc)
      assert.deepEqual(data.snippet_tags, record.tags)
      assert.deepEqual(data.snippet_contents, record.contents)
      done()
    })
  })
  
  it('Case 3: Update Snippet', (done)=>{
    let record = {
      name : 'UnitTest',
      desc : 'Test update result!!',
      tags : ['will','it','success?'],
      contents : [{'version':'v0.0.1', 'snippet':'function(){console.log(\'hello world\')}'}]
    }
    record.tags.push('Really!!!')
    record.tags.push('Good!!')
    record.desc += 'UPDATED.'
    request({
      method: 'PUT',
      uri: TEST_URI,
      json : record
    }, (err, response, body)=>{
      if(err) throw err
      assert.equal(response.statusCode, 200)
      verifyResult()
    })

    function verifyResult(){
      request({
        method: 'GET',
        uri: TEST_URI,
        qs: {name: record.name},
      }, (err, response, body)=>{
        if(err) throw err
        let {data} = JSON.parse(body) 
        assert.deepEqual(data.snippet_name, record.name)
        assert.deepEqual(data.snippet_desc, record.desc)
        assert.deepEqual(data.snippet_tags, record.tags)
        assert.deepEqual(data.snippet_contents, record.contents)
        done()
      })
    }
  })

  it('Case 4: Remove Snippet', (done)=>{
    let record = {
      name : 'UnitTest',
      desc : 'Test update result!!',
      tags : ['will','it','success?'],
      contents : [{'version':'v0.0.1', 'snippet':'function(){console.log(\'hello world\')}'}]
    }
    request({
      method: 'DELETE',
      uri: TEST_URI,
      qs : {name: record.name}
    }, (err, response, body)=>{
      if(err) throw err
      assert.equal(response.statusCode, 200)
      verifyResult()
    })
    
    function verifyResult(){
      request({
        method: 'GET',
        uri: TEST_URI,
        qs: {name: record.name},
      }, (err, response, body)=>{
        if(err) throw err
        let {data} = JSON.parse(body) 
        assert.equal(response.statusCode, 200)
        assert.deepEqual(data.snippet_name, '')
        assert.deepEqual(data.snippet_desc, '')
        assert.deepEqual(data.snippet_tags, [])
        assert.deepEqual(data.snippet_contents, [])
        done()
      })
    }
  })
  
})
