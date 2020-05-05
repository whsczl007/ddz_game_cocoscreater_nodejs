
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gamebeforeUI.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '34b69bK3SJBFbE0zzOU1X9M', 'gamebeforeUI');
// scripts/gameScene/gamebeforeUI.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_ready: cc.Node,
    btn_gamestart: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.btn_gamestart.active = false;
    this.btn_ready.active = false; //监听本地的发送的消息

    this.node.on("init", function () {
      console.log("game beforeui init");
      console.log("myglobal.playerData.housemanageid" + _mygolbal["default"].playerData.housemanageid);
      console.log("myglobal.playerData.accountID" + _mygolbal["default"].playerData.accountID);

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this)); //监听服务器发送来的消息

    _mygolbal["default"].socket.onGameStart(function () {
      console.log("gamebrforeUI onGameStart revice");
      this.node.active = false;
    }.bind(this));

    _mygolbal["default"].socket.onChangeHouseManage(function (data) {
      console.log("gamebrforeUI onChangeHouseManage revice" + JSON.stringify(data));
      _mygolbal["default"].playerData.housemanageid = data;

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this));
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "btn_ready":
        console.log("btn_ready");

        _mygolbal["default"].socket.requestReady();

        break;

      case "btn_start":
        // if(isopen_sound){
        //    cc.audioEngine.play(cc.url.raw("resources/sound/start_a.ogg")) 
        //  }
        console.log("btn_start");

        _mygolbal["default"].socket.requestStart(function (err, data) {
          if (err != 0) {
            console.log("requestStart err" + err);
            Toast.show(data);
          } else {
            console.log("requestStart data" + JSON.stringify(data));
          }
        });

        break;

      default:
        break;
    }
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWVTY2VuZS9nYW1lYmVmb3JlVUkuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJidG5fcmVhZHkiLCJOb2RlIiwiYnRuX2dhbWVzdGFydCIsIm9uTG9hZCIsImFjdGl2ZSIsIm5vZGUiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJob3VzZW1hbmFnZWlkIiwiYWNjb3VudElEIiwiYmluZCIsInNvY2tldCIsIm9uR2FtZVN0YXJ0Iiwib25DaGFuZ2VIb3VzZU1hbmFnZSIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RhcnQiLCJvbkJ1dHRvbkNsaWNrIiwiZXZlbnQiLCJjdXN0b21EYXRhIiwicmVxdWVzdFJlYWR5IiwicmVxdWVzdFN0YXJ0IiwiZXJyIiwiVG9hc3QiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxTQUFTLEVBQUNKLEVBQUUsQ0FBQ0ssSUFETDtBQUVSQyxJQUFBQSxhQUFhLEVBQUNOLEVBQUUsQ0FBQ0s7QUFGVCxHQUhQO0FBUUw7QUFFQUUsRUFBQUEsTUFWSyxvQkFVSztBQUVOLFNBQUtELGFBQUwsQ0FBbUJFLE1BQW5CLEdBQTRCLEtBQTVCO0FBQ0EsU0FBS0osU0FBTCxDQUFlSSxNQUFmLEdBQXdCLEtBQXhCLENBSE0sQ0FLTjs7QUFDQSxTQUFLQyxJQUFMLENBQVVDLEVBQVYsQ0FBYSxNQUFiLEVBQW9CLFlBQVU7QUFDMUJDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFaO0FBQ0FELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNDQUFvQ0MscUJBQVNDLFVBQVQsQ0FBb0JDLGFBQXBFO0FBQ0FKLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtDQUFnQ0MscUJBQVNDLFVBQVQsQ0FBb0JFLFNBQWhFOztBQUNBLFVBQUdILHFCQUFTQyxVQUFULENBQW9CQyxhQUFwQixJQUFtQ0YscUJBQVNDLFVBQVQsQ0FBb0JFLFNBQTFELEVBQW9FO0FBQ2hFO0FBQ0EsYUFBS1YsYUFBTCxDQUFtQkUsTUFBbkIsR0FBNEIsSUFBNUI7QUFDQSxhQUFLSixTQUFMLENBQWVJLE1BQWYsR0FBd0IsS0FBeEI7QUFDSCxPQUpELE1BSUs7QUFDRCxhQUFLRixhQUFMLENBQW1CRSxNQUFuQixHQUE0QixLQUE1QjtBQUNBLGFBQUtKLFNBQUwsQ0FBZUksTUFBZixHQUF3QixJQUF4QjtBQUNIO0FBQ0osS0FabUIsQ0FZbEJTLElBWmtCLENBWWIsSUFaYSxDQUFwQixFQU5NLENBb0JOOztBQUNBSix5QkFBU0ssTUFBVCxDQUFnQkMsV0FBaEIsQ0FBNEIsWUFBVTtBQUNsQ1IsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksaUNBQVo7QUFDQSxXQUFLSCxJQUFMLENBQVVELE1BQVYsR0FBbUIsS0FBbkI7QUFDSCxLQUgyQixDQUcxQlMsSUFIMEIsQ0FHckIsSUFIcUIsQ0FBNUI7O0FBS0FKLHlCQUFTSyxNQUFULENBQWdCRSxtQkFBaEIsQ0FBb0MsVUFBU0MsSUFBVCxFQUFjO0FBQzlDVixNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSw0Q0FBMENVLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixJQUFmLENBQXREO0FBQ0FSLDJCQUFTQyxVQUFULENBQW9CQyxhQUFwQixHQUFvQ00sSUFBcEM7O0FBQ0EsVUFBR1IscUJBQVNDLFVBQVQsQ0FBb0JDLGFBQXBCLElBQW1DRixxQkFBU0MsVUFBVCxDQUFvQkUsU0FBMUQsRUFBb0U7QUFDaEU7QUFDQSxhQUFLVixhQUFMLENBQW1CRSxNQUFuQixHQUE0QixJQUE1QjtBQUNBLGFBQUtKLFNBQUwsQ0FBZUksTUFBZixHQUF3QixLQUF4QjtBQUNILE9BSkQsTUFJSztBQUNELGFBQUtGLGFBQUwsQ0FBbUJFLE1BQW5CLEdBQTRCLEtBQTVCO0FBQ0EsYUFBS0osU0FBTCxDQUFlSSxNQUFmLEdBQXdCLElBQXhCO0FBQ0g7QUFFSixLQVptQyxDQVlsQ1MsSUFaa0MsQ0FZN0IsSUFaNkIsQ0FBcEM7QUFhSCxHQWpESTtBQW1ETE8sRUFBQUEsS0FuREssbUJBbURJLENBRVIsQ0FyREk7QUF1REw7QUFFQUMsRUFBQUEsYUF6REsseUJBeURTQyxLQXpEVCxFQXlEZUMsVUF6RGYsRUF5RDBCO0FBQzNCLFlBQU9BLFVBQVA7QUFDSSxXQUFLLFdBQUw7QUFDSWhCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVo7O0FBQ0FDLDZCQUFTSyxNQUFULENBQWdCVSxZQUFoQjs7QUFDQTs7QUFDSixXQUFLLFdBQUw7QUFDSTtBQUNBO0FBQ0E7QUFDQ2pCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVo7O0FBQ0FDLDZCQUFTSyxNQUFULENBQWdCVyxZQUFoQixDQUE2QixVQUFTQyxHQUFULEVBQWFULElBQWIsRUFBa0I7QUFDNUMsY0FBR1MsR0FBRyxJQUFFLENBQVIsRUFBVTtBQUNObkIsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkscUJBQW1Ca0IsR0FBL0I7QUFDbEJDLFlBQUFBLEtBQUssQ0FBQ0MsSUFBTixDQUFXWCxJQUFYO0FBQ2UsV0FIRCxNQUdLO0FBQ0RWLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFxQlUsSUFBSSxDQUFDQyxTQUFMLENBQWVGLElBQWYsQ0FBakM7QUFFSDtBQUNILFNBUkQ7O0FBU0E7O0FBQ0w7QUFDSTtBQXJCUjtBQXVCSDtBQWpGSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYnRuX3JlYWR5OmNjLk5vZGUsXG4gICAgICAgIGJ0bl9nYW1lc3RhcnQ6Y2MuTm9kZSxcbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICBvbkxvYWQgKCkge1xuXG4gICAgICAgIHRoaXMuYnRuX2dhbWVzdGFydC5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSBmYWxzZVxuXG4gICAgICAgIC8v55uR5ZCs5pys5Zyw55qE5Y+R6YCB55qE5raI5oGvXG4gICAgICAgIHRoaXMubm9kZS5vbihcImluaXRcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYW1lIGJlZm9yZXVpIGluaXRcIilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkXCIrbXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRFwiK215Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKVxuICAgICAgICAgICAgaWYobXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkPT1teWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCl7XG4gICAgICAgICAgICAgICAgLy/oh6rlt7HlsLHmmK/miL/kuLtcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9nYW1lc3RhcnQuYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9nYW1lc3RhcnQuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICAvL+ebkeWQrOacjeWKoeWZqOWPkemAgeadpeeahOa2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25HYW1lU3RhcnQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZWJyZm9yZVVJIG9uR2FtZVN0YXJ0IHJldmljZVwiKVxuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VIb3VzZU1hbmFnZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZWJyZm9yZVVJIG9uQ2hhbmdlSG91c2VNYW5hZ2UgcmV2aWNlXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQgPSBkYXRhXG4gICAgICAgICAgICBpZihteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcbiAgICAgICAgICAgICAgICAvL+iHquW3seWwseaYr+aIv+S4u1xuICAgICAgICAgICAgICAgIHRoaXMuYnRuX2dhbWVzdGFydC5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuYnRuX2dhbWVzdGFydC5hY3RpdmUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgfSxcblxuICAgIHN0YXJ0ICgpIHtcblxuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcbiAgICBcbiAgICBvbkJ1dHRvbkNsaWNrKGV2ZW50LGN1c3RvbURhdGEpe1xuICAgICAgICBzd2l0Y2goY3VzdG9tRGF0YSl7XG4gICAgICAgICAgICBjYXNlIFwiYnRuX3JlYWR5XCI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidG5fcmVhZHlcIilcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJlYWR5KClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcImJ0bl9zdGFydFwiOlxuICAgICAgICAgICAgICAgIC8vIGlmKGlzb3Blbl9zb3VuZCl7XG4gICAgICAgICAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3N0YXJ0X2Eub2dnXCIpKSBcbiAgICAgICAgICAgICAgICAvLyAgfVxuICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ0bl9zdGFydFwiKVxuICAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFN0YXJ0KGZ1bmN0aW9uKGVycixkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyIT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdFN0YXJ0IGVyclwiK2Vycilcblx0XHRcdFx0XHRcdFRvYXN0LnNob3coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0U3RhcnQgZGF0YVwiKyBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgIGJyZWFrICAgIFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=