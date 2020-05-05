
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/loginscene/loginScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b05a68gSOpBWr8ddvT03Jpj', 'loginScene');
// scripts/loginscene/loginScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    wait_node: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    //console.log("qian_state.qian:"+ qian_state.qian)
    if (isopen_sound) {
      cc.audioEngine.play(cc.url.raw("resources/sound/login_bg.ogg"), true);
    }

    _mygolbal["default"].socket.initSocket();
  },
  start: function start() {},
  onButtonCilck: function onButtonCilck(event, customData) {
    switch (customData) {
      case "wx_login":
        console.log("wx_login request"); //this.wait_node.active = true
        //             if(localStorage.getItem("accountID")!=null){
        // 	myglobal.playerData.accountID=localStorage.getItem("accountID");
        // }
        // localStorage.setItem("accountID",myglobal.playerData.accountID);
        //             myglobal.socket.request_wxLogin({
        //                 uniqueID:myglobal.playerData.uniqueID,
        //                 accountID:myglobal.playerData.accountID,
        //                 nickName:myglobal.playerData.nickName,
        //                 avatarUrl:myglobal.playerData.avatarUrl,
        //             },function(err,result){
        //                 //请求返回
        //                 //先隐藏等待UI
        //                 //this.wait_node.active = false
        //                 if(err!=0){
        //                    console.log("err:"+err)
        //                    return     
        //                 }
        //                 console.log("login sucess" + JSON.stringify(result))
        //                 myglobal.playerData.gobal_count = result.goldcount
        //                 cc.director.loadScene("hallScene")
        //             }.bind(this))

        _mygolbal["default"].api.login(function (data) {
          cc.director.loadScene("hallScene");
        }.bind(this));

        break;
      // case "guest_btn":
      // cc.director.loadScene("hallScene")
      // break;

      default:
        // cc.director.loadScene("hallScene")
        break;
    }
  } // update (dt) {},

});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2xvZ2luc2NlbmUvbG9naW5TY2VuZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndhaXRfbm9kZSIsIk5vZGUiLCJvbkxvYWQiLCJpc29wZW5fc291bmQiLCJhdWRpb0VuZ2luZSIsInBsYXkiLCJ1cmwiLCJyYXciLCJteWdsb2JhbCIsInNvY2tldCIsImluaXRTb2NrZXQiLCJzdGFydCIsIm9uQnV0dG9uQ2lsY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJjb25zb2xlIiwibG9nIiwiYXBpIiwibG9naW4iLCJkYXRhIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNUQyxJQUFBQSxTQUFTLEVBQUNKLEVBQUUsQ0FBQ0s7QUFESixHQUhQO0FBT0w7QUFFQUMsRUFBQUEsTUFUSyxvQkFTSztBQUNOO0FBQ0EsUUFBR0MsWUFBSCxFQUFnQjtBQUNaUCxNQUFBQSxFQUFFLENBQUNRLFdBQUgsQ0FBZUMsSUFBZixDQUFvQlQsRUFBRSxDQUFDVSxHQUFILENBQU9DLEdBQVAsQ0FBVyw4QkFBWCxDQUFwQixFQUErRCxJQUEvRDtBQUNGOztBQUVEQyx5QkFBU0MsTUFBVCxDQUFnQkMsVUFBaEI7QUFDSixHQWhCSTtBQWtCTEMsRUFBQUEsS0FsQkssbUJBa0JJLENBQ1IsQ0FuQkk7QUF1QkxDLEVBQUFBLGFBdkJLLHlCQXVCU0MsS0F2QlQsRUF1QmVDLFVBdkJmLEVBdUIwQjtBQUMzQixZQUFPQSxVQUFQO0FBQ0ksV0FBSyxVQUFMO0FBQ0lDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaLEVBREosQ0FHSTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQVIsNkJBQVNTLEdBQVQsQ0FBYUMsS0FBYixDQUFtQixVQUFTQyxJQUFULEVBQWM7QUFDaEN2QixVQUFBQSxFQUFFLENBQUN3QixRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7QUFDQSxTQUZrQixDQUVqQkMsSUFGaUIsQ0FFWixJQUZZLENBQW5COztBQUdZO0FBQ1o7QUFDQTtBQUVBOztBQUNRO0FBQ0g7QUFFTztBQXRDUjtBQXdDSCxHQWhFSSxDQWlFTDs7QUFqRUssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgIHdhaXRfbm9kZTpjYy5Ob2RlLFxuICAgIH0sXG5cbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJxaWFuX3N0YXRlLnFpYW46XCIrIHFpYW5fc3RhdGUucWlhbilcbiAgICAgICAgaWYoaXNvcGVuX3NvdW5kKXtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC9sb2dpbl9iZy5vZ2dcIiksdHJ1ZSkgXG4gICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICAgbXlnbG9iYWwuc29ja2V0LmluaXRTb2NrZXQoKVxuICAgIH0sXG4gICAgXG4gICAgc3RhcnQgKCkge1xuICAgIH0sXG5cdFxuXHRcbiAgICBcbiAgICBvbkJ1dHRvbkNpbGNrKGV2ZW50LGN1c3RvbURhdGEpe1xuICAgICAgICBzd2l0Y2goY3VzdG9tRGF0YSl7XG4gICAgICAgICAgICBjYXNlIFwid3hfbG9naW5cIjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInd4X2xvZ2luIHJlcXVlc3RcIilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL3RoaXMud2FpdF9ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICAvLyAgICAgICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRJRFwiKSE9bnVsbCl7XG5cdFx0XHRcdC8vIFx0bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQ9bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50SURcIik7XG5cdFx0XHRcdC8vIH1cblx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50SURcIixteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCk7XG4gICAgLy8gICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3Rfd3hMb2dpbih7XG4gICAgLy8gICAgICAgICAgICAgICAgIHVuaXF1ZUlEOm15Z2xvYmFsLnBsYXllckRhdGEudW5pcXVlSUQsXG4gICAgLy8gICAgICAgICAgICAgICAgIGFjY291bnRJRDpteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCxcbiAgICAvLyAgICAgICAgICAgICAgICAgbmlja05hbWU6bXlnbG9iYWwucGxheWVyRGF0YS5uaWNrTmFtZSxcbiAgICAvLyAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOm15Z2xvYmFsLnBsYXllckRhdGEuYXZhdGFyVXJsLFxuICAgIC8vICAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyLHJlc3VsdCl7XG4gICAgLy8gICAgICAgICAgICAgICAgIC8v6K+35rGC6L+U5ZueXG4gICAgLy8gICAgICAgICAgICAgICAgIC8v5YWI6ZqQ6JeP562J5b6FVUlcbiAgICAvLyAgICAgICAgICAgICAgICAgLy90aGlzLndhaXRfbm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIC8vICAgICAgICAgICAgICAgICBpZihlcnIhPTApe1xuICAgIC8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycjpcIitlcnIpXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIHJldHVybiAgICAgXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cblxuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIHN1Y2Vzc1wiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcbiAgICAvLyAgICAgICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5nb2JhbF9jb3VudCA9IHJlc3VsdC5nb2xkY291bnRcbiAgICAvLyAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXG4gICAgLy8gICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuXHRcdFx0XHRteWdsb2JhbC5hcGkubG9naW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0Y2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXG5cdFx0XHRcdH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgYnJlYWtcblx0XHRcdFx0Ly8gY2FzZSBcImd1ZXN0X2J0blwiOlxuXHRcdFx0XHQvLyBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcblx0XHRcdCAgICAgIC8vIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhhbGxTY2VuZVwiKVxuXHRcdFx0XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcblxuXG59KTtcbiJdfQ==