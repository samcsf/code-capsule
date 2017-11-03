const fastify = require('fastify')()
const snippet = require('./snippet')

fastify.register(snippet, {DB_URL: 'mongodb://localhost/code-capsule-dev'})

fastify.listen(8809, err=>{
  if(err) throw err
  console.log(`Fastify running on port ${fastify.server.address().port}`)
})