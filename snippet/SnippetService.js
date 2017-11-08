class SnippetService {
  constructor(collection, opts={}){
    this.collection = collection
    this.opts = opts
  }

  deleteSnippet(opts, cb){
    let record = { snippet_name : opts.name }
    this.collection.deleteOne(record, (err, data)=>cb(err, data))
  }

  getSnippet(opts, cb){
    let record = {}
    if (opts.name)
      record = { snippet_name : opts.name }
    this.collection.find(record, (err, data)=>cb(err, data))
  }

  createSnippet(opts, cb){
    let record = {
      snippet_name: opts.name,
      snippet_desc: opts.desc,
      snippet_tags : opts.tags,
      snippet_contents: opts.contents
    }
    this.collection.create(record, (err, data)=>cb(err, data))
  }

  updateSnippet(opts, cb){
    let qry = {snippet_name: opts.name}
    let record = {
      snippet_name: opts.name,
      snippet_desc: opts.desc,
      snippet_tags : opts.tags,
      snippet_contents: opts.contents
    }
    this.collection.updateOne(qry, record, (err, data)=>cb(err, data))
  }
}

module.exports = SnippetService