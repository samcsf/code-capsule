const mongoose = require('mongoose')

const snippetSchema = mongoose.Schema({
  snippet_name: {type: String},
  snippet_desc: String,
  snippet_tags : [String],
  snippet_contents: [{version: String, snippet: String}]
})

module.exports = snippetSchema