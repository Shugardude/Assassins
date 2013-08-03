var router = require('./router.js')
  , express = require('express')
  , app = express()
  , MongoStore = require('connect-mongo')(express)
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);
console.log('Listening on port 8080...');

// Sessions with connext-mongo to store users cookie info in case server goes down

app.use(express.cookieParser());
app.use(express.session({
  secret: '1234567890QWERTY',
  store: new MongoStore({ db: router.conn.connection.db })
}));
app.use(express.bodyParser());

// Router functions are defined in users.js

app.post('/login', function(req, res){
  router.login(req, res);
});

app.post('/signup', function(req, res){
  router.signup(req, res);
});

app.post('/create', function(req, res){
  router.create(req, res);
});

app.post('/joingroup', function(req, res){
  router.joingroup(req, res);
});

app.post('/logcheck', function(req, res){
  router.logcheck(req, res);
});

app.post('/logout', function(req, res){
  router.logout(req, res);
});

app.post('/checklist', function(req, res){
  router.checklist(req, res);
});

app.post('/startgame', function(req, res){
  router.startgame(req, res);
});

// get requests

app.get('/home', function(req, res){
  router.home(req, res);
});

app.get('/login', function(req, res){
  if (req.session.username && req.session.groupname){
	res.redirect('/home');
  } else {
    res.sendfile('./html/login.html');
  }
});

app.get('/signup', function(req, res){
  if (req.session.username && req.session.groupname){
	res.redirect('/home');
  } else {
    res.sendfile('./html/signup.html');
  }
});

app.get('/', function(req, res){
  if (req.session.username && req.session.groupname){
	res.redirect('/home');
  } else {
    res.sendfile('./html/create.html');
  }
});

// css get requests
app.get('/socket.js', function (req, res){
  res.setHeader('Content-Type', 'text/script');
  res.sendfile('./socket.js')
});

app.get('/css/home.css', function (req, res){
  res.setHeader('Content-Type', 'text/css');
  res.sendfile('./css/home.css')
});

app.get('/css/login.css', function (req, res){
  res.setHeader('Content-Type', 'text/css');
  res.sendfile('./css/login.css')
});

app.get('/css/create.css', function (req, res){
  res.setHeader('Content-Type', 'text/css');
  res.sendfile('./css/create.css')
});

app.get('/*', function (req, res){
  res.redirect('/home');
});

// socket io events

io.sockets.on('connection', function (socket){
  socket.emit('news', { hello: 'world' });
  socket.on('joinRoom', function (data){
    console.log('HEARD JOIN!!!');
  });
});






