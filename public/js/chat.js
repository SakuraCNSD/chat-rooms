const socket = io();
//客户端发送消息给服务器
page.onLogin = function (username) {
    socket.emit("login", username);
}
//发送消息
page.onSendMsg = function (me, msg, to) {
    socket.emit("msg", {
        to,
        content: msg,
        me
    });
    page.addMsg(me, msg, to);
    page.clearInput();
}
//客户端监听服务器消息
socket.on("login", result => {
    if (result) {
        page.intoChatRoom();
        socket.emit("users", "");
    } else {
        alert("昵称不可用，请更换昵称");
    }
});
//获取用户列表
socket.on("users", users => {
    page.initChatRoom();
    for (const u of users) {
        page.addUser(u);
    }
});
//新用户进入
socket.on("userIn", username => {
    page.addUser(username);
});
//用户离开
socket.on("userOut", username => {
    page.removeUser(username);
});

socket.on("new msg", result => {
    page.addMsg(result.from, result.content, result.to);
});