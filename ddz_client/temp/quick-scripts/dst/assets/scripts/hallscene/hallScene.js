
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/hallScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9eee7bdCqVB/LXv3XqKAza9', 'hallScene');
// scripts/hallscene/hallScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("./../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    nickname_label: cc.Label,
    headimage: cc.Sprite,
    gobal_count: cc.Label,
    creatroom_prefabs: cc.Prefab,
    joinroom_prefabs: cc.Prefab
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.nickname_label.string = _mygolbal["default"].playerData.nickName;
    this.gobal_count.string = "" + _mygolbal["default"].playerData.gobal_count;
    var str = _mygolbal["default"].playerData.avatarUrl; //console.log(str)

    var head_image_path = "UI/headimage/" + str;
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }

      this.headimage.spriteFrame = spriteFrame;
    }.bind(this));
  },
  start: function start() {},
  btn_bangzhu: function btn_bangzhu() {
    cc.sys.openURL('https://github.com/whsczl007/ddz_game_cocoscreater_nodejs');
  },
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "create_room":
        var creator_Room = cc.instantiate(this.creatroom_prefabs);
        creator_Room.parent = this.node;
        creator_Room.zIndex = 100;
        break;

      case "join_room":
        var join_Room = cc.instantiate(this.joinroom_prefabs);
        join_Room.parent = this.node;
        join_Room.zIndex = 100;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2hhbGxzY2VuZS9oYWxsU2NlbmUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJuaWNrbmFtZV9sYWJlbCIsIkxhYmVsIiwiaGVhZGltYWdlIiwiU3ByaXRlIiwiZ29iYWxfY291bnQiLCJjcmVhdHJvb21fcHJlZmFicyIsIlByZWZhYiIsImpvaW5yb29tX3ByZWZhYnMiLCJvbkxvYWQiLCJzdHJpbmciLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJuaWNrTmFtZSIsInN0ciIsImF2YXRhclVybCIsImhlYWRfaW1hZ2VfcGF0aCIsImxvYWRlciIsImxvYWRSZXMiLCJTcHJpdGVGcmFtZSIsImVyciIsInNwcml0ZUZyYW1lIiwiY29uc29sZSIsImxvZyIsIm1lc3NhZ2UiLCJiaW5kIiwic3RhcnQiLCJidG5fYmFuZ3podSIsInN5cyIsIm9wZW5VUkwiLCJvbkJ1dHRvbkNsaWNrIiwiZXZlbnQiLCJjdXN0b21EYXRhIiwiY3JlYXRvcl9Sb29tIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJub2RlIiwiekluZGV4Iiwiam9pbl9Sb29tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxjQUFjLEVBQUNKLEVBQUUsQ0FBQ0ssS0FEVjtBQUVSQyxJQUFBQSxTQUFTLEVBQUNOLEVBQUUsQ0FBQ08sTUFGTDtBQUdSQyxJQUFBQSxXQUFXLEVBQUNSLEVBQUUsQ0FBQ0ssS0FIUDtBQUlSSSxJQUFBQSxpQkFBaUIsRUFBQ1QsRUFBRSxDQUFDVSxNQUpiO0FBS1JDLElBQUFBLGdCQUFnQixFQUFDWCxFQUFFLENBQUNVO0FBTFosR0FIUDtBQVdMO0FBRUFFLEVBQUFBLE1BYkssb0JBYUs7QUFDUCxTQUFLUixjQUFMLENBQW9CUyxNQUFwQixHQUE2QkMscUJBQVNDLFVBQVQsQ0FBb0JDLFFBQWpEO0FBQ0EsU0FBS1IsV0FBTCxDQUFpQkssTUFBakIsR0FBMEIsS0FBS0MscUJBQVNDLFVBQVQsQ0FBb0JQLFdBQW5EO0FBQ0gsUUFBSVMsR0FBRyxHQUFHSCxxQkFBU0MsVUFBVCxDQUFvQkcsU0FBOUIsQ0FIVSxDQUlWOztBQUNBLFFBQUlDLGVBQWUsR0FBRyxrQkFBa0JGLEdBQXhDO0FBQ0FqQixJQUFBQSxFQUFFLENBQUNvQixNQUFILENBQVVDLE9BQVYsQ0FBa0JGLGVBQWxCLEVBQWtDbkIsRUFBRSxDQUFDc0IsV0FBckMsRUFBaUQsVUFBU0MsR0FBVCxFQUFhQyxXQUFiLEVBQTBCO0FBQ3ZFLFVBQUlELEdBQUosRUFBUztBQUNMRSxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUgsR0FBRyxDQUFDSSxPQUFKLElBQWVKLEdBQTNCO0FBQ0E7QUFDSDs7QUFDQSxXQUFLakIsU0FBTCxDQUFla0IsV0FBZixHQUE2QkEsV0FBN0I7QUFDQSxLQU40QyxDQU0zQ0ksSUFOMkMsQ0FNdEMsSUFOc0MsQ0FBakQ7QUFPRSxHQTFCRztBQTRCTEMsRUFBQUEsS0E1QkssbUJBNEJJLENBRVIsQ0E5Qkk7QUErQkpDLEVBQUFBLFdBL0JJLHlCQStCUztBQUNoQjlCLElBQUFBLEVBQUUsQ0FBQytCLEdBQUgsQ0FBT0MsT0FBUCxDQUFlLDJEQUFmO0FBQ0MsR0FqQ007QUFtQ0w7QUFFQUMsRUFBQUEsYUFyQ0sseUJBcUNTQyxLQXJDVCxFQXFDZUMsVUFyQ2YsRUFxQzBCO0FBQzNCLFlBQU9BLFVBQVA7QUFDSSxXQUFLLGFBQUw7QUFDSSxZQUFJQyxZQUFZLEdBQUdwQyxFQUFFLENBQUNxQyxXQUFILENBQWUsS0FBSzVCLGlCQUFwQixDQUFuQjtBQUNBMkIsUUFBQUEsWUFBWSxDQUFDRSxNQUFiLEdBQXNCLEtBQUtDLElBQTNCO0FBQ0FILFFBQUFBLFlBQVksQ0FBQ0ksTUFBYixHQUFzQixHQUF0QjtBQUNBOztBQUNKLFdBQUssV0FBTDtBQUNJLFlBQUlDLFNBQVMsR0FBR3pDLEVBQUUsQ0FBQ3FDLFdBQUgsQ0FBZSxLQUFLMUIsZ0JBQXBCLENBQWhCO0FBQ0E4QixRQUFBQSxTQUFTLENBQUNILE1BQVYsR0FBbUIsS0FBS0MsSUFBeEI7QUFDQUUsUUFBQUEsU0FBUyxDQUFDRCxNQUFWLEdBQW1CLEdBQW5CO0FBQ0E7O0FBQ0o7QUFDSTtBQVpSO0FBY0g7QUFwREksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLy4uL215Z29sYmFsLmpzXCJcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCwgXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG5pY2tuYW1lX2xhYmVsOmNjLkxhYmVsLFxuICAgICAgICBoZWFkaW1hZ2U6Y2MuU3ByaXRlLFxuICAgICAgICBnb2JhbF9jb3VudDpjYy5MYWJlbCxcbiAgICAgICAgY3JlYXRyb29tX3ByZWZhYnM6Y2MuUHJlZmFiLFxuICAgICAgICBqb2lucm9vbV9wcmVmYWJzOmNjLlByZWZhYixcbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gbXlnbG9iYWwucGxheWVyRGF0YS5uaWNrTmFtZVxuICAgICAgIHRoaXMuZ29iYWxfY291bnQuc3RyaW5nID0gXCJcIiArIG15Z2xvYmFsLnBsYXllckRhdGEuZ29iYWxfY291bnRcblx0ICAgdmFyIHN0ciA9IG15Z2xvYmFsLnBsYXllckRhdGEuYXZhdGFyVXJsXG5cdCAgIC8vY29uc29sZS5sb2coc3RyKVxuXHQgICB2YXIgaGVhZF9pbWFnZV9wYXRoID0gXCJVSS9oZWFkaW1hZ2UvXCIgKyBzdHJcblx0ICAgY2MubG9hZGVyLmxvYWRSZXMoaGVhZF9pbWFnZV9wYXRoLGNjLlNwcml0ZUZyYW1lLGZ1bmN0aW9uKGVycixzcHJpdGVGcmFtZSnCoHtcblx0ICAgICAgIGlmIChlcnIpIHtcblx0ICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSB8fCBlcnIpO1xuXHQgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgIH3CoCDCoCDCoCDCoCDCoCBcblx0ICAgICAgICB0aGlzLmhlYWRpbWFnZS5zcHJpdGVGcmFtZSA9IHNwcml0ZUZyYW1lO8KgIMKgIMKgIMKgIFxuXHQgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgfSxcblxuICAgIHN0YXJ0ICgpIHtcblxuICAgIH0sXG4gICAgIGJ0bl9iYW5nemh1KCl7XG5cdFx0Y2Muc3lzLm9wZW5VUkwoJ2h0dHBzOi8vZ2l0aHViLmNvbS93aHNjemwwMDcvZGR6X2dhbWVfY29jb3NjcmVhdGVyX25vZGVqcycpOyBcblx0IH0sXG5cdCBcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcblxuICAgIG9uQnV0dG9uQ2xpY2soZXZlbnQsY3VzdG9tRGF0YSl7XG4gICAgICAgIHN3aXRjaChjdXN0b21EYXRhKXtcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVfcm9vbVwiOlxuICAgICAgICAgICAgICAgIHZhciBjcmVhdG9yX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNyZWF0cm9vbV9wcmVmYWJzKVxuICAgICAgICAgICAgICAgIGNyZWF0b3JfUm9vbS5wYXJlbnQgPSB0aGlzLm5vZGUgXG4gICAgICAgICAgICAgICAgY3JlYXRvcl9Sb29tLnpJbmRleCA9IDEwMFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwiam9pbl9yb29tXCI6XG4gICAgICAgICAgICAgICAgdmFyIGpvaW5fUm9vbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuam9pbnJvb21fcHJlZmFicylcbiAgICAgICAgICAgICAgICBqb2luX1Jvb20ucGFyZW50ID0gdGhpcy5ub2RlIFxuICAgICAgICAgICAgICAgIGpvaW5fUm9vbS56SW5kZXggPSAxMDBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=