const path = require('path');
const fs = require('fs');
const http = require('http');
const mime = require('mime');
const express = require('express');
const delay = require('express-delay');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const { name, internet } = require('faker');
const chalk = require('chalk');
const { json } = require('express/lib/response');
var datafile = './mock/getTaskType.json';

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const server = http.createServer(app);

var constants = {
    SERVER_PORT: 7080,
    UPLOAD_DIRECTORY: 'uploads',
    MOCK_DIRECTORY: 'mock'
}

function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);

    return file;

}

const getJsonResponse = (filePath, res) => {

    res.setHeader('Content-Type', 'application/json');

    var file = readJsonFileSync(filePath);

    res.jsonp(JSON.parse(file));
}

function getTasksData() {
    var data = fs.readFileSync(datafile, 'utf8');
    return JSON.parse(data);
}
/**
 * risorse statiche
 */
app.use(express.static(path.join(__dirname, '../', 'static')));

app.use(delay(500, 1000));

app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Expires, Content-Type, Accept, Access-Control-Allow-Headers, Authorization, Customercode, CustomerPrefix, UserId, X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

    if ('OPTIONS' === req.method) {
        //respond with 200 to prevent cross site origin
        res.status(200).end();
    }
    else {
        //move on
        console.log(chalk.blue('### REQUEST START: '));
        console.log('------------------------');
        console.log(chalk.bgGreen('method: '), req.method);
        console.log('------------------------');
        console.log(chalk.bgGreen('url: '), req.url);
        console.log('------------------------');
        console.log(chalk.bgGreen('query params: '), req.query);
        console.log('------------------------');
        console.log(chalk.bgGreen('body: '), req.body);
        console.log('------------------------');
        console.log(chalk.blue('### REQUEST END'));
        next();
    }

});

app.get('/api/random-user', function (req, res) {

    let response = {
        data: []
    }

    for (var i = 0; i < 100000; i++) {
        response.data.push({ id: i, name: name.firstName(), lastName: name.lastName(), email: internet.email() })
    }

    res.send(response);


});

app.get('/api/getTaskTypes/:id', function (req, res) {

    console.log(getTasksData());
      let data = getTasksData();
      console.log('Retrieving task id: ' + req.params.id);
	  //console.log('Retrieving data ' + json_encode( data));
    var matchingTask = data.taskTypes.filter(function(item) {
            return item.id == req.params.id;
        });

        if(matchingTask.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(matchingTask[0]);
        }
		
	
   /* let response = {
        data: []
    }

    for (var i = 0; i < 100000; i++) {
        response.data.push({ id: i, name: name.firstName(), lastName: name.lastName(), email: internet.email() })
    }

    res.send(response);
*/

});

app.get('/api//getListaUtenti', function (req, res) {
    getJsonResponse(path.join(constants.MOCK_DIRECTORY, 'getListaUtenti.json'), res);
});
app.get('/api/getTaskTypes', function (req, res) {
    getJsonResponse(path.join(constants.MOCK_DIRECTORY, 'getTaskType.json'), res);
});
app.get('/test', function (req, res) {
    getJsonResponse(path.join(constants.MOCK_DIRECTORY, 'test.json'), res);
});


app.get('/test2', function (req, res) {
    res.status(200);
    res.send('');
})




// Esempi
app.get('/api/get-examples', function (req, res) {
    getJsonResponse(path.join(constants.MOCK_DIRECTORY, 'get.json'), res);
});
app.post('/api/post-example', function (req, res) {
    getJsonResponse(path.join(__dirname, constants.MOCK_DIRECTORY, 'post.json'), res);
});

app.put('/api/put-example', function (req, res) {
    getJsonResponse(path.join(__dirname, constants.MOCK_DIRECTORY, 'put.json'), res);
});

app.delete('/api/delete-example', function (req, res) {
    getJsonResponse(path.join(__dirname, constants.MOCK_DIRECTORY, 'delete.json'), res);
});

app.delete('/api/delete-example', function (req, res) {
    getJsonResponse(path.join(__dirname, constants.MOCK_DIRECTORY, 'delete.json'), res);
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
            index = old_path.lastIndexOf(path.sep) + 1,
            file_name = old_path.substr(index),
            new_path = path.join(__dirname, constants.UPLOAD_DIRECTORY, file_name + '.' + file_ext);

        fs.readFile(old_path, function (err, data) {
            fs.writeFile(new_path, data, function (err) {
                fs.unlink(old_path, function (err) {
                    if (err) {
                        res.status(500);
                        res.json({ 'success': false });
                    } else {
                        res.status(200);
                        res.setHeader('Content-Type', 'application/json');
                        var filepath = "mock/listUploadBean.json"
                        var file = readJsonFileSync(filepath);

                        res.jsonp(JSON.parse(file));

                    }
                });
            });
        });
    });
});

// 404
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
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        //ws.send(message);

        wss.clients
            .forEach(client => {
                if (client != ws) {
                    client.send(`Hello, broadcast message -> ${message}`);
                }
            });
        ws.send(`Ho inviato -> ${message}`);
    });

});

server.listen(constants.SERVER_PORT, function () {
    console.log('Server BE listening on port ' + constants.SERVER_PORT);
});