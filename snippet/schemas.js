//validate the requests 
'use strict'

const getSnippet = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          pattern: '^\\D[\\w-_]*'
        },
        pageSize: {
          type: 'number'
        },
        page: {
          type: 'number' 
        }
      }
    },
    response: {
      200: {
        type: 'object',
        require: [ 'data' ],
        properties: {
          data: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                snippet_name: {
                  type: 'string'
                },
                snippet_desc: {
                  type: 'string'
                },
                snippet_tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                snippet_contents: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'string'
                      },
                      snippet: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }

        },
        additionalProperties: false
      }
    }
  }
}

const createSnippet = {
  schema: {
    body: {
      type: 'object',
      required: ['name','contents'],
      properties: {
        name: {
          type: 'string',
          pattern: '^\\D[\\w-_]*'
        },
        contents: {
          type: 'array'
        }
      }
    },
    response: {
      200: {
        type: 'object',
        require: [ 'data' ],
        properties: {
          data: { 
            type: 'object',
            properties: {
              snippet_name: {
                type: 'string'
              },
              snippet_desc: {
                type: 'string'
              },
              snippet_tags: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              snippet_contents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    version: {
                      type: 'string'
                    },
                    snippet: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }

        },
        additionalProperties: false
      }
    }
  }
}

const deleteSnippet = {
  schema: {
    querystring: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          pattern: '^\\D[\\w-_]*'
        },
      }
    },
    response: {
      200: {
        type: 'object',
        require: [ 'data' ],
        properties: {
          data: {
            type: 'object',
            properties: {
              result: {type: 'object',
                properties: {
                  n: {type: 'number'},
                  ok: {type: 'number'}
                }
              },
              deletedCount: {type: 'number'},
              message:{type: 'string'}
            }
          }
        }
      }
    }
  }
}

module.exports = {
  getSnippet,
  createSnippet,
  deleteSnippet
}