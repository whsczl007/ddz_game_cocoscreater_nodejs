"use strict";
cc._RF.push(module, '9ce03TvsElJsaLzLDlseCff', 'socket_ctr');
// scripts/data/socket_ctr.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _event_lister = _interopRequireDefault(require("../util/event_lister.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import socketio from "../lib/socket_io.js"
var socketCtr = function socketCtr() {
  var that = {};
  var respone_map = {};
  var call_index = 0;
  that._socket = null;
  var event = (0, _event_lister["default"])({});

  that._sendmsg = function (cmdtype, req, callindex) {
    if (!that._socket.connected) {
      //that.initSocket();
      event.fire("socket_closed_notify", {});
    }

    that._socket.emit("notify", {
      cmd: cmdtype,
      data: req,
      callindex: callindex
    });
  };

  that._request = function (cmdtype, req, callback) {
    console.log("send cmd:" + cmdtype + "  " + JSON.stringify(req));
    call_index++;
    respone_map[call_index] = callback;

    that._sendmsg(cmdtype, req, call_index);
  };

  that.initSocket = function (callback) {
    var opts = {
      'reconnection': true,
      'force new connection': false,
      'transports': ['websocket', 'polling']
    };

    if (that._socket != null) {
      that._socket.close();

      that._socket = null;
    }

    that._socket = window.io.connect(defines.serverUrl, opts); // new WebSocket(defines.serverUrl);// socketio(defines.serverUrl,opts);//  window.io.connect(defines.serverUrl,opts);

    that._socket.on("connection", function () {
      console.log("connect server success!!");

      if (callback) {
        console.log("有回调");
        callback();
      }
    });

    that._socket.on("disconnect", function () {
      console.log("disconnect from server!");
      event.fire("socket_closed_notify", {});
    });

    that._socket.on("notify", function (res) {
      console.log("on notify cmd:" + JSON.stringify(res));

      if (respone_map.hasOwnProperty(res.callBackIndex)) {
        var callback = respone_map[res.callBackIndex];

        if (callback) {
          callback(res.result, res.data);
        }
      } else {
        //if(res.callBackIndex!=0){
        //console.log("not found call index",res.callBackIndex)
        //提交一个监听的事件给监听器
        //  on notify cmd:{"type":"player_joinroom_notify","result":0,"data":
        //  {"accountid":"2586422","nick_name":"tiny110","avatarUrl":
        //  "avatar_3","goldcount":1000,"seatindex":2},"callBackIndex":null}
        //没有找到回到函数，就给事件监听器提交一个事件
        var type = res.type;
        event.fire(type, res.data); // }
      }
    });
  };

  that.request_wxLogin = function (req, callback) {
    that._request("wxlogin", req, callback);
  };

  that.request_creatroom = function (req, callback) {
    that._request("createroom_req", req, callback);
  };

  that.request_jion = function (req, callback) {
    that._request("joinroom_req", req, callback);
  };

  that.request_reset = function (req, callback) {
    that._request("resetroom_req", req, callback);
  };

  that.request_enter_room = function (req, callback) {
    that._request("enterroom_req", req, callback);
  };

  that.request_re_room = function (req, callback) {
    that._request("reroom_req", req, callback);
  };

  that.request_recovery = function (req, callback) {
    // 请求 恢复牌局信息
    that._request("recovery_req", req, callback);
  }; //发送不出牌信息


  that.request_buchu_card = function (req, callback) {
    that._request("chu_bu_card_req", req, callback);
  };
  /*玩家出牌
    需要判断: 
       出的牌是否符合规则
       和上个出牌玩家比较，是否满足条件
   */


  that.request_chu_card = function (req, callback) {
    that._request("chu_card_req", req, callback);
  }; //监听其他玩家进入房间消息


  that.onPlayerJoinRoom = function (callback) {
    event.on("player_joinroom_notify", callback);
  };

  that.onPlayerReady = function (callback) {
    event.on("player_ready_notify", callback);
  };

  that.onGameStart = function (callback) {
    if (callback) {
      event.on("gameStart_notify", callback);
    }
  };

  that.onChangeHouseManage = function (callback) {
    if (callback) {
      event.on("changehousemanage_notify", callback);
    }
  }; //发送ready消息


  that.requestReady = function () {
    that._sendmsg("player_ready_notify", {}, null);
  };

  that.requestLeaveRoom = function () {
    that._sendmsg("player_leave_room", {}, null);
  }; //监听 disconnect 消息  玩家 离开房间


  that.onPlayerDisconnect = function (callback) {
    if (callback) {
      event.on("player_disconnect_notify", callback);
    }
  }; //监听 disonline 消息  玩家 游戏中掉线


  that.onPlayerDisonline = function (callback) {
    if (callback) {
      event.on("player_disonline_notify", callback);
    }
  }; //监听 reonline 消息  玩家 游戏中重新连线


  that.onPlayerReonline = function (callback) {
    if (callback) {
      event.on("player_reonline_notify", callback);
    }
  };

  that.onGameFinish = function (callback) {
    if (callback) {
      event.on("gameFinish_notify", callback); //监听服务端 返回消息
    }
  };

  that.requestStart = function (callback) {
    that._request("player_start_notify", {}, callback);
  }; //玩家通知服务器抢地主消息


  that.requestRobState = function (state) {
    that._sendmsg("player_rob_notify", state, null);
  }; //服务器下发牌通知


  that.onPushCards = function (callback) {
    if (callback) {
      event.on("pushcard_notify", callback);
    }
  }; //监听服务器通知开始抢地主消息


  that.onCanRobState = function (callback) {
    if (callback) {
      event.on("canrob_notify", callback);
    }
  }; //监听服务器:通知谁抢地主操作消息


  that.onRobState = function (callback) {
    if (callback) {
      event.on("canrob_state_notify", callback);
    }
  }; //监听服务器:确定地主消息


  that.onChangeMaster = function (callback) {
    if (callback) {
      event.on("change_master_notify", callback);
    }
  }; //监听服务器:显示底牌消息


  that.onShowBottomCard = function (callback) {
    if (callback) {
      event.on("change_showcard_notify", callback);
    }
  }; //监听服务器:可以出牌消息


  that.onCanChuCard = function (callback) {
    if (callback) {
      event.on("can_chu_card_notify", callback);
    }
  };

  that.onRoomChangeState = function (callback) {
    // 房间状态改变通知
    if (callback) {
      event.on("room_state_notify", callback);
    }
  };

  that.onOtherPlayerChuCard = function (callback) {
    //其它玩家出牌通知
    if (callback) {
      event.on("other_chucard_notify", callback);
    }
  };

  that.onSocketClosed = function (callback) {
    //玩家掉线通知
    if (callback) {
      event.on("socket_closed_notify", callback);
    }
  };

  that.onNotLogined = function (callback) {
    //玩家 未登录 通知
    event.on("not_logined", callback);
  };

  that.onUpdateinfo = function (callback) {
    //玩家 分数更新
    event.on("updateinfo_notify", callback);
  };

  that._event = event;
  return that;
};

var _default = socketCtr;
exports["default"] = _default;
module.exports = exports["default"];

cc._RF.pop();