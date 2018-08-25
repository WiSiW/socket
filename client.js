var socket;
var users;
var stream;
var configuration = {
    iceServers: [
        //{url:'stun:stun01.sipphone.com'},
        //{url:'stun:stun.ekiga.net'},
        //{url:'stun:stun.fwdnet.net'},
        //{url:'stun:stun.ideasip.com'},
        //{url:'stun:stun.iptel.org'},
        //{url:'stun:stun.rixtelecom.se'},
        //{url:'stun:stun.schlund.de'},
        //{url:'stun:stun.l.google.com:19302'},
        //{url:'stun:stun1.l.google.com:19302'},
        //{url:'stun:stun2.l.google.com:19302'},
        //{url:'stun:stun3.l.google.com:19302'},
        //{url:'stun:stun4.l.google.com:19302'},
        //{url:'stun:stunserver.org'},
        //{url:'stun:stun.softjoys.com'},
        //{url:'stun:stun.voiparound.com'},
        //{url:'stun:stun.voipbuster.com'},
        //{url:'stun:stun.voipstunt.com'},
        {url:'stun:stun.voxgratia.org'},
        //{url:'stun:stun.xten.com'},
        //{
        //    url: 'turn:numb.viagenie.ca',
        //    credential: 'muazkh',
        //    username: 'webrtc@live.com'
        //},
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        }
    ]
};
var ip = '192.168.1.43';
socket = io("http://"+ ip +":777");


var room_id = document.getElementById("roomId");
var user_id = document.getElementById("userId");
var user_name = document.getElementById("userName");
function join () {
    send();
}
var message = document.getElementById("message").value();
var jsonStr = {
    event: message,
    name: user_name,
    id: user_id,
    room: room_id
}

// 发送消息
function send() {
    console.log(111)
    socket.send(JSON.stringify(jsonStr));
}
// 接收消息
socket.on("message", function(data) {
        console.log(data);
        switch (data.event) {
            case "join":
                handleLogin(data);
                break;
            default:
                break;
        }
    }
);