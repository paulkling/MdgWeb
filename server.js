var express = require('express')
  , http = require('http')
  , path = require('path')
  , reload = require('reload')

var app = express()

var publicDir = path.join(__dirname, 'public')

app.configure(function() {
  app.set('port', process.env.PORT || 3000)
  app.use(express.logger('dev'))
  app.use(express.bodyParser()) //parses json, multi-part (file), url-encoded
  app.use(app.router) //need to be explicit, (automatically adds it if you forget)
  //app.use(express.static(clientDir)) //should cache static assets
})


app.get('/', function(req, res) {
  res.sendfile(path.join(publicDir, 'index.html'))
})

var server = http.createServer(app)
//test com

//reload code here
reload(server, app)

server.listen(app.get('port'), function(){
  console.log("Web server listening on port " + app.get('port'));
});


var io = require("socket.io").listen(server)

io.set('log level', 3)
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
