
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/prefabs/card.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2afe8rz92BOl7CbQfKSCoLh', 'card');
// scripts/gameScene/prefabs/card.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    cards_sprite_atlas: cc.SpriteAtlas
  },
  onLoad: function onLoad() {
    this.flag = false;
    this.offset_y = 20;
    this.node.on("reset_card_flag", function (event) {
      if (this, flag == true) {
        this, flag = false;
        this.node.y -= this.offset_y;
      }
    }.bind(this)); // this.node.on("chu_card_succ",function(event){
    //    var chu_card_list = event
    //    for(var i=0;i<chu_card_list.length;i++){
    //     if(chu_card_list[i].card_id==this.card_id){
    //         //this.runToCenter(chu_card_list[i])
    //         //this.node.destory()
    //     }
    //    }
    // }.bind(this))
  },
  runToCenter: function runToCenter() {//移动到屏幕中间，并带一个牌缩小的效果
  },
  start: function start() {},
  init_data: function init_data(data) {},
  // update (dt) {},
  setTouchEvent: function setTouchEvent() {
    if (this.accountid == _mygolbal["default"].playerData.accountID) {
      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        var gameScene_node = this.node.parent.parent;
        var room_state = gameScene_node.getComponent("gameScene").roomstate;

        if (room_state == RoomState.ROOM_PLAYING) {
          console.log("TOUCH_START id:" + this.card_id);

          if (this.flag == false) {
            this.flag = true;
            this.node.y += this.offset_y; //通知gameui层选定的牌

            var carddata = {
              "cardid": this.card_id,
              "card_data": this.card_data
            };
            gameScene_node.emit("choose_card_event", carddata);
          } else {
            this.flag = false;
            this.node.y -= this.offset_y; //通知gameUI取消了那张牌

            gameScene_node.emit("unchoose_card_event", this.card_id);
          }
        }
      }.bind(this));
    }
  },
  showCards: function showCards(card, accountid) {
    //card.index是服务器生成card给对象设置的一副牌里唯一id
    this.card_id = card.index; //传入参数 card={"value":5,"shape":1,"index":20}

    this.card_data = card;

    if (accountid) {
      this.accountid = accountid; //标识card属于的玩家
    } //this.node.getComponent(cc.Sprite).spriteFrame = 
    //服务器定义牌的表示
    // const cardvalue = {
    //     "A": 12,
    //     "2": 13,
    //     "3": 1,
    //     "4": 2,
    //     "5": 3,
    //     "6": 4,
    //     "7": 5,
    //     "8": 6,
    //     "9": 7,
    //     "10": 8,
    //     "J": 9,
    //     "Q": 10,
    //     "K": 11,
    // }
    //服务器返回的是key,value对应的是资源的编号


    var CardValue = {
      "12": 1,
      "13": 2,
      "1": 3,
      "2": 4,
      "3": 5,
      "4": 6,
      "5": 7,
      "6": 8,
      "7": 9,
      "8": 10,
      "9": 11,
      "10": 12,
      "11": 13
    }; // 黑桃：spade
    // 红桃：heart
    // 梅花：club
    // 方片：diamond
    // const CardShape = {
    //     "S": 1,
    //     "H": 2,
    //     "C": 3,
    //     "D": 4,
    // };

    var cardShpae = {
      "1": 3,
      "2": 2,
      "3": 1,
      "4": 0
    };
    var Kings = {
      "14": 54,
      "15": 53
    };
    var spriteKey = '';

    if (card.shape) {
      spriteKey = 'card_' + (cardShpae[card.shape] * 13 + CardValue[card.value]);
    } else {
      spriteKey = 'card_' + Kings[card.king];
    } // console.log("spriteKey"+spriteKey)


    this.node.getComponent(cc.Sprite).spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey);
    this.setTouchEvent();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWVTY2VuZS9wcmVmYWJzL2NhcmQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjYXJkc19zcHJpdGVfYXRsYXMiLCJTcHJpdGVBdGxhcyIsIm9uTG9hZCIsImZsYWciLCJvZmZzZXRfeSIsIm5vZGUiLCJvbiIsImV2ZW50IiwieSIsImJpbmQiLCJydW5Ub0NlbnRlciIsInN0YXJ0IiwiaW5pdF9kYXRhIiwiZGF0YSIsInNldFRvdWNoRXZlbnQiLCJhY2NvdW50aWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJhY2NvdW50SUQiLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJnYW1lU2NlbmVfbm9kZSIsInBhcmVudCIsInJvb21fc3RhdGUiLCJnZXRDb21wb25lbnQiLCJyb29tc3RhdGUiLCJSb29tU3RhdGUiLCJST09NX1BMQVlJTkciLCJjb25zb2xlIiwibG9nIiwiY2FyZF9pZCIsImNhcmRkYXRhIiwiY2FyZF9kYXRhIiwiZW1pdCIsInNob3dDYXJkcyIsImNhcmQiLCJpbmRleCIsIkNhcmRWYWx1ZSIsImNhcmRTaHBhZSIsIktpbmdzIiwic3ByaXRlS2V5Iiwic2hhcGUiLCJ2YWx1ZSIsImtpbmciLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsImdldFNwcml0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNYQyxJQUFBQSxrQkFBa0IsRUFBRUosRUFBRSxDQUFDSztBQURaLEdBSFA7QUFRTEMsRUFBQUEsTUFSSyxvQkFRSztBQUNOLFNBQUtDLElBQUwsR0FBWSxLQUFaO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUVBLFNBQUtDLElBQUwsQ0FBVUMsRUFBVixDQUFhLGlC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N0JxQixDQTZDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBTUMsU0FBUyxHQUFHO0FBQ2QsV0FBSyxDQURTO0FBRWQsV0FBSyxDQUZTO0FBR2QsV0FBSyxDQUhTO0FBSWQsV0FBSztBQUpTLEtBQWxCO0FBTUEsUUFBTUMsS0FBSyxHQUFHO0FBQ1YsWUFBTSxFQURJO0FBRVYsWUFBTTtBQUZJLEtBQWQ7QUFLQSxRQUFJQyxTQUFTLEdBQUcsRUFBaEI7O0FBQ0EsUUFBSUwsSUFBSSxDQUFDTSxLQUFULEVBQWU7QUFDWEQsTUFBQUEsU0FBUyxHQUFHLFdBQVdGLFNBQVMsQ0FBQ0gsSUFBSSxDQUFDTSxLQUFOLENBQVQsR0FBd0IsRUFBeEIsR0FBNkJKLFNBQVMsQ0FBQ0YsSUFBSSxDQUFDTyxLQUFOLENBQWpELENBQVo7QUFFSCxLQUhELE1BR007QUFDRkYsTUFBQUEsU0FBUyxHQUFHLFVBQVVELEtBQUssQ0FBQ0osSUFBSSxDQUFDUSxJQUFOLENBQTNCO0FBQ0gsS0F4RW9CLENBMEV0Qjs7O0FBQ0MsU0FBS3ZDLElBQUwsQ0FBVW9CLFlBQVYsQ0FBdUI3QixFQUFFLENBQUNpRCxNQUExQixFQUFrQ0MsV0FBbEMsR0FBZ0QsS0FBSzlDLGtCQUFMLENBQXdCK0MsY0FBeEIsQ0FBdUNOLFNBQXZDLENBQWhEO0FBQ0EsU0FBSzNCLGFBQUw7QUFDSDtBQWxKSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgY2FyZHNfc3ByaXRlX2F0bGFzOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgXG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIHRoaXMuZmxhZyA9IGZhbHNlXG4gICAgICAgIHRoaXMub2Zmc2V0X3kgPSAyMFxuICAgICAgICBcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwicmVzZXRfY2FyZF9mbGFnXCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgaWYodGhpcyxmbGFnPT10cnVlKXtcbiAgICAgICAgICAgICAgICB0aGlzLGZsYWcgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMub2Zmc2V0X3lcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC8vIHRoaXMubm9kZS5vbihcImNodV9jYXJkX3N1Y2NcIixmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vICAgIHZhciBjaHVfY2FyZF9saXN0ID0gZXZlbnRcbiAgICAgICAgLy8gICAgZm9yKHZhciBpPTA7aTxjaHVfY2FyZF9saXN0Lmxlbmd0aDtpKyspe1xuICAgICAgICAvLyAgICAgaWYoY2h1X2NhcmRfbGlzdFtpXS5jYXJkX2lkPT10aGlzLmNhcmRfaWQpe1xuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5ydW5Ub0NlbnRlcihjaHVfY2FyZF9saXN0W2ldKVxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5ub2RlLmRlc3RvcnkoKVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vIH0uYmluZCh0aGlzKSlcbiAgICB9LFxuXG4gICAgcnVuVG9DZW50ZXIoKXtcbiAgICAgICAgLy/np7vliqjliLDlsY/luZXkuK3pl7TvvIzlubbluKbkuIDkuKrniYznvKnlsI/nmoTmlYjmnpxcbiAgICB9LFxuICAgIHN0YXJ0ICgpIHtcblxuICAgIH0sXG5cbiAgICBpbml0X2RhdGEoZGF0YSl7XG5cbiAgICB9LFxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxuICAgIHNldFRvdWNoRXZlbnQoKXtcbiAgICAgICAgaWYodGhpcy5hY2NvdW50aWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgdmFyIGdhbWVTY2VuZV9ub2RlID0gdGhpcy5ub2RlLnBhcmVudC5wYXJlbnQgIFxuICAgICAgICAgICAgICAgIHZhciByb29tX3N0YXRlID0gZ2FtZVNjZW5lX25vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZVNjZW5lXCIpLnJvb21zdGF0ZVxuICAgICAgICAgICAgICAgIGlmKHJvb21fc3RhdGU9PVJvb21TdGF0ZS5ST09NX1BMQVlJTkcpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRPVUNIX1NUQVJUIGlkOlwiK3RoaXMuY2FyZF9pZClcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mbGFnPT1mYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYWcgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLm9mZnNldF95XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mAmuefpWdhbWV1aeWxgumAieWumueahOeJjFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmRkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FyZGlkXCI6dGhpcy5jYXJkX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FyZF9kYXRhXCI6dGhpcy5jYXJkX2RhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lU2NlbmVfbm9kZS5lbWl0KFwiY2hvb3NlX2NhcmRfZXZlbnRcIixjYXJkZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYWc9ZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMub2Zmc2V0X3lcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YCa55+lZ2FtZVVJ5Y+W5raI5LqG6YKj5byg54mMXG4gICAgICAgICAgICAgICAgICAgICAgIGdhbWVTY2VuZV9ub2RlLmVtaXQoXCJ1bmNob29zZV9jYXJkX2V2ZW50XCIsdGhpcy5jYXJkX2lkKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgfVxuICAgICAgIFxuICAgIH0sXG4gICAgc2hvd0NhcmRzKGNhcmQsYWNjb3VudGlkKXtcbiAgICAgICAgLy9jYXJkLmluZGV45piv5pyN5Yqh5Zmo55Sf5oiQY2FyZOe7meWvueixoeiuvue9rueahOS4gOWJr+eJjOmHjOWUr+S4gGlkXG4gICAgICAgIHRoaXMuY2FyZF9pZCA9IGNhcmQuaW5kZXhcbiAgICAgICAgLy/kvKDlhaXlj4LmlbAgY2FyZD17XCJ2YWx1ZVwiOjUsXCJzaGFwZVwiOjEsXCJpbmRleFwiOjIwfVxuICAgICAgICB0aGlzLmNhcmRfZGF0YSA9IGNhcmRcbiAgICAgICAgaWYoYWNjb3VudGlkKXtcbiAgICAgICAgICAgIHRoaXMuYWNjb3VudGlkID0gYWNjb3VudGlkIC8v5qCH6K+GY2FyZOWxnuS6jueahOeOqeWutlxuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIC8vdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gXG4gICAgICAgIC8v5pyN5Yqh5Zmo5a6a5LmJ54mM55qE6KGo56S6XG4gICAgICAgIC8vIGNvbnN0IGNhcmR2YWx1ZSA9IHtcbiAgICAgICAgLy8gICAgIFwiQVwiOiAxMixcbiAgICAgICAgLy8gICAgIFwiMlwiOiAxMyxcbiAgICAgICAgLy8gICAgIFwiM1wiOiAxLFxuICAgICAgICAvLyAgICAgXCI0XCI6IDIsXG4gICAgICAgIC8vICAgICBcIjVcIjogMyxcbiAgICAgICAgLy8gICAgIFwiNlwiOiA0LFxuICAgICAgICAvLyAgICAgXCI3XCI6IDUsXG4gICAgICAgIC8vICAgICBcIjhcIjogNixcbiAgICAgICAgLy8gICAgIFwiOVwiOiA3LFxuICAgICAgICAvLyAgICAgXCIxMFwiOiA4LFxuICAgICAgICAvLyAgICAgXCJKXCI6IDksXG4gICAgICAgIC8vICAgICBcIlFcIjogMTAsXG4gICAgICAgIC8vICAgICBcIktcIjogMTEsXG4gICAgICAgIC8vIH1cbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIC8v5pyN5Yqh5Zmo6L+U5Zue55qE5piva2V5LHZhbHVl5a+55bqU55qE5piv6LWE5rqQ55qE57yW5Y+3XG4gICAgICAgIGNvbnN0IENhcmRWYWx1ZSA9IHtcbiAgICAgICAgICAgIFwiMTJcIjogMSxcbiAgICAgICAgICAgIFwiMTNcIjogMixcbiAgICAgICAgICAgIFwiMVwiOiAzLFxuICAgICAgICAgICAgXCIyXCI6IDQsXG4gICAgICAgICAgICBcIjNcIjogNSxcbiAgICAgICAgICAgIFwiNFwiOiA2LFxuICAgICAgICAgICAgXCI1XCI6IDcsXG4gICAgICAgICAgICBcIjZcIjogOCxcbiAgICAgICAgICAgIFwiN1wiOiA5LFxuICAgICAgICAgICAgXCI4XCI6IDEwLFxuICAgICAgICAgICAgXCI5XCI6IDExLFxuICAgICAgICAgICAgXCIxMFwiOiAxMixcbiAgICAgICAgICAgIFwiMTFcIjogMTNcbiAgICAgICAgfTtcblxuICAgICAgICAvLyDpu5HmoYPvvJpzcGFkZVxuICAgICAgICAvLyDnuqLmoYPvvJpoZWFydFxuICAgICAgICAvLyDmooXoirHvvJpjbHViXG4gICAgICAgIC8vIOaWueeJh++8mmRpYW1vbmRcbiAgICAgICAgLy8gY29uc3QgQ2FyZFNoYXBlID0ge1xuICAgICAgICAvLyAgICAgXCJTXCI6IDEsXG4gICAgICAgIC8vICAgICBcIkhcIjogMixcbiAgICAgICAgLy8gICAgIFwiQ1wiOiAzLFxuICAgICAgICAvLyAgICAgXCJEXCI6IDQsXG4gICAgICAgIC8vIH07XG4gICAgICAgIGNvbnN0IGNhcmRTaHBhZSA9IHtcbiAgICAgICAgICAgIFwiMVwiOiAzLFxuICAgICAgICAgICAgXCIyXCI6IDIsXG4gICAgICAgICAgICBcIjNcIjogMSxcbiAgICAgICAgICAgIFwiNFwiOiAwXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IEtpbmdzID0ge1xuICAgICAgICAgICAgXCIxNFwiOiA1NCxcbiAgICAgICAgICAgIFwiMTVcIjogNTNcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc3ByaXRlS2V5ID0gJyc7XG4gICAgICAgIGlmIChjYXJkLnNoYXBlKXtcbiAgICAgICAgICAgIHNwcml0ZUtleSA9ICdjYXJkXycgKyAoY2FyZFNocGFlW2NhcmQuc2hhcGVdICogMTMgKyBDYXJkVmFsdWVbY2FyZC52YWx1ZV0pO1xuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHNwcml0ZUtleSA9ICdjYXJkXycgKyBLaW5nc1tjYXJkLmtpbmddO1xuICAgICAgICB9XG5cbiAgICAgICAvLyBjb25zb2xlLmxvZyhcInNwcml0ZUtleVwiK3Nwcml0ZUtleSlcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5jYXJkc19zcHJpdGVfYXRsYXMuZ2V0U3ByaXRlRnJhbWUoc3ByaXRlS2V5KVxuICAgICAgICB0aGlzLnNldFRvdWNoRXZlbnQoKVxuICAgIH1cbn0pO1xuXG5cbiJdfQ==