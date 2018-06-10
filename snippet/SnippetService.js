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

  getSnippetHints(opts, cb){
    let {text, resultSize} = opts
    this.collection.find({snippet_name: new RegExp(`^${text}`)},{_id: 0,snippet_name: 1}).sort({ snippet_name: 1}).limit(resultSize).exec((err, data)=>cb(err, data))
  }

  getSnippetByTags(opts, cb){
    let {tags} = opts
    let {page, pageSize} = opts
    let query = {
      snippet_tags: {$all: tags} // $all act as 'like' here
    }
    console.log(query)
    if (!opts.page && !opts.pageSize)
      this.collection.find(query, (err, data)=>cb(err, data))
    else
      this.collection.find(query, {_id: 0,snippet_name: 1}).sort({ snippet_name: 1}).skip((page-1)*pageSize).limit(pageSize).exec((err, data)=>cb(err, data))
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