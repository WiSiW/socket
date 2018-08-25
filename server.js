var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var IO = require('socket.io');

var redis = require('redis');
var redisClient = redis.createClient;
var pub = redisClient(6379, '127.0.0.1');
var sub = redisClient(6379, '127.0.0.1');

app.use(express.static('dist'));
var server = http.createServer(app).listen(777);
console.log("The HTTPS server is up and running");

var io = IO(server);
console.log("Socket Secure server is up and running.");


// 音频房间用户名单
var videoUsers = {};
var videoSockets = {};


io.on('connect', function (socket) {

  var roomID = '';  //房间号
  var user = '';    //当前登录用户名
  var userId = '';    //当前登录用户Id

  socket.on('message', function(data) {
    console.log(data);
    //var data = JSON.parse(data);
    //switch (data.event) {
    //  case "get_room_info":
    //    socket.emit('listenStream', JSON.stringify({
    //        "event": "show",
    //        "allUser": videoUsers,
    //        "success": true
    //      })
    //    );
    //    break;
    //  //当有新用户加入时
    //  case "join":
    //    user = data.name;
    //    userId = data.id;
    //    roomID = data.room;
    //    if (! videoUsers[roomID]) {
    //      videoUsers[roomID] = [];
    //      videoSockets[roomID] = [];
    //      sub.subscribe(roomID);
    //    }
    //    var inRoom = false;
    //    for(var i=0;i<videoUsers[roomID].length;i++){
    //      if(data.id === videoUsers[roomID][i].id){
    //        console.log("音视频切换");
    //        inRoom = true;
    //        break;
    //      }
    //    }
    //    //当昵称重复时
    //    //if(videoUsers[roomID].indexOf(user) !== -1) {
    //    if(inRoom) {
    //      pub.publish(roomID, JSON.stringify({
    //        "event": "join",
    //        "message": data.type,
    //        "success": false,
    //        "name": data.name,
    //        "id": data.id,
    //        "users": videoUsers[roomID]
    //      }));
    //    } else {
    //      //保存用户信息于该房间
    //      videoUsers[roomID].push({user:user,id:data.id,type:data.type});
    //      videoSockets[roomID][data.id] = socket;
    //      socket.name = user;
    //      socket.join(roomID);
    //      io.emit('message', JSON.stringify({
    //          "event": "show",
    //          "allUser": videoUsers,
    //          "success": true
    //        })
    //      );
    //      pub.publish(roomID, JSON.stringify({
    //        "event": "join",
    //        "users": videoUsers[roomID],
    //        "success": true
    //      }));
    //    }
    //    break;
    //
    //  case "offer":
    //    console.log("offer")
    //    console.log(data)
    //    console.log(user, " Sending offer to: ", data.connectedUserName);
    //    var conn = videoSockets[roomID][data.connectedUserId];
    //    if(conn != null) {
    //      sendTo(conn, {
    //        "event": "offer",
    //        "offer": data.offer,
    //        "name": user,
    //        "id": userId
    //      });
    //    } else {
    //      sendTo(socket, {
    //        "event": "msg",
    //        "message": "Not found this name"
    //      });
    //    }
    //    break;
    //
    //  case "answer":
    //    console.log("answer")
    //    console.log(data)
    //    console.log("user:"+user)
    //    console.log(user, " Sending answer to: ", data.connectedUserName);
    //    //for ex. UserB answers UserA
    //    var conn = videoSockets[roomID][data.connectedUserId];
    //    if(conn != null) {
    //      sendTo(conn, {
    //        "event": "answer",
    //        "answer": data.answer,
    //        "name": user,
    //        "id": userId
    //      });
    //    }
    //    break;
    //
    //  case "candidate":
    //    console.log(data)
    //    console.log(data.name)
    //    console.log(data.name, " Sending candidate to: ", user);
    //    var conn = videoSockets[roomID][data.id];
    //    if(conn != null) {
    //      sendTo(conn, {
    //        "event": "candidate",
    //        "candidate": data.candidate,
    //        "name": user,
    //        "id": userId,
    //        "type": data.type
    //      });
    //    }
    //    break;
    //
    //  //关闭摄像头和麦克风但不退出房间
    //  case "offCameraAndMicrophone":
    //    console.log("offCameraAndMicrophone");
    //    console.log(data);
    //    console.log("socket.name"+socket.name);
    //    var userIdx,id;
    //    for(var i=0;i<videoUsers[roomID].length;i++){
    //      if(videoUsers[roomID][i].user == socket.name){
    //        userIdx = i;
    //        id = videoUsers[roomID][i].id
    //      }
    //    }
    //    console.log(videoSockets[roomID]);
    //    videoSockets[roomID].splice(id,1);
    //    console.log(videoSockets[roomID]);
    //    console.log(videoUsers[roomID]);
    //    videoUsers[roomID].splice(userIdx,1);
    //    console.log(videoUsers[roomID]);
    //    pub.publish(roomID, JSON.stringify({
    //      "event": "offCameraAndMicrophone",
    //      "name": socket.name,
    //      "id": id,
    //      "users": videoUsers[roomID]
    //    }));
    //    break;
    //
    //  //关闭摄像头和麦克风但不退出房间
    //  case "toggleVideo":
    //    console.log("toggleVideo");
    //    console.log(data);
    //    pub.publish(roomID, JSON.stringify({
    //      "event": "toggleVideo",
    //      "name": data.name,
    //      "id": data.id,
    //      "type": data.type,
    //      "users": videoUsers[roomID]
    //    }));
    //    break;

    //}
  });

  socket.on("disconnect", function() {
    if (socket.name) {
      var userIdx,id;
      for(var i=0;i<videoUsers[roomID].length;i++){
        if(videoUsers[roomID][i].user == socket.name){
          userIdx = i;
          id = videoUsers[roomID][i].id
        }
      }
      console.log(videoSockets[roomID]);
      videoSockets[roomID].splice(id,1);
      console.log(videoSockets[roomID]);
      console.log(userIdx);
      console.log(videoUsers[roomID]);
      videoUsers[roomID].splice(userIdx,1);
      console.log(videoUsers[roomID]);
      console.log("Disconnecting from ", socket.name);
      pub.publish(roomID, JSON.stringify({
        "event": "leave",
        "name": id,
        "users": videoUsers[roomID]
      }));
      if (videoUsers[roomID].length == 0) {
        delete videoUsers[roomID];
        delete videoSockets[roomID];
      }
      io.emit('message', JSON.stringify({
        "event": "show",
        "allUser": videoUsers,
        "success": true
      }));
    }
  });
});

sub.on("subscribe", function(channel) {
  console.log('subscribe: ' + channel);
});

//音频聊天
sub.on("message", function(channel, message) {
  console.log("message channel " + channel + ": " + message);
  io.to(channel).emit('message', JSON.parse(message));
});
function sendTo(connection, message) {
  connection.send(message);
}