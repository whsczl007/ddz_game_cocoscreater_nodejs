
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/prefabs_script/joinRoom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9b543i+qr1Px4nfSdBwSJcb', 'joinRoom');
// scripts/hallscene/prefabs_script/joinRoom.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    joinids: {
      type: cc.Label,
      "default": []
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.joinid = "";
    this.cur_input_count = -1;
  },
  start: function start() {},
  //  update (dt) {
  //  },
  onButtonClick: function onButtonClick(event, customData) {
    if (customData.length === 1) {
      this.joinid += customData;
      this.cur_input_count += 1;
      if (this.cur_input_count > 6) return;
      this.joinids[this.cur_input_count].string = customData; //console.log("joinid.length:"+this.joinid.length)

      if (this.joinid.length >= 6) {
        //判断加入房间逻辑
        var room_para = {
          roomid: this.joinid
        };

        _mygolbal["default"].socket.request_jion(room_para, function (err, result) {
          if (err) {
            console.log("err" + err);
            Toast.show(err);
          } else {
            console.log("join room sucess" + JSON.stringify(result));
            _mygolbal["default"].playerData.bottom = result.bottom;
            _mygolbal["default"].playerData.rate = result.rate;
            cc.director.loadScene("gameScene");
          }
        });

        return;
      }

      console.log("customData:" + customData);
    }

    switch (customData) {
      case "back":
        if (this.cur_input_count < 0) {
          return;
        }

        this.joinids[this.cur_input_count].string = "";
        this.cur_input_count -= 1;
        this.joinid = this.joinid.substring(0, this.joinid.length - 1);
        break;

      case "clear":
        for (var i = 0; i < 6; ++i) {
          this.joinids[i].string = "";
        }

        this.joinid = "";
        this.cur_input_count = -1;
        break;

      case "close":
        this.node.destroy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2hhbGxzY2VuZS9wcmVmYWJzX3NjcmlwdC9qb2luUm9vbS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImpvaW5pZHMiLCJ0eXBlIiwiTGFiZWwiLCJvbkxvYWQiLCJqb2luaWQiLCJjdXJfaW5wdXRfY291bnQiLCJzdGFydCIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJsZW5ndGgiLCJzdHJpbmciLCJyb29tX3BhcmEiLCJyb29taWQiLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3RfamlvbiIsImVyciIsInJlc3VsdCIsImNvbnNvbGUiLCJsb2ciLCJUb2FzdCIsInNob3ciLCJKU09OIiwic3RyaW5naWZ5IiwicGxheWVyRGF0YSIsImJvdHRvbSIsInJhdGUiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsInN1YnN0cmluZyIsImkiLCJub2RlIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFDO0FBQ0pDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTSxLQURMO0FBRUosaUJBQVE7QUFGSjtBQURFLEdBSFA7QUFXTDtBQUVBQyxFQUFBQSxNQWJLLG9CQWFLO0FBQ04sU0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLENBQUMsQ0FBeEI7QUFDSCxHQWhCSTtBQWtCTEMsRUFBQUEsS0FsQkssbUJBa0JJLENBRVIsQ0FwQkk7QUFzQkw7QUFFQTtBQUVBQyxFQUFBQSxhQTFCSyx5QkEwQlNDLEtBMUJULEVBMEJlQyxVQTFCZixFQTBCMEI7QUFDM0IsUUFBR0EsVUFBVSxDQUFDQyxNQUFYLEtBQW9CLENBQXZCLEVBQXlCO0FBQ3JCLFdBQUtOLE1BQUwsSUFBZUssVUFBZjtBQUNBLFdBQUtKLGVBQUwsSUFBd0IsQ0FBeEI7QUFDVCxVQUFHLEtBQUtBLGVBQUwsR0FBcUIsQ0FBeEIsRUFBMEI7QUFDakIsV0FBS0wsT0FBTCxDQUFhLEtBQUtLLGVBQWxCLEVBQW1DTSxNQUFuQyxHQUE0Q0YsVUFBNUMsQ0FKcUIsQ0FLckI7O0FBQ0EsVUFBRyxLQUFLTCxNQUFMLENBQVlNLE1BQVosSUFBb0IsQ0FBdkIsRUFBeUI7QUFDckI7QUFDQSxZQUFJRSxTQUFTLEdBQUc7QUFDWkMsVUFBQUEsTUFBTSxFQUFDLEtBQUtUO0FBREEsU0FBaEI7O0FBR0FVLDZCQUFTQyxNQUFULENBQWdCQyxZQUFoQixDQUE2QkosU0FBN0IsRUFBdUMsVUFBU0ssR0FBVCxFQUFhQyxNQUFiLEVBQW9CO0FBQ3ZELGNBQUlELEdBQUosRUFBUTtBQUNKRSxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFPSCxHQUFuQjtBQUNsQkksWUFBQUEsS0FBSyxDQUFDQyxJQUFOLENBQVdMLEdBQVg7QUFDZSxXQUhELE1BR0s7QUFDREUsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkscUJBQW1CRyxJQUFJLENBQUNDLFNBQUwsQ0FBZU4sTUFBZixDQUEvQjtBQUNBSixpQ0FBU1csVUFBVCxDQUFvQkMsTUFBcEIsR0FBNkJSLE1BQU0sQ0FBQ1EsTUFBcEM7QUFDQVosaUNBQVNXLFVBQVQsQ0FBb0JFLElBQXBCLEdBQTJCVCxNQUFNLENBQUNTLElBQWxDO0FBQ0EvQixZQUFBQSxFQUFFLENBQUNnQyxRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7QUFDSDtBQUNKLFNBVkQ7O0FBV0E7QUFDSDs7QUFFRFYsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQWVYLFVBQTNCO0FBRUg7O0FBQ0QsWUFBT0EsVUFBUDtBQUNJLFdBQUssTUFBTDtBQUNJLFlBQUcsS0FBS0osZUFBTCxHQUFxQixDQUF4QixFQUEwQjtBQUN0QjtBQUNIOztBQUNELGFBQUtMLE9BQUwsQ0FBYSxLQUFLSyxlQUFsQixFQUFtQ00sTUFBbkMsR0FBNEMsRUFBNUM7QUFDQSxhQUFLTixlQUFMLElBQXVCLENBQXZCO0FBQ0EsYUFBS0QsTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FBWTBCLFNBQVosQ0FBc0IsQ0FBdEIsRUFBd0IsS0FBSzFCLE1BQUwsQ0FBWU0sTUFBWixHQUFtQixDQUEzQyxDQUFkO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0ksYUFBSSxJQUFJcUIsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLENBQWQsRUFBZ0IsRUFBRUEsQ0FBbEIsRUFBb0I7QUFDaEIsZUFBSy9CLE9BQUwsQ0FBYStCLENBQWIsRUFBZ0JwQixNQUFoQixHQUF5QixFQUF6QjtBQUVIOztBQUNELGFBQUtQLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsZUFBTCxHQUF1QixDQUFDLENBQXhCO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0csYUFBSzJCLElBQUwsQ0FBVUMsT0FBVjtBQUNBOztBQUNIO0FBQ0k7QUFyQlI7QUF1Qkg7QUE5RUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi8uLi9teWdvbGJhbC5qc1wiXG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgXG4gICAgcHJvcGVydGllczoge1xuICAgICAgam9pbmlkczp7XG4gICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgICAgZGVmYXVsdDpbXSxcbiAgICAgIH1cbiAgICBcbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLmpvaW5pZCA9IFwiXCI7XG4gICAgICAgIHRoaXMuY3VyX2lucHV0X2NvdW50ID0gLTFcbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuXG4gICAgfSxcblxuICAgIC8vICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIFxuICAgIC8vICB9LFxuXG4gICAgb25CdXR0b25DbGljayhldmVudCxjdXN0b21EYXRhKXtcbiAgICAgICAgaWYoY3VzdG9tRGF0YS5sZW5ndGg9PT0xKXtcbiAgICAgICAgICAgIHRoaXMuam9pbmlkICs9IGN1c3RvbURhdGFcbiAgICAgICAgICAgIHRoaXMuY3VyX2lucHV0X2NvdW50ICs9IDFcblx0XHRcdGlmKHRoaXMuY3VyX2lucHV0X2NvdW50PjYpcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5qb2luaWRzW3RoaXMuY3VyX2lucHV0X2NvdW50XS5zdHJpbmcgPSBjdXN0b21EYXRhXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiam9pbmlkLmxlbmd0aDpcIit0aGlzLmpvaW5pZC5sZW5ndGgpXG4gICAgICAgICAgICBpZih0aGlzLmpvaW5pZC5sZW5ndGg+PTYpe1xuICAgICAgICAgICAgICAgIC8v5Yik5pat5Yqg5YWl5oi/6Ze06YC76L6RXG4gICAgICAgICAgICAgICAgdmFyIHJvb21fcGFyYSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm9vbWlkOnRoaXMuam9pbmlkLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9qaW9uKHJvb21fcGFyYSxmdW5jdGlvbihlcnIscmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVyclwiKyBlcnIpXG5cdFx0XHRcdFx0XHRUb2FzdC5zaG93KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luIHJvb20gc3VjZXNzXCIrSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuYm90dG9tID0gcmVzdWx0LmJvdHRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5yYXRlID0gcmVzdWx0LnJhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVTY2VuZVwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXN0b21EYXRhOlwiKyBjdXN0b21EYXRhKVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xuICAgICAgICAgICAgY2FzZSBcImJhY2tcIjpcbiAgICAgICAgICAgICAgICBpZih0aGlzLmN1cl9pbnB1dF9jb3VudDwwKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuam9pbmlkc1t0aGlzLmN1cl9pbnB1dF9jb3VudF0uc3RyaW5nID0gXCJcIlxuICAgICAgICAgICAgICAgIHRoaXMuY3VyX2lucHV0X2NvdW50IC09MVxuICAgICAgICAgICAgICAgIHRoaXMuam9pbmlkID0gdGhpcy5qb2luaWQuc3Vic3RyaW5nKDAsdGhpcy5qb2luaWQubGVuZ3RoLTEpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJjbGVhclwiOlxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8NjsrK2kpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmpvaW5pZHNbaV0uc3RyaW5nID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5qb2luaWQgPSBcIlwiXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJfaW5wdXRfY291bnQgPSAtMVxuICAgICAgICAgICAgICAgIGJyZWFrICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FzZSBcImNsb3NlXCI6XG4gICAgICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpXG4gICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=