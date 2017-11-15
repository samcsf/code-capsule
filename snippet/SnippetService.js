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
    let {page, pageSize} = opts
    if (opts.name)
      record = { snippet_name : opts.name }
    if (!opts.page && !opts.pageSize)
      this.collection.find(record, (err, data)=>cb(err, data))
    else
      this.collection.find(record).sort({ snippet_name: 1}).skip((page-1)*pageSize).limit(pageSize).exec((err, data)=>cb(err, data))
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