const mongoose = require('mongoose')
const fp = require('fastify-plugin')

function connectMongoose(fastify, opts, next){
  //Connect DB..
  mongoose.connect(opts.url, opts.others={useMongoClient: true})
  var conn = mongoose.connection

  //Start up -> Injects to Fastify & Hook on close
  conn.on('connected', onConnect)

  function onConnect(){
    console.log('Connected to ' + opts.url)

    fastify
      .decorate('mongoose', mongoose)
      .addHook('onClose', ()=>{mongoose.disconnect()})  
    
    next()
  }
}

module.exports = fp(connectMongoose)