const WebSocket = require('ws'); // 웹 소켓
var DB = require('./db.js'); // 관련 내용 쓰는 함수 예시
var CREATE = require('./create.js'); // 방을 만들 때 쓰는 클래스
var db = new DB(); // DB 객체를 만든다.

const wss = new WebSocket.Server({ port: 8005 });

const maxClients = 5; // 최대 접속 인원수
let rooms = {}; // 룸 배열
let joinuserTemp = 1; // 유저

db.LogMsg(); // DB 로그 메세지

wss.on('connection', function connection(ws) {
  ws.user = genKey(5); // 임시적으로 유저의 이름을 할당 한다.

  var create = new CREATE();
  console.log(ws.user);

  ws.on('message', function message(data) {
    console.log(JSON.parse(data));
    const obj = JSON.parse(data);
    const type = obj.type;
    const params = obj.params;

    switch (type) {
      case 'create':
        //create(params);
        create.create(params, rooms, ws, db);
        break;
      case 'join':
        join(params);
        break;
      case 'leave':
        leave(params);
        break;
      default:
        console.warn(`Type: ${type} unknown`);
        break;
    }
  });

  function generalInformation(ws) {
    let obj;
    if (ws['room'] != undefined) {
      obj = {
        type: 'info',
        params: {
          room: ws['room'],
          'no-clients': rooms[ws['room']].length,
        },
      };
    } else {
      obj = {
        type: 'info',
        params: {
          room: 'no room',
        },
      };
    }

    ws.send(JSON.stringify(obj));
  }

  function create(params) {
    const room = genKey(5);
    console.log('room id : ' + room);
    rooms[room] = [ws];
    ws['room'] = room;

    generalInformation(ws);
  }

  function genKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  function join(params) {
    const room = params.code;
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`);
      return;
    }

    if (rooms[room].length >= maxClients) {
      console.warn(`Room ${room} is full!`);
      return;
    }

    rooms[room].push(ws);
    ws['room'] = room;

    generalInformation(ws);

    var UserList = '';

    for (let i = 0; i < rooms[room].length; i++) {
      UserList += 'User : ' + rooms[room][i].user + ' \n';
    }
    joinuserTemp += 1;

    obj = {
      type: 'info',
      params: {
        room: ws['room'],
        UserList: 'TTT : ' + UserList,
      },
    };

    for (var i = 0; i < rooms[room].length; i++) {
      rooms[room][i].send(JSON.stringify(obj));
    }
  }

  function leave(params) {
    const room = ws.room;

    if (rooms[room].length > 0) {
      rooms[room] = rooms[room].filter(so => so !== ws);

      ws['room'] = undefined;

      if (rooms[room].length == 0) {
        close(room);
      }
    }

    function close(room) {
      if (rooms.length > 0) rooms = rooms.filter(key => key !== room);
    }
  }
});
