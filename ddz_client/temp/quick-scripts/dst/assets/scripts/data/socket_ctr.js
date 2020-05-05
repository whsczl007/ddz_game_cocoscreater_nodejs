
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/data/socket_ctr.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2RhdGEvc29ja2V0X2N0ci5qcyJdLCJuYW1lcyI6WyJzb2NrZXRDdHIiLCJ0aGF0IiwicmVzcG9uZV9tYXAiLCJjYWxsX2luZGV4IiwiX3NvY2tldCIsImV2ZW50IiwiX3NlbmRtc2ciLCJjbWR0eXBlIiwicmVxIiwiY2FsbGluZGV4IiwiY29ubmVjdGVkIiwiZmlyZSIsImVtaXQiLCJjbWQiLCJkYXRhIiwiX3JlcXVlc3QiLCJjYWxsYmFjayIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5IiwiaW5pdFNvY2tldCIsIm9wdHMiLCJjbG9zZSIsIndpbmRvdyIsImlvIiwiY29ubmVjdCIsImRlZmluZXMiLCJzZXJ2ZXJVcmwiLCJvbiIsInJlcyIsImhhc093blByb3BlcnR5IiwiY2FsbEJhY2tJbmRleCIsInJlc3VsdCIsInR5cGUiLCJyZXF1ZXN0X3d4TG9naW4iLCJyZXF1ZXN0X2NyZWF0cm9vbSIsInJlcXVlc3RfamlvbiIsInJlcXVlc3RfcmVzZXQiLCJyZXF1ZXN0X2VudGVyX3Jvb20iLCJyZXF1ZXN0X3JlX3Jvb20iLCJyZXF1ZXN0X3JlY292ZXJ5IiwicmVxdWVzdF9idWNodV9jYXJkIiwicmVxdWVzdF9jaHVfY2FyZCIsIm9uUGxheWVySm9pblJvb20iLCJvblBsYXllclJlYWR5Iiwib25HYW1lU3RhcnQiLCJvbkNoYW5nZUhvdXNlTWFuYWdlIiwicmVxdWVzdFJlYWR5IiwicmVxdWVzdExlYXZlUm9vbSIsIm9uUGxheWVyRGlzY29ubmVjdCIsIm9uUGxheWVyRGlzb25saW5lIiwib25QbGF5ZXJSZW9ubGluZSIsIm9uR2FtZUZpbmlzaCIsInJlcXVlc3RTdGFydCIsInJlcXVlc3RSb2JTdGF0ZSIsInN0YXRlIiwib25QdXNoQ2FyZHMiLCJvbkNhblJvYlN0YXRlIiwib25Sb2JTdGF0ZSIsIm9uQ2hhbmdlTWFzdGVyIiwib25TaG93Qm90dG9tQ2FyZCIsIm9uQ2FuQ2h1Q2FyZCIsIm9uUm9vbUNoYW5nZVN0YXRlIiwib25PdGhlclBsYXllckNodUNhcmQiLCJvblNvY2tldENsb3NlZCIsIm9uTm90TG9naW5lZCIsIm9uVXBkYXRlaW5mbyIsIl9ldmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7QUFDQSxJQUFJQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxHQUFVO0FBQ3RCLE1BQUlDLElBQUksR0FBRyxFQUFYO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsTUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBRUFGLEVBQUFBLElBQUksQ0FBQ0csT0FBTCxHQUFlLElBQWY7QUFDQSxNQUFJQyxLQUFLLEdBQUcsOEJBQVksRUFBWixDQUFaOztBQUNDSixFQUFBQSxJQUFJLENBQUNLLFFBQUwsR0FBZ0IsVUFBU0MsT0FBVCxFQUFpQkMsR0FBakIsRUFBcUJDLFNBQXJCLEVBQStCO0FBQy9DLFFBQUcsQ0FBQ1IsSUFBSSxDQUFDRyxPQUFMLENBQWFNLFNBQWpCLEVBQTJCO0FBQzdCO0FBQ0FMLE1BQUFBLEtBQUssQ0FBQ00sSUFBTixDQUFXLHNCQUFYLEVBQWtDLEVBQWxDO0FBQ0E7O0FBQ0tWLElBQUFBLElBQUksQ0FBQ0csT0FBTCxDQUFhUSxJQUFiLENBQWtCLFFBQWxCLEVBQTJCO0FBQUNDLE1BQUFBLEdBQUcsRUFBQ04sT0FBTDtBQUFhTyxNQUFBQSxJQUFJLEVBQUNOLEdBQWxCO0FBQXNCQyxNQUFBQSxTQUFTLEVBQUNBO0FBQWhDLEtBQTNCO0FBQ0gsR0FOQTs7QUFRQVIsRUFBQUEsSUFBSSxDQUFDYyxRQUFMLEdBQWdCLFVBQVNSLE9BQVQsRUFBaUJDLEdBQWpCLEVBQXFCUSxRQUFyQixFQUE4QjtBQUMzQ0MsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWVgsT0FBWixHQUFvQixJQUFwQixHQUEwQlksSUFBSSxDQUFDQyxTQUFMLENBQWVaLEdBQWYsQ0FBdEM7QUFDQUwsSUFBQUEsVUFBVTtBQUNWRCxJQUFBQSxXQUFXLENBQUNDLFVBQUQsQ0FB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eUIsVUFBUy9DLFFBQVQsRUFBa0I7QUFBRTtBQUN6QyxRQUFHQSxRQUFILEVBQVk7QUFDUlgsTUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFTLG1CQUFULEVBQTZCYixRQUE3QjtBQUNIO0FBQ0osR0FKRDs7QUFNQWYsRUFBQUEsSUFBSSxDQUFDK0Qsb0JBQUwsR0FBNEIsVUFBU2hELFFBQVQsRUFBa0I7QUFBQztBQUMzQyxRQUFHQSxRQUFILEVBQVk7QUFDUlgsTUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFTLHNCQUFULEVBQWdDYixRQUFoQztBQUNIO0FBQ0osR0FKRDs7QUFNSGYsRUFBQUEsSUFBSSxDQUFDZ0UsY0FBTCxHQUFvQixVQUFTakQsUUFBVCxFQUFrQjtBQUFFO0FBQ3ZDLFFBQUdBLFFBQUgsRUFBWTtBQUNSWCxNQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVMsc0JBQVQsRUFBZ0NiLFFBQWhDO0FBQ0g7QUFDRCxHQUpEOztBQUtBZixFQUFBQSxJQUFJLENBQUNpRSxZQUFMLEdBQWtCLFVBQVNsRCxRQUFULEVBQWtCO0FBQUM7QUFDbENYLElBQUFBLEtBQUssQ0FBQ3dCLEVBQU4sQ0FBUyxhQUFULEVBQXVCYixRQUF2QjtBQUNGLEdBRkQ7O0FBSUFmLEVBQUFBLElBQUksQ0FBQ2tFLFlBQUwsR0FBa0IsVUFBU25ELFFBQVQsRUFBa0I7QUFBQztBQUNwQ1gsSUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFTLG1CQUFULEVBQTZCYixRQUE3QjtBQUNBLEdBRkQ7O0FBR0FmLEVBQUFBLElBQUksQ0FBQ21FLE1BQUwsR0FBWS9ELEtBQVo7QUFFRyxTQUFPSixJQUFQO0FBQ0gsQ0FsUEQ7O2VBb1BlRCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50bGlzdGVyIGZyb20gXCIuLi91dGlsL2V2ZW50X2xpc3Rlci5qc1wiXG4vLyBpbXBvcnQgc29ja2V0aW8gZnJvbSBcIi4uL2xpYi9zb2NrZXRfaW8uanNcIlxudmFyIHNvY2tldEN0ciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRoYXQgPSB7fVxuICAgIHZhciByZXNwb25lX21hcCA9IHt9IFxuICAgIHZhciBjYWxsX2luZGV4ID0gMFxuXG4gICAgdGhhdC5fc29ja2V0ID0gbnVsbFxuICAgIHZhciBldmVudCA9IGV2ZW50bGlzdGVyKHt9KVxuICAgICB0aGF0Ll9zZW5kbXNnID0gZnVuY3Rpb24oY21kdHlwZSxyZXEsY2FsbGluZGV4KXtcblx0ICAgIGlmKCF0aGF0Ll9zb2NrZXQuY29ubmVjdGVkKXtcblx0XHRcdC8vdGhhdC5pbml0U29ja2V0KCk7XG5cdFx0XHRldmVudC5maXJlKFwic29ja2V0X2Nsb3NlZF9ub3RpZnlcIix7fSk7XG5cdFx0fVxuICAgICAgICB0aGF0Ll9zb2NrZXQuZW1pdChcIm5vdGlmeVwiLHtjbWQ6Y21kdHlwZSxkYXRhOnJlcSxjYWxsaW5kZXg6Y2FsbGluZGV4fSlcbiAgICB9IFxuIFxuICAgICB0aGF0Ll9yZXF1ZXN0ID0gZnVuY3Rpb24oY21kdHlwZSxyZXEsY2FsbGJhY2spe1xuICAgICAgICBjb25zb2xlLmxvZyhcInNlbmQgY21kOlwiK2NtZHR5cGUrXCIgIFwiKyBKU09OLnN0cmluZ2lmeShyZXEpKVxuICAgICAgICBjYWxsX2luZGV4KysgXG4gICAgICAgIHJlc3BvbmVfbWFwW2NhbGxfaW5kZXhdID0gY2FsbGJhY2tcbiAgICAgICAgdGhhdC5fc2VuZG1zZyhjbWR0eXBlLHJlcSxjYWxsX2luZGV4KVxuICAgIH0gXG4gIFxuICAgICAgICBcbiAgICB0aGF0LmluaXRTb2NrZXQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgJ3JlY29ubmVjdGlvbic6dHJ1ZSxcbiAgICAgICAgICAgICdmb3JjZSBuZXcgY29ubmVjdGlvbic6IGZhbHNlLFxuICAgICAgICAgICAgJ3RyYW5zcG9ydHMnOlsnd2Vic29ja2V0JywgJ3BvbGxpbmcnXVxuICAgICAgICB9XG5cdFx0aWYodGhhdC5fc29ja2V0IT1udWxsKXtcblx0XHRcdHRoYXQuX3NvY2tldC5jbG9zZSgpO1xuXHRcdFx0dGhhdC5fc29ja2V0PW51bGw7XG5cdFx0fVxuICAgICAgICB0aGF0Ll9zb2NrZXQgPSB3aW5kb3cuaW8uY29ubmVjdChkZWZpbmVzLnNlcnZlclVybCxvcHRzKTsvLyBuZXcgV2ViU29ja2V0KGRlZmluZXMuc2VydmVyVXJsKTsvLyBzb2NrZXRpbyhkZWZpbmVzLnNlcnZlclVybCxvcHRzKTsvLyAgd2luZG93LmlvLmNvbm5lY3QoZGVmaW5lcy5zZXJ2ZXJVcmwsb3B0cyk7XG5cbiAgICAgICAgdGhhdC5fc29ja2V0Lm9uKFwiY29ubmVjdGlvblwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3Qgc2VydmVyIHN1Y2Nlc3MhIVwiKVxuXHRcdFx0aWYoY2FsbGJhY2spe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIuacieWbnuiwg1wiKVxuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fVxuICAgICAgICAgIH0pXG5cdFx0dGhhdC5fc29ja2V0Lm9uKFwiZGlzY29ubmVjdFwiLGZ1bmN0aW9uKCl7XG5cdFx0XHRjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3QgZnJvbSBzZXJ2ZXIhXCIpXG5cdFx0XHQgZXZlbnQuZmlyZShcInNvY2tldF9jbG9zZWRfbm90aWZ5XCIse30pO1xuXHRcdH0pXG5cdFx0XG5cbiAgICAgICB0aGF0Ll9zb2NrZXQub24oXCJub3RpZnlcIixmdW5jdGlvbihyZXMpe1xuICAgICAgICAgY29uc29sZS5sb2coXCJvbiBub3RpZnkgY21kOlwiICsgSlNPTi5zdHJpbmdpZnkocmVzKSlcbiAgICAgICAgIGlmKHJlc3BvbmVfbWFwLmhhc093blByb3BlcnR5KHJlcy5jYWxsQmFja0luZGV4KSl7XG4gICAgICAgICAgIHZhciBjYWxsYmFjayA9IHJlc3BvbmVfbWFwW3Jlcy5jYWxsQmFja0luZGV4XVxuICAgICAgICAgICBpZihjYWxsYmFjayl7XG4gICAgICAgICAgICAgICBjYWxsYmFjayhyZXMucmVzdWx0LHJlcy5kYXRhKVxuICAgICAgICAgICB9XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIC8vaWYocmVzLmNhbGxCYWNrSW5kZXghPTApe1xuICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibm90IGZvdW5kIGNhbGwgaW5kZXhcIixyZXMuY2FsbEJhY2tJbmRleClcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAvL+aPkOS6pOS4gOS4quebkeWQrOeahOS6i+S7tue7meebkeWQrOWZqFxuICAgICAgICAvLyAgb24gbm90aWZ5IGNtZDp7XCJ0eXBlXCI6XCJwbGF5ZXJfam9pbnJvb21fbm90aWZ5XCIsXCJyZXN1bHRcIjowLFwiZGF0YVwiOlxuICAgICAgICAvLyAge1wiYWNjb3VudGlkXCI6XCIyNTg2NDIyXCIsXCJuaWNrX25hbWVcIjpcInRpbnkxMTBcIixcImF2YXRhclVybFwiOlxuICAgICAgICAvLyAgXCJhdmF0YXJfM1wiLFwiZ29sZGNvdW50XCI6MTAwMCxcInNlYXRpbmRleFwiOjJ9LFwiY2FsbEJhY2tJbmRleFwiOm51bGx9XG4gICAgICAgICAgICAgIC8v5rKh5pyJ5om+5Yiw5Zue5Yiw5Ye95pWw77yM5bCx57uZ5LqL5Lu255uR5ZCs5Zmo5o+Q5Lqk5LiA5Liq5LqL5Lu2XG4gICAgICAgICAgICAgIHZhciB0eXBlID0gcmVzLnR5cGVcbiAgICAgICAgICAgICAgZXZlbnQuZmlyZSh0eXBlLHJlcy5kYXRhKVxuICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgXG4gICAgICAgICB9XG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHRoYXQucmVxdWVzdF93eExvZ2luID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcbiAgICAgICAgdGhhdC5fcmVxdWVzdChcInd4bG9naW5cIixyZXEsY2FsbGJhY2spXG4gICAgfVxuICAgIFxuICAgIHRoYXQucmVxdWVzdF9jcmVhdHJvb20gPSBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xuICAgICAgICB0aGF0Ll9yZXF1ZXN0KFwiY3JlYXRlcm9vbV9yZXFcIixyZXEsY2FsbGJhY2spXG4gICAgfVxuXG4gICAgdGhhdC5yZXF1ZXN0X2ppb24gPSBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xuICAgICAgICB0aGF0Ll9yZXF1ZXN0KFwiam9pbnJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxuICAgIH1cblx0dGhhdC5yZXF1ZXN0X3Jlc2V0ID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcblx0ICAgIHRoYXQuX3JlcXVlc3QoXCJyZXNldHJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxuXHR9XG5cbiAgICB0aGF0LnJlcXVlc3RfZW50ZXJfcm9vbSA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XG4gICAgICAgdGhhdC5fcmVxdWVzdChcImVudGVycm9vbV9yZXFcIixyZXEsY2FsbGJhY2spXG4gICAgfVxuXG4gICAgIHRoYXQucmVxdWVzdF9yZV9yb29tID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcbiAgICAgICAgIHRoYXQuX3JlcXVlc3QoXCJyZXJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxuICAgICB9XG5cdCBcblx0IHRoYXQucmVxdWVzdF9yZWNvdmVyeSA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7Ly8g6K+35rGCIOaBouWkjeeJjOWxgOS/oeaBr1xuXHQgICAgIHRoYXQuX3JlcXVlc3QoXCJyZWNvdmVyeV9yZXFcIixyZXEsY2FsbGJhY2spXG5cdCB9XG4gICAgLy/lj5HpgIHkuI3lh7rniYzkv6Hmga9cbiAgICB0aGF0LnJlcXVlc3RfYnVjaHVfY2FyZCA9ICBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xuICAgICAgICB0aGF0Ll9yZXF1ZXN0KFwiY2h1X2J1X2NhcmRfcmVxXCIscmVxLGNhbGxiYWNrKVxuICAgIH1cbiAgICAvKueOqeWutuWHuueJjFxuICAgICAg6ZyA6KaB5Yik5patOiBcbiAgICAgICAgIOWHuueahOeJjOaYr+WQpuespuWQiOinhOWImVxuICAgICAgICAg5ZKM5LiK5Liq5Ye654mM546p5a625q+U6L6D77yM5piv5ZCm5ruh6Laz5p2h5Lu2XG5cbiAgICAqL1xuICAgIHRoYXQucmVxdWVzdF9jaHVfY2FyZCA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XG4gICAgICAgdGhhdC5fcmVxdWVzdChcImNodV9jYXJkX3JlcVwiLHJlcSxjYWxsYmFjaylcbiAgICB9XG4gICAgLy/nm5HlkKzlhbbku5bnjqnlrrbov5vlhaXmiL/pl7Tmtojmga9cbiAgICB0aGF0Lm9uUGxheWVySm9pblJvb20gPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgICBldmVudC5vbihcInBsYXllcl9qb2lucm9vbV9ub3RpZnlcIixjYWxsYmFjaylcbiAgICB9XG5cbiAgICB0aGF0Lm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGV2ZW50Lm9uKFwicGxheWVyX3JlYWR5X25vdGlmeVwiLGNhbGxiYWNrKVxuICAgIH1cblxuICAgIHRoYXQub25HYW1lU3RhcnQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgZXZlbnQub24oXCJnYW1lU3RhcnRfbm90aWZ5XCIsY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGF0Lm9uQ2hhbmdlSG91c2VNYW5hZ2UgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwiY2hhbmdlaG91c2VtYW5hZ2Vfbm90aWZ5XCIsY2FsbGJhY2spXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/lj5HpgIFyZWFkeea2iOaBr1xuICAgIHRoYXQucmVxdWVzdFJlYWR5ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhhdC5fc2VuZG1zZyhcInBsYXllcl9yZWFkeV9ub3RpZnlcIix7fSxudWxsKVxuICAgIH1cblx0dGhhdC5yZXF1ZXN0TGVhdmVSb29tPWZ1bmN0aW9uKCl7XG5cdFx0dGhhdC5fc2VuZG1zZyhcInBsYXllcl9sZWF2ZV9yb29tXCIse30sbnVsbClcblx0fVxuICAgIC8v55uR5ZCsIGRpc2Nvbm5lY3Qg5raI5oGvICDnjqnlrrYg56a75byA5oi/6Ze0XG5cdHRoYXQub25QbGF5ZXJEaXNjb25uZWN0PWZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRldmVudC5vbihcInBsYXllcl9kaXNjb25uZWN0X25vdGlmeVwiLGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cblx0Ly/nm5HlkKwgZGlzb25saW5lIOa2iOaBryAg546p5a62IOa4uOaIj+S4reaOiee6v1xuXHR0aGF0Lm9uUGxheWVyRGlzb25saW5lPWZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRldmVudC5vbihcInBsYXllcl9kaXNvbmxpbmVfbm90aWZ5XCIsY2FsbGJhY2spO1xuXHRcdH1cblx0fVxuXHQvL+ebkeWQrCByZW9ubGluZSDmtojmga8gIOeOqeWutiDmuLjmiI/kuK3ph43mlrDov57nur9cblx0dGhhdC5vblBsYXllclJlb25saW5lPWZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRldmVudC5vbihcInBsYXllcl9yZW9ubGluZV9ub3RpZnlcIixjYWxsYmFjayk7XG5cdFx0fVxuXHR9XG5cdHRoYXQub25HYW1lRmluaXNoPWZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRpZihjYWxsYmFjayl7XG5cdFx0XHRldmVudC5vbihcImdhbWVGaW5pc2hfbm90aWZ5XCIsY2FsbGJhY2spOy8v55uR5ZCs5pyN5Yqh56uvIOi/lOWbnua2iOaBr1xuXHRcdH1cblx0fVxuXHRcbiBcbiAgICB0aGF0LnJlcXVlc3RTdGFydCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgdGhhdC5fcmVxdWVzdChcInBsYXllcl9zdGFydF9ub3RpZnlcIix7fSxjYWxsYmFjaylcbiAgICB9XG5cbiAgICAvL+eOqeWutumAmuefpeacjeWKoeWZqOaKouWcsOS4u+a2iOaBr1xuICAgIHRoYXQucmVxdWVzdFJvYlN0YXRlID0gZnVuY3Rpb24oc3RhdGUpe1xuICAgICAgICB0aGF0Ll9zZW5kbXNnKFwicGxheWVyX3JvYl9ub3RpZnlcIixzdGF0ZSxudWxsKVxuICAgIH1cbiAgICAvL+acjeWKoeWZqOS4i+WPkeeJjOmAmuefpVxuICAgIHRoYXQub25QdXNoQ2FyZHMgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwicHVzaGNhcmRfbm90aWZ5XCIsY2FsbGJhY2spXG4gICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/nm5HlkKzmnI3liqHlmajpgJrnn6XlvIDlp4vmiqLlnLDkuLvmtojmga9cbiAgICB0aGF0Lm9uQ2FuUm9iU3RhdGUgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwiY2Fucm9iX25vdGlmeVwiLGNhbGxiYWNrKVxuICAgICAgICAgfVxuICAgIH1cblxuICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOumAmuefpeiwgeaKouWcsOS4u+aTjeS9nOa2iOaBr1xuICAgIHRoYXQub25Sb2JTdGF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgaWYoY2FsbGJhY2spe1xuICAgICAgICAgICAgZXZlbnQub24oXCJjYW5yb2Jfc3RhdGVfbm90aWZ5XCIsY2FsbGJhY2spXG4gICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/nm5HlkKzmnI3liqHlmag656Gu5a6a5Zyw5Li75raI5oGvXG4gICAgdGhhdC5vbkNoYW5nZU1hc3RlciA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgaWYoY2FsbGJhY2spe1xuICAgICAgICAgICAgZXZlbnQub24oXCJjaGFuZ2VfbWFzdGVyX25vdGlmeVwiLGNhbGxiYWNrKVxuICAgICAgICAgfVxuICAgIH1cblxuICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOuaYvuekuuW6leeJjOa2iOaBr1xuICAgIHRoYXQub25TaG93Qm90dG9tQ2FyZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgaWYoY2FsbGJhY2spe1xuICAgICAgICAgICAgZXZlbnQub24oXCJjaGFuZ2Vfc2hvd2NhcmRfbm90aWZ5XCIsY2FsbGJhY2spXG4gICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/nm5HlkKzmnI3liqHlmag65Y+v5Lul5Ye654mM5raI5oGvXG4gICAgdGhhdC5vbkNhbkNodUNhcmQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwiY2FuX2NodV9jYXJkX25vdGlmeVwiLGNhbGxiYWNrKVxuICAgICAgICB9XG4gICAgfVxuICAgXG4gICAgdGhhdC5vblJvb21DaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXsgLy8g5oi/6Ze054q25oCB5pS55Y+Y6YCa55+lXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwicm9vbV9zdGF0ZV9ub3RpZnlcIixjYWxsYmFjaylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoYXQub25PdGhlclBsYXllckNodUNhcmQgPSBmdW5jdGlvbihjYWxsYmFjayl7Ly/lhbblroPnjqnlrrblh7rniYzpgJrnn6VcbiAgICAgICAgaWYoY2FsbGJhY2spe1xuICAgICAgICAgICAgZXZlbnQub24oXCJvdGhlcl9jaHVjYXJkX25vdGlmeVwiLGNhbGxiYWNrKVxuICAgICAgICB9XG4gICAgfVxuXHRcblx0dGhhdC5vblNvY2tldENsb3NlZD1mdW5jdGlvbihjYWxsYmFjayl7IC8v546p5a625o6J57q/6YCa55+lXG5cdFx0aWYoY2FsbGJhY2spe1xuXHRcdCAgICBldmVudC5vbihcInNvY2tldF9jbG9zZWRfbm90aWZ5XCIsY2FsbGJhY2spXG5cdFx0fVxuXHR9XG5cdHRoYXQub25Ob3RMb2dpbmVkPWZ1bmN0aW9uKGNhbGxiYWNrKXsvL+eOqeWutiDmnKrnmbvlvZUg6YCa55+lXG5cdFx0ICBldmVudC5vbihcIm5vdF9sb2dpbmVkXCIsY2FsbGJhY2spXG5cdH1cblxuXHR0aGF0Lm9uVXBkYXRlaW5mbz1mdW5jdGlvbihjYWxsYmFjayl7Ly/njqnlrrYg5YiG5pWw5pu05pawXG5cdFx0ZXZlbnQub24oXCJ1cGRhdGVpbmZvX25vdGlmeVwiLGNhbGxiYWNrKVxuXHR9XG5cdHRoYXQuX2V2ZW50PWV2ZW50O1xuXHRcbiAgICByZXR1cm4gdGhhdFxufVxuXG5leHBvcnQgZGVmYXVsdCBzb2NrZXRDdHIgIl19