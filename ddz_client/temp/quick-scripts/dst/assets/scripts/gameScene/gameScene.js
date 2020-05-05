
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gameScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cf22aez0/xDaaC1kRqxn/pw', 'gameScene');
// scripts/gameScene/gameScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    di_label: cc.Label,
    beishu_label: cc.Label,
    roomid_label: cc.Label,
    player_node_prefabs: cc.Prefab,
    //绑定玩家座位,下面有3个子节点
    players_seat_pos: cc.Node
  },
  //本局结束，做状态清除
  gameEnd: function gameEnd() {
    console.log("本局结束,做 状态 清除");
  },
  recovery_game: function recovery_game() {
    _mygolbal["default"].socket.request_recovery({}, function (err, result) {
      //尝试 恢复牌局
      console.log("request_recovery_resp" + JSON.stringify(result)); //Toast.show(JSON.stringify(result));

      if (err != 0) {
        console.log("request_recovery_resp err:" + err);
      } else {
        this.ResetUI_with_data(result);
      }
    }.bind(this));
  },
  ResetUI_with_data: function ResetUI_with_data(data) {
    this.roomstate = data.state;
    var gameingUI = this.node.getChildByName("gameingUI");
    gameingUI.active = this.roomstate == RoomState.ROOM_PLAYING ? true : false;
    var gameingUI_script = this.node.getChildByName("gameingUI").getComponent("gameingUI");
    gameingUI_script.ResetUI_();
    var gamebeforeUI = this.node.getChildByName("gamebeforeUI");

    if (this.roomstate == RoomState.ROOM_PLAYING) {
      //游戏中
      gamebeforeUI.active = false;
    } else {
      gamebeforeUI.active = this.roomstate == RoomState.ROOM_PLAYING ? false : true;
      gamebeforeUI.emit("init");
    }

    if (this.roomstate == RoomState.ROOM_PLAYING) {
      // 游戏中
      if (typeof data._cards != "undefined" && data._cards.length > 0) {
        //显示手牌
        gameingUI_script.show_mycards(data._cards);
      }

      if (typeof data.three_cards != "undefined" && data.three_cards.length > 0) {
        //显示地主牌
        gameingUI_script.show_bottom_cards(data.three_cards);
      }

      if (typeof data.cur_waitchucard != "undefined") {
        //当前谁出牌
        gameingUI_script.now_whocan_chupai(data.cur_waitchucard);
      }

      if (typeof data.last_push_card_accountid != "undefined") {
        //上次出的非空牌
        gameingUI_script.show_chupai({
          "accountid": data.last_push_card_accountid,
          "cards": data.last_push_card_list
        });
      }
    }
  },
  returnback: function returnback() {
    //返回上一页
    //cc.director.loadScene("hallScene")
    if (this.roomstate >= RoomState.ROOM_GAMESTART) {
      Alert.show("游戏进行中,确定离开吗", function () {
        this.leaveroom();
      }.bind(this));
    } else {
      // 	//离开房间
      this.leaveroom();
    }
  },
  leaveroom: function leaveroom() {
    // 离开房间
    cc.director.loadScene("hallScene");

    _mygolbal["default"].socket.requestLeaveRoom();
  },
  // onLoad(){
  // },
  onDestroy: function onDestroy() {
    _mygolbal["default"].socket._event.removeAllLister();
  },
  onLoad: function onLoad() {
    var that = this;
    this.playerNodeList = [];
    this.playerdata_list = [];
    this.di_label.string = "底:" + _mygolbal["default"].playerData.bottom;
    this.beishu_label.string = "倍数:" + _mygolbal["default"].playerData.rate;
    this.roomstate = RoomState.ROOM_INVALID; //监听，给其他玩家发牌(内部事件)

    this.node.on("pushcard_other_event", function () {
      console.log("gamescene pushcard_other_event");

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("push_card_event");
        }
      }
    }.bind(this)); //监听房间状态改变事件

    _mygolbal["default"].socket.onRoomChangeState(function (data) {
      //回调的函数参数是进入房间用户消息
      console.log("onRoomChangeState:" + data);
      that.roomstate = data;

      if (that.roomstate == RoomState.ROOM_INVALID) {
        //
        //重置游戏
        console.log("服务器 重置 游戏"); //var gamebefore_node = this.node.getChildByName("gameingUI")

        that.node.getChildByName("gameingUI").getComponent("gameingUI").ResetUI_(); //gamebefore_node.emit("init")
      }
    }.bind(this));

    _mygolbal["default"].socket.onPlayerDisconnect(function (data) {
      console.log("onPlayerDisconnect 玩家离开房间:" + data.accountid + " "); //某个玩家离开房间

      Toast.show(data.accountid + " 离开房间");
      that.deletePlayerNode(data);

      if (data.accountid == _mygolbal["default"].playerData.accountID) {
        console.log("您被踢出房间");
        cc.director.loadScene("hallScene");
      }
    }.bind(this));

    _mygolbal["default"].socket.onPlayerDisonline(function (data) {
      console.log("onPlayerDisonline 玩家掉线:" + data.accountid + " "); //某个玩家 游戏中掉线

      that.offlinePlayerNode(data);
    }.bind(this));

    _mygolbal["default"].socket.onPlayerReonline(function (data) {
      console.log("onPlayerReonline 玩家重新连接成功:" + data.accountid + " "); //某个玩家 游戏中掉线重连成功通知

      that.onlinePlayerNode(data);
    }.bind(this)); //


    _mygolbal["default"].socket.onSocketClosed(function (data) {
      console.log("onSocketClosed:" + data);
      Alert.show("您掉线啦,请重新登录!", function () {
        cc.director.loadScene("loginScene");
        return; // if(this.roomstate!=RoomState.ROOM_PLAYING){
        // 		  cc.director.loadScene("loginScene");
        // 		  return;
        // }
        // var node=this.node.getChildByName("gameingUI").getComponent("gameingUI");
        // 	node.returnroom.active=true;
      }, false);
    }.bind(this));

    _mygolbal["default"].socket.onNotLogined(function (data) {
      console.log("您未登录!");
      Alert.show("您未登录,请重新登录!", function () {
        cc.director.loadScene("loginScene");
      });
    }.bind(this));

    this.node.on("onCanChuCard_gameScene", function (data) {
      console.log("等待玩家出牌 ", JSON.stringify(data)); //通知 可以出牌

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          node.emit("onCanChuCard_playernode", data);
        }
      }
    }.bind(this));
    this.node.on("canrob_event", function (event) {
      console.log("gamescene canrob_event:" + event); //通知给playernode子节点

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_canrob_event", event);
        }
      }
    }.bind(this));
    this.node.on("choose_card_event", function (event) {
      console.log("--------choose_card_event-----------");
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("choose_card_event", event);
    }.bind(this));
    this.node.on("unchoose_card_event", function (event) {
      console.log("--------unchoose_card_event-----------");
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("unchoose_card_event", event);
    }.bind(this)); //监听给玩家添加三张底牌
    // this.node.on("add_three_card",function(event){
    //     console.log("add_three_card:"+event)
    //     for(var i=0;i<this.playerNodeList.length;i++){
    //         var node = this.playerNodeList[i]
    //         if(node){
    //             //给playernode节点发送事件
    //             node.emit("playernode_add_three_card",event)
    //         }
    //     }
    // }.bind(this))

    _mygolbal["default"].socket.request_enter_room({}, function (err, result) {
      console.log("enter_room_resp" + JSON.stringify(result));

      if (err != 0) {
        console.log("enter_room_resp err:" + err);
      } else {
        //enter_room成功
        //notify ={"seatid":1,"playerdata":[{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}]}
        var seatid = result.seatindex; //自己在房间里的seatid

        that.playerdata_list_pos = []; //3个用户创建一个空用户列表
        //this.setPlayerSeatPos(seatid)

        var playerdata_list = result.playerdata;
        var roomid = result.roomid;
        that.roomid = result.roomid;
        that.roomid_label.string = "房间号:" + roomid;
        _mygolbal["default"].playerData.housemanageid = result.housemanageid;
        _mygolbal["default"].playerData.seat_index = seatid;

        for (var i = 0; i < playerdata_list.length; i++) {
          //consol.log("this----"+this)
          that.addPlayerNode(playerdata_list[i]);
        }

        if (isopen_sound) {
          cc.audioEngine.stopAll();
          cc.audioEngine.play(cc.url.raw("resources/sound/bg.mp3"), true);
        }
      } // var gamebefore_node = this.node.getChildByName("gamebeforeUI")
      //gamebefore_node.emit("init")
      //this.node.getChildByName("gameingUI").getComponent("gameingUI").ResetUI_()


      that.recovery_game();
    }.bind(this)); //在进入房间后，注册其他玩家进入房间的事件


    _mygolbal["default"].socket.onPlayerJoinRoom(function (join_playerdata) {
      //回调的函数参数是进入房间用户消息
      console.log("onPlayerJoinRoom:" + JSON.stringify(join_playerdata));
      Toast.show(join_playerdata.accountid + " 进入房间");
      that.addPlayerNode(join_playerdata);
    }.bind(this)); //回调参数是发送准备消息的accountid


    _mygolbal["default"].socket.onPlayerReady(function (data) {
      console.log("-------onPlayerReady:" + data);

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          node.emit("player_ready_notify", data);
        }
      }
    });

    _mygolbal["default"].socket.onGameStart(function () {
      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          node.emit("gamestart_event");
        }
      } //隐藏gamebeforeUI节点


      var gamebeforeUI = this.node.getChildByName("gamebeforeUI");

      if (gamebeforeUI) {
        gamebeforeUI.active = false;
      }
    }.bind(this)); //监听服务器玩家抢地主消息


    _mygolbal["default"].socket.onRobState(function (event) {
      console.log("-----onRobState" + JSON.stringify(event)); //onRobState{"accountid":"2162866","state":1}

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_rob_state_event", event);
        }
      }
    }.bind(this)); //注册监听服务器确定地主消息


    _mygolbal["default"].socket.onChangeMaster(function (event) {
      console.log("onChangeMaster" + event); //保存一下地主id

      _mygolbal["default"].playerData.master_accountid = event;

      for (var i = 0; i < that.playerNodeList.length; i++) {
        var node = that.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_changemaster_event", event);
        }
      }
    }.bind(this)); //注册监听服务器显示底牌消息


    _mygolbal["default"].socket.onShowBottomCard(function (event) {
      console.log("onShowBottomCard---------" + event);
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("show_bottom_card_event", event);
    }.bind(this)); //更新玩家分数


    _mygolbal["default"].socket.onUpdateinfo(function (event) {
      for (var i = 0; i < this.playerNodeList.length; i++) {
        this.playerNodeList[i].getComponent("player_node").updateGold(event.infolist);
      }
    }.bind(this));
  },
  //seat_index自己在房间的位置id
  // setPlayerSeatPos(seat_index){
  //     if(seat_index < 1 || seat_index > 3){
  //         console.log("seat_index error"+seat_index)
  //         return
  //     }
  //     console.log("setPlayerSeatPos seat_index:" + seat_index)
  //     //界面位置转化成逻辑位置
  //     switch(seat_index){
  //         case 1:
  //                this.playerdata_list_pos[1] = 0
  //                this.playerdata_list_pos[2] = 1 
  //                this.playerdata_list_pos[3] = 2
  //           break
  //          case 2:
  //                 this.playerdata_list_pos[2] = 0
  //                 this.playerdata_list_pos[3] = 1
  //                 this.playerdata_list_pos[1] = 2
  //                 break
  //          case 3:
  //                 this.playerdata_list_pos[3] = 0     
  //                 this.playerdata_list_pos[2] = 1
  //                 this.playerdata_list_pos[1] = 2
  //                 break
  //         default: 
  //           break      
  //     } 
  // },
  addPlayerNode: function addPlayerNode(player_data) {
    var playernode_inst = cc.instantiate(this.player_node_prefabs);
    playernode_inst.parent = this.node; //玩家在room里的位置索引(逻辑位置)

    var index = (player_data.seatindex + 3 - _mygolbal["default"].playerData.seat_index) % 3; //     this.playerdata_list_pos[player_data.seatindex]

    console.log("我座位号" + _mygolbal["default"].playerData.seat_index + " ,玩家座位号" + player_data.seatindex + " " + index);
    playernode_inst.position = this.players_seat_pos.children[index].position;
    playernode_inst.getComponent("player_node").init_data(player_data, index); //创建的节点存储在gamescene的列表中

    this.playerNodeList.push(playernode_inst);
  },
  deletePlayerNode: function deletePlayerNode(p) {
    //某个玩家 离开房间
    // const _this=this;
    for (var i = 0; i < this.playerNodeList.length; i++) {
      console.log("is delete " + this.playerNodeList[i].getComponent("player_node").accountid + ":" + p.accountid);

      if (this.playerNodeList[i].getComponent("player_node").accountid == p.accountid) {
        console.log("delete " + i + ":" + p.accountid);
        var j = i; // setTimeout(function () {

        this.playerNodeList[j].removeFromParent();
        this.playerNodeList[j].destroy(); // delete(_this.playerNodeList[j]);
        //this.playerNodeList[j].removeListener();

        this.playerNodeList.splice(j, 1); // }.bind(this),100);
      }
    }
  },
  getPlayerNodeByAccountid: function getPlayerNodeByAccountid(accountid) {
    var _this = this;

    for (var i = 0; i < _this.playerNodeList.length; i++) {
      //  console.log("is delete "+_this.playerNodeList[i].getComponent("player_node").accountid+":"+accountid);
      if (_this.playerNodeList[i].getComponent("player_node").accountid == accountid) {
        return _this.playerNodeList[i];
      }
    }
  },
  offlinePlayerNode: function offlinePlayerNode(p) {
    //某个玩家 游戏中掉线
    var _this = this;

    var node = _this.getPlayerNodeByAccountid(p.accountid);

    node.getComponent("player_node").onOffLine(); // for(var i=0;i<_this.playerdata_list.length;i++){
    //   if(_this.playerdata_list[i].accountid==p.accountid){
    // 	  _this.playerNodeList[i].getComponent("player_node").onOffLine();
    //   }
    // }
  },
  onlinePlayerNode: function onlinePlayerNode(p) {
    //某个玩家 游戏中掉线重新连接成功
    var _this = this; // for(var i=0;i<_this.playerdata_list.length;i++){//
    //   if(_this.playerdata_list[i].accountid==p.accountid){
    // 	  _this.playerNodeList[i].getComponent("player_node").onOnLine();
    //   }
    // }


    var node = _this.getPlayerNodeByAccountid(p.accountid);

    node.getComponent("player_node").onOnLine();

    if (p.accountid == _mygolbal["default"].playerData.accountID) {
      // 自己掉线重连成功
      //获取 手牌 和 房间最新状态   
      //手牌  房间状态  当前到谁出牌, 上次玩家 出牌是什么  出牌剩余时间  地主底牌是什么
      console.log("我重连成功了");
    }
  },
  // start () {
  // },

  /*
   //通过accountid获取用户出牌放在gamescend的位置 
   做法：先放3个节点在gameacene的场景中cardsoutzone(012)
         
  */
  getUserOutCardPosByAccount: function getUserOutCardPosByAccount(accountid) {
    console.log("getUserOutCardPosByAccount accountid:" + accountid);

    for (var i = 0; i < this.playerNodeList.length; i++) {
      var node = this.playerNodeList[i];

      if (node) {
        //获取节点绑定的组件
        var node_script = node.getComponent("player_node"); //如果accountid和player_node节点绑定的accountid相同
        //接获取player_node的子节点

        if (node_script.accountid === accountid) {
          var seat_node = this.players_seat_pos.children[node_script.seat_index];
          var index_name = "cardsoutzone" + node_script.seat_index; //console.log("getUserOutCardPosByAccount index_name:"+index_name)

          var out_card_node = seat_node.getChildByName(index_name); //console.log("OutZone:"+ out_card_node.name)

          return out_card_node;
        }
      }
    }

    return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWVTY2VuZS9nYW1lU2NlbmUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaV9sYWJlbCIsIkxhYmVsIiwiYmVpc2h1X2xhYmVsIiwicm9vbWlkX2xhYmVsIiwicGxheWVyX25vZGVfcHJlZmFicyIsIlByZWZhYiIsInBsYXllcnNfc2VhdF9wb3MiLCJOb2RlIiwiZ2FtZUVuZCIsImNvbnNvbGUiLCJsb2ciLCJyZWNvdmVyeV9nYW1lIiwibXlnbG9iYWwiLCJzb2NrZXQiLCJyZXF1ZXN0X3JlY292ZXJ5IiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsIlJlc2V0VUlfd2l0aF9kYXRhIiwiYmluZCIsImRhdGEiLCJyb29tc3RhdGUiLCJzdGF0ZSIsImdhbWVpbmdVSSIsIm5vZGUiLCJnZXRDaGlsZEJ5TmFtZSIsImFjdGl2ZSIsIlJvb21TdGF0ZSIsIlJPT01fUExBWUlORyIsImdhbWVpbmdVSV9zY3JpcHQiLCJnZXRDb21wb25lbnQiLCJSZXNldFVJXyIsImdhbWViZWZvcmVVSSIsImVtaXQiLCJfY2FyZHMiLCJsZW5ndGgiLCJzaG93X215Y2FyZHMiLCJ0aHJlZV9jYXJkcyIsInNob3dfYm90dG9tX2NhcmRzIiwiY3VyX3dhaXRjaHVjYXJkIiwibm93X3dob2Nhbl9jaHVwYWkiLCJsYXN0X3B1c2hfY2FyZF9hY2NvdW50aWQiLCJzaG93X2NodXBhaSIsImxhc3RfcHVzaF9jYXJkX2xpc3QiLCJyZXR1cm5iYWNrIiwiUk9PTV9HQU1FU1RBUlQiLCJBbGVydCIsInNob3ciLCJsZWF2ZXJvb20iLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsInJlcXVlc3RMZWF2ZVJvb20iLCJvbkRlc3Ryb3kiLCJfZXZlbnQiLCJyZW1vdmVBbGxMaXN0ZXIiLCJvbkxvYWQiLCJ0aGF0IiwicGxheWVyTm9kZUxpc3QiLCJwbGF5ZXJkYXRhX2xpc3QiLCJzdHJpbmciLCJwbGF5ZXJEYXRhIiwiYm90dG9tIiwicmF0ZSIsIlJPT01fSU5WQUxJRCIsIm9uIiwiaSIsIm9uUm9vbUNoYW5nZVN0YXRlIiwib25QbGF5ZXJEaXNjb25uZWN0IiwiYWNjb3VudGlkIiwiVG9hc3QiLCJkZWxldGVQbGF5ZXJOb2RlIiwiYWNjb3VudElEIiwib25QbGF5ZXJEaXNvbmxpbmUiLCJvZmZsaW5lUGxheWVyTm9kZSIsIm9uUGxheWVyUmVvbmxpbmUiLCJvbmxpbmVQbGF5ZXJOb2RlIiwib25Tb2NrZXRDbG9zZWQiLCJvbk5vdExvZ2luZWQiLCJldmVudCIsImdhbWV1aV9ub2RlIiwicmVxdWVzdF9lbnRlcl9yb29tIiwic2VhdGlkIiwic2VhdGluZGV4IiwicGxheWVyZGF0YV9saXN0X3BvcyIsInBsYXllcmRhdGEiLCJyb29taWQiLCJob3VzZW1hbmFnZWlkIiwic2VhdF9pbmRleCIsImFkZFBsYXllck5vZGUiLCJpc29wZW5fc291bmQiLCJhdWRpb0VuZ2luZSIsInN0b3BBbGwiLCJwbGF5IiwidXJsIiwicmF3Iiwib25QbGF5ZXJKb2luUm9vbSIsImpvaW5fcGxheWVyZGF0YSIsIm9uUGxheWVyUmVhZHkiLCJvbkdhbWVTdGFydCIsIm9uUm9iU3RhdGUiLCJvbkNoYW5nZU1hc3RlciIsIm1hc3Rlcl9hY2NvdW50aWQiLCJvblNob3dCb3R0b21DYXJkIiwib25VcGRhdGVpbmZvIiwidXBkYXRlR29sZCIsImluZm9saXN0IiwicGxheWVyX2RhdGEiLCJwbGF5ZXJub2RlX2luc3QiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImluZGV4IiwicG9zaXRpb24iLCJjaGlsZHJlbiIsImluaXRfZGF0YSIsInB1c2giLCJwIiwiaiIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95Iiwic3BsaWNlIiwiZ2V0UGxheWVyTm9kZUJ5QWNjb3VudGlkIiwiX3RoaXMiLCJvbk9mZkxpbmUiLCJvbk9uTGluZSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50Iiwibm9kZV9zY3JpcHQiLCJzZWF0X25vZGUiLCJpbmRl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QUFJLEdBQUcsS0FBS2lDLGNBQUwsQ0FBb0JRLENBQXBCLENBQVg7O0FBQ0EsVUFBR3pDLElBQUgsRUFBUTtBQUNKO0FBQ0EsWUFBSXFHLFdBQVcsR0FBR3JHLElBQUksQ0FBQ00sWUFBTCxDQUFrQixhQUFsQixDQUFsQixDQUZJLENBR0o7QUFDQTs7QUFDQSxZQUFHK0YsV0FBVyxDQUFDekQsU0FBWixLQUF3QkEsU0FBM0IsRUFBcUM7QUFDbkMsY0FBSTBELFNBQVMsR0FBRyxLQUFLekgsZ0JBQUwsQ0FBc0IyRyxRQUF0QixDQUErQmEsV0FBVyxDQUFDdEMsVUFBM0MsQ0FBaEI7QUFDQSxjQUFJd0MsVUFBVSxHQUFHLGlCQUFlRixXQUFXLENBQUN0QyxVQUE1QyxDQUZtQyxDQUduQzs7QUFDQSxjQUFJeUMsYUFBYSxHQUFHRixTQUFTLENBQUNyRyxjQUFWLENBQXlCc0csVUFBekIsQ0FBcEIsQ0FKbUMsQ0FLbkM7O0FBQ0EsaUJBQU9DLGFBQVA7QUFDRDtBQUNKO0FBQ0o7O0FBRUQsV0FBTyxJQUFQO0FBQ0gsR0FyZUksQ0FzZUw7O0FBdGVLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBkaV9sYWJlbDpjYy5MYWJlbCxcbiAgICAgICAgYmVpc2h1X2xhYmVsOmNjLkxhYmVsLFxuICAgICAgICByb29taWRfbGFiZWw6Y2MuTGFiZWwsXG4gICAgICAgIHBsYXllcl9ub2RlX3ByZWZhYnM6Y2MuUHJlZmFiLFxuICAgICAgICAvL+e7keWumueOqeWutuW6p+S9jSzkuIvpnaLmnIkz5Liq5a2Q6IqC54K5XG4gICAgICAgIHBsYXllcnNfc2VhdF9wb3M6Y2MuTm9kZSxcbiAgICAgICAgXG4gICAgfSxcbiAgICAvL+acrOWxgOe7k+adn++8jOWBmueKtuaAgea4hemZpFxuICAgIGdhbWVFbmQoKXtcbiAgICAgICBjb25zb2xlLmxvZyhcIuacrOWxgOe7k+adnyzlgZog54q25oCBIOa4hemZpFwiKVxuICAgIH0sXG5cdHJlY292ZXJ5X2dhbWUoKXtcblx0XHRteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9yZWNvdmVyeSh7fSxmdW5jdGlvbihlcnIscmVzdWx0KXsvL+WwneivlSDmgaLlpI3niYzlsYBcblx0XHQgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0X3JlY292ZXJ5X3Jlc3BcIisgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcblx0XHRcdC8vVG9hc3Quc2hvdyhKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcblx0XHQgICAgaWYoZXJyIT0wKXtcblx0XHQgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0X3JlY292ZXJ5X3Jlc3AgZXJyOlwiK2Vycilcblx0XHQgICAgfWVsc2V7XG5cdFx0XHRcblx0ICAgICAgICB0aGlzLlJlc2V0VUlfd2l0aF9kYXRhKHJlc3VsdCk7XHRcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0fSxcblx0UmVzZXRVSV93aXRoX2RhdGEoZGF0YSl7XG5cdFx0dGhpcy5yb29tc3RhdGU9ZGF0YS5zdGF0ZTtcblx0XHRcblx0XHR2YXIgZ2FtZWluZ1VJPXRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWVpbmdVSVwiKTtcblx0XHRcdFx0XHRcdGdhbWVpbmdVSS5hY3RpdmU9KHRoaXMucm9vbXN0YXRlPT1Sb29tU3RhdGUuUk9PTV9QTEFZSU5HP3RydWU6ZmFsc2UpO1xuXHRcdHZhciBnYW1laW5nVUlfc2NyaXB0PSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIikuZ2V0Q29tcG9uZW50KFwiZ2FtZWluZ1VJXCIpO1xuXHRcdGdhbWVpbmdVSV9zY3JpcHQuUmVzZXRVSV8oKVxuXHRcdFxuXHRcdFxuXHRcdFx0dmFyIGdhbWViZWZvcmVVSSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxuXHRcdFx0ICAgIGlmKHRoaXMucm9vbXN0YXRlPT1Sb29tU3RhdGUuUk9PTV9QTEFZSU5HKXsvL+a4uOaIj+S4rVxuXHRcdFx0XHQgICAgZ2FtZWJlZm9yZVVJLmFjdGl2ZT1mYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0ICAgICAgICBnYW1lYmVmb3JlVUkuYWN0aXZlID0gdGhpcy5yb29tc3RhdGU9PVJvb21TdGF0ZS5ST09NX1BMQVlJTkc/IGZhbHNlOnRydWVcblx0XHRcdCAgICAgICAgZ2FtZWJlZm9yZVVJLmVtaXQoXCJpbml0XCIpXG5cdFx0XHRcdH1cblx0XHRcblx0XHQgaWYodGhpcy5yb29tc3RhdGU9PVJvb21TdGF0ZS5ST09NX1BMQVlJTkcpey8vIOa4uOaIj+S4rVxuXHRcdCAgIGlmKHR5cGVvZihkYXRhLl9jYXJkcykhPVwidW5kZWZpbmVkXCImJmRhdGEuX2NhcmRzLmxlbmd0aD4wKXsvL+aYvuekuuaJi+eJjFxuXHRcdCAgICAgIGdhbWVpbmdVSV9zY3JpcHQuc2hvd19teWNhcmRzKGRhdGEuX2NhcmRzKTtcblx0XHQgICB9XG5cdFx0ICAgaWYodHlwZW9mKGRhdGEudGhyZWVfY2FyZHMpIT1cInVuZGVmaW5lZFwiJiZkYXRhLnRocmVlX2NhcmRzLmxlbmd0aD4wKXsvL+aYvuekuuWcsOS4u+eJjFxuXHRcdCAgICAgICBnYW1laW5nVUlfc2NyaXB0LnNob3dfYm90dG9tX2NhcmRzKGRhdGEudGhyZWVfY2FyZHMpICBcblx0XHQgICB9XG5cdFx0ICAgaWYodHlwZW9mKGRhdGEuY3VyX3dhaXRjaHVjYXJkKSE9XCJ1bmRlZmluZWRcIil7Ly/lvZPliY3osIHlh7rniYxcblx0XHQgICAgIGdhbWVpbmdVSV9zY3JpcHQubm93X3dob2Nhbl9jaHVwYWkoZGF0YS5jdXJfd2FpdGNodWNhcmQpO1xuXHRcdCAgIH1cblx0XHQgICBpZih0eXBlb2YoZGF0YS5sYXN0X3B1c2hfY2FyZF9hY2NvdW50aWQpIT1cInVuZGVmaW5lZFwiKXsvL+S4iuasoeWHuueahOmdnuepuueJjFxuXHRcdFx0ICAgZ2FtZWluZ1VJX3NjcmlwdC5zaG93X2NodXBhaSh7XCJhY2NvdW50aWRcIjpkYXRhLmxhc3RfcHVzaF9jYXJkX2FjY291bnRpZCxcImNhcmRzXCI6ZGF0YS5sYXN0X3B1c2hfY2FyZF9saXN0fSk7XG5cdFx0ICAgfVxuXHRcdCAgIFxuXHRcdCAgfVxuXHRcdCAgIFxuXHRcdCAgIFxuXHR9LFxuXHRcblx0cmV0dXJuYmFjaygpey8v6L+U5Zue5LiK5LiA6aG1XG5cdFx0XG5cdFx0XG5cdFx0Ly9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcblx0XHRcblx0XHRpZih0aGlzLnJvb21zdGF0ZT49Um9vbVN0YXRlLlJPT01fR0FNRVNUQVJUKXtcblx0XHRcdCBBbGVydC5zaG93KFwi5ri45oiP6L+b6KGM5LitLOehruWumuemu+W8gOWQl1wiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCB0aGlzLmxlYXZlcm9vbSgpXG5cdFx0XHQgfS5iaW5kKHRoaXMpKTsgXG5cdFx0fWVsc2V7XG5cdFx0Ly8gXHQvL+emu+W8gOaIv+mXtFxuXHRcdCBcdHRoaXMubGVhdmVyb29tKCk7XG5cdFx0fVx0XG5cdH0sXG5cdGxlYXZlcm9vbSgpey8vIOemu+W8gOaIv+mXtFxuXHQgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcblx0ICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RMZWF2ZVJvb20oKTtcblx0fSxcblx0Ly8gb25Mb2FkKCl7XG5cdFx0XG5cdC8vIH0sXG5cdG9uRGVzdHJveSgpe1xuXHQgICBteWdsb2JhbC5zb2NrZXQuX2V2ZW50LnJlbW92ZUFsbExpc3RlcigpO1x0XG5cdH0sXG4gICAgb25Mb2FkICgpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuICAgICAgICB0aGlzLnBsYXllck5vZGVMaXN0ID0gW11cblx0XHR0aGlzLnBsYXllcmRhdGFfbGlzdD1bXVxuICAgICAgICB0aGlzLmRpX2xhYmVsLnN0cmluZyA9IFwi5bqVOlwiICsgIG15Z2xvYmFsLnBsYXllckRhdGEuYm90dG9tXG4gICAgICAgIHRoaXMuYmVpc2h1X2xhYmVsLnN0cmluZyA9IFwi5YCN5pWwOlwiICsgbXlnbG9iYWwucGxheWVyRGF0YS5yYXRlXG4gICAgICAgIHRoaXMucm9vbXN0YXRlID0gUm9vbVN0YXRlLlJPT01fSU5WQUxJRFxuICAgICAgICAvL+ebkeWQrO+8jOe7meWFtuS7lueOqeWutuWPkeeJjCjlhoXpg6jkuovku7YpXG4gICAgICAgIHRoaXMubm9kZS5vbihcInB1c2hjYXJkX290aGVyX2V2ZW50XCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZXNjZW5lIHB1c2hjYXJkX290aGVyX2V2ZW50XCIpXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoYXQucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhhdC5wbGF5ZXJOb2RlTGlzdFtpXVxuICAgICAgICAgICAgICAgICAgICBpZihub2RlKXtcbiAgICAgICAgICAgICAgICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmVtaXQoXCJwdXNoX2NhcmRfZXZlbnRcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgLy/nm5HlkKzmiL/pl7TnirbmgIHmlLnlj5jkuovku7ZcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uUm9vbUNoYW5nZVN0YXRlKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgLy/lm57osIPnmoTlh73mlbDlj4LmlbDmmK/ov5vlhaXmiL/pl7TnlKjmiLfmtojmga9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25Sb29tQ2hhbmdlU3RhdGU6XCIrZGF0YSlcbiAgICAgICAgICAgIHRoYXQucm9vbXN0YXRlID0gZGF0YVxuXHRcdFx0aWYodGhhdC5yb29tc3RhdGU9PVJvb21TdGF0ZS5ST09NX0lOVkFMSUQpey8vXG5cdFx0XHQvL+mHjee9rua4uOaIj1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIuacjeWKoeWZqCDph43nva4g5ri45oiPXCIpO1xuXHRcdFx0XHQvL3ZhciBnYW1lYmVmb3JlX25vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIilcblx0XHRcdFx0dGhhdC5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpLmdldENvbXBvbmVudChcImdhbWVpbmdVSVwiKS5SZXNldFVJXygpXG5cblx0XHRcdFx0Ly9nYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcblx0XHRcdFx0XG5cdFx0XHR9XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblx0XHRcblx0XHRteWdsb2JhbC5zb2NrZXQub25QbGF5ZXJEaXNjb25uZWN0KGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coXCJvblBsYXllckRpc2Nvbm5lY3Qg546p5a6256a75byA5oi/6Ze0OlwiK2RhdGEuYWNjb3VudGlkK1wiIFwiKSAvL+afkOS4queOqeWutuemu+W8gOaIv+mXtFxuXHRcdFx0VG9hc3Quc2hvdyhkYXRhLmFjY291bnRpZCtcIiDnprvlvIDmiL/pl7RcIik7XG5cdFxuXHRcdFx0dGhhdC5kZWxldGVQbGF5ZXJOb2RlKGRhdGEpO1xuXHQgICAgICAgIGlmKGRhdGEuYWNjb3VudGlkPT1teWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwi5oKo6KKr6Lii5Ye65oi/6Ze0XCIpXG5cdFx0XHRcdGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhhbGxTY2VuZVwiKVxuXHRcdFx0fVx0XHRcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdG15Z2xvYmFsLnNvY2tldC5vblBsYXllckRpc29ubGluZShmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKFwib25QbGF5ZXJEaXNvbmxpbmUg546p5a625o6J57q/OlwiK2RhdGEuYWNjb3VudGlkK1wiIFwiKSAvL+afkOS4queOqeWutiDmuLjmiI/kuK3mjonnur9cblx0XHRcdHRoYXQub2ZmbGluZVBsYXllck5vZGUoZGF0YSk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRteWdsb2JhbC5zb2NrZXQub25QbGF5ZXJSZW9ubGluZShmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKFwib25QbGF5ZXJSZW9ubGluZSDnjqnlrrbph43mlrDov57mjqXmiJDlip86XCIrZGF0YS5hY2NvdW50aWQrXCIgXCIpIC8v5p+Q5Liq546p5a62IOa4uOaIj+S4reaOiee6v+mHjei/nuaIkOWKn+mAmuefpVxuXHRcdFx0dGhhdC5vbmxpbmVQbGF5ZXJOb2RlKGRhdGEpO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XG5cdCAgXG5cdFx0IFxuXHRcdCBcbiAgICAgICAgLy9cblx0XHRteWdsb2JhbC5zb2NrZXQub25Tb2NrZXRDbG9zZWQoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2xvc2VkOlwiK2RhdGEpXG5cdFx0XHQgQWxlcnQuc2hvdyhcIuaCqOaOiee6v+WVpizor7fph43mlrDnmbvlvZUhXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImxvZ2luU2NlbmVcIik7XG5cdFx0XHRcdCByZXR1cm47XG5cdFx0XHRcdCAvLyBpZih0aGlzLnJvb21zdGF0ZSE9Um9vbVN0YXRlLlJPT01fUExBWUlORyl7XG5cdFx0XHRcdCAvLyBcdFx0ICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJsb2dpblNjZW5lXCIpO1xuXHRcdFx0XHQgLy8gXHRcdCAgcmV0dXJuO1xuXHRcdFx0XHQgLy8gfVxuXHRcdFx0XHQgXHRcblx0XHRcdFx0IC8vIHZhciBub2RlPXRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWVpbmdVSVwiKS5nZXRDb21wb25lbnQoXCJnYW1laW5nVUlcIik7XG5cdFx0XHRcdCAvLyBcdG5vZGUucmV0dXJucm9vbS5hY3RpdmU9dHJ1ZTtcblx0XHRcdFx0IFx0XG5cdFx0XHRcdCBcdFxuXHRcdFx0XHQgfSxmYWxzZSk7XG5cdFx0XHRcdCBcblx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0XG5cdFx0bXlnbG9iYWwuc29ja2V0Lm9uTm90TG9naW5lZChmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKFwi5oKo5pyq55m75b2VIVwiKVxuXHRcdFx0QWxlcnQuc2hvdyhcIuaCqOacqueZu+W9lSzor7fph43mlrDnmbvlvZUhXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0Y2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibG9naW5TY2VuZVwiKTtcblx0XHRcdH0pXG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdFxuXHRcdFxuXHRcblx0XHRcblx0XHRcblx0XHR0aGlzLm5vZGUub24oXCJvbkNhbkNodUNhcmRfZ2FtZVNjZW5lXCIsZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZyhcIuetieW+heeOqeWutuWHuueJjCBcIixKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cdFx0XHQvL+mAmuefpSDlj6/ku6Xlh7rniYxcblx0XHRcdGZvcih2YXIgaT0wO2k8dGhhdC5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdCAgICB2YXIgbm9kZSA9IHRoYXQucGxheWVyTm9kZUxpc3RbaV1cblx0XHRcdCAgICBpZihub2RlKXtcblx0XHRcdFx0XHRub2RlLmVtaXQoXCJvbkNhbkNodUNhcmRfcGxheWVybm9kZVwiLGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2Fucm9iX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYW1lc2NlbmUgY2Fucm9iX2V2ZW50OlwiK2V2ZW50KVxuICAgICAgICAgICAgLy/pgJrnn6Xnu5lwbGF5ZXJub2Rl5a2Q6IqC54K5XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoYXQucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGF0LnBsYXllck5vZGVMaXN0W2ldXG4gICAgICAgICAgICAgICAgaWYobm9kZSl7XG4gICAgICAgICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxuICAgICAgICAgICAgICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NhbnJvYl9ldmVudFwiLGV2ZW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXHRcdFxuXG4gICAgICAgIHRoaXMubm9kZS5vbihcImNob29zZV9jYXJkX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLWNob29zZV9jYXJkX2V2ZW50LS0tLS0tLS0tLS1cIilcbiAgICAgICAgICAgIHZhciBnYW1ldWlfbm9kZSA9ICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIilcbiAgICAgICAgICAgIGlmKGdhbWV1aV9ub2RlPT1udWxsKXtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGNoaWxkZXIgbmFtZSBnYW1laW5nVUlcIilcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2FtZXVpX25vZGUuZW1pdChcImNob29zZV9jYXJkX2V2ZW50XCIsZXZlbnQpXG4gICAgICAgICAgIFxuICAgICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS11bmNob29zZV9jYXJkX2V2ZW50LS0tLS0tLS0tLS1cIilcbiAgICAgICAgICAgIHZhciBnYW1ldWlfbm9kZSA9ICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIilcbiAgICAgICAgICAgIGlmKGdhbWV1aV9ub2RlPT1udWxsKXtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGNoaWxkZXIgbmFtZSBnYW1laW5nVUlcIilcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2FtZXVpX25vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIixldmVudClcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAvL+ebkeWQrOe7meeOqeWutua3u+WKoOS4ieW8oOW6leeJjFxuICAgICAgICAvLyB0aGlzLm5vZGUub24oXCJhZGRfdGhyZWVfY2FyZFwiLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiYWRkX3RocmVlX2NhcmQ6XCIrZXZlbnQpXG4gICAgICAgIC8vICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgIC8vICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXG4gICAgICAgIC8vICAgICAgICAgaWYobm9kZSl7XG4gICAgICAgIC8vICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxuICAgICAgICAvLyAgICAgICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2FkZF90aHJlZV9jYXJkXCIsZXZlbnQpXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfZW50ZXJfcm9vbSh7fSxmdW5jdGlvbihlcnIscmVzdWx0KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJfcm9vbV9yZXNwXCIrIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpXG4gICAgICAgICAgICBpZihlcnIhPTApe1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbnRlcl9yb29tX3Jlc3AgZXJyOlwiK2VycilcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VudGVyX3Jvb23miJDlip9cbiAgICAgICAgICAgICAgLy9ub3RpZnkgPXtcInNlYXRpZFwiOjEsXCJwbGF5ZXJkYXRhXCI6W3tcImFjY291bnRpZFwiOlwiMjExNzgzNlwiLFwibmlja19uYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XX1cbiAgICAgICAgICAgICAgICB2YXIgc2VhdGlkID0gcmVzdWx0LnNlYXRpbmRleCAvL+iHquW3seWcqOaIv+mXtOmHjOeahHNlYXRpZFxuICAgICAgICAgICAgICAgIHRoYXQucGxheWVyZGF0YV9saXN0X3BvcyA9IFtdICAvLzPkuKrnlKjmiLfliJvlu7rkuIDkuKrnqbrnlKjmiLfliJfooahcbiAgICAgICAgICAgICAgICAvL3RoaXMuc2V0UGxheWVyU2VhdFBvcyhzZWF0aWQpXG5cbiAgICAgICAgICAgICAgICB2YXIgcGxheWVyZGF0YV9saXN0ID0gcmVzdWx0LnBsYXllcmRhdGFcbiAgICAgICAgICAgICAgICB2YXIgcm9vbWlkID0gcmVzdWx0LnJvb21pZFxuXHRcdFx0XHR0aGF0LnJvb21pZD1yZXN1bHQucm9vbWlkXG4gICAgICAgICAgICAgICAgdGhhdC5yb29taWRfbGFiZWwuc3RyaW5nID0gXCLmiL/pl7Tlj7c6XCIgKyByb29taWRcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQgPSByZXN1bHQuaG91c2VtYW5hZ2VpZFxuICAgICAgICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuc2VhdF9pbmRleD1zZWF0aWQ7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxwbGF5ZXJkYXRhX2xpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sLmxvZyhcInRoaXMtLS0tXCIrdGhpcylcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5hZGRQbGF5ZXJOb2RlKHBsYXllcmRhdGFfbGlzdFtpXSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihpc29wZW5fc291bmQpe1xuICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsKClcbiAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL2JnLm1wM1wiKSx0cnVlKSBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIC8vIHZhciBnYW1lYmVmb3JlX25vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1lYmVmb3JlVUlcIilcbiAgICAgICAgICAgIC8vZ2FtZWJlZm9yZV9ub2RlLmVtaXQoXCJpbml0XCIpXG5cdFx0XHRcblx0XHRcdC8vdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpLmdldENvbXBvbmVudChcImdhbWVpbmdVSVwiKS5SZXNldFVJXygpXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0dGhhdC5yZWNvdmVyeV9nYW1lKCk7XG5cdFx0XHRcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC8v5Zyo6L+b5YWl5oi/6Ze05ZCO77yM5rOo5YaM5YW25LuW546p5a626L+b5YWl5oi/6Ze055qE5LqL5Lu2XG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vblBsYXllckpvaW5Sb29tKGZ1bmN0aW9uKGpvaW5fcGxheWVyZGF0YSl7XG4gICAgICAgICAgICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvblBsYXllckpvaW5Sb29tOlwiK0pTT04uc3RyaW5naWZ5KGpvaW5fcGxheWVyZGF0YSkpXG4gICAgICAgICAgICBUb2FzdC5zaG93KGpvaW5fcGxheWVyZGF0YS5hY2NvdW50aWQrXCIg6L+b5YWl5oi/6Ze0XCIpO1xuXHRcdFx0dGhhdC5hZGRQbGF5ZXJOb2RlKGpvaW5fcGxheWVyZGF0YSlcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICBcbiAgICAgICAgLy/lm57osIPlj4LmlbDmmK/lj5HpgIHlh4blpIfmtojmga/nmoRhY2NvdW50aWRcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uUGxheWVyUmVhZHkoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS1vblBsYXllclJlYWR5OlwiK2RhdGEpXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoYXQucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGF0LnBsYXllck5vZGVMaXN0W2ldXG4gICAgICAgICAgICAgICAgaWYobm9kZSl7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcl9yZWFkeV9ub3RpZnlcIixkYXRhKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25HYW1lU3RhcnQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhhdC5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoYXQucGxheWVyTm9kZUxpc3RbaV1cbiAgICAgICAgICAgICAgICBpZihub2RlKXtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8v6ZqQ6JePZ2FtZWJlZm9yZVVJ6IqC54K5XG4gICAgICAgIHZhciBnYW1lYmVmb3JlVUkgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1lYmVmb3JlVUlcIilcbiAgICAgICAgICAgIGlmKGdhbWViZWZvcmVVSSl7XG4gICAgICAgICAgICAgICAgZ2FtZWJlZm9yZVVJLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICAgICAgICAvL+ebkeWQrOacjeWKoeWZqOeOqeWutuaKouWcsOS4u+a2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25Sb2JTdGF0ZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLW9uUm9iU3RhdGVcIitKU09OLnN0cmluZ2lmeShldmVudCkpXG4gICAgICAgICAgICAgICAgLy9vblJvYlN0YXRle1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGF0LnBsYXllck5vZGVMaXN0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoYXQucGxheWVyTm9kZUxpc3RbaV1cbiAgICAgICAgICAgICAgICAgICAgaWYobm9kZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsZXZlbnQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICAvL+azqOWGjOebkeWQrOacjeWKoeWZqOehruWumuWcsOS4u+a2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VNYXN0ZXIoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbkNoYW5nZU1hc3RlclwiK2V2ZW50KVxuICAgICAgICAgICAgLy/kv53lrZjkuIDkuIvlnLDkuLtpZFxuICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5tYXN0ZXJfYWNjb3VudGlkID0gZXZlbnRcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhhdC5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoYXQucGxheWVyTm9kZUxpc3RbaV1cbiAgICAgICAgICAgICAgICBpZihub2RlKXtcbiAgICAgICAgICAgICAgICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfY2hhbmdlbWFzdGVyX2V2ZW50XCIsZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgIFxuICAgICAgICAvL+azqOWGjOebkeWQrOacjeWKoeWZqOaYvuekuuW6leeJjOa2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25TaG93Qm90dG9tQ2FyZChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwib25TaG93Qm90dG9tQ2FyZC0tLS0tLS0tLVwiK2V2ZW50KVxuICAgICAgICAgICB2YXIgZ2FtZXVpX25vZGUgPSAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpXG4gICAgICAgICAgIGlmKGdhbWV1aV9ub2RlPT1udWxsKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY2hpbGRlciBuYW1lIGdhbWVpbmdVSVwiKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgfVxuICAgICAgICAgICBnYW1ldWlfbm9kZS5lbWl0KFwic2hvd19ib3R0b21fY2FyZF9ldmVudFwiLGV2ZW50KVxuICAgICAgICB9LmJpbmQodGhpcykpXG5cdFx0XG5cdFx0Ly/mm7TmlrDnjqnlrrbliIbmlbBcblx0XHRteWdsb2JhbC5zb2NrZXQub25VcGRhdGVpbmZvKGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFxuXHRcdFx0Zm9yKHZhciBpPTA7aTwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdFx0dGhpcy5wbGF5ZXJOb2RlTGlzdFtpXS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKS51cGRhdGVHb2xkKGV2ZW50LmluZm9saXN0KVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcblx0XHRcbiAgICB9LFxuXG4gICAgLy9zZWF0X2luZGV46Ieq5bex5Zyo5oi/6Ze055qE5L2N572uaWRcbiAgICAvLyBzZXRQbGF5ZXJTZWF0UG9zKHNlYXRfaW5kZXgpe1xuICAgIC8vICAgICBpZihzZWF0X2luZGV4IDwgMSB8fCBzZWF0X2luZGV4ID4gMyl7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcInNlYXRfaW5kZXggZXJyb3JcIitzZWF0X2luZGV4KVxuICAgIC8vICAgICAgICAgcmV0dXJuXG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcInNldFBsYXllclNlYXRQb3Mgc2VhdF9pbmRleDpcIiArIHNlYXRfaW5kZXgpXG4gICAgICAgXG4gICAgLy8gICAgIC8v55WM6Z2i5L2N572u6L2s5YyW5oiQ6YC76L6R5L2N572uXG4gICAgLy8gICAgIHN3aXRjaChzZWF0X2luZGV4KXtcbiAgICAvLyAgICAgICAgIGNhc2UgMTpcbiAgICAvLyAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAwXG4gICAgLy8gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMSBcbiAgICAvLyAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbM10gPSAyXG4gICAgLy8gICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgIFxuXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1syXSA9IDBcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzNdID0gMVxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAyXG4gICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICAgY2FzZSAzOlxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbM10gPSAwICAgICBcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMVxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAyXG4gICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICBkZWZhdWx0OiBcbiAgICAvLyAgICAgICAgICAgYnJlYWsgICAgICBcbiAgICAvLyAgICAgfSBcblxuICAgIC8vIH0sXG5cbiAgICBhZGRQbGF5ZXJOb2RlKHBsYXllcl9kYXRhKXtcbiAgICAgICAgdmFyIHBsYXllcm5vZGVfaW5zdCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyX25vZGVfcHJlZmFicylcbiAgICAgICAgcGxheWVybm9kZV9pbnN0LnBhcmVudCA9IHRoaXMubm9kZVxuICAgICAgXG4gICAgICAgICBcbiAgICAgICAgLy/njqnlrrblnKhyb29t6YeM55qE5L2N572u57Si5byVKOmAu+i+keS9jee9rilcbiAgICAgICAgdmFyIGluZGV4ID0gKHBsYXllcl9kYXRhLnNlYXRpbmRleCszLW15Z2xvYmFsLnBsYXllckRhdGEuc2VhdF9pbmRleCklMzsvLyAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zW3BsYXllcl9kYXRhLnNlYXRpbmRleF1cbiAgICAgICAgY29uc29sZS5sb2coXCLmiJHluqfkvY3lj7dcIitteWdsb2JhbC5wbGF5ZXJEYXRhLnNlYXRfaW5kZXgrXCIgLOeOqeWutuW6p+S9jeWPt1wiK3BsYXllcl9kYXRhLnNlYXRpbmRleCsgXCIgXCIraW5kZXgpXG4gICAgICAgIHBsYXllcm5vZGVfaW5zdC5wb3NpdGlvbiA9IHRoaXMucGxheWVyc19zZWF0X3Bvcy5jaGlsZHJlbltpbmRleF0ucG9zaXRpb25cbiAgICAgICAgcGxheWVybm9kZV9pbnN0LmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmluaXRfZGF0YShwbGF5ZXJfZGF0YSxpbmRleClcblx0XHQvL+WIm+W7uueahOiKgueCueWtmOWCqOWcqGdhbWVzY2VuZeeahOWIl+ihqOS4rVxuXHRcdHRoaXMucGxheWVyTm9kZUxpc3QucHVzaChwbGF5ZXJub2RlX2luc3QpXG4gICAgfSxcblx0ZGVsZXRlUGxheWVyTm9kZShwKXsvL+afkOS4queOqeWutiDnprvlvIDmiL/pl7Rcblx0XHQgLy8gY29uc3QgX3RoaXM9dGhpcztcblx0ICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDtpKyspe1xuXHRcdFx0ICBjb25zb2xlLmxvZyhcImlzIGRlbGV0ZSBcIit0aGlzLnBsYXllck5vZGVMaXN0W2ldLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmFjY291bnRpZCtcIjpcIitwLmFjY291bnRpZCk7XG5cdFx0XHQgIGlmKHRoaXMucGxheWVyTm9kZUxpc3RbaV0uZ2V0Q29tcG9uZW50KFwicGxheWVyX25vZGVcIikuYWNjb3VudGlkPT1wLmFjY291bnRpZCl7XG5cdFx0XHRcdCAgY29uc29sZS5sb2coXCJkZWxldGUgXCIraStcIjpcIitwLmFjY291bnRpZCk7XG5cdFx0XHRcdCAgICAgIHZhciBqPWk7XG5cdFx0XHRcdFx0ICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ICAgICAgICB0aGlzLnBsYXllck5vZGVMaXN0W2pdLnJlbW92ZUZyb21QYXJlbnQoKTtcblx0XHRcdFx0ICAgICAgICB0aGlzLnBsYXllck5vZGVMaXN0W2pdLmRlc3Ryb3koKTtcblx0XHRcdFx0ICAgICAgICAvLyBkZWxldGUoX3RoaXMucGxheWVyTm9kZUxpc3Rbal0pO1xuXHRcdFx0XHRcdFx0Ly90aGlzLnBsYXllck5vZGVMaXN0W2pdLnJlbW92ZUxpc3RlbmVyKCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBsYXllck5vZGVMaXN0LnNwbGljZShqLDEpO1xuXHRcdFx0XHQgICAgICAvLyB9LmJpbmQodGhpcyksMTAwKTtcblx0XHRcdFx0ICBcblx0XHRcdCAgfVxuXHRcdCAgfVxuXHRcdFxuXHR9LFxuXHRnZXRQbGF5ZXJOb2RlQnlBY2NvdW50aWQoYWNjb3VudGlkKXtcblx0XHRjb25zdCBfdGhpcz10aGlzO1xuXHRcdGZvcih2YXIgaT0wO2k8X3RoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XG5cdFx0XHRcdFx0Ly8gIGNvbnNvbGUubG9nKFwiaXMgZGVsZXRlIFwiK190aGlzLnBsYXllck5vZGVMaXN0W2ldLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmFjY291bnRpZCtcIjpcIithY2NvdW50aWQpO1xuXHRcdCAgICBpZihfdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKS5hY2NvdW50aWQ9PWFjY291bnRpZCl7XG5cdFx0XHRcdHJldHVybiBfdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdG9mZmxpbmVQbGF5ZXJOb2RlKHApey8v5p+Q5Liq546p5a62IOa4uOaIj+S4reaOiee6v1xuXHRcdGNvbnN0IF90aGlzPXRoaXM7XG5cdFx0IHZhciBub2RlPSBfdGhpcy5nZXRQbGF5ZXJOb2RlQnlBY2NvdW50aWQocC5hY2NvdW50aWQpO1xuXHRcdCBub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLm9uT2ZmTGluZSgpO1xuXHRcdC8vIGZvcih2YXIgaT0wO2k8X3RoaXMucGxheWVyZGF0YV9saXN0Lmxlbmd0aDtpKyspe1xuXHRcdC8vICAgaWYoX3RoaXMucGxheWVyZGF0YV9saXN0W2ldLmFjY291bnRpZD09cC5hY2NvdW50aWQpe1xuXHRcdC8vIFx0ICBfdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKS5vbk9mZkxpbmUoKTtcblx0XHQvLyAgIH1cblx0XHQvLyB9XG5cdH0sXG5cdG9ubGluZVBsYXllck5vZGUocCl7Ly/mn5DkuKrnjqnlrrYg5ri45oiP5Lit5o6J57q/6YeN5paw6L+e5o6l5oiQ5YqfXG5cdFx0Y29uc3QgX3RoaXM9dGhpcztcblx0XHQvLyBmb3IodmFyIGk9MDtpPF90aGlzLnBsYXllcmRhdGFfbGlzdC5sZW5ndGg7aSsrKXsvL1xuXHRcdC8vICAgaWYoX3RoaXMucGxheWVyZGF0YV9saXN0W2ldLmFjY291bnRpZD09cC5hY2NvdW50aWQpe1xuXHRcdC8vIFx0ICBfdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKS5vbk9uTGluZSgpO1xuXHRcdC8vICAgfVxuXHRcdC8vIH1cblx0XHR2YXIgbm9kZT0gX3RoaXMuZ2V0UGxheWVyTm9kZUJ5QWNjb3VudGlkKHAuYWNjb3VudGlkKTtcblx0XHRub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLm9uT25MaW5lKCk7XG5cdFx0XG5cdFx0aWYocC5hY2NvdW50aWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXsvLyDoh6rlt7Hmjonnur/ph43ov57miJDlip9cblx0XHQgIC8v6I635Y+WIOaJi+eJjCDlkowg5oi/6Ze05pyA5paw54q25oCBICAgXG5cdFx0ICAvL+aJi+eJjCAg5oi/6Ze054q25oCBICDlvZPliY3liLDosIHlh7rniYwsIOS4iuasoeeOqeWutiDlh7rniYzmmK/ku4DkuYggIOWHuueJjOWJqeS9meaXtumXtCAg5Zyw5Li75bqV54mM5piv5LuA5LmIXG5cdFx0XHRjb25zb2xlLmxvZyhcIuaIkemHjei/nuaIkOWKn+S6hlwiKTtcdFxuXHRcdH1cblx0XHRcblx0fSxcbiAgICAvLyBzdGFydCAoKSB7XG4gICAgLy8gfSxcblxuICAgIC8qXG4gICAgIC8v6YCa6L+HYWNjb3VudGlk6I635Y+W55So5oi35Ye654mM5pS+5ZyoZ2FtZXNjZW5k55qE5L2N572uIFxuICAgICDlgZrms5XvvJrlhYjmlL4z5Liq6IqC54K55ZyoZ2FtZWFjZW5l55qE5Zy65pmv5LitY2FyZHNvdXR6b25lKDAxMilcbiAgICAgICAgICAgXG4gICAgKi9cbiAgICBnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudChhY2NvdW50aWQpe1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50IGFjY291bnRpZDpcIithY2NvdW50aWQpXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxuICAgICAgICAgICAgaWYobm9kZSl7XG4gICAgICAgICAgICAgICAgLy/ojrflj5boioLngrnnu5HlrprnmoTnu4Tku7ZcbiAgICAgICAgICAgICAgICB2YXIgbm9kZV9zY3JpcHQgPSBub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpXG4gICAgICAgICAgICAgICAgLy/lpoLmnpxhY2NvdW50aWTlkoxwbGF5ZXJfbm9kZeiKgueCuee7keWumueahGFjY291bnRpZOebuOWQjFxuICAgICAgICAgICAgICAgIC8v5o6l6I635Y+WcGxheWVyX25vZGXnmoTlrZDoioLngrlcbiAgICAgICAgICAgICAgICBpZihub2RlX3NjcmlwdC5hY2NvdW50aWQ9PT1hY2NvdW50aWQpe1xuICAgICAgICAgICAgICAgICAgdmFyIHNlYXRfbm9kZSA9IHRoaXMucGxheWVyc19zZWF0X3Bvcy5jaGlsZHJlbltub2RlX3NjcmlwdC5zZWF0X2luZGV4XVxuICAgICAgICAgICAgICAgICAgdmFyIGluZGV4X25hbWUgPSBcImNhcmRzb3V0em9uZVwiK25vZGVfc2NyaXB0LnNlYXRfaW5kZXhcbiAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCBpbmRleF9uYW1lOlwiK2luZGV4X25hbWUpXG4gICAgICAgICAgICAgICAgICB2YXIgb3V0X2NhcmRfbm9kZSA9IHNlYXRfbm9kZS5nZXRDaGlsZEJ5TmFtZShpbmRleF9uYW1lKVxuICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk91dFpvbmU6XCIrIG91dF9jYXJkX25vZGUubmFtZSlcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvdXRfY2FyZF9ub2RlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxufSk7XG4iXX0=