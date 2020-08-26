const socketIO = require("socket.io");
let users = [];
module.exports = function (server) {
    const io = socketIO(server);
    io.on("connection", socket => {
        let curUser = ""; //当前用户名
        //监听客户端消息
        socket.on("login", username => {
            if (username === "所有人" || users.filter(u => users.username === username).length > 0) {
                //名称不可用
                socket.emit("login", false);
            } else {
                users.push({
                    username,
                    socket
                });
                curUser = username;
                socket.emit("login", true);
                //新用户进入
                socket.broadcast.emit("userIn", username); //将消息发送给除自己之外的客户端
            }
        });
        socket.on("users", () => {
            const arr = users.map(i => i.username);
            socket.emit("users", arr);
        });
        socket.on("disconnect", () => {
            socket.broadcast.emit("userOut", curUser);
            users = users.filter(u => u.username !== curUser);
        });
        socket.on("msg", data => {
            if (data.to) {
                //发送给指定的用户
                const us = users.filter(u => u.username === data.to);
                //将消息发送到对应的socket上
                const u = us[0];
                u.socket.emit("new msg", {
                    from: curUser,
                    content: data.content,
                    to: data.to
                });
            } else {
                //发送给所有人
                socket.broadcast.emit("new msg", {
                    from: curUser,
                    content: data.content,
                    to: data.to
                });
            }
        });
    });
}