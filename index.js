const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, "./public")));

//websocket
require("./chatServer")(server);

server.listen(5008, () => {
    console.log("监听端口5008");
});