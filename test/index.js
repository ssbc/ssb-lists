
//okay create a block list, have someone subscribe to it
var tape = require('tape')
var List = require('../create')
var Scuttlebot = require('ssb-server')
      .use(require('ssb-server/plugins/replicate'))
      .use(require('ssb-friends'))
      .use(require('../'))
      
var alice = Scuttlebot({
  temp: true
})
var bob = alice.createFeed()
var carol = alice.createFeed()

var list_id
tape('bob creates blocklist', function (t) {
  bob.publish(List.create({}), function (err, data) {
    list_id = data.key
    t.end()
  })
})


tape('bob blocks carol', function (t) {
  bob.publish(List.contact({
    list: list_id,
    contact: carol.id,
    blocking: true
  }), function (err) {
    if(err) throw err
    alice.publish(
      List.subscribe({
        list: list_id, subscribe: true
      }), function (err) {
        if(err) throw err
        alice.friends.hops({}, function (err, value) {
          t.equal(value[list_id], 0.1)
          t.equal(value[carol.id], -1.1)
          t.end()
        })
      }
    )
  })
})

tape('cleanup', function (t) {
  alice.close()
  t.end()
})

