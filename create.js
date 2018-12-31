var ref = require('ssb-ref')

function isId (id) {
  return ref.isFeed(id) || ref.isMsg(id)
}

//creating a list doesn't need any special properties
exports.create = function (opts) {
  return Object.assign({}, opts, {
    type: 'list/create'
  })
}

exports.contact = function (opts) {
  if(!isId(opts.contact))
    throw new Error('must have contact property, a feed or msg id')
  if(!ref.isMsg(opts.list))
    throw new Error('must have list property, a msg id')
  if(!(opts.blocking === true || opts.following === true || opts.following == false))
    throw new Error('must be blocking following, or unfollowing')
  return Object.assign({}, opts, {
    type: 'list/contact'
  })
}

exports.subscribe = function (opts) {
  if(!ref.isMsg(opts.list))
    throw new Error('must have list property, a msg id')
  if('boolean' !== typeof opts.subscribe)
    throw new Error('must have boolean subscribe property')
  return Object.assign({}, opts, {
    type: 'list/subscribe'
  })
}


