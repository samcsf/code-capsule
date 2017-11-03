const fp = require('fastify-plugin')
const mongoosePlugin = require('../util/fastify-mongoose')
const SnippetService = require('./SnippetService')
//validation schema
const { getSnippet: getSnippetSchema,
        createSnippet: createSnippetSchema,
        deleteSnippet: deleteSnippetSchema } = require('./schemas')
//db schema
const snippetSchema = require('./db')

module.exports = function(fastify, opts, next){
  //validate and save environment vars
  fastify.register(require('fastify-env'),{
    schema: {
      type: 'object',
      required: ['DB_URL'],
      properties: {
        DB_URL: {type: 'string', default: 'mongodb://localhost/code-capsule-dev'},
        DB_OPTIONS: {type: 'object', default: {useMongoClient: true}},
      }
    },
    data: opts
  })

  //to await the env validation and start subsequence processes
  //each registration will allocate new fastify scope
  //below wrapper[register()] creates fastify instance and only share inside the wrapper
  fastify.register(function (fastify, opts, done){
    fastify.register(mongoosePlugin, { url: fastify.config.DB_URL })
    fastify.register(fp(function decorateCollection(fastify, opts, done){
      fastify.decorate('snippetCollection', fastify.mongoose.model('snippet', snippetSchema))
      fastify.decorate('snippetService', new SnippetService(fastify.snippetCollection))
      done()
    }))
    fastify.register(setupRoutes)
    done()
  })
  next()  
}

//routes
function setupRoutes(fastify, opts, next){
  const { snippetService } = fastify
  function replyWrapper(replyObj){
    return replyObj.sendData.bind(replyObj)
  }

  fastify.decorateReply('sendData', function(err, data){
    if(err) this.send(err)
    if(!data)
      data = { snippet_name: '', snippet_desc: '', snippet_tags : [], snippet_contents: []}
    this.send({data})
  })

  fastify.get('/snippets', getSnippetSchema, (req, reply)=>{
    snippetService.getSnippet(req.query, replyWrapper(reply))
  })

  fastify.post('/snippets', createSnippetSchema, (req, reply)=>{
    snippetService.createSnippet(req.body, replyWrapper(reply))
  })

  fastify.put('/snippets', createSnippetSchema, (req, reply)=>{
    snippetService.updateSnippet(req.body, replyWrapper(reply))
  })

  fastify.delete('/snippets', deleteSnippetSchema, (req, reply)=>{
    snippetService.deleteSnippet(req.query, replyWrapper(reply))
  })

  next()
}