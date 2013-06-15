var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs')

var counter;
var ARDUINO_PORT = "/dev/tty.usbmodemfd141";

var sp = require("serialport");
var SerialPort = sp.SerialPort;

// NOTE: In
var serialPort = new SerialPort(ARDUINO_PORT, {
    parser : sp.parsers.readline()
});

io.set('log level', 1); // reduce logging

app.listen(8124);

function handler (req, res) {
    fs.readFile( 'client.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            counter = 1;

            res.writeHead(200);
            res.end(data);
        });
}
io.sockets.on('connection', function (socket) {
    socket.emit('news', { news: '0' });
    /*
    socket.on('echo', function (data) {


        if ( true ) {
            //counter++;
            setTimeout( function(){
                counter = Math.floor(Math.random()*11 + 70);
                data.back = counter;
                socket.emit('news', {news: data.back });
            }, 200);

            //data.back+=counter;
            //socket.emit('news', {news: data.back + '<br>'});
        }

    });
    */
    serialPort.on("data", function (data) {
        //socket.emit('data', data);
        socket.emit('news', {news: data });
    });
});