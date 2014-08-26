var restify = require('restify')
var dataUriToBuffer = require('data-uri-to-buffer')
var faceblur = require('faceblur')
var server = restify.createServer()
var port = process.env.PORT || 8000

server.use(restify.acceptParser(server.acceptable))
server.use(restify.bodyParser({
  maxBodySize: 1000000,
  mapParams: false
}))

server.head('/', function(req, res, next) {
  res.send(200)
})

server.post('/service', function(req, res, next) {
  var buffer = dataUriToBuffer(req.body.content.data)

  faceblur(buffer, function(err, blurred) {
    var data = [
      'data:',
      blurred.type,
      ';base64,',
      blurred.toString('base64')
    ].join('')

    req.body.content.data = data
    res.json(req.body)
  })
})

server.listen(port)
console.log('Faceblur service running on port %s', port)
