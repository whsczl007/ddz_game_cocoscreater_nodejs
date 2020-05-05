
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/prefabs_script/creatRoom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e85c8xPVuxKX5zdxLJ1e12h', 'creatRoom');
// scripts/hallscene/prefabs_script/creatRoom.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  _createroom: function _createroom(level, callback) {
    if (level < 0 || level > 4) {
      callback("create room level error" + level);
      console.log("create room level error" + level);
      return;
    } // var global = 0
    // if (rate==1){
    //     global = 10
    // }else if(rate==2){
    //     global = 20
    // }else if(rate==3){
    //     global = 30
    // }else if(rate==4){
    //     global = 40
    // }


    var room_para = {
      // global:global,
      level: level
    }; //播放一个等待动画

    _mygolbal["default"].socket.request_creatroom(room_para, function (err, result) {
      if (err != 0) {
        console.log("create_room err:" + err);
        callback(err, result);
      } else {
        console.log("create_room" + JSON.stringify(result)); //网络数据包

        _mygolbal["default"].playerData.bottom = result.bottom;
        _mygolbal["default"].playerData.rate = result.rate;
        cc.director.loadScene("gameScene");
        callback(0);
      }
    });
  },
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    var callback = function (err, result) {
      //
      if (err == 0) {
        this.node.destroy();
      } else {
        Toast.show(result);
      } //

    }.bind(this);

    switch (customData) {
      case "create_room_1":
        this._createroom(1, callback);

        break;

      case "create_room_2":
        this._createroom(2, callback);

        break;

      case "create_room_3":
        this._createroom(3, callback);

        break;

      case "create_room_4":
        this._createroom(4, callback);

        break;

      case "create_room_close":
        this.node.destroy();
        break;

      default:
        break;
    } // this.node.destroy() 

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2hhbGxzY2VuZS9wcmVmYWJzX3NjcmlwdC9jcmVhdFJvb20uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFydCIsIl9jcmVhdGVyb29tIiwibGV2ZWwiLCJjYWxsYmFjayIsImNvbnNvbGUiLCJsb2ciLCJyb29tX3BhcmEiLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3RfY3JlYXRyb29tIiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBsYXllckRhdGEiLCJib3R0b20iLCJyYXRlIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJvbkJ1dHRvbkNsaWNrIiwiZXZlbnQiLCJjdXN0b21EYXRhIiwibm9kZSIsImRlc3Ryb3kiLCJUb2FzdCIsInNob3ciLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRSxFQUhQO0FBT0w7QUFFQTtBQUVBQyxFQUFBQSxLQVhLLG1CQVdJLENBRVIsQ0FiSTtBQWVMQyxFQUFBQSxXQWZLLHVCQWVPQyxLQWZQLEVBZWFDLFFBZmIsRUFlc0I7QUFDdkIsUUFBR0QsS0FBSyxHQUFDLENBQU4sSUFBV0EsS0FBSyxHQUFDLENBQXBCLEVBQXNCO0FBQzNCQyxNQUFBQSxRQUFRLENBQUMsNEJBQTJCRCxLQUE1QixDQUFSO0FBQ1NFLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDRCQUEyQkgsS0FBdkM7QUFDQTtBQUNILEtBTHNCLENBT3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQSxRQUFJSSxTQUFTLEdBQUc7QUFDVDtBQUNDSixNQUFBQSxLQUFLLEVBQUNBO0FBRkUsS0FBaEIsQ0FsQnVCLENBc0JmOztBQUVBSyx5QkFBU0MsTUFBVCxDQUFnQkMsaUJBQWhCLENBQWtDSCxTQUFsQyxFQUE0QyxVQUFTSSxHQUFULEVBQWFDLE1BQWIsRUFBb0I7QUFDNUQsVUFBSUQsR0FBRyxJQUFFLENBQVQsRUFBVztBQUNQTixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxxQkFBbUJLLEdBQS9CO0FBQ2xCUCxRQUFBQSxRQUFRLENBQUNPLEdBQUQsRUFBS0MsTUFBTCxDQUFSO0FBQ2UsT0FIRCxNQUdLO0FBQ0RQLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFnQk8sSUFBSSxDQUFDQyxTQUFMLENBQWVGLE1BQWYsQ0FBNUIsRUFEQyxDQUVEOztBQUNBSiw2QkFBU08sVUFBVCxDQUFvQkMsTUFBcEIsR0FBNkJKLE1BQU0sQ0FBQ0ksTUFBcEM7QUFDQVIsNkJBQVNPLFVBQVQsQ0FBb0JFLElBQXBCLEdBQTJCTCxNQUFNLENBQUNLLElBQWxDO0FBQ0FwQixRQUFBQSxFQUFFLENBQUNxQixRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7QUFDbEJmLFFBQUFBLFFBQVEsQ0FBQyxDQUFELENBQVI7QUFDZTtBQUVKLEtBYkQ7QUFjWCxHQXJESTtBQXVETDtBQUNBZ0IsRUFBQUEsYUF4REsseUJBd0RTQyxLQXhEVCxFQXdEZUMsVUF4RGYsRUF3RDBCO0FBQ2pDLFFBQUlsQixRQUFRLEdBQUMsVUFBU08sR0FBVCxFQUFhQyxNQUFiLEVBQW9CO0FBQUM7QUFDaEMsVUFBR0QsR0FBRyxJQUFFLENBQVIsRUFBVTtBQUNULGFBQUtZLElBQUwsQ0FBVUMsT0FBVjtBQUNBLE9BRkQsTUFFSztBQUNKQyxRQUFBQSxLQUFLLENBQUNDLElBQU4sQ0FBV2QsTUFBWDtBQUNBLE9BTDhCLENBTy9COztBQUNELEtBUlksQ0FRWGUsSUFSVyxDQVFOLElBUk0sQ0FBYjs7QUFTTSxZQUFPTCxVQUFQO0FBQ0ksV0FBSyxlQUFMO0FBQ00sYUFBS3BCLFdBQUwsQ0FBaUIsQ0FBakIsRUFBbUJFLFFBQW5COztBQUNBOztBQUNOLFdBQUssZUFBTDtBQUNNLGFBQUtGLFdBQUwsQ0FBaUIsQ0FBakIsRUFBbUJFLFFBQW5COztBQUNBOztBQUNOLFdBQUssZUFBTDtBQUNNLGFBQUtGLFdBQUwsQ0FBaUIsQ0FBakIsRUFBbUJFLFFBQW5COztBQUNBOztBQUNOLFdBQUssZUFBTDtBQUNNLGFBQUtGLFdBQUwsQ0FBaUIsQ0FBakIsRUFBbUJFLFFBQW5COztBQUNBOztBQUNOLFdBQUssbUJBQUw7QUFDTSxhQUFLbUIsSUFBTCxDQUFVQyxPQUFWO0FBQ0Y7O0FBQ0o7QUFDSTtBQWpCUixLQVYyQixDQTZCNUI7O0FBRUY7QUF2RkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi8uLi9teWdvbGJhbC5qc1wiXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICBcbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICAvLyBvbkxvYWQgKCkge30sXG5cbiAgICBzdGFydCAoKSB7XG5cbiAgICB9LFxuXG4gICAgX2NyZWF0ZXJvb20obGV2ZWwsY2FsbGJhY2spe1xuICAgICAgICBpZihsZXZlbDwwIHx8IGxldmVsPjQpe1xuXHRcdFx0Y2FsbGJhY2soXCJjcmVhdGUgcm9vbSBsZXZlbCBlcnJvclwiKyBsZXZlbClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlIHJvb20gbGV2ZWwgZXJyb3JcIisgbGV2ZWwpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhciBnbG9iYWwgPSAwXG4gICAgICAgIC8vIGlmIChyYXRlPT0xKXtcbiAgICAgICAgLy8gICAgIGdsb2JhbCA9IDEwXG4gICAgICAgIC8vIH1lbHNlIGlmKHJhdGU9PTIpe1xuICAgICAgICAvLyAgICAgZ2xvYmFsID0gMjBcbiAgICAgICAgLy8gfWVsc2UgaWYocmF0ZT09Myl7XG4gICAgICAgIC8vICAgICBnbG9iYWwgPSAzMFxuICAgICAgICAvLyB9ZWxzZSBpZihyYXRlPT00KXtcbiAgICAgICAgLy8gICAgIGdsb2JhbCA9IDQwXG4gICAgICAgIC8vIH1cblxuICAgICAgICB2YXIgcm9vbV9wYXJhID0ge1xuICAgICAgICAgICAgICAgLy8gZ2xvYmFsOmdsb2JhbCxcbiAgICAgICAgICAgICAgICBsZXZlbDpsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL+aSreaUvuS4gOS4quetieW+heWKqOeUu1xuXHRcdFx0XHRcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9jcmVhdHJvb20ocm9vbV9wYXJhLGZ1bmN0aW9uKGVycixyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlX3Jvb20gZXJyOlwiK2Vycilcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGVycixyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVfcm9vbVwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmJvdHRvbSA9IHJlc3VsdC5ib3R0b21cbiAgICAgICAgICAgICAgICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEucmF0ZSA9IHJlc3VsdC5yYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lU2NlbmVcIilcblx0XHRcdFx0XHRcdGNhbGxiYWNrKDApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxuICAgIG9uQnV0dG9uQ2xpY2soZXZlbnQsY3VzdG9tRGF0YSl7XG5cdFx0dmFyIGNhbGxiYWNrPWZ1bmN0aW9uKGVycixyZXN1bHQpey8vXG5cdFx0XHQgaWYoZXJyPT0wKXtcblx0XHRcdCAgdGhpcy5ub2RlLmRlc3Ryb3koKVxuXHRcdFx0IH1lbHNle1xuXHRcdFx0XHQgVG9hc3Quc2hvdyhyZXN1bHQpO1xuXHRcdFx0IH1cblx0XHRcdCBcblx0XHRcdCAvL1xuXHRcdH0uYmluZCh0aGlzKVxuICAgICAgICBzd2l0Y2goY3VzdG9tRGF0YSl7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fMVwiOlxuICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlcm9vbSgxLGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVfcm9vbV8yXCI6XG4gICAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVyb29tKDIsY2FsbGJhY2spXG4gICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZV9yb29tXzNcIjpcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZXJvb20oMyxjYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fNFwiOlxuICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlcm9vbSg0LGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVfcm9vbV9jbG9zZVwiOlxuICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKSBcbiAgICAgICAgICAgICAgICBicmVhayAgICAgICBcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgIC8vIHRoaXMubm9kZS5kZXN0cm95KCkgXG5cbiAgICB9XG5cbn0pO1xuIl19