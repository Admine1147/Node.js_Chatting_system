var LOOPS = require('./Loop.js');

var CREATE = function () {
  console.log('CREATEReadInfo'); // 방이 만들어진 log
};

CREATE.prototype.LogMsg = function () {
  console.log('CREATEConnect'); // 방의 메세지
};

CREATE.prototype.generalInformation = function (ws, rooms) {
  let obj;
  if (ws['room'] != undefined) {
    //ws 배열에 방이 있을 경우 진입한다.
    obj = {
      type: 'info',
      params: {
        room: ws['room'],
        'no-clients': rooms[ws['room']].length,
      },
    };
  } else {
    // 방이 없다
    obj = {
      type: 'info',
      params: {
        room: 'no room',
      },
    };
  }

  ws.send(JSON.stringify(obj)); // 클라이언트에 전달한다.
};

CREATE.prototype.create = function (params, rooms, ws, db) {
  const room = this.genKey(5);
  console.log('room id : ' + room);
  rooms[room] = [ws];
  ws['room'] = room;

  this.generalInformation(ws, rooms);

  var loops = new LOOPS();
  loops.StartLoops(params, rooms, ws, db, room);
};

CREATE.prototype.genKey = function (length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = CREATE;
