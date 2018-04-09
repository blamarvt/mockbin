'use strict'

var debug = require('debug-log')('mockbin')
var merge = require('deepmerge')

module.exports = function (req, res, next) {
  var _this = this;
  this.client.get('bin:' + req.params.uuid, function (err, value) {
    if (err) {
      debug(err)

      throw err
    }

    if (value) {
      var har = JSON.parse(value)

      res.view = 'bin/view'
      res.body = merge(har, req.jsonBody)

      var id = req.path.split('/')[1];
      res.body.id = id;
      _this.client.set('bin:' + id, JSON.stringify(res.body), () => {
        next()
      })
    } else {
      next()
    }
  })
}

