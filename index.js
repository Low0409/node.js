const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.broadcast.emit('chat message', "誰かが入室しました");//入室通知

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.broadcast.emit('chat message',"【＠"+socket.userName+"】"+"が退出しました");//退出通知
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    //io.emit('chat message', msg);           //自分と相手
    socket.broadcast.emit('chat message', msg + "【＠"+socket.userName+"】");//相手にだけ表示
  })


  socket.on('setUserName', function (userName) {
    if (!userName) userName = '匿名';

    socket.userName = userName;
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
