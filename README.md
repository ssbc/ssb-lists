# ssb-list

block or follow lists for ssb.

This implements block/follow lists. (the main use-case was block lists)
but a system that could both block and follow was not more complicated.

A user creates a list by publishing a `{type: "list/create"}` message.
Then they add contacts to that list using a `list/contact` message.

``` js
{
  type: 'list/contact',
  list: <list_id>, //the id of the list/create message.
  blocking: true
  // OR
  following: true
  // OR
  following: false
}
```
this is the same format as contact messages, except with a reference
to a list.

Then other users can subscribe to that list.

```
{
  type: 'list/subscribe',
  list: <list_id>, //id of the list/create message
  subscribe: true || false
}
```
## how it works

This uses the `createLayer` feature of the ssb-friends plugin.
The blocklist makes a map from the list_id to the contacts
(who are either blocked or followed or unfollowed/unblocked)
but the trick is that subscribing uses a low hop count of 0.1.
(as same-as would) this means that if you subscribe to a block
list, it's follows/blocks are treated the same as your own.

## usage

I just wrote this! so currently no ssb clients support this.
(will link here when some clients implement support!)

However, if you install this plugin manually, and use
via the command line, it will work!
```
ssb-server plugins.install ssb-lists
```

create relavant messages manually like this:

```
#create a list, you'll need the "key" output for following commands
ssb-server publish --type list/create
{"key": <list_id>, value:...}

# have the list block someone
ssb-server publish --type list/contact \
  --list <list_id> --contact <feed_id> \
  --blocking --reason <optional_reason>

# subscribe to the list
ssb-server publish --type list/subscribe \
  --list <list_id> --subscribe
```

Because this integrates with `ssb-friends` and `ssb-friends`
handles deciding who to replicate, anyone blocked on a list
you have subscribed to will not be replicated!

## License

MIT

