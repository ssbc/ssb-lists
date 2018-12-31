'use strict'
var Reduce = require('flumeview-reduce')
var ref = require('ssb-ref')
/*
  message types:

  subscribe/unsubscribe
  create,
  block/unblock
*/

//allow follow targets to be either feeds or msgs, so you can
//follow lists. 
function isId(id) {
  return ref.isFeed(id) || ref.isMsg(id)
}

exports.name = 'lists'
exports.manifest = {
  get: 'async'
}

exports.init = function (sbot, config) {

  var layer = sbot.friends.createLayer('lists')
  var g

  var lists = sbot._flumeUse('lists', Reduce(1, function (state, data) {
    if(!state) {
      state = {graph: g = g || {}}
    }

    var g = state.graph
    var content = data.value.content

    function update (from, to, value) {
      g[from] = g[from] || {}
      g[from][to] = value
      layer(from, to, value)
    }

    if(!/^list\//.test(content.type)) return

    if('list/create' === content.type) {
      //subscribing to a blocklist must imply following it's owner
      update(data.key, data.value.author, 0.9)
    }
    else if('list/contact' == content.type) {
      //TODO: insert mutable document model here.
      //or maybe just express via allowing a list to subscribe to another list?
      //check if this author is authorized to update list
      if(ref.isMsg(content.list)) {
        var rel_author = g[content.list] ? g[content.list][data.value.author] : -1
        if(rel_author > 0 && rel_author <= 1 && isId(content.contact))
          update(
            content.list, content.contact,
            content.blocking ? -1 : content.following === true ? 1 : -2
          )
      }
    }
    else if('list/subscribe' === content.type) {
      //subscribe uses a weight as low as same-as
      //because you treat the blocks/follows on the list
      //as if they are your own.
      if(ref.isMsg(content.list)) {
        update(data.value.author, content.list, content.subscribe === true ? 0.1 : -2)
      }
    }
    return state
  }))

  lists.get(function (err, value) {
    if(err || !value) g = {}
    else              g = value.graph
    layer(g)
  })

  return lists
}












