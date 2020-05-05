
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/prefabs/player_node.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'aa64aMZgnFIfLx2Lmi+lbwV', 'player_node');
// scripts/gameScene/prefabs/player_node.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    account_label: cc.Label,
    nickname_label: cc.Label,
    room_touxiang: cc.Sprite,
    globalcount_label: cc.Label,
    headimage: cc.Sprite,
    readyimage: cc.Node,
    offlineimage: cc.Node,
    card_node: cc.Node,
    card_prefab: cc.Prefab,
    //tips_label:cc.Label,
    clockimage: cc.Node,
    qiangdidzhu_node: cc.Node,
    //抢地主的父节点
    time_label: cc.Label,
    robimage_sp: cc.SpriteFrame,
    robnoimage_sp: cc.SpriteFrame,
    robIconSp: cc.Sprite,
    robIcon_Sp: cc.Node,
    robnoIcon_Sp: cc.Node,
    masterIcon: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.readyimage.active = false;
    this.offlineimage.active = false; //监听开始游戏事件(客户端发给客户端)

    this.node.on("gamestart_event", function (event) {
      this.readyimage.active = false;
    }.bind(this)); //给其他玩家发牌事件

    this.node.on("push_card_event", function (event) {
      console.log("on push_card_event"); //自己不再发牌

      if (this.accountid == _mygolbal["default"].playerData.accountID) {
        return;
      }

      this.pushCard();
    }.bind(this));
    this.node.on("playernode_rob_state_event", function (event) {
      //{"accountid":"2162866","state":1}
      var detail = event; //如果是自己在抢，需要隐藏qiangdidzhu_node节点
      //this.accountid表示这个节点挂接的accountid

      if (detail.accountid == this.accountid) {
        //console.log("detail.accountid"+detail.accountid)
        this.qiangdidzhu_node.active = true;
      }

      if (this.accountid == detail.accountid) {
        if (detail.state == qian_state.qian) {
          console.log("this.robIcon_Sp.active = true");
          this.robIcon_Sp.active = true;
        } else if (detail.state == qian_state.buqiang) {
          this.robnoIcon_Sp.active = true;
        } else {
          console.log("get rob value :" + detail.state);
        } //this.qiangdidzhu_node.active = false

      }
    }.bind(this));
    this.node.on("playernode_changemaster_event", function (event) {
      var detail = event;
      this.robIcon_Sp.active = false;
      this.robnoIcon_Sp.active = false;

      if (detail == this.accountid) {
        this.masterIcon.active = true;
      }
    }.bind(this)); // this.node.on("playernode_add_three_card",function(event){
    //   var detail = event //地主的accountid
    //   if(detail==this.accountid){
    //     //给地主发三张排
    //   }
    // }.bind(this))
  },
  start: function start() {},
  funUp2: function funUp2() {
    this.now++;

    if (this.next_time - this.now > 0) {
      this.time_label.string = "" + (this.next_time - this.now); //this.schedule(funUp,1)
    } else {
      this.unschedule(this.funUp2);
    }
  },
  updateGold: function updateGold(infolist) {
    for (var i = 0; i < infolist.length; i++) {
      if (infolist[i].accountID == this.accountid) {
        this.globalcount_label.string = infolist[i].goldcount;
        break;
      }
    }
  },
  //这里初始化房间内位置节点信息(自己和其他玩家)
  //data玩家节点数据
  //index玩家在房间的位置索引
  init_data: function init_data(data, index) {
    console.log("init_data:" + JSON.stringify(data)); //data:{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}

    this.accountid = data.accountid;
    this.accountId = data.accountid;
    this.account_label.string = data.accountid;
    this.nickname_label.string = data.nick_name + " s " + data.seatindex + " i" + index;
    this.globalcount_label.string = data.goldcount;
    this.cardlist_node = [];
    this.seat_index = index;

    if (data.isready == true) {
      this.readyimage.active = true;
    }

    this.offlineimage.active = false;

    if (typeof data.isonline != "undefined" && data.isonline == false) {
      this.offlineimage.active = true;
    } //网络图片加载
    //     cc.loader.load({url: data.avatarUrl, type: 'jpg'},  (err, tex)=> {
    //     //cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
    //     let oldWidth = this.headImage.node.width;
    //     //console.log('old withd' + oldWidth);
    //     this.room_touxiang.spriteFrame = new cc.SpriteFrame(tex);
    //     let newWidth = this.headImage.node.width;
    //     //console.log('old withd' + newWidth);
    //     this.headImage.node.scale = oldWidth / newWidth;
    // });
    //这里根据传入的avarter来获取本地图像


    var str = data.avatarUrl; //console.log(str)

    var head_image_path = "UI/headimage/" + str;
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }

      this.headimage.spriteFrame = spriteFrame;
    }.bind(this)); //注册一个player_ready消息

    this.node.on("player_ready_notify", function (event) {
      console.log("player_ready_notify event", event);
      var detail = event;
      console.log("------player_ready_notify detail:" + detail);

      if (detail == this.accountid) {
        this.readyimage.active = true;
      }
    }.bind(this)); //监听内部随可以抢地主消息,这个消息会发给每个playernode节点

    this.node.on("playernode_canrob_event", function (event) {
      var detail = event;
      console.log("------playernode_canrob_event detail:" + detail);
      this.unschedule(this.funUp2);

      if (detail._accountID == this.accountid) {
        this.qiangdidzhu_node.active = true; //this.tips_label.string ="正在抢地主" 
        // this.time_label.string="10"
        //开启一个定时器
        // var now=detail.next_time-detail.now;

        this.next_time = detail.next_time;
        this.now = detail.now;
        this.time_label.string = "" + (this.next_time - this.now); // let funUp2 = function(){
        // 	this.now++;
        // 	if(this.next_time-this.now>0){
        // 		this.time_label.string=""+(this.next_time-this.now);
        // 		//this.schedule(funUp,1)
        // 	}else{
        // 		// this.unschedule(funUp)
        // 	}
        // }.bind(this);

        this.schedule(this.funUp2, 1);
      } else {
        this.qiangdidzhu_node.active = false;
      }
    }.bind(this));
    this.node.on("onCanChuCard_playernode", function (data) {
      console.log("收到通知 等待用户出牌 " + data);
      this.onCardWatting(data);
    }.bind(this)); //?

    if (index == 1) {
      this.card_node.x = -this.card_node.x - 30;
    }
  },
  // update (dt) {},
  pushCard: function pushCard() {
    this.card_node.active = true;

    for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.6;
      console.log(" this.card_node.parent.parent" + this.card_node.parent.parent.name);
      card.parent = this.card_node; //card.parent = this.node

      var height = card.height;
      card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
      card.x = 0; //console.log("call pushCard x:"+card.x+" y:"+card.y)

      this.cardlist_node.push(card);
    }
  },
  funUp3: function funUp3() {
    this.now++;

    if (this.next_time - this.now > 0) {
      this.time_label.string = "" + (this.next_time - this.now); //this.schedule(funUp,1)
    } else {
      this.qiangdidzhu_node.active = false;
      this.unschedule(this.funUp3);
    }
  },
  onCardWatting: function onCardWatting(data) {
    console.log("等待 出牌:", data._accountID);
    this.unschedule(this.funUp3);

    if (this.accountid == data._accountID) {
      this.qiangdidzhu_node.active = true;
    } else {
      this.qiangdidzhu_node.active = false;
    }

    if (this.accountid != data._accountID) {
      return;
    } //var now=data.next_time-data.now;


    this.next_time = data.next_time;
    this.now = data.now;
    this.time_label.string = "" + data.next_time - data.now;
    ; // let funUp3 = function(){
    // 	this.now++;
    // 	if(this.next_time-this.now>0){
    // 		this.time_label.string=""+(this.next_time-this.now);
    // 		//this.schedule(funUp,1)
    // 	}else{
    // 		this.qiangdidzhu_node.active = false;
    // 		this.unschedule(this.funUp3);
    // 	}
    // }.bind(this);
    // this.schedule(funUp, 1);

    this.schedule(this.funUp3, 1); // this.schedule(function(){
    // 	data.now+=1000;
    // 	if(data.next_time-data.now>0){
    // 		this.time_label.string=""+(data.next_time-data.now)/1000;
    // 	}
    // }.bind(this),1);
    //等待某人出牌
  },
  onOffLine: function onOffLine() {
    console.log("  掉线了 " + this.accountid);
    this.offlineimage.active = true;
  },
  onOnLine: function onOnLine() {
    console.log("  上线了 " + this.accountid);
    this.offlineimage.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWVTY2VuZS9wcmVmYWJzL3BsYXllcl9ub2RlLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiYWNjb3VudF9sYWJlbCIsIkxhYmVsIiwibmlja25hbWVfbGFiZWwiLCJyb29tX3RvdXhpYW5nIiwiU3ByaXRlIiwiZ2xvYmFsY291bnRfbGFiZWwiLCJoZWFkaW1hZ2UiLCJyZWFkeWltYWdlIiwiTm9kZSIsIm9mZmxpbmVpbWFnZSIsImNhcmRfbm9kZSIsImNhcmRfcHJlZmFiIiwiUHJlZmFiIiwiY2xvY2tpbWFnZSIsInFpYW5nZGlkemh1X25vZGUiLCJ0aW1lX2xhYmVsIiwicm9iaW1hZ2Vfc3AiLCJTcHJpdGVGcmFtZSIsInJvYm5vaW1hZ2Vfc3AiLCJyb2JJY29uU3AiLCJyb2JJY29uX1NwIiwicm9ibm9JY29uX1NwIiwibWFzdGVySWNvbiIsIm9uTG9hZCIsImFjdGl2ZSIsIm5vZGUiLCJvbiIsImV2ZW50IiwiYmluZCIsImNvbnNvbGUiLCJsb2ciLCJhY2NvdW50aWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJhY2NvdW50SUQiLCJwdXNoQ2FyZCIsImRldGFpbCIsInN0YXRlIiwicWlhbl9zdGF0ZSIsInFpYW4iLCJidXFpYW5nIiwic3RhcnQiLCJmdW5VcDIiLCJub3ciLCJuZXh0X3RpbWUiLCJzdHJpbmciLCJ1bnNjaGVkdWxlIiwidXBkYXRlR29sZCIsImluZm9saXN0IiwiaSIsImxlbmd0aCIsImdvbGRjb3VudCIsImluaXRfZGF0YSIsImRhdGEiLCJpbmRleCIsIkpTT04iLCJzdHJpbmdpZnkiLCJhY2NvdW50SWQiLCJuaWNrX25hbWUiLCJzZWF0aW5kZXgiLCJjYXJkbGlzdF9ub2RlIiwic2VhdF9pbmRleCIsImlzcmVhZHkiLCJpc29ubGluZSIsInN0ciIsImF2YXRhclVybCIsImhlYWRfaW1hZ2VfcGF0aCIsImxvYWRlciIsImxvYWRSZXMiLCJlcnIiLCJzcHJpdGVGcmFtZSIsIm1lc3NhZ2UiLCJfYWNjb3VudElEIiwic2NoZWR1bGUiLCJvbkNhcmRXYXR0aW5nIiwieCIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInNjYWxlIiwicGFyZW50IiwibmFtZSIsImhlaWdodCIsInkiLCJwdXNoIiwiZnVuVXAzIiwib25PZmZMaW5lIiwib25PbkxpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGFBQWEsRUFBQ0osRUFBRSxDQUFDSyxLQURUO0FBRVJDLElBQUFBLGNBQWMsRUFBQ04sRUFBRSxDQUFDSyxLQUZWO0FBR1JFLElBQUFBLGFBQWEsRUFBQ1AsRUFBRSxDQUFDUSxNQUhUO0FBSVJDLElBQUFBLGlCQUFpQixFQUFDVCxFQUFFLENBQUNLLEtBSmI7QUFLUkssSUFBQUEsU0FBUyxFQUFDVixFQUFFLENBQUNRLE1BTEw7QUFNUkcsSUFBQUEsVUFBVSxFQUFDWCxFQUFFLENBQUNZLElBTk47QUFPUkMsSUFBQUEsWUFBWSxFQUFDYixFQUFFLENBQUNZLElBUFI7QUFRUkUsSUFBQUEsU0FBUyxFQUFDZCxFQUFFLENBQUNZLElBUkw7QUFTUkcsSUFBQUEsV0FBVyxFQUFDZixFQUFFLENBQUNnQixNQVRQO0FBVVI7QUFDQUMsSUFBQUEsVUFBVSxFQUFDakIsRUFBRSxDQUFDWSxJQVhOO0FBWVJNLElBQUFBLGdCQUFnQixFQUFDbEIsRUFBRSxDQUFDWSxJQVpaO0FBWWtCO0FBQzFCTyxJQUFBQSxVQUFVLEVBQUNuQixFQUFFLENBQUNLLEtBYk47QUFjUmUsSUFBQUEsV0FBVyxFQUFDcEIsRUFBRSxDQUFDcUIsV0FkUDtBQWVSQyxJQUFBQSxhQUFhLEVBQUN0QixFQUFFLENBQUNxQixXQWZUO0FBZ0JSRSxJQUFBQSxTQUFTLEVBQUV2QixFQUFFLENBQUNRLE1BaEJOO0FBaUJSZ0IsSUFB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QUFoQixHQUF1QixLQUFHUSxJQUFJLENBQUNULFNBQVIsR0FBa0JTLElBQUksQ0FBQ1YsR0FBOUM7QUFBa0QsS0FoQmhDLENBaUJsQjtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDOztBQUNBLFNBQUs4QixRQUFMLENBQWMsS0FBS1csTUFBbkIsRUFBMEIsQ0FBMUIsRUE3QmlCLENBZ0NsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBeFJPO0FBeVJSQyxFQUFBQSxTQXpSUSx1QkF5Ukc7QUFDVnhELElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFdBQVMsS0FBS0MsU0FBMUI7QUFDQSxTQUFLdEIsWUFBTCxDQUFrQmUsTUFBbEIsR0FBeUIsSUFBekI7QUFDQSxHQTVSTztBQTZSUjhELEVBQUFBLFFBN1JRLHNCQTZSRTtBQUNUekQsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBUyxLQUFLQyxTQUExQjtBQUNBLFNBQUt0QixZQUFMLENBQWtCZSxNQUFsQixHQUF5QixLQUF6QjtBQUNBO0FBaFNPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vLi4vbXlnb2xiYWwuanNcIlxuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBhY2NvdW50X2xhYmVsOmNjLkxhYmVsLFxuICAgICAgICBuaWNrbmFtZV9sYWJlbDpjYy5MYWJlbCxcbiAgICAgICAgcm9vbV90b3V4aWFuZzpjYy5TcHJpdGUsXG4gICAgICAgIGdsb2JhbGNvdW50X2xhYmVsOmNjLkxhYmVsLFxuICAgICAgICBoZWFkaW1hZ2U6Y2MuU3ByaXRlLFxuICAgICAgICByZWFkeWltYWdlOmNjLk5vZGUsXG4gICAgICAgIG9mZmxpbmVpbWFnZTpjYy5Ob2RlLFxuICAgICAgICBjYXJkX25vZGU6Y2MuTm9kZSxcbiAgICAgICAgY2FyZF9wcmVmYWI6Y2MuUHJlZmFiLFxuICAgICAgICAvL3RpcHNfbGFiZWw6Y2MuTGFiZWwsXG4gICAgICAgIGNsb2NraW1hZ2U6Y2MuTm9kZSxcbiAgICAgICAgcWlhbmdkaWR6aHVfbm9kZTpjYy5Ob2RlLCAvL+aKouWcsOS4u+eahOeItuiKgueCuVxuICAgICAgICB0aW1lX2xhYmVsOmNjLkxhYmVsLFxuICAgICAgICByb2JpbWFnZV9zcDpjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgcm9ibm9pbWFnZV9zcDpjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgcm9iSWNvblNwOiBjYy5TcHJpdGUsXG4gICAgICAgIHJvYkljb25fU3A6Y2MuTm9kZSxcbiAgICAgICAgcm9ibm9JY29uX1NwOmNjLk5vZGUsXG4gICAgICAgIG1hc3Rlckljb246Y2MuTm9kZSxcbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB0aGlzLm9mZmxpbmVpbWFnZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgXG4gICAgICAvL+ebkeWQrOW8gOWni+a4uOaIj+S6i+S7tijlrqLmiLfnq6/lj5Hnu5nlrqLmiLfnq68pXG4gICAgICB0aGlzLm5vZGUub24oXCJnYW1lc3RhcnRfZXZlbnRcIixmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAvL+e7meWFtuS7lueOqeWutuWPkeeJjOS6i+S7tlxuICAgICAgdGhpcy5ub2RlLm9uKFwicHVzaF9jYXJkX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uIHB1c2hfY2FyZF9ldmVudFwiKVxuICAgICAgICAvL+iHquW3seS4jeWGjeWPkeeJjFxuICAgICAgICBpZih0aGlzLmFjY291bnRpZD09bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpe1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQ2FyZCgpXG4gICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgIC8ve1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XG4gICAgICAgICAgdmFyIGRldGFpbCA9IGV2ZW50XG4gICAgICBcbiAgICAgICAgICAvL+WmguaenOaYr+iHquW3seWcqOaKou+8jOmcgOimgemakOiXj3FpYW5nZGlkemh1X25vZGXoioLngrlcbiAgICAgICAgICAvL3RoaXMuYWNjb3VudGlk6KGo56S66L+Z5Liq6IqC54K55oyC5o6l55qEYWNjb3VudGlkXG4gICAgICAgICAgaWYoZGV0YWlsLmFjY291bnRpZD09dGhpcy5hY2NvdW50aWQpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRldGFpbC5hY2NvdW50aWRcIitkZXRhaWwuYWNjb3VudGlkKVxuICAgICAgICAgICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYodGhpcy5hY2NvdW50aWQgPT0gZGV0YWlsLmFjY291bnRpZCl7XG4gICAgICAgICAgICBpZihkZXRhaWwuc3RhdGU9PXFpYW5fc3RhdGUucWlhbil7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IHRydWVcIilcbiAgICAgICAgICAgICAgdGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IHRydWVcblxuICAgICAgICAgICAgfWVsc2UgaWYoZGV0YWlsLnN0YXRlPT1xaWFuX3N0YXRlLmJ1cWlhbmcpe1xuICAgICAgICAgICAgICB0aGlzLnJvYm5vSWNvbl9TcC5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgcm9iIHZhbHVlIDpcIitkZXRhaWwuc3RhdGUpXG4gICAgICAgICAgICB9XG5cdFx0XHRcblx0XHRcdC8vdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdFxuICAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX2NoYW5nZW1hc3Rlcl9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgIHZhciBkZXRhaWwgPSBldmVudCBcbiAgICAgICAgIHRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSBmYWxzZVxuICAgICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgIGlmKGRldGFpbD09dGhpcy5hY2NvdW50aWQpe1xuICAgICAgICAgICAgdGhpcy5tYXN0ZXJJY29uLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgIC8vIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XG4gICAgICAvLyAgIHZhciBkZXRhaWwgPSBldmVudCAvL+WcsOS4u+eahGFjY291bnRpZFxuICAgICAgLy8gICBpZihkZXRhaWw9PXRoaXMuYWNjb3VudGlkKXtcbiAgICAgIC8vICAgICAvL+e7meWcsOS4u+WPkeS4ieW8oOaOklxuXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0uYmluZCh0aGlzKSlcbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICBcbiAgICB9LFxuXHQgZnVuVXAyICgpe1xuXHRcdHRoaXMubm93Kys7XG5cdFx0aWYodGhpcy5uZXh0X3RpbWUtdGhpcy5ub3c+MCl7XG5cdFx0XHR0aGlzLnRpbWVfbGFiZWwuc3RyaW5nPVwiXCIrKHRoaXMubmV4dF90aW1lLXRoaXMubm93KTtcblx0XHRcdC8vdGhpcy5zY2hlZHVsZShmdW5VcCwxKVxuXHRcdH1lbHNle1xuXHRcdFx0IHRoaXMudW5zY2hlZHVsZSh0aGlzLmZ1blVwMilcblx0XHR9XG5cdH0sXG4gICAgdXBkYXRlR29sZChpbmZvbGlzdCl7XG5cdFx0Zm9yKHZhciBpPTA7aTxpbmZvbGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdGlmKGluZm9saXN0W2ldLmFjY291bnRJRD09dGhpcy5hY2NvdW50aWQpe1xuXHRcdFx0XHR0aGlzLmdsb2JhbGNvdW50X2xhYmVsLnN0cmluZz1pbmZvbGlzdFtpXS5nb2xkY291bnRcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHR9LFxuXHRcblxuICAgIC8v6L+Z6YeM5Yid5aeL5YyW5oi/6Ze05YaF5L2N572u6IqC54K55L+h5oGvKOiHquW3seWSjOWFtuS7lueOqeWutilcbiAgICAvL2RhdGHnjqnlrrboioLngrnmlbDmja5cbiAgICAvL2luZGV4546p5a625Zyo5oi/6Ze055qE5L2N572u57Si5byVXG4gICAgaW5pdF9kYXRhKGRhdGEsaW5kZXgpe1xuICAgICAgY29uc29sZS5sb2coXCJpbml0X2RhdGE6XCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpICBcbiAgICAgIC8vZGF0YTp7XCJhY2NvdW50aWRcIjpcIjIxMTc4MzZcIixcIm5pY2tfbmFtZVwiOlwidGlueTU0M1wiLFwiYXZhdGFyVXJsXCI6XCJodHRwOi8veHh4XCIsXCJnb2xkY291bnRcIjoxMDAwfVxuICAgICAgdGhpcy5hY2NvdW50aWQgPSBkYXRhLmFjY291bnRpZFxuXHQgIHRoaXMuYWNjb3VudElkPWRhdGEuYWNjb3VudGlkXG4gICAgICB0aGlzLmFjY291bnRfbGFiZWwuc3RyaW5nID0gZGF0YS5hY2NvdW50aWRcbiAgICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gZGF0YS5uaWNrX25hbWUgK1wiIHMgXCIrIGRhdGEuc2VhdGluZGV4ICtcIiBpXCIraW5kZXhcbiAgICAgIHRoaXMuZ2xvYmFsY291bnRfbGFiZWwuc3RyaW5nID0gZGF0YS5nb2xkY291bnRcbiAgICAgIHRoaXMuY2FyZGxpc3Rfbm9kZSA9IFtdXG4gICAgICB0aGlzLnNlYXRfaW5kZXggPSBpbmRleFxuICAgICAgaWYoZGF0YS5pc3JlYWR5PT10cnVlKXtcbiAgICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IHRydWVcbiAgICAgIH1cblx0ICAgdGhpcy5vZmZsaW5laW1hZ2UuYWN0aXZlPWZhbHNlIFxuXHQgIGlmKHR5cGVvZihkYXRhLmlzb25saW5lKSE9XCJ1bmRlZmluZWRcIiAmJiBkYXRhLmlzb25saW5lPT1mYWxzZSl7XG5cdFx0ICAgdGhpcy5vZmZsaW5laW1hZ2UuYWN0aXZlPXRydWUgXG5cdCAgfVxuICAgICBcbiAgICAgIC8v572R57uc5Zu+54mH5Yqg6L29XG4gICAgLy8gICAgIGNjLmxvYWRlci5sb2FkKHt1cmw6IGRhdGEuYXZhdGFyVXJsLCB0eXBlOiAnanBnJ30sICAoZXJyLCB0ZXgpPT4ge1xuICAgIC8vICAgICAvL2NjLmxvZygnU2hvdWxkIGxvYWQgYSB0ZXh0dXJlIGZyb20gUkVTVGZ1bCBBUEkgYnkgc3BlY2lmeSB0aGUgdHlwZTogJyArICh0ZXggaW5zdGFuY2VvZiBjYy5UZXh0dXJlMkQpKTtcbiAgICAvLyAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5oZWFkSW1hZ2Uubm9kZS53aWR0aDtcbiAgICAvLyAgICAgLy9jb25zb2xlLmxvZygnb2xkIHdpdGhkJyArIG9sZFdpZHRoKTtcbiAgICAvLyAgICAgdGhpcy5yb29tX3RvdXhpYW5nLnNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKHRleCk7XG4gICAgLy8gICAgIGxldCBuZXdXaWR0aCA9IHRoaXMuaGVhZEltYWdlLm5vZGUud2lkdGg7XG4gICAgLy8gICAgIC8vY29uc29sZS5sb2coJ29sZCB3aXRoZCcgKyBuZXdXaWR0aCk7XG4gICAgLy8gICAgIHRoaXMuaGVhZEltYWdlLm5vZGUuc2NhbGUgPSBvbGRXaWR0aCAvIG5ld1dpZHRoO1xuICAgIC8vIH0pO1xuICAgIC8v6L+Z6YeM5qC55o2u5Lyg5YWl55qEYXZhcnRlcuadpeiOt+WPluacrOWcsOWbvuWDj1xuICAgIHZhciBzdHIgPSBkYXRhLmF2YXRhclVybFxuICAgIC8vY29uc29sZS5sb2coc3RyKVxuICAgIHZhciBoZWFkX2ltYWdlX3BhdGggPSBcIlVJL2hlYWRpbWFnZS9cIiArIHN0clxuICAgIGNjLmxvYWRlci5sb2FkUmVzKGhlYWRfaW1hZ2VfcGF0aCxjYy5TcHJpdGVGcmFtZSxmdW5jdGlvbihlcnIsc3ByaXRlRnJhbWUpwqB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlIHx8IGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH3CoCDCoCDCoCDCoCDCoCBcbiAgICAgICAgIHRoaXMuaGVhZGltYWdlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7wqAgwqAgwqAgwqAgXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvL+azqOWGjOS4gOS4qnBsYXllcl9yZWFkeea2iOaBr1xuICAgIHRoaXMubm9kZS5vbihcInBsYXllcl9yZWFkeV9ub3RpZnlcIixmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyX3JlYWR5X25vdGlmeSBldmVudFwiLGV2ZW50KVxuICAgICAgICAgICAgdmFyIGRldGFpbCA9IGV2ZW50XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXBsYXllcl9yZWFkeV9ub3RpZnkgZGV0YWlsOlwiK2RldGFpbClcbiAgICAgICAgICAgIGlmKGRldGFpbD09dGhpcy5hY2NvdW50aWQpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICAvL+ebkeWQrOWGhemDqOmaj+WPr+S7peaKouWcsOS4u+a2iOaBryzov5nkuKrmtojmga/kvJrlj5Hnu5nmr4/kuKpwbGF5ZXJub2Rl6IqC54K5XG4gICAgICAgIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfY2Fucm9iX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGRldGFpbCA9IGV2ZW50XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXBsYXllcm5vZGVfY2Fucm9iX2V2ZW50IGRldGFpbDpcIitkZXRhaWwpXG5cdFx0XHQgdGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXAyKVxuICAgICAgICAgICAgaWYoZGV0YWlsLl9hY2NvdW50SUQ9PXRoaXMuYWNjb3VudGlkKXtcbiAgICAgICAgICAgICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZT10cnVlXG4gICAgICAgICAgICAgIC8vdGhpcy50aXBzX2xhYmVsLnN0cmluZyA9XCLmraPlnKjmiqLlnLDkuLtcIiBcbiAgICAgICAgICAgICAvLyB0aGlzLnRpbWVfbGFiZWwuc3RyaW5nPVwiMTBcIlxuICAgICAgICAgICAgICAvL+W8gOWQr+S4gOS4quWumuaXtuWZqFxuXHRcdFx0ICAvLyB2YXIgbm93PWRldGFpbC5uZXh0X3RpbWUtZGV0YWlsLm5vdztcblx0XHRcdCAgdGhpcy5uZXh0X3RpbWU9ZGV0YWlsLm5leHRfdGltZTtcblx0XHRcdCAgdGhpcy5ub3c9ZGV0YWlsLm5vdztcblx0XHRcdHRoaXMudGltZV9sYWJlbC5zdHJpbmc9XCJcIisodGhpcy5uZXh0X3RpbWUtdGhpcy5ub3cpO1xuXHRcdFx0Ly8gbGV0IGZ1blVwMiA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBcdHRoaXMubm93Kys7XG5cdFx0XHQvLyBcdGlmKHRoaXMubmV4dF90aW1lLXRoaXMubm93PjApe1xuXHRcdFx0Ly8gXHRcdHRoaXMudGltZV9sYWJlbC5zdHJpbmc9XCJcIisodGhpcy5uZXh0X3RpbWUtdGhpcy5ub3cpO1xuXHRcdFx0Ly8gXHRcdC8vdGhpcy5zY2hlZHVsZShmdW5VcCwxKVxuXHRcdFx0Ly8gXHR9ZWxzZXtcblx0XHRcdC8vIFx0XHQvLyB0aGlzLnVuc2NoZWR1bGUoZnVuVXApXG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH0uYmluZCh0aGlzKTtcblx0XHQgICAgXG5cdFx0XHQgdGhpcy5zY2hlZHVsZSh0aGlzLmZ1blVwMiwgMSk7XG4gICAgICAgICAgICBcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZT1mYWxzZVxuXHRcdFx0fVxuXHRcdFx0XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblx0XHR0aGlzLm5vZGUub24oXCJvbkNhbkNodUNhcmRfcGxheWVybm9kZVwiLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coXCLmlLbliLDpgJrnn6Ug562J5b6F55So5oi35Ye654mMIFwiK2RhdGEpO1xuXHRcdFx0dGhpcy5vbkNhcmRXYXR0aW5nKGRhdGEpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG4gICAgICAgIC8vP1xuICAgICAgICBpZihpbmRleD09MSl7XG4gICAgICAgICAgdGhpcy5jYXJkX25vZGUueCA9IC10aGlzLmNhcmRfbm9kZS54IC0gMzBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcbiAgICBwdXNoQ2FyZCgpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jYXJkX25vZGUuYWN0aXZlID0gdHJ1ZSBcbiAgICAgICAgZm9yKHZhciBpPTA7aTwxNztpKyspe1xuICAgICAgICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxuICAgICAgICAgICAgY2FyZC5zY2FsZT0wLjZcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIHRoaXMuY2FyZF9ub2RlLnBhcmVudC5wYXJlbnRcIisgdGhpcy5jYXJkX25vZGUucGFyZW50LnBhcmVudC5uYW1lKVxuICAgICAgICAgICAgY2FyZC5wYXJlbnQgPSB0aGlzLmNhcmRfbm9kZVxuICAgICAgICAgICAgLy9jYXJkLnBhcmVudCA9IHRoaXMubm9kZVxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGNhcmQuaGVpZ2h0XG4gICAgICAgICAgICBjYXJkLnkgPSAoMTcgLSAxKSAqIDAuNSAqIGhlaWdodCAqIDAuNCAqIDAuMyAtIGhlaWdodCAqIDAuNCAqIDAuMyAqIGk7XG4gICAgICAgICAgICBjYXJkLnggPSAwXG4gICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNhbGwgcHVzaENhcmQgeDpcIitjYXJkLngrXCIgeTpcIitjYXJkLnkpXG4gICAgICAgICAgICB0aGlzLmNhcmRsaXN0X25vZGUucHVzaChjYXJkKVxuICAgICAgICB9XG4gICAgfSxcblx0ZnVuVXAzKCl7XG5cdFx0XHR0aGlzLm5vdysrO1xuXHRcdFx0aWYodGhpcy5uZXh0X3RpbWUtdGhpcy5ub3c+MCl7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnRpbWVfbGFiZWwuc3RyaW5nPVwiXCIrKHRoaXMubmV4dF90aW1lLXRoaXMubm93KTtcblx0XHRcdFx0Ly90aGlzLnNjaGVkdWxlKGZ1blVwLDEpXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLnVuc2NoZWR1bGUodGhpcy5mdW5VcDMpO1xuXHRcdFx0fVxuXHR9LFxuXHRvbkNhcmRXYXR0aW5nKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKFwi562J5b6FIOWHuueJjDpcIixkYXRhLl9hY2NvdW50SUQpXG5cdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXAzKTtcblx0XHRcblx0XHRpZih0aGlzLmFjY291bnRpZD09ZGF0YS5fYWNjb3VudElEKXtcblx0XHQgICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlID0gZmFsc2U7XG5cdFx0fVxuXHRcdGlmKCB0aGlzLmFjY291bnRpZCE9ZGF0YS5fYWNjb3VudElEKXtcblx0XHRcdHJldHVybiA7XG5cdFx0fVxuXHRcdC8vdmFyIG5vdz1kYXRhLm5leHRfdGltZS1kYXRhLm5vdztcblx0XHR0aGlzLm5leHRfdGltZT1kYXRhLm5leHRfdGltZTtcblx0XHR0aGlzLm5vdz1kYXRhLm5vdztcblx0XHR0aGlzLnRpbWVfbGFiZWwuc3RyaW5nPVwiXCIrZGF0YS5uZXh0X3RpbWUtZGF0YS5ub3c7O1xuXHRcdC8vIGxldCBmdW5VcDMgPSBmdW5jdGlvbigpe1xuXHRcdC8vIFx0dGhpcy5ub3crKztcblx0XHQvLyBcdGlmKHRoaXMubmV4dF90aW1lLXRoaXMubm93PjApe1xuXHRcdFx0XHRcblx0XHQvLyBcdFx0dGhpcy50aW1lX2xhYmVsLnN0cmluZz1cIlwiKyh0aGlzLm5leHRfdGltZS10aGlzLm5vdyk7XG5cdFx0Ly8gXHRcdC8vdGhpcy5zY2hlZHVsZShmdW5VcCwxKVxuXHRcdC8vIFx0fWVsc2V7XG5cdFx0Ly8gXHRcdHRoaXMucWlhbmdkaWR6aHVfbm9kZS5hY3RpdmUgPSBmYWxzZTtcblx0XHQvLyBcdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXAzKTtcblx0XHQvLyBcdH1cblx0XHQvLyB9LmJpbmQodGhpcyk7XG5cdFx0IC8vIHRoaXMuc2NoZWR1bGUoZnVuVXAsIDEpO1xuXHRcdCB0aGlzLnNjaGVkdWxlKHRoaXMuZnVuVXAzLDEpO1xuXHRcdCBcblx0XG5cdFx0Ly8gdGhpcy5zY2hlZHVsZShmdW5jdGlvbigpe1xuXHRcdC8vIFx0ZGF0YS5ub3crPTEwMDA7XG5cdFx0Ly8gXHRpZihkYXRhLm5leHRfdGltZS1kYXRhLm5vdz4wKXtcblx0XHQvLyBcdFx0dGhpcy50aW1lX2xhYmVsLnN0cmluZz1cIlwiKyhkYXRhLm5leHRfdGltZS1kYXRhLm5vdykvMTAwMDtcblx0XHQvLyBcdH1cblx0XHQvLyB9LmJpbmQodGhpcyksMSk7XG5cdFx0Ly/nrYnlvoXmn5Dkurrlh7rniYxcblx0fSxcblx0b25PZmZMaW5lKCl7XG5cdFx0Y29uc29sZS5sb2coXCIgIOaOiee6v+S6hiBcIit0aGlzLmFjY291bnRpZCk7IFxuXHRcdHRoaXMub2ZmbGluZWltYWdlLmFjdGl2ZT10cnVlXG5cdH0sXG5cdG9uT25MaW5lKCl7XG5cdFx0Y29uc29sZS5sb2coXCIgIOS4iue6v+S6hiBcIit0aGlzLmFjY291bnRpZCk7IFxuXHRcdHRoaXMub2ZmbGluZWltYWdlLmFjdGl2ZT1mYWxzZVxuXHR9XG5cdFxufSk7XG4iXX0=