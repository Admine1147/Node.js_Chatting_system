var LOOPS = function () {
  let loop;
  let fps = 1;
  let gameloopTimeCount = 0;

  this.LogMsg = function () {
    console.log('GAMELOOPS');
  };

  this.StartLoops = function (params, rooms, ws, db, room) {
    loop = setInterval(() => {
      gameloopTimeCount += 1;
      console.log('Looping : ' + gameloopTimeCount);

      obj = {
        type: 'info',
        params: {
          room: ws['room'],
          loopTimeCount: gameloopTimeCount,
        },
      };

      for (var i = 0; i < rooms[room].length; i++) {
        rooms[room][i].send(JSON.stringify(obj));
      }
    }, 1000 / fps);
  };
};

module.exports = LOOPS;
