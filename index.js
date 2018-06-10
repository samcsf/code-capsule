const fastify = require('fastify')()
const path = require('path')
const snippet = require('./snippet')
const HOST = process.env.MONGODB_PORT_27017_TCP_ADDR || '0.0.0.0'
const PORT = process.env.MONGODB_PORT_27017_TCP_PORT || 27017

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public')
})
fastify.register(snippet, {DB_URL: 'mongodb://' + HOST + ':' + PORT + '/code-capsule-dev'})

fastify.listen(8809, err=>{
  if(err) throw err
  console.log(`Fastify running on port ${fastify.server.address().port}`)
})
