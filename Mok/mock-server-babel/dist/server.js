"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

var _mime = _interopRequireDefault(require("mime"));

var _express = _interopRequireDefault(require("express"));

var _expressDelay = _interopRequireDefault(require("express-delay"));

var _ws = _interopRequireDefault(require("ws"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _faker = require("faker");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); // support json encoded bodies

app.use(_bodyParser["default"].urlencoded({
  extended: true
})); // support encoded bodies

var server = _http["default"].createServer(app);

var constants = {
  SERVER_PORT: 7080,
  UPLOAD_DIRECTORY: 'uploads',
  MOCK_DIRECTORY: 'mock'
};

function readJsonFileSync(filepath, encoding) {
  if (typeof encoding == 'undefined') {
    encoding = 'utf8';
  }

  var file = _fs["default"].readFileSync(filepath, encoding);

  return file;
}

var getJsonResponse = function getJsonResponse(filePath, res) {
  res.setHeader('Content-Type', 'application/json');
  var file = readJsonFileSync(filePath);
  res.jsonp(JSON.parse(file));
};

app.use((0, _expressDelay["default"])(500, 1000)); //app.use('/entro-web/', express.static('build'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Expires, Content-Type, Accept, Access-Control-Allow-Headers, Authorization, Customercode, CustomerPrefix, UserId, X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

  if ('OPTIONS' === req.method) {
    //respond with 200 to prevent cross site origin
    res.status(200).end();
  } else {
    //move on
    console.log(_chalk["default"].blue('### REQUEST START: '));
    console.log('------------------------');
    console.log(_chalk["default"].bgGreen('method: '), req.method);
    console.log('------------------------');
    console.log(_chalk["default"].bgGreen('url: '), req.url);
    console.log('------------------------');
    console.log(_chalk["default"].bgGreen('query params: '), req.query);
    console.log('------------------------');
    console.log(_chalk["default"].bgGreen('body: '), req.body);
    console.log('------------------------');
    console.log(_chalk["default"].blue('### REQUEST END'));
    next();
  }
});
app.get('/api/random-user', function (req, res) {
  var response = {
    data: []
  };

  for (var i = 0; i < 1000; i++) {
    response.data.push({
      name: _faker.name.firstName(),
      lastName: _faker.name.lastName()
    });
  }

  res.send(response);
});
app.get('/api/get-examples', function (req, res) {
  console.log(constants.MOCK_DIRECTORY);
  getJsonResponse(_path["default"].join(constants.MOCK_DIRECTORY, 'get.json'), res);
});
app.post('/api/post-example', function (req, res) {
  getJsonResponse(_path["default"].join(__dirname, constants.MOCK_DIRECTORY, 'post.json'), res);
});
app.put('/api/put-example', function (req, res) {
  getJsonResponse(_path["default"].join(__dirname, constants.MOCK_DIRECTORY, 'put.json'), res);
});
app["delete"]('/api/delete-example', function (req, res) {
  getJsonResponse(_path["default"].join(__dirname, constants.MOCK_DIRECTORY, 'delete.json'), res);
});
/**
 * Upload Example
 */

app.post('/uploadItem', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var old_path = files.file.path,
        file_size = files.file.size,
        file_ext = files.file.name.split('.').pop(),
        index = old_path.lastIndexOf(_path["default"].sep) + 1,
        file_name = old_path.substr(index),
        new_path = _path["default"].join(__dirname, constants.UPLOAD_DIRECTORY, file_name + '.' + file_ext);

    _fs["default"].readFile(old_path, function (err, data) {
      _fs["default"].writeFile(new_path, data, function (err) {
        _fs["default"].unlink(old_path, function (err) {
          if (err) {
            res.status(500);
            res.json({
              'success': false
            });
          } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            var filepath = "mock/listUploadBean.json";
            var file = readJsonFileSync(filepath);
            res.jsonp(JSON.parse(file));
          }
        });
      });
    });
  });
}); // 404

app.use(function (req, res, next) {
  res.status(404);
  res.json({
    error: {
      message: "INVALID ENDPOINT"
    },
    data: null
  });
});
/**
 * SOCKET S
 */

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/index.html');
});
var wss = new _ws["default"].Server({
  server: server
});
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message); //ws.send(message);

    wss.clients.forEach(function (client) {
      if (client != ws) {
        client.send("Hello, broadcast message -> ".concat(message));
      }
    });
    ws.send("Ho inviato -> ".concat(message));
  });
});
server.listen(constants.SERVER_PORT, function () {
  console.log('Server BE listening on port ' + constants.SERVER_PORT);
});