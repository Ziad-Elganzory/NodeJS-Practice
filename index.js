"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var port = 5000;
var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Hello World'
    }));
});
server.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
