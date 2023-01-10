var DB = function () {
  console.log('ReadInfo'); // DB가 준비 되었다.
};

DB.prototype.LogMsg = function () {
  console.log('DBConnect'); // DB의 메세지 함수
};

module.exports = DB;
