
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gameingUI.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'fc5fbLb+LFG+rCIt1gYkSVX', 'gameingUI');
// scripts/gameScene/gameingUI.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

var _socket_ctr = _interopRequireDefault(require("../data/socket_ctr.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    gameingUI: cc.Node,
    card_prefab: cc.Prefab,
    robUI: cc.Node,
    bottom_card_pos_node: cc.Node,
    playingUI_node: cc.Node,
    tipsLabel: cc.Label,
    //玩家出牌不合法的tips
    mypaiview: cc.Node,
    returnroom: cc.Node,
    clock_label: cc.Label,
    playing_clock_label: cc.Label
  },
  ResetUI: function ResetUI() {
    //测试按钮
    Toast.show("测试按钮");

    _mygolbal["default"].socket.requestReady(); //myglobal.socket._socket.close();
    //    myglobal.socket.request_reset(function(data){
    // 	console.log("重置游戏 返回"+data);
    // 	//this.ResetUI_();
    // }.bind(this))	

  },
  ResetUI_: function ResetUI_() {
    //自己牌列表
    this.cards_nods = [];
    this.card_width = 0; //当前可以抢地主的accountid

    this.rob_player_accountid = 0; //发牌动画是否结束

    this.fapai_end = false; //底牌数组

    this.bottom_card = []; //底牌的json对象数据

    this.bottom_card_data = [];
    this.choose_card_data = [];
    this.outcar_zone = [];
    this.push_card_tmp = []; //this.robUI.removeAllChildren();

    this.robUI.active = false;
    this.playingUI_node.active = false; //cc.director.loadScene("gameScene")
    //先清理出牌区域

    this.unscheduleAllCallbacks(); //清除所有定时器

    var gameScene_script = this.node.parent.getComponent("gameScene");

    for (var i = 0; i < gameScene_script.playerNodeList.length; i++) {
      gameScene_script.playerNodeList[i].getChildByName("card_node").removeAllChildren(true); //gameScene_script.playerNodeList[i].unscheduleAllCallbacks()//清除所有定时器

      this.clearOutZone(gameScene_script.playerNodeList[i].getComponent("player_node").accountid);
    }

    this.bottom_card_pos_node.removeAllChildren(true);
    this.mypaiview.removeAllChildren(true); // var gamebefore_node = this.node.parent.getChildByName("gamebeforeUI")
    // if(gameScene_script.roomstate<RoomState.ROOM_GAMESTART){//游戏中
    //     gamebefore_node.active=true;
    // 	gamebefore_node.emit("init")
    // }
    // else{
    //     gamebefore_node.active =  false
    // }

    var gamebefore_node = this.node.parent.getChildByName("gamebeforeUI");
    gamebefore_node.active = true;
    gamebefore_node.emit("init");
  },
  show_mycards: function show_mycards(data) {
    //显示我的手牌
    this.card_data = data;
    this.cur_index_card = data.length - 1;
    this.pushCard(data);

    if (isopen_sound) {} //循环播放发牌音效
    //this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"),true)
    // console.log("start fapai_audioID"+this.fapai_audioID) 
    //左边移动定时器


    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3);
    this.node.parent.emit("pushcard_other_event");
  },
  show_bottom_cards: function show_bottom_cards(data) {
    //显示地主牌
    this.bottom_card_data = data;

    for (var i = 0; i < data.length; i++) {
      var card = this.bottom_card[i];
      var show_data = data[i];
      var call_data = {
        "obj": card,
        "data": show_data
      };
      console.log("bottom show_data:" + JSON.stringify(show_data));
      var run = cc.callFunc(function (target, activedata) {
        var show_card = activedata.obj;
        var show_data = activedata.data; //console.log("cc.callFunc:"+JSON.stringify(show_data))

        show_card.getComponent("card").showCards(show_data);
      }, this, call_data);
      card.runAction(cc.sequence(cc.rotateBy(0, 0, 180), cc.rotateBy(0.2, 0, -90), run, cc.rotateBy(0.2, 0, -90), cc.scaleBy(1, 1.2)));

      if (isopen_sound) {
        cc.audioEngine.play(cc.url.raw("resources/sound/start.mp3"));
      }
    }
  },
  now_whocan_chupai: function now_whocan_chupai(data) {
    // 现在谁出牌
    this.unschedule(this.funUp1);

    if (data._accountID == _mygolbal["default"].playerData.accountID) {
      //显示可以出牌的UI
      this.playingUI_node.active = true; //先清理出牌区域

      this.clearOutZone(_mygolbal["default"].playerData.accountID); //先把自己出牌列表置空
      //this.choose_card_data=[]

      this.playing_clock_label.string = "" + (data.next_time - data.now);
      this.next_time = data.next_time;
      this.now = data.now; // let funUp1 = function(){
      // 	this.now+=1;
      // 	if(this.next_time-this.now>0){
      // 		this.playing_clock_label.string=""+(this.next_time-this.now);
      // 	}else{
      // 		this.playingUI_node.active = false
      // 		//this.unschedule(funUp);
      // 	}
      // }.bind(this);
      // this.unschedule(this.funUp1);

      this.schedule(this.funUp1, 1);
    } else {
      //隐藏可以出牌的UI
      this.playingUI_node.active = false;
    }

    this.node.parent.emit("onCanChuCard_gameScene", data);
  },
  show_chupai: function show_chupai(data) {
    // 显示玩家出牌
    var accountid = data.accountid;
    var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

    var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);

    if (outCard_node == null) {
      return;
    }

    var node_cards = [];

    for (var i = 0; i < data.cards.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.getComponent("card").showCards(data.cards[i].card_data, _mygolbal["default"].playerData.accountID);
      node_cards.push(card);
    }

    this.appendOtherCardsToOutZone(outCard_node, node_cards, 0);
  },
  funUp: function funUp() {
    this.now++;

    if (this.next_time - this.now >= 0) {
      this.clock_label.string = "" + (this.next_time - this.now); //this.scheduleOnce(funUp,1) 
    } else {
      this.robUI.active = false;
      this.unschedule(this.funUp);
    }
  },
  funUp1: function funUp1() {
    this.now += 1;

    if (this.next_time - this.now > 0) {
      this.playing_clock_label.string = "" + (this.next_time - this.now);
    } else {
      this.playingUI_node.active = false;
      this.unschedule(this.funUp1);
    }
  },
  onLoad: function onLoad() {
    //自己牌列表 
    // this.cards_nods = []
    // this.card_width = 0
    // //当前可以抢地主的accountid
    // this.rob_player_accountid = 0
    // //发牌动画是否结束
    // this.fapai_end = false
    // //底牌数组
    // this.bottom_card = []
    // //底牌的json对象数据
    // this.bottom_card_data=[]
    // this.choose_card_data=[]
    // this.outcar_zone = []
    // this.push_card_tmp = []
    this.ResetUI_(); //监听服务器:下发牌消息

    _mygolbal["default"].socket.onPushCards(function (data) {
      console.log("onPushCards" + JSON.stringify(data));
      this.show_mycards(data); // this.card_data = data
      // this.cur_index_card = data.length - 1
      // this.pushCard(data)
      // if(isopen_sound){
      //     //循环播放发牌音效
      //    // this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"),true)
      //     console.log("start fapai_audioID"+this.fapai_audioID) 
      // }
      //  //左边移动定时器
      // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)
      // this.node.parent.emit("pushcard_other_event")
    }.bind(this)); //监听服务器:通知抢地主消息,显示相应的UI


    _mygolbal["default"].socket.onCanRobState(function (data) {
      console.log("onCanRobState" + JSON.stringify(data)); //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束

      this.rob_player_accountid = data._accountID; // if(data._accountID==myglobal.playerData.accountID && this.fapai_end==true){

      if (data._accountID == _mygolbal["default"].playerData.accountID) {
        this.robUI.active = true;
        this.clock_label.string = "" + (data.next_time - data.now);
        this.next_time = data.next_time;
        this.now = data.now; // let funUp = function(){
        // 	data.now++;
        // 	if(data.next_time-data.now>=0){
        // 		this.clock_label.string=""+(data.next_time-data.now);
        // 		//this.scheduleOnce(funUp,1) 
        // 	}else{
        // 		this.robUI.active = false
        // 		//this.unschedule(funUp);
        // 	}
        // }.bind(this);

        this.unschedule(this.funUp);
        this.schedule(this.funUp, 1);
      } else {
        this.robUI.active = false;
      }

      this.node.parent.emit("canrob_event", data);
    }.bind(this)); //监听服务器可以出牌消息


    _mygolbal["default"].socket.onCanChuCard(function (data) {
      console.log("onCanChuCard gameingUI" + JSON.stringify(data));
      console.log("");
      this.now_whocan_chupai(data); //判断是不是自己能出牌
      //          if(data._accountID==myglobal.playerData.accountID){
      // 	//显示可以出牌的UI
      // 	this.playingUI_node.active = true
      //              //先清理出牌区域
      //              this.clearOutZone(myglobal.playerData.accountID)
      //              //先把自己出牌列表置空
      //              //this.choose_card_data=[]
      // 	this.playing_clock_label.string=""+(data.next_time-data.now);
      // 	let funUp = function(){
      // 		data.now+=1;
      // 		if(data.next_time-data.now>0){
      // 			this.playing_clock_label.string=""+(data.next_time-data.now);
      // 		}else{
      // 			this.playingUI_node.active = false
      // 			//this.unschedule(funUp);
      // 		}
      // 	}.bind(this);
      // 	 this.schedule(funUp,1,(data.next_time-data.now));
      // }else{
      // 	//隐藏可以出牌的UI
      // 	this.playingUI_node.active = false
      // }
      // this.node.parent.emit("onCanChuCard_gameScene",data);
    }.bind(this));

    _mygolbal["default"].socket.onGameFinish(function (data) {
      console.log("游戏结束通知 onGameFinish:" + data); //this.tipsLabel.string="winner"+data;

      Alert.show("You " + (data.you_dt_score > 0 ? "win" : "lose") + " " + data.you_dt_score); // if(data.winner==myglobal.playerData.accountID){
      //      Alert.show("You win "+data.you_dt_score)
      // }else{
      //Toast.show("You dt "+data.you_dt_score)
      // }
      //this.gameingUI.active = true;

      this.ResetUI_(); //cc.director.loadScene("gameScene")
    }.bind(this)); //监听服务器：其他玩家出牌消息


    _mygolbal["default"].socket.onOtherPlayerChuCard(function (data) {
      //{"accountid":"2357540","cards":[{"cardid":4,"card_data":{"index":4,"value":1,"shape":1}}]}
      console.log("onOtherPlayerChuCard" + JSON.stringify(data));
      this.show_chupai(data); // var accountid = data.accountid
      // var gameScene_script = this.node.parent.getComponent("gameScene")
      // //获取出牌区域节点
      // var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid)
      // if(outCard_node==null){
      //     return
      // }
      // var node_cards = []
      // for(var i=0;i<data.cards.length;i++){
      //     var card = cc.instantiate(this.card_prefab)
      //     card.getComponent("card").showCards(data.cards[i].card_data,myglobal.playerData.accountID)
      //     node_cards.push(card)
      // }
      // this.appendOtherCardsToOutZone(outCard_node,node_cards,0)
    }.bind(this)); //内部事件:显示底牌事件,data是三张底牌数据


    this.node.on("show_bottom_card_event", function (data) {
      console.log("----show_bottom_card_event", +data);
      this.show_bottom_cards(data); // this.bottom_card_data = data
      // for(var i=0;i<data.length;i++){
      //     var card = this.bottom_card[i]
      //     var show_data = data[i]
      //     var call_data = {
      //         "obj":card,
      //         "data":show_data,
      //     }
      //     console.log("bottom show_data:"+JSON.stringify(show_data))
      //     var run =  cc.callFunc(function(target,activedata){
      //         var show_card = activedata.obj
      //         var show_data = activedata.data
      //         //console.log("cc.callFunc:"+JSON.stringify(show_data))
      //         show_card.getComponent("card").showCards(show_data)
      //     },this,call_data)
      //     card.runAction(cc.sequence(cc.rotateBy(0,0,180),cc.rotateBy(0.2,0,-90), run,
      //     cc.rotateBy(0.2,0,-90),cc.scaleBy(1, 1.2)));
      //     if(isopen_sound){
      //         cc.audioEngine.play(cc.url.raw("resources/sound/start.mp3")) 
      //      }
      // }
      //this.node.parent.emit("change_room_state_event",RoomState.ROOM_PLAYING)
      //如果自己地主，给加上三张底牌

      if (_mygolbal["default"].playerData.accountID == _mygolbal["default"].playerData.master_accountid) {
        this.scheduleOnce(this.pushThreeCard.bind(this), 0.2);
      }
    }.bind(this)); //注册监听一个选择牌消息 

    this.node.on("choose_card_event", function (event) {
      console.log("choose_card_event:" + JSON.stringify(event));
      var detail = event;
      this.choose_card_data.push(detail);
    }.bind(this));
    this.node.on("unchoose_card_event", function (event) {
      console.log("unchoose_card_event:" + event);
      var detail = event;

      for (var i = 0; i < this.choose_card_data.length; i++) {
        if (this.choose_card_data[i].cardid == detail) {
          this.choose_card_data.splice(i, 1);
        }
      }
    }.bind(this));
  },
  start: function start() {},
  //处理发牌的效果
  _runactive_pushcard: function _runactive_pushcard() {
    //console.log("_runactive_pushcard:"+this.cur_index_card)
    if (this.cur_index_card < 0) {
      console.log("pushcard end"); //发牌动画完成，显示抢地主按钮
      //this.robUI.active = true

      this.fapai_end = true;

      if (this.rob_player_accountid == _mygolbal["default"].playerData.accountID) {
        this.robUI.active = true;
      }

      if (isopen_sound) {
        //console.log("start fapai_audioID"+this.fapai_audioID) 
        cc.audioEngine.stop(this.fapai_audioID);
      } //通知gamescene节点，倒计时


      var sendevent = this.rob_player_accountid; //this.node.parent.emit("canrob_event",sendevent)

      return;
    } //原有逻辑  
    // var move_node = this.cards_nods[this.cur_index_card]
    // move_node.active = true
    // var newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
    // var action = cc.moveTo(0.1, cc.v2(newx, -250));
    // move_node.runAction(action)
    // this.cur_index_card--
    // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)
    // this.cur_index_card=0;


    var move_node = this.cards_nods[this.cards_nods.length - this.cur_index_card - 1];
    if (move_node == null) return;
    move_node.active = true;
    this.push_card_tmp.push(move_node);
    if (isopen_sound) this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"));

    for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
      var move_node = this.push_card_tmp[i];
      var newx = move_node.x - this.card_width * 0.4;
      var action = cc.moveTo(0.1, cc.v2(newx, -250));
      move_node.runAction(action);
    }

    this.cur_index_card--; // this._runactive_pushcard.bind(this);

    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.03);
  },
  //对牌排序
  sortCard: function sortCard() {
    this.cards_nods.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }

      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }

      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }

      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    }); //var x = this.cards_nods[0].x;
    //这里使用固定坐标，因为取this.cards_nods[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时

    var timeout = 1000;
    setTimeout(function () {
      //var x = -417.6 
      var x = this.cards_nods[0].x;
      console.log("sort x:" + x);

      for (var i = 0; i < this.cards_nods.length; i++) {
        var card = this.cards_nods[i];
        card.zIndex = i; //设置牌的叠加次序,zindex越大显示在上面

        card.x = x + card.width * 0.4 * i;
      }
    }.bind(this), timeout);
  },
  pushCard: function pushCard(data) {
    //发牌 
    if (data) {
      data.sort(function (a, b) {
        if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
          return b.value - a.value;
        }

        if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
          return -1;
        }

        if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return 1;
        }

        if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return b.king - a.king;
        }
      });
    } //创建card预制体


    this.cards_nods = [];

    for (var i = 0; i < data.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8;
      card.parent = this.mypaiview; //card.x = card.width * 0.4 * (17 - 1) * (-0.5) + card.width * 0.4 * 0;

      card.x = card.width * 0.4 * -0.5 * -16 + card.width * 0.4 * 0; //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动

      card.y = -250;
      card.active = false;
      card.getComponent("card").showCards(data[i], _mygolbal["default"].playerData.accountID); //存储牌的信息,用于后面发牌效果

      this.cards_nods.push(card);
      this.card_width = card.width;
    } //创建3张底牌


    this.bottom_card = [];

    for (var i = 0; i < 3; i++) {
      var di_card = cc.instantiate(this.card_prefab);
      di_card.scale = 0.4;
      di_card.position.x = this.bottom_card_pos_node.position.x;
      di_card.position.y = 0; //三张牌，中间坐标就是bottom_card_pos_node节点坐标，
      //0,和2两张牌左右移动windth*0.4

      if (i == 0) {
        di_card.x = di_card.x - di_card.width * 0.4;
      } else if (i == 2) {
        di_card.x = di_card.x + di_card.width * 0.4;
      } //di_card.x = di_card.width-i*di_card.width-20
      //di_card.y=60


      di_card.parent = this.bottom_card_pos_node; // this.node.getComponent("gameingUI").dizhupaiview;//this.node.getComponent("dizhupaiview");//  this.node.parent
      //存储在容器里

      this.bottom_card.push(di_card);
    }
  },
  //给玩家发送三张底牌后，过1s,把牌设置到y=-250位置效果
  schedulePushThreeCard: function schedulePushThreeCard() {
    for (var i = 0; i < this.cards_nods.length; i++) {
      var card = this.cards_nods[i];

      if (card.y == -230) {
        card.y = -250;
      }
    }
  },
  //给地主发三张排，并显示在原有牌的后面
  pushThreeCard: function pushThreeCard() {
    //每张牌的其实位置 
    var last_card_x = this.cards_nods[this.cards_nods.length - 1].x;

    for (var i = 0; i < this.bottom_card_data.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8;
      card.parent = this.mypaiview;
      card.x = last_card_x + (i + 1) * this.card_width * 0.4;
      card.y = -230; //先把底盘放在-230，在设置个定时器下移到-250的位置
      //console.log("pushThreeCard x:"+card.x)

      card.getComponent("card").showCards(this.bottom_card_data[i], _mygolbal["default"].playerData.accountID);
      card.active = true;
      this.cards_nods.push(card);
    }

    this.sortCard(); //设置一个定时器，在2s后，修改y坐标为-250

    this.scheduleOnce(this.schedulePushThreeCard.bind(this), 2);
  },
  destoryCard: function destoryCard(accountid, choose_card) {
    if (choose_card.length == 0) {
      return;
    }
    /*出牌逻辑
      1. 将选中的牌 从父节点中移除
      2. 从this.cards_nods 数组中，删除 选中的牌 
      3. 将 “选中的牌” 添加到出牌区域
          3.1 清空出牌区域
          3.2 添加子节点
          3.3 设置scale
          3.4 设置position
      4.  重新设置手中的牌的位置  this.updateCards();
    */
    //1/2步骤删除自己手上的card节点 


    var destroy_card = [];

    for (var i = 0; i < choose_card.length; i++) {
      for (var j = 0; j < this.cards_nods.length; j++) {
        var card_id = this.cards_nods[j].getComponent("card").card_id;

        if (card_id == choose_card[i].cardid) {
          console.log("destroy card id:" + card_id); //this.cards_nods[j].destroy()

          this.cards_nods[j].removeFromParent(true); //this.cards_nods[j].destroy();

          destroy_card.push(this.cards_nods[j]);
          this.cards_nods.splice(j, 1);
        }
      }
    }

    this.appendCardsToOutZone(accountid, destroy_card);
    this.updateCards();
  },
  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone: function clearOutZone(accountid) {
    var gameScene_script = this.node.parent.getComponent("gameScene");
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);

    if (outCard_node == null) {
      return;
    }

    var children = outCard_node.children;

    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy();
    }

    outCard_node.removeAllChildren(true);
  },
  //对出的牌做排序
  pushCardSort: function pushCardSort(cards) {
    if (cards.length == 1) {
      return;
    }

    cards.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }

      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }

      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }

      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    });
  },
  appendOtherCardsToOutZone: function appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
    outCard_node.removeAllChildren(true); //console.log("appendOtherCardsToOutZone length"+cards.length)
    //添加新的子节点

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      outCard_node.addChild(card, 100 + i); //第二个参数是zorder,保证牌不能被遮住
    } //对出牌进行排序
    //设置出牌节点的坐标


    var zPoint = cards.length / 2; //console.log("appendOtherCardsToOutZone zeroPoint:"+zPoint)

    for (var i = 0; i < cards.length; i++) {
      var cardNode = outCard_node.getChildren()[i];
      var x = (i - zPoint) * 30;
      var y = cardNode.y + yoffset; //因为每个节点需要的Y不一样，做参数传入
      //console.log("-----cardNode: x:"+x+" y:"+y)

      cardNode.setScale(0.5, 0.5);
      cardNode.setPosition(x, y);
    }
  },
  //将 “选中的牌” 添加到出牌区域
  //destroy_card是玩家本次出的牌
  appendCardsToOutZone: function appendCardsToOutZone(accountid, destroy_card) {
    if (destroy_card.length == 0) {} // return
    //先给本次出的牌做一个排序


    this.pushCardSort(destroy_card); //console.log("appendCardsToOutZone")

    var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

    var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);
    this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360); //sconsole.log("OutZone:"+outCard_node.name)
  },
  //重新排序手上的牌,并移动
  updateCards: function updateCards() {
    var zeroPoint = this.cards_nods.length / 2; //var last_card_x = this.cards_nods[this.cards_nods.length-1].x

    for (var i = 0; i < this.cards_nods.length; i++) {
      var cardNode = this.cards_nods[i];
      var x = (i - zeroPoint) * (this.card_width * 0.4);
      cardNode.setPosition(x, -250);
    }
  },
  playPushCardSound: function playPushCardSound(card_name) {
    console.log("playPushCardSound:" + card_name);

    if (card_name == "") {
      return;
    }

    switch (card_name) {
      case CardsValue.one.name:
        break;

      case CardsValue["double"].name:
        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3"));
        }

        break;
    }
  },
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "btn_qiandz":
        console.log("btn_qiandz");

        _mygolbal["default"].socket.requestRobState(qian_state.qian);

        this.unschedule(this.funUp); //清除 抢地主 定时器

        this.robUI.active = false;

        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/woman_jiao_di_zhu.ogg"));
        }

        break;

      case "btn_buqiandz":
        console.log("btn_buqiandz");

        _mygolbal["default"].socket.requestRobState(qian_state.buqiang);

        this.unschedule(this.funUp); //清除 抢地主 定时器

        this.robUI.active = false;

        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/woman_bu_jiao.ogg"));
        }

        break;

      case "nopushcard":
        //不出牌
        _mygolbal["default"].socket.request_buchu_card([], null);

        this.playingUI_node.active = false;
        this.unschedule(this.funUp1); // 清除 出牌定时器

        break;

      case "pushcard":
        //出牌
        //先获取本次出牌数据
        if (this.choose_card_data.length == 0) {
          this.tipsLabel.string = "请选择牌!";
          this.playingUI_node.active = true;
          setTimeout(function () {
            this.tipsLabel.string = "";
          }.bind(this), 2000);
          return; // 不出牌 则返回
        }

        this.unschedule(this.funUp1); // 清除 出牌定时器

        _mygolbal["default"].socket.request_chu_card(this.choose_card_data, function (err, data) {
          if (err) {
            console.log("request_chu_card:" + err);
            console.log("request_chu_card" + JSON.stringify(data));

            if (this.tipsLabel.string == "") {
              this.tipsLabel.string = data.msg;
              setTimeout(function () {
                this.tipsLabel.string = "";
              }.bind(this), 2000);
            } //出牌失败，把选择的牌归位


            for (var i = 0; i < this.cards_nods.length; i++) {
              var card = this.cards_nods[i];
              card.emit("reset_card_flag");
            }

            this.choose_card_data = [];
          } else {
            //出牌成功
            console.log("resp_chu_card data:" + JSON.stringify(data));
            this.playingUI_node.active = false; //播放出牌的声音
            //resp_chu_card data:{"account":"2519901","msg":"sucess","cardvalue":{"name":"Double","value":1}}
            //{"type":"other_chucard_notify","result":0,"data":{"accountid":"2519901","cards":[{"cardid":24,"card_data":{"index":24,"value":6,"shape":1}},{"cardid":26,"card_data":{"index":26,"value":6,"shape":3}}]},"callBackIndex":0}

            this.playPushCardSound(data.cardvalue.name);
            this.destoryCard(data.account, this.choose_card_data);
            this.choose_card_data = [];
          }
        }.bind(this)); //this.playingUI_node.active = false


        break;

      case "tipcard":
        break;

      case "returnroom":
        //重新连接
        //   console.log("点击了 重新连接")
        //  myglobal.socket.initSocket(function(){
        // 	  console.log("初始化 成功 initSocket")
        //  myglobal.api.login(function(data){
        //    console.log("自动登录成功")
        //      var gameScene_script = this.node.parent.getComponent("gameScene")
        //         myglobal.socket.request_re_room({"roomid":gameScene_script.roomid},function(err,data){
        // 	  //重新连接
        // 		 if(err==0){
        // 		 this.returnroom.active=false;
        // 		 console.log("重新进入房间 成功"+JSON.stringify(data));
        // 		 }else{
        // 			 console.log("重新进入房间 失败"+err);
        // 		 }
        //      }.bind(this))
        //   }.bind(this))
        //   }.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWVTY2VuZS9nYW1laW5nVUkuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJnYW1laW5nVUkiLCJOb2RlIiwiY2FyZF9wcmVmYWIiLCJQcmVmYWIiLCJyb2JVSSIsImJvdHRvbV9jYXJkX3Bvc19ub2RlIiwicGxheWluZ1VJX25vZGUiLCJ0aXBzTGFiZWwiLCJMYWJlbCIsIm15cGFpdmlldyIsInJldHVybnJvb20iLCJjbG9ja19sYWJlbCIsInBsYXlpbmdfY2xvY2tfbGFiZWwiLCJSZXNldFVJIiwiVG9hc3QiLCJzaG93IiwibXlnbG9iYWwiLCJzb2NrZXQiLCJyZXF1ZXN0UmVhZHkiLCJSZXNldFVJXyIsImNhcmRzX25vZHMiLCJjYXJkX3dpZHRoIiwicm9iX3BsYXllcl9hY2NvdW50aWQiLCJmYXBhaV9lbmQiLCJib3R0b21fY2FyZCIsImJvdHRvbV9jYXJkX2RhdGEiLCJjaG9vc2VfY2FyZF9kYXRhIiwib3V0Y2FyX3pvbmUiLCJwdXNoX2NhcmRfdG1wIiwiYWN0aXZlIiwidW5zY2hlZHVsZUFsbENhbGxiYWNrcyIsImdhbWVTY2VuZV9zY3JpcHQiLCJub2RlIiwicGFyZW50IiwiZ2V0Q29tcG9uZW50IiwiaSIsInBsYXllck5vZGVMaXN0IiwibGVuZ3RoIiwiZ2V0Q2hpbGRCeU5hbWUiLCJyZW1vdmVBbGxDaGlsZHJlbiIsImNsZWFyT3V0Wm9uZSIsImFjY291bnRpZCIsImdhbWViZWZvcmVfbm9kZSIsImVtaXQiLCJzaG93X215Y2FyZHMiLCJkYXRhIiwiY2FyZF9kYXRhIiwiY3VyX2luZGV4X2NhcmQiLCJwdXNoQ2FyZCIsImlzb3Blbl9zb3VuZCIsInNjaGVkdWxlT25jZSIsIl9ydW5hY3RpdmVfcHVzaGNhcmQiLCJiaW5kIiwic2hvd19ib3R0b21fY2FyZHMiLCJjYXJkIiwic2hvd19kYXRhIiwiY2FsbF9kYXRhIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJydW4iLCJjYWxsRnVuYyIsInRhcmdldCIsImFjdGl2ZWRhdGEiLCJzaG93X2NhcmQiLCJvYmoiLCJzaG93Q2FyZHMiLCJydW5BY3Rpb24iLCJzZXF1ZW5jZSIsInJvdGF0ZUJ5Iiwic2NhbGVCeSIsImF1ZGlvRW5naW5lIiwicGxheSIsInVybCIsInJhdyIsIm5vd193aG9jYW5fY2h1cGFpIiwidW5zY2hlZHVsZSIsImZ1blVwMSIsIl9hY2NvdW50SUQiLCJwbGF5ZXJEYXRhIiwiYWNjb3VudElEIiwic3RyaW5nIiwibmV4dF90aW1lIiwibm93Iiwic2NoZWR1bGUiLCJzaG93X2NodXBhaSIsIm91dENhcmRfbm9kZSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50Iiwibm9kZV9jYXJkcyIsImNhcmRzIiwiaW5zdGFudGlhdGUiLCJwdXNoIiwiYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZSIsImZ1blVwIiwib25Mb2FkIiwib25QdXNoQ2FyZHMiLCJvbkNhblJvYlN0YXRlIiwib25DYW5DaHVDYXJkIiwib25HYW1lRmluaXNoIiwiQWxlcnQiLCJ5b3VfZHRfc2NvcmUiLCJvbk90aGVyUGxheWVyQ2h1Q2FyZCIsIm9uIiwibWFzdGVyX2FjY291bnRpZCIsInB1c2hUaHJlZUNhcmQiLCJldmVudCIsImRldGFpbCIsImNhcmRpZCIsInNwbGljZSIsInN0YXJ0Iiwic3RvcCIsImZhcGFpX2F1ZGlvSUQiLCJzZW5kZXZlbnQiLCJtb3ZlX25vZGUiLCJuZXd4IiwieCIsImFjdGlvbiIsIm1vdmVUbyIsInYyIiwic29ydENhcmQiLCJzb3J0IiwieSIsImEiLCJiIiwiaGFzT3duUHJvcGVydHkiLCJ2YWx1ZSIsImtpbmciLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsInpJbmRleCIsIndpZHRoIiwic2NhbGUiLCJkaV9jYXJkIiwicG9zaXRpb24iLCJzY2hlZHVsZVB1c2hUaHJlZUNhcmQiLCJsYXN0X2NhcmRfeCIsImRlc3RvcnlDYXJkIiwiY2hvb3NlX2NhcmQiLCJkZXN0cm95X2NhcmQiLCJqIiwiY2FyZF9pZCIsInJlbW92ZUZyb21QYXJlbnQiLCJhcHBlbmRDYXJkc1RvT3V0Wm9uZSIsInVwZGF0ZUNhcmRzIiwiY2hpbGRyZW4iLCJkZXN0cm95IiwicHVzaENhcmRTb3J0IiwieW9mZnNldCIsImFkZENoaWxkIiwielBvaW50IiwiY2FyZE5vZGUiLCJnZXRDaGlsZHJlbiIsInNldFNjYWxlIiwic2V0UG9zaXRpb24iLCJ6ZXJvUG9pbnQiLCJwbGF5UHVzaENhcmRTb3VuZCIsImNhcmRfbmFtZSIsIkNhcmRzVmFsdWUiLCJvbmUiLCJuYW1lIiwib25CdXR0b25DbGljayIsImN1c3RvbURhdGEiLCJyZXF1ZXN0Um9iU3RhdGUiLCJxaWFuX3N0YXRlIiwicWlhbiIsImJ1cWlhbmciLCJyZXF1ZXN0X2J1Y2h1X2NhcmQiLCJyZXF1ZXN0X2NodV9jYXJkIiwiZXJyIiwibXNnIiwiY2FyZHZhbHVlIiwiYWNjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLLElBRE47QUFFUkMsSUFBQUEsV0FBVyxFQUFDTixFQUFFLENBQUNPLE1BRlA7QUFHUkMsSUFBQUEsS0FBSyxFQUFDUixFQUFFLENBQUNLLElBSEQ7QUFJUkksSUFBQUEsb0JBQW9CLEVBQUNULEVBQUUsQ0FBQ0ssSUFKaEI7QUFLUkssSUFBQUEsY0FBYyxFQUFDVixFQUFFLENBQUNLLElBTFY7QUFNUk0sSUFBQUEsU0FBUyxFQUFDWCxFQUFFLENBQUNZLEtBTkw7QUFNWTtBQUNwQkMsSUFBQUEsU0FBUyxFQUFDYixFQUFFLENBQUNLLElBUEw7QUFRZFMsSUFBQUEsVUFBVSxFQUFDZCxFQUFFLENBQUNLLElBUkE7QUFTZFUsSUFBQUEsV0FBVyxFQUFDZixFQUFFLENBQUNZLEtBVEQ7QUFVZEksSUFBQUEsbUJBQW1CLEVBQUNoQixFQUFFLENBQUNZO0FBVlQsR0FIUDtBQWdCTEssRUFBQUEsT0FoQksscUJBZ0JJO0FBQUM7QUFFWkMsSUFBQUEsS0FBSyxDQUFDQyxJQUFOLENBQVcsTUFBWDs7QUFDQUMseUJBQVNDLE1BQVQsQ0FBZ0JDLFlBQWhCLEdBSFcsQ0FJWjtBQUNDO0FBQ0E7QUFDQTtBQUNBOztBQUNBLEdBekJPO0FBMkJSQyxFQUFBQSxRQTNCUSxzQkEyQkU7QUFDVDtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLENBQWxCLENBSFMsQ0FJVDs7QUFDQSxTQUFLQyxvQkFBTCxHQUE0QixDQUE1QixDQUxTLENBTVQ7O0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixLQUFqQixDQVBTLENBUVQ7O0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQixDQVRTLENBVVQ7O0FBQ0EsU0FBS0MsZ0JBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxnQkFBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLEVBQXJCLENBZlMsQ0FpQlQ7O0FBQ0MsU0FBS3hCLEtBQUwsQ0FBV3lCLE1BQVgsR0FBbUIsS0FBbkI7QUFDQSxTQUFLdkIsY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTJCLEtBQTNCLENBbkJRLENBb0JUO0FBRUE7O0FBRUEsU0FBS0Msc0JBQUwsR0F4QlMsQ0F3Qm9COztBQUU3QixRQUFJQyxnQkFBZ0IsR0FBRyxLQUFLQyxJQUFMLENBQVVDLE1BQVYsQ0FBaUJDLFlBQWpCLENBQThCLFdBQTlCLENBQXZCOztBQUNBLFNBQUksSUFBSUMsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFFSixnQkFBZ0IsQ0FBQ0ssY0FBakIsQ0FBZ0NDLE1BQS9DLEVBQXNERixDQUFDLEVBQXZELEVBQTBEO0FBQ3pESixNQUFBQSxnQkFBZ0IsQ0FBQ0ssY0FBakIsQ0FBZ0NELENBQWhDLEVBQW1DRyxjQUFuQyxDQUFrRCxXQUFsRCxFQUErREMsaUJBQS9ELENBQWlGLElBQWpGLEVBRHlELENBRXpEOztBQUNBLFdBQUtDLFlBQUwsQ0FBa0JULGdCQUFnQixDQUFDSyxjQUFqQixDQUFnQ0QsQ0FBaEMsRUFBbUNELFlBQW5DLENBQWdELGFBQWhELEVBQStETyxTQUFqRjtBQUNBOztBQUlELFNBQUtwQyxvQkFBTCxDQUEwQmtDLGlCQUExQixDQUE0QyxJQUE1QztBQUNBLFNBQUs5QixTQUFMLENBQWU4QixpQkFBZixDQUFpQyxJQUFqQyxFQXBDUyxDQXNDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUlHLGVBQWUsR0FBRyxLQUFLVixJQUFMLENBQVVDLE1BQVYsQ0FBaUJLLGNBQWpCLENBQWdDLGNBQWhDLENBQXRCO0FBQ0FJLElBQUFBLGVBQWUsQ0FBQ2IsTUFBaEIsR0FBdUIsSUFBdkI7QUFDQWEsSUFBQUEsZUFBZSxDQUFDQyxJQUFoQixDQUFxQixNQUFyQjtBQUdBLEdBOUVPO0FBZ0ZSQyxFQUFBQSxZQWhGUSx3QkFnRktDLElBaEZMLEVBZ0ZVO0FBQUM7QUFDaEIsU0FBS0MsU0FBTCxHQUFpQkQsSUFBakI7QUFDQSxTQUFLRSxjQUFMLEdBQXNCRixJQUFJLENBQUNSLE1BQUwsR0FBYyxDQUFwQztBQUNBLFNBQUtXLFFBQUwsQ0FBY0gsSUFBZDs7QUFDQSxRQUFHSSxZQUFILEVBQWdCLENBSWQsQ0FKRixDQUNDO0FBQ0c7QUFDQTtBQUVOOzs7QUFDRyxTQUFLQyxZQUFMLENBQWtCLEtBQUtDLG1CQUFMLENBQXlCQyxJQUF6QixDQUE4QixJQUE5QixDQUFsQixFQUFzRCxHQUF0RDtBQUNBLFNBQUtwQixJQUFMLENBQVVDLE1BQVYsQ0FBaUJVLElBQWpCLENBQXNCLHNCQUF0QjtBQUNILEdBNUZPO0FBNkZSVSxFQUFBQSxpQkE3RlEsNkJBNkZVUixJQTdGVixFQTZGZTtBQUFDO0FBRXZCLFNBQUtwQixnQkFBTCxHQUF3Qm9CLElBQXhCOztBQUVBLFNBQUksSUFBSVYsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDVSxJQUFJLENBQUNSLE1BQW5CLEVBQTBCRixDQUFDLEVBQTNCLEVBQThCO0FBQzFCLFVBQUltQixJQUFJLEdBQUcsS0FBSzlCLFdBQUwsQ0FBaUJXLENBQWpCLENBQVg7QUFDQSxVQUFJb0IsU0FBUyxHQUFHVixJQUFJLENBQUNWLENBQUQsQ0FBcEI7QUFDQSxVQUFJcUIsU0FBUyxHQUFHO0FBQ1osZUFBTUYsSUFETTtBQUVaLGdCQUFPQztBQUZLLE9BQWhCO0FBSUFFLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFvQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVMLFNBQWYsQ0FBaEM7QUFDQSxVQUFJTSxHQUFHLEdBQUlqRSxFQUFFLENBQUNrRSxRQUFILENBQVksVUFBU0MsTUFBVCxFQUFnQkMsVUFBaEIsRUFBMkI7QUFFOUMsWUFBSUMsU0FBUyxHQUFHRCxVQUFVLENBQUNFLEdBQTNCO0FBQ0EsWUFBSVgsU0FBUyxHQUFHUyxVQUFVLENBQUNuQixJQUEzQixDQUg4QyxDQUk5Qzs7QUFDQW9CLFFBQUFBLFNBQVMsQ0FBQy9CLFlBQVYsQ0FBdUIsTUFBdkIsRUFBK0JpQyxTQUEvQixDQUF5Q1osU0FBekM7QUFFSCxPQVBVLEVBT1QsSUFQUyxFQU9KQyxTQVBJLENBQVg7QUFTQUYsTUFBQUEsSUFBSSxDQUFDYyxTQUFMLENBQWV4RSxFQUFFLENBQUN5RSxRQUFILENBQVl6RSxFQUFFLENBQUMwRSxRQUFILENBQVksQ0FBWixFQUFjLENBQWQsRUFBZ0IsR0FBaEIsQ0FBWixFQUFpQzFFLEVBQUUsQ0FBQzBFLFFBQUgsQ0FBWSxHQUFaLEVBQWdCLENBQWhCLEVBQWtCLENBQUMsRUFBbkIsQ0FBakMsRUFBeURULEdBQXpELEVBQ2ZqRSxFQUFFLENBQUMwRSxRQUFILENBQVksR0FBWixFQUFnQixDQUFoQixFQUFrQixDQUFDLEVBQW5CLENBRGUsRUFDUTFFLEVBQUUsQ0FBQzJFLE9BQUgsQ0FBVyxDQUFYLEVBQWMsR0FBZCxDQURSLENBQWY7O0FBR0EsVUFBR3RCLFlBQUgsRUFBZ0I7QUFDWnJELFFBQUFBLEVBQUUsQ0FBQzRFLFdBQUgsQ0FBZUMsSUFBZixDQUFvQjdFLEVBQUUsQ0FBQzhFLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLDJCQUFYLENBQXBCO0FBQ0Y7QUFDTDtBQUVELEdBMUhPO0FBNEhSQyxFQUFBQSxpQkE1SFEsNkJBNEhVL0IsSUE1SFYsRUE0SGU7QUFBQztBQUN2QixTQUFLZ0MsVUFBTCxDQUFnQixLQUFLQyxNQUFyQjs7QUFFQSxRQUFHakMsSUFBSSxDQUFDa0MsVUFBTCxJQUFpQi9ELHFCQUFTZ0UsVUFBVCxDQUFvQkMsU0FBeEMsRUFBa0Q7QUFDakQ7QUFDQSxXQUFLM0UsY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTZCLElBQTdCLENBRmlELENBRzlDOztBQUNBLFdBQUtXLFlBQUwsQ0FBa0J4QixxQkFBU2dFLFVBQVQsQ0FBb0JDLFNBQXRDLEVBSjhDLENBSzlDO0FBQ0E7O0FBRUgsV0FBS3JFLG1CQUFMLENBQXlCc0UsTUFBekIsR0FBZ0MsTUFBSXJDLElBQUksQ0FBQ3NDLFNBQUwsR0FBZXRDLElBQUksQ0FBQ3VDLEdBQXhCLENBQWhDO0FBQ0EsV0FBS0QsU0FBTCxHQUFnQnRDLElBQUksQ0FBQ3NDLFNBQXJCO0FBQ0EsV0FBS0MsR0FBTCxHQUFTdkMsSUFBSSxDQUFDdUMsR0FBZCxDQVZpRCxDQVdqRDtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQyxXQUFLQyxRQUFMLENBQWMsS0FBS1AsTUFBbkIsRUFBMEIsQ0FBMUI7QUFDRCxLQXZCRCxNQXVCSztBQUNKO0FBQ0EsV0FBS3hFLGNBQUwsQ0FBb0J1QixNQUFwQixHQUE2QixLQUE3QjtBQUNBOztBQUVELFNBQUtHLElBQUwsQ0FBVUMsTUFBVixDQUFpQlUsSUFBakIsQ0FBc0Isd0JBQXRCLEVBQStDRSxJQUEvQztBQUdBLEdBOUpPO0FBK0pSeUMsRUFBQUEsV0EvSlEsdUJBK0pJekMsSUEvSkosRUErSlM7QUFBQztBQUNqQixRQUFJSixTQUFTLEdBQUdJLElBQUksQ0FBQ0osU0FBckI7QUFDQSxRQUFJVixnQkFBZ0IsR0FBRyxLQUFLQyxJQUFMLENBQVVDLE1BQVYsQ0FBaUJDLFlBQWpCLENBQThCLFdBQTlCLENBQXZCLENBRmdCLENBR2hCOztBQUNBLFFBQUlxRCxZQUFZLEdBQUd4RCxnQkFBZ0IsQ0FBQ3lELDBCQUFqQixDQUE0Qy9DLFNBQTVDLENBQW5COztBQUNBLFFBQUc4QyxZQUFZLElBQUUsSUFBakIsRUFBc0I7QUFDbEI7QUFDSDs7QUFFRCxRQUFJRSxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsU0FBSSxJQUFJdEQsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDVSxJQUFJLENBQUM2QyxLQUFMLENBQVdyRCxNQUF6QixFQUFnQ0YsQ0FBQyxFQUFqQyxFQUFvQztBQUNoQyxVQUFJbUIsSUFBSSxHQUFHMUQsRUFBRSxDQUFDK0YsV0FBSCxDQUFlLEtBQUt6RixXQUFwQixDQUFYO0FBQ0FvRCxNQUFBQSxJQUFJLENBQUNwQixZQUFMLENBQWtCLE1BQWxCLEVBQTBCaUMsU0FBMUIsQ0FBb0N0QixJQUFJLENBQUM2QyxLQUFMLENBQVd2RCxDQUFYLEVBQWNXLFNBQWxELEVBQTREOUIscUJBQVNnRSxVQUFULENBQW9CQyxTQUFoRjtBQUNBUSxNQUFBQSxVQUFVLENBQUNHLElBQVgsQ0FBZ0J0QyxJQUFoQjtBQUNIOztBQUNELFNBQUt1Qyx5QkFBTCxDQUErQk4sWUFBL0IsRUFBNENFLFVBQTVDLEVBQXVELENBQXZEO0FBQ0EsR0EvS087QUFnTFJLLEVBQUFBLEtBaExRLG1CQWdMQTtBQUNKLFNBQUtWLEdBQUw7O0FBQ0EsUUFBRyxLQUFLRCxTQUFMLEdBQWUsS0FBS0MsR0FBcEIsSUFBeUIsQ0FBNUIsRUFBOEI7QUFDN0IsV0FBS3pFLFdBQUwsQ0FBaUJ1RSxNQUFqQixHQUF3QixNQUFJLEtBQUtDLFNBQUwsR0FBZSxLQUFLQyxHQUF4QixDQUF4QixDQUQ2QixDQUU3QjtBQUNBLEtBSEQsTUFHSztBQUNKLFdBQUtoRixLQUFMLENBQVd5QixNQUFYLEdBQW9CLEtBQXBCO0FBQ0ksV0FBS2dELFVBQUwsQ0FBZ0IsS0FBS2lCLEtBQXJCO0FBQ0o7QUFDSixHQXpMTztBQTBMUmhCLEVBQUFBLE1BMUxRLG9CQTBMQTtBQUNQLFNBQUtNLEdBQUwsSUFBVSxDQUFWOztBQUNBLFFBQUcsS0FBS0QsU0FBTCxHQUFlLEtBQUtDLEdBQXBCLEdBQXdCLENBQTNCLEVBQTZCO0FBQzVCLFdBQUt4RSxtQkFBTCxDQUF5QnNFLE1BQXpCLEdBQWdDLE1BQUksS0FBS0MsU0FBTCxHQUFlLEtBQUtDLEdBQXhCLENBQWhDO0FBRUEsS0FIRCxNQUdLO0FBQ0osV0FBSzlFLGNBQUwsQ0FBb0J1QixNQUFwQixHQUE2QixLQUE3QjtBQUNBLFdBQUtnRCxVQUFMLENBQWdCLEtBQUtDLE1BQXJCO0FBQ0E7QUFDRCxHQW5NTztBQW9NTGlCLEVBQUFBLE1BcE1LLG9CQW9NSztBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDTixTQUFLNUUsUUFBTCxHQWhCWSxDQWlCTjs7QUFDQUgseUJBQVNDLE1BQVQsQ0FBZ0IrRSxXQUFoQixDQUE0QixVQUFTbkQsSUFBVCxFQUFjO0FBQ3RDWSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxnQkFBY0MsSUFBSSxDQUFDQyxTQUFMLENBQWVmLElBQWYsQ0FBMUI7QUFDVCxXQUFLRCxZQUFMLENBQWtCQyxJQUFsQixFQUYrQyxDQUd0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUgsS0FmMkIsQ0FlMUJPLElBZjBCLENBZXJCLElBZnFCLENBQTVCLEVBbEJNLENBbUNOOzs7QUFDQXBDLHlCQUFTQyxNQUFULENBQWdCZ0YsYUFBaEIsQ0FBOEIsVUFBU3BELElBQVQsRUFBYztBQUN4Q1ksTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksa0JBQWdCQyxJQUFJLENBQUNDLFNBQUwsQ0FBZWYsSUFBZixDQUE1QixFQUR3QyxDQUV4Qzs7QUFDQSxXQUFLdkIsb0JBQUwsR0FBNEJ1QixJQUFJLENBQUNrQyxVQUFqQyxDQUh3QyxDQUl6Qzs7QUFDTCxVQUFHbEMsSUFBSSxDQUFDa0MsVUFBTCxJQUFpQi9ELHFCQUFTZ0UsVUFBVCxDQUFvQkMsU0FBeEMsRUFBbUQ7QUFFekMsYUFBSzdFLEtBQUwsQ0FBV3lCLE1BQVgsR0FBb0IsSUFBcEI7QUFFWixhQUFLbEIsV0FBTCxDQUFpQnVFLE1BQWpCLEdBQXdCLE1BQUlyQyxJQUFJLENBQUNzQyxTQUFMLEdBQWV0QyxJQUFJLENBQUN1QyxHQUF4QixDQUF4QjtBQUNBLGFBQUtELFNBQUwsR0FBZ0J0QyxJQUFJLENBQUNzQyxTQUFyQjtBQUNBLGFBQUtDLEdBQUwsR0FBU3ZDLElBQUksQ0FBQ3VDLEdBQWQsQ0FOcUQsQ0FPckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsYUFBS1AsVUFBTCxDQUFnQixLQUFLaUIsS0FBckI7QUFDQyxhQUFLVCxRQUFMLENBQWMsS0FBS1MsS0FBbkIsRUFBMEIsQ0FBMUI7QUFFUSxPQXBCUCxNQW9CVztBQUNiLGFBQUsxRixLQUFMLENBQVd5QixNQUFYLEdBQW9CLEtBQXBCO0FBQ0E7O0FBQ0QsV0FBS0csSUFBTCxDQUFVQyxNQUFWLENBQWlCVSxJQUFqQixDQUFzQixjQUF0QixFQUFxQ0UsSUFBckM7QUFHTSxLQS9CNkIsQ0ErQjVCTyxJQS9CNEIsQ0ErQnZCLElBL0J1QixDQUE5QixFQXBDTSxDQXFFTjs7O0FBQ0FwQyx5QkFBU0MsTUFBVCxDQUFnQmlGLFlBQWhCLENBQTZCLFVBQVNyRCxJQUFULEVBQWM7QUFDdkNZLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDJCQUF5QkMsSUFBSSxDQUFDQyxTQUFMLENBQWVmLElBQWYsQ0FBckM7QUFDVFksTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksRUFBWjtBQUVBLFdBQUtrQixpQkFBTCxDQUF1Qi9CLElBQXZCLEVBSmdELENBS3ZDO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdNLEtBckM0QixDQXFDM0JPLElBckMyQixDQXFDdEIsSUFyQ3NCLENBQTdCOztBQXVDQXBDLHlCQUFTQyxNQUFULENBQWdCa0YsWUFBaEIsQ0FBNkIsVUFBU3RELElBQVQsRUFBYztBQUMxQ1ksTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkseUJBQXVCYixJQUFuQyxFQUQwQyxDQUUxQzs7QUFHSnVELE1BQUFBLEtBQUssQ0FBQ3JGLElBQU4sQ0FBVyxVQUFROEIsSUFBSSxDQUFDd0QsWUFBTCxHQUFrQixDQUFsQixHQUFvQixLQUFwQixHQUEwQixNQUFsQyxJQUEwQyxHQUExQyxHQUE4Q3hELElBQUksQ0FBQ3dELFlBQTlELEVBTDhDLENBUWhEO0FBQ0E7QUFDQTtBQUNFO0FBQ0Y7QUFFQTs7QUFDQSxXQUFLbEYsUUFBTCxHQWZnRCxDQWdCaEQ7QUFFTSxLQWxCNEIsQ0FrQjNCaUMsSUFsQjJCLENBa0J0QixJQWxCc0IsQ0FBN0IsRUE3R00sQ0FrSU47OztBQUNBcEMseUJBQVNDLE1BQVQsQ0FBZ0JxRixvQkFBaEIsQ0FBcUMsVUFBU3pELElBQVQsRUFBYztBQUMvQztBQUNBWSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSx5QkFBdUJDLElBQUksQ0FBQ0MsU0FBTCxDQUFlZixJQUFmLENBQW5DO0FBRUEsV0FBS3lDLFdBQUwsQ0FBaUJ6QyxJQUFqQixFQUorQyxDQUsvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0gsS0F0Qm9DLENBc0JuQ08sSUF0Qm1DLENBc0I5QixJQXRCOEIsQ0FBckMsRUFuSU0sQ0EySk47OztBQUNBLFNBQUtwQixJQUFMLENBQVV1RSxFQUFWLENBQWEsd0JBQWIsRUFBc0MsVUFBUzFELElBQVQsRUFBYztBQUNoRFksTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEJBQVosRUFBeUMsQ0FBQ2IsSUFBMUM7QUFFUCxXQUFLUSxpQkFBTCxDQUF1QlIsSUFBdkIsRUFIdUQsQ0FJaEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFDQSxVQUFHN0IscUJBQVNnRSxVQUFULENBQW9CQyxTQUFwQixJQUErQmpFLHFCQUFTZ0UsVUFBVCxDQUFvQndCLGdCQUF0RCxFQUF1RTtBQUNuRSxhQUFLdEQsWUFBTCxDQUFrQixLQUFLdUQsYUFBTCxDQUFtQnJELElBQW5CLENBQXdCLElBQXhCLENBQWxCLEVBQWdELEdBQWhEO0FBQ0g7QUFHSixLQXRDcUMsQ0FzQ3BDQSxJQXRDb0MsQ0FzQy9CLElBdEMrQixDQUF0QyxFQTVKTSxDQW9NTjs7QUFDQSxTQUFLcEIsSUFBTCxDQUFVdUUsRUFBVixDQUFhLG1CQUFiLEVBQWlDLFVBQVNHLEtBQVQsRUFBZTtBQUM1Q2pELE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHVCQUFxQkMsSUFBSSxDQUFDQyxTQUFMLENBQWU4QyxLQUFmLENBQWpDO0FBQ0EsVUFBSUMsTUFBTSxHQUFHRCxLQUFiO0FBQ0EsV0FBS2hGLGdCQUFMLENBQXNCa0UsSUFBdEIsQ0FBMkJlLE1BQTNCO0FBQ0gsS0FKZ0MsQ0FJL0J2RCxJQUorQixDQUkxQixJQUowQixDQUFqQztBQU1BLFNBQUtwQixJQUFMLENBQVV1RSxFQUFWLENBQWEscUJBQWIsRUFBbUMsVUFBU0csS0FBVCxFQUFlO0FBQzlDakQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkseUJBQXdCZ0QsS0FBcEM7QUFDQSxVQUFJQyxNQUFNLEdBQUdELEtBQWI7O0FBQ0EsV0FBSSxJQUFJdkUsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtULGdCQUFMLENBQXNCVyxNQUFwQyxFQUEyQ0YsQ0FBQyxFQUE1QyxFQUErQztBQUMzQyxZQUFHLEtBQUtULGdCQUFMLENBQXNCUyxDQUF0QixFQUF5QnlFLE1BQXpCLElBQWlDRCxNQUFwQyxFQUEyQztBQUN2QyxlQUFLakYsZ0JBQUwsQ0FBc0JtRixNQUF0QixDQUE2QjFFLENBQTdCLEVBQStCLENBQS9CO0FBQ0g7QUFDSjtBQUNKLEtBUmtDLENBUWpDaUIsSUFSaUMsQ0FRNUIsSUFSNEIsQ0FBbkM7QUFVSCxHQXpaSTtBQTJaTDBELEVBQUFBLEtBM1pLLG1CQTJaSSxDQUVSLENBN1pJO0FBK1pMO0FBQ0EzRCxFQUFBQSxtQkFoYUssaUNBZ2FnQjtBQUNqQjtBQUNBLFFBQUcsS0FBS0osY0FBTCxHQUFzQixDQUF6QixFQUEyQjtBQUN2QlUsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWixFQUR1QixDQUV2QjtBQUNBOztBQUNBLFdBQUtuQyxTQUFMLEdBQWlCLElBQWpCOztBQUNBLFVBQUcsS0FBS0Qsb0JBQUwsSUFBMkJOLHFCQUFTZ0UsVUFBVCxDQUFvQkMsU0FBbEQsRUFBNEQ7QUFDeEQsYUFBSzdFLEtBQUwsQ0FBV3lCLE1BQVgsR0FBb0IsSUFBcEI7QUFDSDs7QUFFRCxVQUFHb0IsWUFBSCxFQUFnQjtBQUNaO0FBQ0FyRCxRQUFBQSxFQUFFLENBQUM0RSxXQUFILENBQWV1QyxJQUFmLENBQW9CLEtBQUtDLGFBQXpCO0FBQ0gsT0Fac0IsQ0FlckI7OztBQUNGLFVBQUlDLFNBQVMsR0FBRyxLQUFLM0Ysb0JBQXJCLENBaEJ1QixDQWlCdkI7O0FBRUE7QUFDSCxLQXRCZ0IsQ0F3QmpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFRDs7O0FBQ0MsUUFBSTRGLFNBQVMsR0FBRyxLQUFLOUYsVUFBTCxDQUFnQixLQUFLQSxVQUFMLENBQWdCaUIsTUFBaEIsR0FBdUIsS0FBS1UsY0FBNUIsR0FBMkMsQ0FBM0QsQ0FBaEI7QUFDTixRQUFHbUUsU0FBUyxJQUFFLElBQWQsRUFBbUI7QUFDYkEsSUFBQUEsU0FBUyxDQUFDckYsTUFBVixHQUFtQixJQUFuQjtBQUNBLFNBQUtELGFBQUwsQ0FBbUJnRSxJQUFuQixDQUF3QnNCLFNBQXhCO0FBQ0gsUUFBR2pFLFlBQUgsRUFDRyxLQUFLK0QsYUFBTCxHQUFxQnBILEVBQUUsQ0FBQzRFLFdBQUgsQ0FBZUMsSUFBZixDQUFvQjdFLEVBQUUsQ0FBQzhFLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLDRCQUFYLENBQXBCLENBQXJCOztBQUNBLFNBQUksSUFBSXhDLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQyxLQUFLUCxhQUFMLENBQW1CUyxNQUFuQixHQUEwQixDQUF4QyxFQUEwQ0YsQ0FBQyxFQUEzQyxFQUE4QztBQUN0QyxVQUFJK0UsU0FBUyxHQUFHLEtBQUt0RixhQUFMLENBQW1CTyxDQUFuQixDQUFoQjtBQUNBLFVBQUlnRixJQUFJLEdBQUdELFNBQVMsQ0FBQ0UsQ0FBVixHQUFlLEtBQUsvRixVQUFMLEdBQWtCLEdBQTVDO0FBQ0EsVUFBSWdHLE1BQU0sR0FBR3pILEVBQUUsQ0FBQzBILE1BQUgsQ0FBVSxHQUFWLEVBQWUxSCxFQUFFLENBQUMySCxFQUFILENBQU1KLElBQU4sRUFBWSxDQUFDLEdBQWIsQ0FBZixDQUFiO0FBQ0FELE1BQUFBLFNBQVMsQ0FBQzlDLFNBQVYsQ0FBb0JpRCxNQUFwQjtBQUNQOztBQUVELFNBQUt0RSxjQUFMLEdBL0NpQixDQWdEdkI7O0FBQ00sU0FBS0csWUFBTCxDQUFrQixLQUFLQyxtQkFBTCxDQUF5QkMsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBbEIsRUFBc0QsSUFBdEQ7QUFDSCxHQWxkSTtBQW9kTDtBQUNBb0UsRUFBQUEsUUFyZEssc0JBcWRLO0FBQ04sU0FBS3BHLFVBQUwsQ0FBZ0JxRyxJQUFoQixDQUFxQixVQUFTTCxDQUFULEVBQVdNLENBQVgsRUFBYTtBQUM5QixVQUFJQyxDQUFDLEdBQUdQLENBQUMsQ0FBQ2xGLFlBQUYsQ0FBZSxNQUFmLEVBQXVCWSxTQUEvQjtBQUNBLFVBQUk4RSxDQUFDLEdBQUdGLENBQUMsQ0FBQ3hGLFlBQUYsQ0FBZSxNQUFmLEVBQXVCWSxTQUEvQjs7QUFFQSxVQUFJNkUsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE9BQWpCLEtBQTZCRCxDQUFDLENBQUNDLGNBQUYsQ0FBaUIsT0FBakIsQ0FBakMsRUFBNEQ7QUFDeEQsZUFBUUQsQ0FBQyxDQUFDRSxLQUFGLEdBQVFILENBQUMsQ0FBQ0csS0FBbEI7QUFDSDs7QUFDRCxVQUFJSCxDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsS0FBNEIsQ0FBQ0QsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWpDLEVBQTJEO0FBQ3ZELGVBQU8sQ0FBQyxDQUFSO0FBQ0g7O0FBQ0QsVUFBSSxDQUFDRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsQ0FBRCxJQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWpDLEVBQTJEO0FBQ3ZELGVBQU8sQ0FBUDtBQUNIOztBQUNELFVBQUlGLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixNQUFqQixLQUE0QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWhDLEVBQTBEO0FBQ3RELGVBQVFELENBQUMsQ0FBQ0csSUFBRixHQUFPSixDQUFDLENBQUNJLElBQWpCO0FBQ0g7QUFDSixLQWhCRCxFQURNLENBa0JOO0FBQ0E7QUFDQTs7QUFDQSxRQUFJQyxPQUFPLEdBQUcsSUFBZDtBQUNBQyxJQUFBQSxVQUFVLENBQUMsWUFBVTtBQUNqQjtBQUNBLFVBQUliLENBQUMsR0FBRyxLQUFLaEcsVUFBTCxDQUFnQixDQUFoQixFQUFtQmdHLENBQTNCO0FBQ0EzRCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxZQUFXMEQsQ0FBdkI7O0FBQ0EsV0FBSyxJQUFJakYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLZixVQUFMLENBQWdCaUIsTUFBcEMsRUFBNENGLENBQUMsRUFBN0MsRUFBaUQ7QUFDN0MsWUFBSW1CLElBQUksR0FBRyxLQUFLbEMsVUFBTCxDQUFnQmUsQ0FBaEIsQ0FBWDtBQUNBbUIsUUFBQUEsSUFBSSxDQUFDNEUsTUFBTCxHQUFjL0YsQ0FBZCxDQUY2QyxDQUU1Qjs7QUFDakJtQixRQUFBQSxJQUFJLENBQUM4RCxDQUFMLEdBQVNBLENBQUMsR0FBRzlELElBQUksQ0FBQzZFLEtBQUwsR0FBYSxHQUFiLEdBQW1CaEcsQ0FBaEM7QUFDSDtBQUNKLEtBVFUsQ0FTVGlCLElBVFMsQ0FTSixJQVRJLENBQUQsRUFTSTRFLE9BVEosQ0FBVjtBQVlILEdBdmZJO0FBMGZMaEYsRUFBQUEsUUExZkssb0JBMGZJSCxJQTFmSixFQTBmUztBQUFDO0FBQ2YsUUFBSUEsSUFBSixFQUFVO0FBQ0ZBLE1BQUFBLElBQUksQ0FBQzRFLElBQUwsQ0FBVSxVQUFVRSxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDdEIsWUFBSUQsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE9BQWpCLEtBQTZCRCxDQUFDLENBQUNDLGNBQUYsQ0FBaUIsT0FBakIsQ0FBakMsRUFBNEQ7QUFDeEQsaUJBQU9ELENBQUMsQ0FBQ0UsS0FBRixHQUFVSCxDQUFDLENBQUNHLEtBQW5CO0FBQ0g7O0FBQ0QsWUFBSUgsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE1BQWpCLEtBQTRCLENBQUNELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFqQyxFQUEyRDtBQUN2RCxpQkFBTyxDQUFDLENBQVI7QUFDSDs7QUFDRCxZQUFJLENBQUNGLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixNQUFqQixDQUFELElBQTZCRCxDQUFDLENBQUNDLGNBQUYsQ0FBaUIsTUFBakIsQ0FBakMsRUFBMkQ7QUFDdkQsaUJBQU8sQ0FBUDtBQUNIOztBQUNELFlBQUlGLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixNQUFqQixLQUE0QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWhDLEVBQTBEO0FBQ3RELGlCQUFPRCxDQUFDLENBQUNHLElBQUYsR0FBU0osQ0FBQyxDQUFDSSxJQUFsQjtBQUNIO0FBQ0osT0FiRDtBQWNILEtBaEJTLENBaUJaOzs7QUFDQSxTQUFLM0csVUFBTCxHQUFrQixFQUFsQjs7QUFDQSxTQUFJLElBQUllLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQ1UsSUFBSSxDQUFDUixNQUFuQixFQUEwQkYsQ0FBQyxFQUEzQixFQUE4QjtBQUU1QixVQUFJbUIsSUFBSSxHQUFHMUQsRUFBRSxDQUFDK0YsV0FBSCxDQUFlLEtBQUt6RixXQUFwQixDQUFYO0FBQ0FvRCxNQUFBQSxJQUFJLENBQUM4RSxLQUFMLEdBQVcsR0FBWDtBQUNBOUUsTUFBQUEsSUFBSSxDQUFDckIsTUFBTCxHQUFjLEtBQUt4QixTQUFuQixDQUo0QixDQUs1Qjs7QUFDQTZDLE1BQUFBLElBQUksQ0FBQzhELENBQUwsR0FBUzlELElBQUksQ0FBQzZFLEtBQUwsR0FBYSxHQUFiLEdBQW9CLENBQUMsR0FBckIsR0FBNkIsQ0FBQyxFQUE5QixHQUFvQzdFLElBQUksQ0FBQzZFLEtBQUwsR0FBYSxHQUFiLEdBQW1CLENBQWhFLENBTjRCLENBTzVCOztBQUNBN0UsTUFBQUEsSUFBSSxDQUFDb0UsQ0FBTCxHQUFTLENBQUMsR0FBVjtBQUNBcEUsTUFBQUEsSUFBSSxDQUFDekIsTUFBTCxHQUFjLEtBQWQ7QUFFQXlCLE1BQUFBLElBQUksQ0FBQ3BCLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJpQyxTQUExQixDQUFvQ3RCLElBQUksQ0FBQ1YsQ0FBRCxDQUF4QyxFQUE0Q25CLHFCQUFTZ0UsVUFBVCxDQUFvQkMsU0FBaEUsRUFYNEIsQ0FZNUI7O0FBQ0EsV0FBSzdELFVBQUwsQ0FBZ0J3RSxJQUFoQixDQUFxQnRDLElBQXJCO0FBQ0EsV0FBS2pDLFVBQUwsR0FBa0JpQyxJQUFJLENBQUM2RSxLQUF2QjtBQUNELEtBbENXLENBb0NaOzs7QUFDQSxTQUFLM0csV0FBTCxHQUFtQixFQUFuQjs7QUFDQSxTQUFJLElBQUlXLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQyxDQUFkLEVBQWdCQSxDQUFDLEVBQWpCLEVBQW9CO0FBQ2xCLFVBQUlrRyxPQUFPLEdBQUd6SSxFQUFFLENBQUMrRixXQUFILENBQWUsS0FBS3pGLFdBQXBCLENBQWQ7QUFDQW1JLE1BQUFBLE9BQU8sQ0FBQ0QsS0FBUixHQUFjLEdBQWQ7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxRQUFSLENBQWlCbEIsQ0FBakIsR0FBcUIsS0FBSy9HLG9CQUFMLENBQTBCaUksUUFBMUIsQ0FBbUNsQixDQUF4RDtBQUNOaUIsTUFBQUEsT0FBTyxDQUFDQyxRQUFSLENBQWlCWixDQUFqQixHQUFtQixDQUFuQixDQUp3QixDQUtsQjtBQUNBOztBQUNBLFVBQUd2RixDQUFDLElBQUUsQ0FBTixFQUFRO0FBRUprRyxRQUFBQSxPQUFPLENBQUNqQixDQUFSLEdBQVlpQixPQUFPLENBQUNqQixDQUFSLEdBQVlpQixPQUFPLENBQUNGLEtBQVIsR0FBYyxHQUF0QztBQUNILE9BSEQsTUFHTSxJQUFHaEcsQ0FBQyxJQUFFLENBQU4sRUFBUTtBQUNWa0csUUFBQUEsT0FBTyxDQUFDakIsQ0FBUixHQUFZaUIsT0FBTyxDQUFDakIsQ0FBUixHQUFZaUIsT0FBTyxDQUFDRixLQUFSLEdBQWMsR0FBdEM7QUFDSCxPQVppQixDQWVsQjtBQUNBOzs7QUFDQUUsTUFBQUEsT0FBTyxDQUFDcEcsTUFBUixHQUFpQixLQUFLNUIsb0JBQXRCLENBakJrQixDQWlCeUI7QUFDM0M7O0FBQ0EsV0FBS21CLFdBQUwsQ0FBaUJvRSxJQUFqQixDQUFzQnlDLE9BQXRCO0FBQ0Q7QUFFRixHQXRqQkk7QUF3akJMO0FBQ0FFLEVBQUFBLHFCQXpqQkssbUNBeWpCa0I7QUFDbkIsU0FBSSxJQUFJcEcsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtmLFVBQUwsQ0FBZ0JpQixNQUE5QixFQUFxQ0YsQ0FBQyxFQUF0QyxFQUF5QztBQUNyQyxVQUFJbUIsSUFBSSxHQUFHLEtBQUtsQyxVQUFMLENBQWdCZSxDQUFoQixDQUFYOztBQUNBLFVBQUdtQixJQUFJLENBQUNvRSxDQUFMLElBQVEsQ0FBQyxHQUFaLEVBQWdCO0FBQ1pwRSxRQUFBQSxJQUFJLENBQUNvRSxDQUFMLEdBQVMsQ0FBQyxHQUFWO0FBQ0g7QUFDSjtBQUNKLEdBaGtCSTtBQWlrQkw7QUFDQWpCLEVBQUFBLGFBbGtCSywyQkFra0JVO0FBQ1g7QUFDQSxRQUFJK0IsV0FBVyxHQUFJLEtBQUtwSCxVQUFMLENBQWdCLEtBQUtBLFVBQUwsQ0FBZ0JpQixNQUFoQixHQUF1QixDQUF2QyxFQUEwQytFLENBQTdEOztBQUNBLFNBQUksSUFBSWpGLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQyxLQUFLVixnQkFBTCxDQUFzQlksTUFBcEMsRUFBMkNGLENBQUMsRUFBNUMsRUFBK0M7QUFDM0MsVUFBSW1CLElBQUksR0FBRzFELEVBQUUsQ0FBQytGLFdBQUgsQ0FBZSxLQUFLekYsV0FBcEIsQ0FBWDtBQUNBb0QsTUFBQUEsSUFBSSxDQUFDOEUsS0FBTCxHQUFXLEdBQVg7QUFDQTlFLE1BQUFBLElBQUksQ0FBQ3JCLE1BQUwsR0FBYyxLQUFLeEIsU0FBbkI7QUFFQTZDLE1BQUFBLElBQUksQ0FBQzhELENBQUwsR0FBU29CLFdBQVcsR0FBSSxDQUFDckcsQ0FBQyxHQUFDLENBQUgsSUFBTSxLQUFLZCxVQUFYLEdBQXdCLEdBQWhEO0FBQ0FpQyxNQUFBQSxJQUFJLENBQUNvRSxDQUFMLEdBQVMsQ0FBQyxHQUFWLENBTjJDLENBTTVCO0FBRWY7O0FBQ0FwRSxNQUFBQSxJQUFJLENBQUNwQixZQUFMLENBQWtCLE1BQWxCLEVBQTBCaUMsU0FBMUIsQ0FBb0MsS0FBSzFDLGdCQUFMLENBQXNCVSxDQUF0QixDQUFwQyxFQUE2RG5CLHFCQUFTZ0UsVUFBVCxDQUFvQkMsU0FBakY7QUFDQTNCLE1BQUFBLElBQUksQ0FBQ3pCLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBS1QsVUFBTCxDQUFnQndFLElBQWhCLENBQXFCdEMsSUFBckI7QUFDSDs7QUFFRCxTQUFLa0UsUUFBTCxHQWpCVyxDQWtCWDs7QUFDQSxTQUFLdEUsWUFBTCxDQUFrQixLQUFLcUYscUJBQUwsQ0FBMkJuRixJQUEzQixDQUFnQyxJQUFoQyxDQUFsQixFQUF3RCxDQUF4RDtBQUVILEdBdmxCSTtBQXlsQkxxRixFQUFBQSxXQXpsQkssdUJBeWxCT2hHLFNBemxCUCxFQXlsQmlCaUcsV0F6bEJqQixFQXlsQjZCO0FBQzlCLFFBQUdBLFdBQVcsQ0FBQ3JHLE1BQVosSUFBb0IsQ0FBdkIsRUFBeUI7QUFDckI7QUFDSDtBQUVEOzs7Ozs7Ozs7O0FBVUE7OztBQUNBLFFBQUlzRyxZQUFZLEdBQUcsRUFBbkI7O0FBQ0EsU0FBSSxJQUFJeEcsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDdUcsV0FBVyxDQUFDckcsTUFBMUIsRUFBaUNGLENBQUMsRUFBbEMsRUFBcUM7QUFDakMsV0FBSSxJQUFJeUcsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUt4SCxVQUFMLENBQWdCaUIsTUFBOUIsRUFBcUN1RyxDQUFDLEVBQXRDLEVBQXlDO0FBQ3JDLFlBQUlDLE9BQU8sR0FBRyxLQUFLekgsVUFBTCxDQUFnQndILENBQWhCLEVBQW1CMUcsWUFBbkIsQ0FBZ0MsTUFBaEMsRUFBd0MyRyxPQUF0RDs7QUFDQSxZQUFHQSxPQUFPLElBQUVILFdBQVcsQ0FBQ3ZHLENBQUQsQ0FBWCxDQUFleUUsTUFBM0IsRUFBa0M7QUFDOUJuRCxVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxxQkFBbUJtRixPQUEvQixFQUQ4QixDQUU5Qjs7QUFDQSxlQUFLekgsVUFBTCxDQUFnQndILENBQWhCLEVBQW1CRSxnQkFBbkIsQ0FBb0MsSUFBcEMsRUFIOEIsQ0FJN0M7O0FBQ2VILFVBQUFBLFlBQVksQ0FBQy9DLElBQWIsQ0FBa0IsS0FBS3hFLFVBQUwsQ0FBZ0J3SCxDQUFoQixDQUFsQjtBQUNBLGVBQUt4SCxVQUFMLENBQWdCeUYsTUFBaEIsQ0FBdUIrQixDQUF2QixFQUF5QixDQUF6QjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFLRyxvQkFBTCxDQUEwQnRHLFNBQTFCLEVBQW9Da0csWUFBcEM7QUFDQSxTQUFLSyxXQUFMO0FBRUgsR0EzbkJJO0FBNm5CTDtBQUNBeEcsRUFBQUEsWUE5bkJLLHdCQThuQlFDLFNBOW5CUixFQThuQmtCO0FBQ25CLFFBQUlWLGdCQUFnQixHQUFHLEtBQUtDLElBQUwsQ0FBVUMsTUFBVixDQUFpQkMsWUFBakIsQ0FBOEIsV0FBOUIsQ0FBdkI7QUFDQSxRQUFJcUQsWUFBWSxHQUFHeEQsZ0JBQWdCLENBQUN5RCwwQkFBakIsQ0FBNEMvQyxTQUE1QyxDQUFuQjs7QUFDTixRQUFHOEMsWUFBWSxJQUFFLElBQWpCLEVBQXNCO0FBQUM7QUFBUTs7QUFDekIsUUFBSTBELFFBQVEsR0FBRzFELFlBQVksQ0FBQzBELFFBQTVCOztBQUNBLFNBQUksSUFBSTlHLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQzhHLFFBQVEsQ0FBQzVHLE1BQXZCLEVBQThCRixDQUFDLEVBQS9CLEVBQWtDO0FBQzlCLFVBQUltQixJQUFJLEdBQUcyRixRQUFRLENBQUM5RyxDQUFELENBQW5CO0FBQ0FtQixNQUFBQSxJQUFJLENBQUM0RixPQUFMO0FBQ0g7O0FBQ0QzRCxJQUFBQSxZQUFZLENBQUNoRCxpQkFBYixDQUErQixJQUEvQjtBQUNILEdBeG9CSTtBQXlvQkw7QUFDQTRHLEVBQUFBLFlBMW9CSyx3QkEwb0JRekQsS0Exb0JSLEVBMG9CYztBQUNmLFFBQUdBLEtBQUssQ0FBQ3JELE1BQU4sSUFBYyxDQUFqQixFQUFtQjtBQUNmO0FBQ0g7O0FBQ0RxRCxJQUFBQSxLQUFLLENBQUMrQixJQUFOLENBQVcsVUFBU0wsQ0FBVCxFQUFXTSxDQUFYLEVBQWE7QUFDcEIsVUFBSUMsQ0FBQyxHQUFHUCxDQUFDLENBQUNsRixZQUFGLENBQWUsTUFBZixFQUF1QlksU0FBL0I7QUFDQSxVQUFJOEUsQ0FBQyxHQUFHRixDQUFDLENBQUN4RixZQUFGLENBQWUsTUFBZixFQUF1QlksU0FBL0I7O0FBRUEsVUFBSTZFLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixPQUFqQixLQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE9BQWpCLENBQWpDLEVBQTREO0FBQ3hELGVBQU9ELENBQUMsQ0FBQ0UsS0FBRixHQUFVSCxDQUFDLENBQUNHLEtBQW5CO0FBQ0g7O0FBQ0QsVUFBSUgsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE1BQWpCLEtBQTRCLENBQUNELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFqQyxFQUEyRDtBQUN2RCxlQUFPLENBQUMsQ0FBUjtBQUNIOztBQUNELFVBQUksQ0FBQ0YsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE1BQWpCLENBQUQsSUFBNkJELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFqQyxFQUEyRDtBQUN2RCxlQUFPLENBQVA7QUFDSDs7QUFDRCxVQUFJRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsS0FBNEJELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFoQyxFQUEwRDtBQUN0RCxlQUFPRCxDQUFDLENBQUNHLElBQUYsR0FBU0osQ0FBQyxDQUFDSSxJQUFsQjtBQUNIO0FBQ0osS0FoQkQ7QUFpQkgsR0EvcEJJO0FBaXFCTGxDLEVBQUFBLHlCQWpxQksscUNBaXFCcUJOLFlBanFCckIsRUFpcUJrQ0csS0FqcUJsQyxFQWlxQndDMEQsT0FqcUJ4QyxFQWlxQmdEO0FBQ2xEN0QsSUFBQUEsWUFBWSxDQUFDaEQsaUJBQWIsQ0FBK0IsSUFBL0IsRUFEa0QsQ0FHbEQ7QUFDQTs7QUFDQSxTQUFJLElBQUlKLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQ3VELEtBQUssQ0FBQ3JELE1BQXBCLEVBQTJCRixDQUFDLEVBQTVCLEVBQStCO0FBQzNCLFVBQUltQixJQUFJLEdBQUdvQyxLQUFLLENBQUN2RCxDQUFELENBQWhCO0FBQ0FvRCxNQUFBQSxZQUFZLENBQUM4RCxRQUFiLENBQXNCL0YsSUFBdEIsRUFBMkIsTUFBSW5CLENBQS9CLEVBRjJCLENBRU87QUFDckMsS0FSaUQsQ0FVbEQ7QUFDQTs7O0FBQ0EsUUFBSW1ILE1BQU0sR0FBRzVELEtBQUssQ0FBQ3JELE1BQU4sR0FBZSxDQUE1QixDQVprRCxDQWFsRDs7QUFDQSxTQUFJLElBQUlGLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQ3VELEtBQUssQ0FBQ3JELE1BQXBCLEVBQTJCRixDQUFDLEVBQTVCLEVBQStCO0FBQzlCLFVBQUlvSCxRQUFRLEdBQUdoRSxZQUFZLENBQUNpRSxXQUFiLEdBQTJCckgsQ0FBM0IsQ0FBZjtBQUNBLFVBQUlpRixDQUFDLEdBQUcsQ0FBQ2pGLENBQUMsR0FBR21ILE1BQUwsSUFBZSxFQUF2QjtBQUNBLFVBQUk1QixDQUFDLEdBQUc2QixRQUFRLENBQUM3QixDQUFULEdBQVcwQixPQUFuQixDQUg4QixDQUdGO0FBQzVCOztBQUNBRyxNQUFBQSxRQUFRLENBQUNFLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUIsR0FBdkI7QUFDQUYsTUFBQUEsUUFBUSxDQUFDRyxXQUFULENBQXFCdEMsQ0FBckIsRUFBdUJNLENBQXZCO0FBRUE7QUFDSCxHQXhyQkk7QUF5ckJMO0FBQ0E7QUFDQXFCLEVBQUFBLG9CQTNyQkssZ0NBMnJCZ0J0RyxTQTNyQmhCLEVBMnJCMEJrRyxZQTNyQjFCLEVBMnJCdUM7QUFDeEMsUUFBR0EsWUFBWSxDQUFDdEcsTUFBYixJQUFxQixDQUF4QixFQUEwQixDQUV6QixDQUZELENBQ0c7QUFFSDs7O0FBQ0QsU0FBSzhHLFlBQUwsQ0FBa0JSLFlBQWxCLEVBTHlDLENBTXpDOztBQUNBLFFBQUk1RyxnQkFBZ0IsR0FBRyxLQUFLQyxJQUFMLENBQVVDLE1BQVYsQ0FBaUJDLFlBQWpCLENBQThCLFdBQTlCLENBQXZCLENBUHlDLENBUXpDOztBQUNBLFFBQUlxRCxZQUFZLEdBQUd4RCxnQkFBZ0IsQ0FBQ3lELDBCQUFqQixDQUE0Qy9DLFNBQTVDLENBQW5CO0FBQ0EsU0FBS29ELHlCQUFMLENBQStCTixZQUEvQixFQUE0Q29ELFlBQTVDLEVBQXlELEdBQXpELEVBVnlDLENBV3pDO0FBRUYsR0F4c0JJO0FBMHNCTDtBQUNBSyxFQUFBQSxXQTNzQksseUJBMnNCUTtBQUVULFFBQUlXLFNBQVMsR0FBRyxLQUFLdkksVUFBTCxDQUFnQmlCLE1BQWhCLEdBQXlCLENBQXpDLENBRlMsQ0FHVDs7QUFDQSxTQUFJLElBQUlGLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQyxLQUFLZixVQUFMLENBQWdCaUIsTUFBOUIsRUFBcUNGLENBQUMsRUFBdEMsRUFBeUM7QUFDckMsVUFBSW9ILFFBQVEsR0FBRyxLQUFLbkksVUFBTCxDQUFnQmUsQ0FBaEIsQ0FBZjtBQUNBLFVBQUlpRixDQUFDLEdBQUcsQ0FBQ2pGLENBQUMsR0FBR3dILFNBQUwsS0FBaUIsS0FBS3RJLFVBQUwsR0FBa0IsR0FBbkMsQ0FBUjtBQUNBa0ksTUFBQUEsUUFBUSxDQUFDRyxXQUFULENBQXFCdEMsQ0FBckIsRUFBd0IsQ0FBQyxHQUF6QjtBQUNIO0FBRUosR0FydEJJO0FBdXRCTHdDLEVBQUFBLGlCQXZ0QkssNkJBdXRCYUMsU0F2dEJiLEVBdXRCdUI7QUFDeEJwRyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSx1QkFBcUJtRyxTQUFqQzs7QUFFQSxRQUFHQSxTQUFTLElBQUUsRUFBZCxFQUFpQjtBQUNiO0FBQ0g7O0FBRUQsWUFBT0EsU0FBUDtBQUNJLFdBQUtDLFVBQVUsQ0FBQ0MsR0FBWCxDQUFlQyxJQUFwQjtBQUNJOztBQUNKLFdBQUtGLFVBQVUsVUFBVixDQUFrQkUsSUFBdkI7QUFDUSxZQUFHL0csWUFBSCxFQUFnQjtBQUNackQsVUFBQUEsRUFBRSxDQUFDNEUsV0FBSCxDQUFlQyxJQUFmLENBQW9CN0UsRUFBRSxDQUFDOEUsR0FBSCxDQUFPQyxHQUFQLENBQVcsMkJBQVgsQ0FBcEI7QUFDRjs7QUFDTjtBQVBSO0FBU0gsR0F2dUJJO0FBd3VCTDtBQUNBc0YsRUFBQUEsYUF6dUJLLHlCQXl1QlN2RCxLQXp1QlQsRUF5dUJld0QsVUF6dUJmLEVBeXVCMEI7QUFFM0IsWUFBT0EsVUFBUDtBQUNJLFdBQUssWUFBTDtBQUNJekcsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksWUFBWjs7QUFDQTFDLDZCQUFTQyxNQUFULENBQWdCa0osZUFBaEIsQ0FBZ0NDLFVBQVUsQ0FBQ0MsSUFBM0M7O0FBQ1osYUFBS3hGLFVBQUwsQ0FBZ0IsS0FBS2lCLEtBQXJCLEVBSFEsQ0FHbUI7O0FBRWYsYUFBSzFGLEtBQUwsQ0FBV3lCLE1BQVgsR0FBb0IsS0FBcEI7O0FBQ0EsWUFBR29CLFlBQUgsRUFBZ0I7QUFDWnJELFVBQUFBLEVBQUUsQ0FBQzRFLFdBQUgsQ0FBZUMsSUFBZixDQUFvQjdFLEVBQUUsQ0FBQzhFLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLHVDQUFYLENBQXBCO0FBQ0Y7O0FBQ0Y7O0FBQ0osV0FBSyxjQUFMO0FBQ0lsQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxjQUFaOztBQUNBMUMsNkJBQVNDLE1BQVQsQ0FBZ0JrSixlQUFoQixDQUFnQ0MsVUFBVSxDQUFDRSxPQUEzQzs7QUFDWixhQUFLekYsVUFBTCxDQUFnQixLQUFLaUIsS0FBckIsRUFIUSxDQUdtQjs7QUFFZixhQUFLMUYsS0FBTCxDQUFXeUIsTUFBWCxHQUFvQixLQUFwQjs7QUFDQSxZQUFHb0IsWUFBSCxFQUFnQjtBQUNackQsVUFBQUEsRUFBRSxDQUFDNEUsV0FBSCxDQUFlQyxJQUFmLENBQW9CN0UsRUFBRSxDQUFDOEUsR0FBSCxDQUFPQyxHQUFQLENBQVcsbUNBQVgsQ0FBcEI7QUFDRjs7QUFDRDs7QUFDSixXQUFLLFlBQUw7QUFBb0I7QUFDaEIzRCw2QkFBU0MsTUFBVCxDQUFnQnNKLGtCQUFoQixDQUFtQyxFQUFuQyxFQUFzQyxJQUF0Qzs7QUFDQSxhQUFLakssY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTZCLEtBQTdCO0FBQ1osYUFBS2dELFVBQUwsQ0FBZ0IsS0FBS0MsTUFBckIsRUFIUSxDQUdvQjs7QUFDaEI7O0FBQ0osV0FBSyxVQUFMO0FBQW1CO0FBQ2Y7QUFDQSxZQUFHLEtBQUtwRCxnQkFBTCxDQUFzQlcsTUFBdEIsSUFBOEIsQ0FBakMsRUFBbUM7QUFDaEMsZUFBSzlCLFNBQUwsQ0FBZTJFLE1BQWYsR0FBc0IsT0FBdEI7QUFDZixlQUFLNUUsY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTZCLElBQTdCO0FBRWVvRyxVQUFBQSxVQUFVLENBQUMsWUFBVTtBQUNqQixpQkFBSzFILFNBQUwsQ0FBZTJFLE1BQWYsR0FBc0IsRUFBdEI7QUFDSCxXQUZVLENBRVQ5QixJQUZTLENBRUosSUFGSSxDQUFELEVBRUksSUFGSixDQUFWO0FBR2YsaUJBUCtDLENBT3hDO0FBQ007O0FBQ2IsYUFBS3lCLFVBQUwsQ0FBZ0IsS0FBS0MsTUFBckIsRUFYUSxDQVdvQjs7QUFDaEI5RCw2QkFBU0MsTUFBVCxDQUFnQnVKLGdCQUFoQixDQUFpQyxLQUFLOUksZ0JBQXRDLEVBQXVELFVBQVMrSSxHQUFULEVBQWE1SCxJQUFiLEVBQWtCO0FBRXRFLGNBQUc0SCxHQUFILEVBQU87QUFDSGhILFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFvQitHLEdBQWhDO0FBQ0FoSCxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxxQkFBbUJDLElBQUksQ0FBQ0MsU0FBTCxDQUFlZixJQUFmLENBQS9COztBQUNBLGdCQUFHLEtBQUt0QyxTQUFMLENBQWUyRSxNQUFmLElBQXVCLEVBQTFCLEVBQTZCO0FBQ3pCLG1CQUFLM0UsU0FBTCxDQUFlMkUsTUFBZixHQUF3QnJDLElBQUksQ0FBQzZILEdBQTdCO0FBQ0F6QyxjQUFBQSxVQUFVLENBQUMsWUFBVTtBQUNqQixxQkFBSzFILFNBQUwsQ0FBZTJFLE1BQWYsR0FBc0IsRUFBdEI7QUFDSCxlQUZVLENBRVQ5QixJQUZTLENBRUosSUFGSSxDQUFELEVBRUksSUFGSixDQUFWO0FBR0gsYUFSRSxDQVVIOzs7QUFDQSxpQkFBSSxJQUFJakIsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtmLFVBQUwsQ0FBZ0JpQixNQUE5QixFQUFxQ0YsQ0FBQyxFQUF0QyxFQUF5QztBQUNyQyxrQkFBSW1CLElBQUksR0FBRyxLQUFLbEMsVUFBTCxDQUFnQmUsQ0FBaEIsQ0FBWDtBQUNBbUIsY0FBQUEsSUFBSSxDQUFDWCxJQUFMLENBQVUsaUJBQVY7QUFDSDs7QUFDRCxpQkFBS2pCLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0YsV0FoQkYsTUFnQk07QUFDRDtBQUNBK0IsWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksd0JBQXNCQyxJQUFJLENBQUNDLFNBQUwsQ0FBZWYsSUFBZixDQUFsQztBQUNBLGlCQUFLdkMsY0FBTCxDQUFvQnVCLE1BQXBCLEdBQTZCLEtBQTdCLENBSEMsQ0FJRDtBQUNBO0FBQ0E7O0FBQ0EsaUJBQUsrSCxpQkFBTCxDQUF1Qi9HLElBQUksQ0FBQzhILFNBQUwsQ0FBZVgsSUFBdEM7QUFDQSxpQkFBS3ZCLFdBQUwsQ0FBaUI1RixJQUFJLENBQUMrSCxPQUF0QixFQUE4QixLQUFLbEosZ0JBQW5DO0FBQ0EsaUJBQUtBLGdCQUFMLEdBQXdCLEVBQXhCO0FBRUg7QUFFSixTQS9Cc0QsQ0ErQnJEMEIsSUEvQnFELENBK0JoRCxJQS9CZ0QsQ0FBdkQsRUFaSixDQTRDSTs7O0FBQ0E7O0FBQ0osV0FBSyxTQUFMO0FBQ0k7O0FBQ2QsV0FBSyxZQUFMO0FBQWtCO0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQzs7QUFDTztBQUNJO0FBbkdSO0FBcUdIO0FBaDFCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcbmltcG9ydCBzb2NrZXRjdHIgZnJvbSBcIi4uL2RhdGEvc29ja2V0X2N0ci5qc1wiXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBnYW1laW5nVUk6IGNjLk5vZGUsXG4gICAgICAgIGNhcmRfcHJlZmFiOmNjLlByZWZhYixcbiAgICAgICAgcm9iVUk6Y2MuTm9kZSxcbiAgICAgICAgYm90dG9tX2NhcmRfcG9zX25vZGU6Y2MuTm9kZSxcbiAgICAgICAgcGxheWluZ1VJX25vZGU6Y2MuTm9kZSxcbiAgICAgICAgdGlwc0xhYmVsOmNjLkxhYmVsLCAvL+eOqeWutuWHuueJjOS4jeWQiOazleeahHRpcHNcbiAgICAgICAgbXlwYWl2aWV3OmNjLk5vZGUgICxcblx0XHRyZXR1cm5yb29tOmNjLk5vZGUsXG5cdFx0Y2xvY2tfbGFiZWw6Y2MuTGFiZWwsXG5cdFx0cGxheWluZ19jbG9ja19sYWJlbDpjYy5MYWJlbFxuXHRcdFxuICAgIH0sXG4gICAgUmVzZXRVSSgpey8v5rWL6K+V5oyJ6ZKuXG5cdFxuXHQgVG9hc3Quc2hvdyhcIua1i+ivleaMiemSrlwiKTsgXG5cdCBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJlYWR5KClcblx0Ly9teWdsb2JhbC5zb2NrZXQuX3NvY2tldC5jbG9zZSgpO1xuXHQgLy8gICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfcmVzZXQoZnVuY3Rpb24oZGF0YSl7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhcIumHjee9rua4uOaIjyDov5Tlm55cIitkYXRhKTtcblx0XHQvLyBcdC8vdGhpcy5SZXNldFVJXygpO1xuXHRcdC8vIH0uYmluZCh0aGlzKSlcdFxuXHR9LFxuXHRcblx0UmVzZXRVSV8oKXtcblx0XHQvL+iHquW3seeJjOWIl+ihqFxuXHRcdHRoaXMuY2FyZHNfbm9kcyA9IFtdXG5cdFx0dGhpcy5jYXJkX3dpZHRoID0gMFxuXHRcdC8v5b2T5YmN5Y+v5Lul5oqi5Zyw5Li755qEYWNjb3VudGlkXG5cdFx0dGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IDBcblx0XHQvL+WPkeeJjOWKqOeUu+aYr+WQpue7k+adn1xuXHRcdHRoaXMuZmFwYWlfZW5kID0gZmFsc2Vcblx0XHQvL+W6leeJjOaVsOe7hFxuXHRcdHRoaXMuYm90dG9tX2NhcmQgPSBbXVxuXHRcdC8v5bqV54mM55qEanNvbuWvueixoeaVsOaNrlxuXHRcdHRoaXMuYm90dG9tX2NhcmRfZGF0YT1bXVxuXHRcdHRoaXMuY2hvb3NlX2NhcmRfZGF0YT1bXVxuXHRcdHRoaXMub3V0Y2FyX3pvbmUgPSBbXVxuXHRcdFxuXHRcdHRoaXMucHVzaF9jYXJkX3RtcCA9IFtdXG5cdFx0XG5cdFx0Ly90aGlzLnJvYlVJLnJlbW92ZUFsbENoaWxkcmVuKCk7XG5cdFx0IHRoaXMucm9iVUkuYWN0aXZlPSBmYWxzZTtcblx0XHQgdGhpcy5wbGF5aW5nVUlfbm9kZS5hY3RpdmU9ZmFsc2U7XG5cdFx0Ly9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lU2NlbmVcIilcblx0XHRcblx0XHQvL+WFiOa4heeQhuWHuueJjOWMuuWfn1xuXHRcdFxuXHRcdHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpLy/muIXpmaTmiYDmnInlrprml7blmahcblx0XHRcblx0XHR2YXIgZ2FtZVNjZW5lX3NjcmlwdCA9IHRoaXMubm9kZS5wYXJlbnQuZ2V0Q29tcG9uZW50KFwiZ2FtZVNjZW5lXCIpXG5cdFx0Zm9yKHZhciBpPTA7aTwgZ2FtZVNjZW5lX3NjcmlwdC5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcblx0XHRcdGdhbWVTY2VuZV9zY3JpcHQucGxheWVyTm9kZUxpc3RbaV0uZ2V0Q2hpbGRCeU5hbWUoXCJjYXJkX25vZGVcIikucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XG5cdFx0XHQvL2dhbWVTY2VuZV9zY3JpcHQucGxheWVyTm9kZUxpc3RbaV0udW5zY2hlZHVsZUFsbENhbGxiYWNrcygpLy/muIXpmaTmiYDmnInlrprml7blmahcblx0XHRcdHRoaXMuY2xlYXJPdXRab25lKGdhbWVTY2VuZV9zY3JpcHQucGxheWVyTm9kZUxpc3RbaV0uZ2V0Q29tcG9uZW50KFwicGxheWVyX25vZGVcIikuYWNjb3VudGlkKVxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRcblx0XHR0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xuXHRcdHRoaXMubXlwYWl2aWV3LnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xuXHRcdFxuXHRcdC8vIHZhciBnYW1lYmVmb3JlX25vZGUgPSB0aGlzLm5vZGUucGFyZW50LmdldENoaWxkQnlOYW1lKFwiZ2FtZWJlZm9yZVVJXCIpXG5cdFx0Ly8gaWYoZ2FtZVNjZW5lX3NjcmlwdC5yb29tc3RhdGU8Um9vbVN0YXRlLlJPT01fR0FNRVNUQVJUKXsvL+a4uOaIj+S4rVxuXHRcdC8vICAgICBnYW1lYmVmb3JlX25vZGUuYWN0aXZlPXRydWU7XG5cdFx0Ly8gXHRnYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcblx0XHQvLyB9XG5cdFx0Ly8gZWxzZXtcblx0XHQvLyAgICAgZ2FtZWJlZm9yZV9ub2RlLmFjdGl2ZSA9ICBmYWxzZVxuXHRcdC8vIH1cblx0XHR2YXIgZ2FtZWJlZm9yZV9ub2RlID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxuXHRcdGdhbWViZWZvcmVfbm9kZS5hY3RpdmU9dHJ1ZTtcblx0XHRnYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcblx0XHRcblx0XHRcblx0fSxcblx0XG5cdHNob3dfbXljYXJkcyhkYXRhKXsvL+aYvuekuuaIkeeahOaJi+eJjFxuXHQgICB0aGlzLmNhcmRfZGF0YSA9IGRhdGFcblx0ICAgdGhpcy5jdXJfaW5kZXhfY2FyZCA9IGRhdGEubGVuZ3RoIC0gMVxuXHQgICB0aGlzLnB1c2hDYXJkKGRhdGEpXG5cdCAgIGlmKGlzb3Blbl9zb3VuZCl7XG5cdCAgICAvL+W+queOr+aSreaUvuWPkeeJjOmfs+aViFxuXHQgICAgICAgLy90aGlzLmZhcGFpX2F1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvZmFwYWkxLm1wM1wiKSx0cnVlKVxuXHQgICAgICAgLy8gY29uc29sZS5sb2coXCJzdGFydCBmYXBhaV9hdWRpb0lEXCIrdGhpcy5mYXBhaV9hdWRpb0lEKSBcblx0ICAgIH1cblx0IC8v5bem6L6556e75Yqo5a6a5pe25ZmoXG5cdCAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXG5cdCAgICB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJwdXNoY2FyZF9vdGhlcl9ldmVudFwiKVx0XG5cdH0sXG5cdHNob3dfYm90dG9tX2NhcmRzKGRhdGEpey8v5pi+56S65Zyw5Li754mMXG5cdFx0XG5cdFx0dGhpcy5ib3R0b21fY2FyZF9kYXRhID0gZGF0YVxuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcblx0XHQgICAgdmFyIGNhcmQgPSB0aGlzLmJvdHRvbV9jYXJkW2ldXG5cdFx0ICAgIHZhciBzaG93X2RhdGEgPSBkYXRhW2ldXG5cdFx0ICAgIHZhciBjYWxsX2RhdGEgPSB7XG5cdFx0ICAgICAgICBcIm9ialwiOmNhcmQsXG5cdFx0ICAgICAgICBcImRhdGFcIjpzaG93X2RhdGEsXG5cdFx0ICAgIH1cblx0XHQgICAgY29uc29sZS5sb2coXCJib3R0b20gc2hvd19kYXRhOlwiK0pTT04uc3RyaW5naWZ5KHNob3dfZGF0YSkpXG5cdFx0ICAgIHZhciBydW4gPSAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24odGFyZ2V0LGFjdGl2ZWRhdGEpe1xuXHRcdCAgICAgICBcblx0XHQgICAgICAgIHZhciBzaG93X2NhcmQgPSBhY3RpdmVkYXRhLm9ialxuXHRcdCAgICAgICAgdmFyIHNob3dfZGF0YSA9IGFjdGl2ZWRhdGEuZGF0YVxuXHRcdCAgICAgICAgLy9jb25zb2xlLmxvZyhcImNjLmNhbGxGdW5jOlwiK0pTT04uc3RyaW5naWZ5KHNob3dfZGF0YSkpXG5cdFx0ICAgICAgICBzaG93X2NhcmQuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5zaG93Q2FyZHMoc2hvd19kYXRhKVxuXHRcdCAgICAgICBcblx0XHQgICAgfSx0aGlzLGNhbGxfZGF0YSlcblx0XHRcblx0XHQgICAgY2FyZC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Mucm90YXRlQnkoMCwwLDE4MCksY2Mucm90YXRlQnkoMC4yLDAsLTkwKSwgcnVuLFxuXHRcdCAgICBjYy5yb3RhdGVCeSgwLjIsMCwtOTApLGNjLnNjYWxlQnkoMSwgMS4yKSkpO1xuXHRcdCAgIFxuXHRcdCAgICBpZihpc29wZW5fc291bmQpe1xuXHRcdCAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3N0YXJ0Lm1wM1wiKSkgXG5cdFx0ICAgICB9XG5cdFx0fVxuXHRcdFxuXHR9LFxuXHRcblx0bm93X3dob2Nhbl9jaHVwYWkoZGF0YSl7Ly8g546w5Zyo6LCB5Ye654mMXG5cdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXAxKTtcblx0XHRcblx0XHRpZihkYXRhLl9hY2NvdW50SUQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcblx0XHRcdC8v5pi+56S65Y+v5Lul5Ye654mM55qEVUlcblx0XHRcdHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gdHJ1ZVxuXHRcdCAgICAvL+WFiOa4heeQhuWHuueJjOWMuuWfn1xuXHRcdCAgICB0aGlzLmNsZWFyT3V0Wm9uZShteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRClcblx0XHQgICAgLy/lhYjmioroh6rlt7Hlh7rniYzliJfooajnva7nqbpcblx0XHQgICAgLy90aGlzLmNob29zZV9jYXJkX2RhdGE9W11cblx0XHRcdFxuXHRcdFx0dGhpcy5wbGF5aW5nX2Nsb2NrX2xhYmVsLnN0cmluZz1cIlwiKyhkYXRhLm5leHRfdGltZS1kYXRhLm5vdyk7XG5cdFx0XHR0aGlzLm5leHRfdGltZT0gZGF0YS5uZXh0X3RpbWVcblx0XHRcdHRoaXMubm93PWRhdGEubm93O1xuXHRcdFx0Ly8gbGV0IGZ1blVwMSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBcdHRoaXMubm93Kz0xO1xuXHRcdFx0Ly8gXHRpZih0aGlzLm5leHRfdGltZS10aGlzLm5vdz4wKXtcblx0XHRcdC8vIFx0XHR0aGlzLnBsYXlpbmdfY2xvY2tfbGFiZWwuc3RyaW5nPVwiXCIrKHRoaXMubmV4dF90aW1lLXRoaXMubm93KTtcblx0XHRcdFx0XG5cdFx0XHQvLyBcdH1lbHNle1xuXHRcdFx0Ly8gXHRcdHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2Vcblx0XHRcdC8vIFx0XHQvL3RoaXMudW5zY2hlZHVsZShmdW5VcCk7XG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH0uYmluZCh0aGlzKTtcblx0XHRcdC8vIHRoaXMudW5zY2hlZHVsZSh0aGlzLmZ1blVwMSk7XG5cdFx0XHQgdGhpcy5zY2hlZHVsZSh0aGlzLmZ1blVwMSwxKTtcblx0XHR9ZWxzZXtcblx0XHRcdC8v6ZqQ6JeP5Y+v5Lul5Ye654mM55qEVUlcblx0XHRcdHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2Vcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5ub2RlLnBhcmVudC5lbWl0KFwib25DYW5DaHVDYXJkX2dhbWVTY2VuZVwiLGRhdGEpO1xuXHRcdFxuXHRcdFxuXHR9LFxuXHRzaG93X2NodXBhaShkYXRhKXsvLyDmmL7npLrnjqnlrrblh7rniYxcblx0XHR2YXIgYWNjb3VudGlkID0gZGF0YS5hY2NvdW50aWRcblx0XHR2YXIgZ2FtZVNjZW5lX3NjcmlwdCA9IHRoaXMubm9kZS5wYXJlbnQuZ2V0Q29tcG9uZW50KFwiZ2FtZVNjZW5lXCIpXG5cdFx0Ly/ojrflj5blh7rniYzljLrln5/oioLngrlcblx0XHR2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudChhY2NvdW50aWQpXG5cdFx0aWYob3V0Q2FyZF9ub2RlPT1udWxsKXtcblx0XHQgICAgcmV0dXJuXG5cdFx0fVxuXHRcdFxuXHRcdHZhciBub2RlX2NhcmRzID0gW11cblx0XHRmb3IodmFyIGk9MDtpPGRhdGEuY2FyZHMubGVuZ3RoO2krKyl7XG5cdFx0ICAgIHZhciBjYXJkID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkX3ByZWZhYilcblx0XHQgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhkYXRhLmNhcmRzW2ldLmNhcmRfZGF0YSxteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRClcblx0XHQgICAgbm9kZV9jYXJkcy5wdXNoKGNhcmQpXG5cdFx0fVxuXHRcdHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsbm9kZV9jYXJkcywwKVxuXHR9LFxuXHRmdW5VcCAoKXtcblx0XHRcdFx0XHR0aGlzLm5vdysrO1xuXHRcdFx0XHRcdGlmKHRoaXMubmV4dF90aW1lLXRoaXMubm93Pj0wKXtcblx0XHRcdFx0XHRcdHRoaXMuY2xvY2tfbGFiZWwuc3RyaW5nPVwiXCIrKHRoaXMubmV4dF90aW1lLXRoaXMubm93KTtcblx0XHRcdFx0XHRcdC8vdGhpcy5zY2hlZHVsZU9uY2UoZnVuVXAsMSkgXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXG5cdFx0XHRcdFx0ICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5mdW5VcCk7XG5cdFx0XHRcdFx0fVxuXHR9LFxuXHRmdW5VcDEoKXtcblx0XHR0aGlzLm5vdys9MTtcblx0XHRpZih0aGlzLm5leHRfdGltZS10aGlzLm5vdz4wKXtcblx0XHRcdHRoaXMucGxheWluZ19jbG9ja19sYWJlbC5zdHJpbmc9XCJcIisodGhpcy5uZXh0X3RpbWUtdGhpcy5ub3cpO1xuXHRcdFxuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5wbGF5aW5nVUlfbm9kZS5hY3RpdmUgPSBmYWxzZVxuXHRcdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXAxKTtcblx0XHR9XG5cdH0sXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgLy/oh6rlt7HniYzliJfooaggXG4gICAgICAgIC8vIHRoaXMuY2FyZHNfbm9kcyA9IFtdXG4gICAgICAgIC8vIHRoaXMuY2FyZF93aWR0aCA9IDBcbiAgICAgICAgLy8gLy/lvZPliY3lj6/ku6XmiqLlnLDkuLvnmoRhY2NvdW50aWRcbiAgICAgICAgLy8gdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IDBcbiAgICAgICAgLy8gLy/lj5HniYzliqjnlLvmmK/lkKbnu5PmnZ9cbiAgICAgICAgLy8gdGhpcy5mYXBhaV9lbmQgPSBmYWxzZVxuICAgICAgICAvLyAvL+W6leeJjOaVsOe7hFxuICAgICAgICAvLyB0aGlzLmJvdHRvbV9jYXJkID0gW11cbiAgICAgICAgLy8gLy/lupXniYznmoRqc29u5a+56LGh5pWw5o2uXG4gICAgICAgIC8vIHRoaXMuYm90dG9tX2NhcmRfZGF0YT1bXVxuICAgICAgICAvLyB0aGlzLmNob29zZV9jYXJkX2RhdGE9W11cbiAgICAgICAgLy8gdGhpcy5vdXRjYXJfem9uZSA9IFtdXG5cbiAgICAgICAgLy8gdGhpcy5wdXNoX2NhcmRfdG1wID0gW11cblx0XHR0aGlzLlJlc2V0VUlfKCk7XG4gICAgICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOuS4i+WPkeeJjOa2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25QdXNoQ2FyZHMoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uUHVzaENhcmRzXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG5cdFx0XHR0aGlzLnNob3dfbXljYXJkcyhkYXRhKVxuICAgICAgICAgICAgLy8gdGhpcy5jYXJkX2RhdGEgPSBkYXRhXG4gICAgICAgICAgICAvLyB0aGlzLmN1cl9pbmRleF9jYXJkID0gZGF0YS5sZW5ndGggLSAxXG4gICAgICAgICAgICAvLyB0aGlzLnB1c2hDYXJkKGRhdGEpXG4gICAgICAgICAgICAvLyBpZihpc29wZW5fc291bmQpe1xuICAgICAgICAgICAgLy8gICAgIC8v5b6q546v5pKt5pS+5Y+R54mM6Z+z5pWIXG4gICAgICAgICAgICAvLyAgICAvLyB0aGlzLmZhcGFpX2F1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvZmFwYWkxLm1wM1wiKSx0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwic3RhcnQgZmFwYWlfYXVkaW9JRFwiK3RoaXMuZmFwYWlfYXVkaW9JRCkgXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyAgLy/lt6bovrnnp7vliqjlrprml7blmahcbiAgICAgICAgICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX3J1bmFjdGl2ZV9wdXNoY2FyZC5iaW5kKHRoaXMpLDAuMylcbiAgICAgICAgICAgIC8vIHRoaXMubm9kZS5wYXJlbnQuZW1pdChcInB1c2hjYXJkX290aGVyX2V2ZW50XCIpXG4gICAgICAgICAgIFxuICAgICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgLy/nm5HlkKzmnI3liqHlmag66YCa55+l5oqi5Zyw5Li75raI5oGvLOaYvuekuuebuOW6lOeahFVJXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vbkNhblJvYlN0YXRlKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbkNhblJvYlN0YXRlXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgICAgICAvL+i/memHjOmcgOimgTLkuKrlj5jph4/mnaHku7bvvJroh6rlt7HmmK/kuIvkuIDkuKrmiqLlnLDkuLvvvIwy5Y+R54mM5Yqo55S757uT5p2fXG4gICAgICAgICAgICB0aGlzLnJvYl9wbGF5ZXJfYWNjb3VudGlkID0gZGF0YS5fYWNjb3VudElEXG4gICAgICAgICAgIC8vIGlmKGRhdGEuX2FjY291bnRJRD09bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQgJiYgdGhpcy5mYXBhaV9lbmQ9PXRydWUpe1xuXHRcdCAgICBpZihkYXRhLl9hY2NvdW50SUQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEICl7XG5cdFx0XHRcdFxuICAgICAgICAgICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gdHJ1ZVxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jbG9ja19sYWJlbC5zdHJpbmc9XCJcIisoZGF0YS5uZXh0X3RpbWUtZGF0YS5ub3cpO1xuXHRcdFx0XHR0aGlzLm5leHRfdGltZT0gZGF0YS5uZXh0X3RpbWU7XG5cdFx0XHRcdHRoaXMubm93PWRhdGEubm93O1xuXHRcdFx0XHQvLyBsZXQgZnVuVXAgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBcdGRhdGEubm93Kys7XG5cdFx0XHRcdC8vIFx0aWYoZGF0YS5uZXh0X3RpbWUtZGF0YS5ub3c+PTApe1xuXHRcdFx0XHQvLyBcdFx0dGhpcy5jbG9ja19sYWJlbC5zdHJpbmc9XCJcIisoZGF0YS5uZXh0X3RpbWUtZGF0YS5ub3cpO1xuXHRcdFx0XHQvLyBcdFx0Ly90aGlzLnNjaGVkdWxlT25jZShmdW5VcCwxKSBcblx0XHRcdFx0Ly8gXHR9ZWxzZXtcblx0XHRcdFx0Ly8gXHRcdHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0Ly8gXHRcdC8vdGhpcy51bnNjaGVkdWxlKGZ1blVwKTtcblx0XHRcdFx0Ly8gXHR9XG5cdFx0XHRcdC8vIH0uYmluZCh0aGlzKTtcblx0XHRcdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXApO1xuXHRcdFx0XHQgdGhpcy5zY2hlZHVsZSh0aGlzLmZ1blVwLCAxKTtcblxuICAgICAgICAgICAgfWVsc2V7XG5cdFx0XHRcdHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2Vcblx0XHRcdH1cblx0XHRcdHRoaXMubm9kZS5wYXJlbnQuZW1pdChcImNhbnJvYl9ldmVudFwiLGRhdGEpO1xuXHRcdFx0XG4gICAgICAgICAgXG4gICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgXG4gICAgICAgIC8v55uR5ZCs5pyN5Yqh5Zmo5Y+v5Lul5Ye654mM5raI5oGvXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vbkNhbkNodUNhcmQoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uQ2FuQ2h1Q2FyZCBnYW1laW5nVUlcIitKU09OLnN0cmluZ2lmeShkYXRhKSlcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpXG5cdFx0XHRcblx0XHRcdHRoaXMubm93X3dob2Nhbl9jaHVwYWkoZGF0YSlcbiAgICAgICAgICAgIC8v5Yik5pat5piv5LiN5piv6Ieq5bex6IO95Ye654mMXG4gICAvLyAgICAgICAgICBpZihkYXRhLl9hY2NvdW50SUQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcblx0XHRcdC8vIFx0Ly/mmL7npLrlj6/ku6Xlh7rniYznmoRVSVxuXHRcdFx0Ly8gXHR0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcbiAgIC8vICAgICAgICAgICAgICAvL+WFiOa4heeQhuWHuueJjOWMuuWfn1xuICAgLy8gICAgICAgICAgICAgIHRoaXMuY2xlYXJPdXRab25lKG15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKVxuICAgLy8gICAgICAgICAgICAgIC8v5YWI5oqK6Ieq5bex5Ye654mM5YiX6KGo572u56m6XG4gICAvLyAgICAgICAgICAgICAgLy90aGlzLmNob29zZV9jYXJkX2RhdGE9W11cbiAgICAgICAgICAgICAgICBcbiAgIFxuXHRcdFx0XHRcblx0XHRcdC8vIFx0dGhpcy5wbGF5aW5nX2Nsb2NrX2xhYmVsLnN0cmluZz1cIlwiKyhkYXRhLm5leHRfdGltZS1kYXRhLm5vdyk7XG5cdFx0XHQvLyBcdGxldCBmdW5VcCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBcdFx0ZGF0YS5ub3crPTE7XG5cdFx0XHQvLyBcdFx0aWYoZGF0YS5uZXh0X3RpbWUtZGF0YS5ub3c+MCl7XG5cdFx0XHQvLyBcdFx0XHR0aGlzLnBsYXlpbmdfY2xvY2tfbGFiZWwuc3RyaW5nPVwiXCIrKGRhdGEubmV4dF90aW1lLWRhdGEubm93KTtcblx0XHRcdFx0XHRcblx0XHRcdC8vIFx0XHR9ZWxzZXtcblx0XHRcdC8vIFx0XHRcdHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFxuXHRcdFx0Ly8gXHRcdFx0Ly90aGlzLnVuc2NoZWR1bGUoZnVuVXApO1xuXHRcdFx0Ly8gXHRcdH1cblx0XHRcdC8vIFx0fS5iaW5kKHRoaXMpO1xuXHRcdFx0Ly8gXHQgdGhpcy5zY2hlZHVsZShmdW5VcCwxLChkYXRhLm5leHRfdGltZS1kYXRhLm5vdykpO1xuXHRcdFx0Ly8gfWVsc2V7XG5cdFx0XHQvLyBcdC8v6ZqQ6JeP5Y+v5Lul5Ye654mM55qEVUlcblx0XHRcdC8vIFx0dGhpcy5wbGF5aW5nVUlfbm9kZS5hY3RpdmUgPSBmYWxzZVxuXHRcdFx0Ly8gfVxuXHRcdFx0XG5cdFx0XHQvLyB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJvbkNhbkNodUNhcmRfZ2FtZVNjZW5lXCIsZGF0YSk7XG5cdFx0XHRcblx0XHRcdFxuICAgICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uR2FtZUZpbmlzaChmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgXHRjb25zb2xlLmxvZyhcIua4uOaIj+e7k+adn+mAmuefpSBvbkdhbWVGaW5pc2g6XCIrZGF0YSk7XG4gICAgICAgIFx0Ly90aGlzLnRpcHNMYWJlbC5zdHJpbmc9XCJ3aW5uZXJcIitkYXRhO1xuXHRcdFxuXHRcdFx0XG5cdFx0XHRcdCBBbGVydC5zaG93KFwiWW91IFwiKyhkYXRhLnlvdV9kdF9zY29yZT4wP1wid2luXCI6XCJsb3NlXCIpK1wiIFwiK2RhdGEueW91X2R0X3Njb3JlKVxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdC8vIGlmKGRhdGEud2lubmVyPT1teWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCl7XG5cdFx0XHQvLyAgICAgIEFsZXJ0LnNob3coXCJZb3Ugd2luIFwiK2RhdGEueW91X2R0X3Njb3JlKVxuXHRcdFx0Ly8gfWVsc2V7XG5cdFx0XHRcdCAvL1RvYXN0LnNob3coXCJZb3UgZHQgXCIrZGF0YS55b3VfZHRfc2NvcmUpXG5cdFx0XHQvLyB9XG5cdFx0XHRcblx0XHRcdC8vdGhpcy5nYW1laW5nVUkuYWN0aXZlID0gdHJ1ZTtcblx0XHRcdHRoaXMuUmVzZXRVSV8oKVxuXHRcdFx0Ly9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lU2NlbmVcIilcblx0XHRcdFxuICAgICAgICB9LmJpbmQodGhpcykpOyAgXG5cblxuICAgICAgICAvL+ebkeWQrOacjeWKoeWZqO+8muWFtuS7lueOqeWutuWHuueJjOa2iOaBr1xuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25PdGhlclBsYXllckNodUNhcmQoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAvL3tcImFjY291bnRpZFwiOlwiMjM1NzU0MFwiLFwiY2FyZHNcIjpbe1wiY2FyZGlkXCI6NCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6NCxcInZhbHVlXCI6MSxcInNoYXBlXCI6MX19XX1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25PdGhlclBsYXllckNodUNhcmRcIitKU09OLnN0cmluZ2lmeShkYXRhKSlcblxuICAgICAgICAgICAgdGhpcy5zaG93X2NodXBhaShkYXRhKTtcbiAgICAgICAgICAgIC8vIHZhciBhY2NvdW50aWQgPSBkYXRhLmFjY291bnRpZFxuICAgICAgICAgICAgLy8gdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxuICAgICAgICAgICAgLy8gLy/ojrflj5blh7rniYzljLrln5/oioLngrlcbiAgICAgICAgICAgIC8vIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcbiAgICAgICAgICAgIC8vIGlmKG91dENhcmRfbm9kZT09bnVsbCl7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIHZhciBub2RlX2NhcmRzID0gW11cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaT0wO2k8ZGF0YS5jYXJkcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIC8vICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXG4gICAgICAgICAgICAvLyAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhkYXRhLmNhcmRzW2ldLmNhcmRfZGF0YSxteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRClcbiAgICAgICAgICAgIC8vICAgICBub2RlX2NhcmRzLnB1c2goY2FyZClcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsbm9kZV9jYXJkcywwKVxuXG4gICAgICAgICAgICBcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC8v5YaF6YOo5LqL5Lu2OuaYvuekuuW6leeJjOS6i+S7tixkYXRh5piv5LiJ5byg5bqV54mM5pWw5o2uXG4gICAgICAgIHRoaXMubm9kZS5vbihcInNob3dfYm90dG9tX2NhcmRfZXZlbnRcIixmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLXNob3dfYm90dG9tX2NhcmRfZXZlbnRcIiwrZGF0YSlcbiAgICAgICAgICBcblx0XHQgICB0aGlzLnNob3dfYm90dG9tX2NhcmRzKGRhdGEpOyBcbiAgICAgICAgICAgIC8vIHRoaXMuYm90dG9tX2NhcmRfZGF0YSA9IGRhdGFcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZm9yKHZhciBpPTA7aTxkYXRhLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgLy8gICAgIHZhciBjYXJkID0gdGhpcy5ib3R0b21fY2FyZFtpXVxuICAgICAgICAgICAgLy8gICAgIHZhciBzaG93X2RhdGEgPSBkYXRhW2ldXG4gICAgICAgICAgICAvLyAgICAgdmFyIGNhbGxfZGF0YSA9IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJvYmpcIjpjYXJkLFxuICAgICAgICAgICAgLy8gICAgICAgICBcImRhdGFcIjpzaG93X2RhdGEsXG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiYm90dG9tIHNob3dfZGF0YTpcIitKU09OLnN0cmluZ2lmeShzaG93X2RhdGEpKVxuICAgICAgICAgICAgLy8gICAgIHZhciBydW4gPSAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24odGFyZ2V0LGFjdGl2ZWRhdGEpe1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gICAgICAgICB2YXIgc2hvd19jYXJkID0gYWN0aXZlZGF0YS5vYmpcbiAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHNob3dfZGF0YSA9IGFjdGl2ZWRhdGEuZGF0YVxuICAgICAgICAgICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKFwiY2MuY2FsbEZ1bmM6XCIrSlNPTi5zdHJpbmdpZnkoc2hvd19kYXRhKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgc2hvd19jYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKHNob3dfZGF0YSlcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICB9LHRoaXMsY2FsbF9kYXRhKVxuXG4gICAgICAgICAgICAvLyAgICAgY2FyZC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Mucm90YXRlQnkoMCwwLDE4MCksY2Mucm90YXRlQnkoMC4yLDAsLTkwKSwgcnVuLFxuICAgICAgICAgICAgLy8gICAgIGNjLnJvdGF0ZUJ5KDAuMiwwLC05MCksY2Muc2NhbGVCeSgxLCAxLjIpKSk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICBpZihpc29wZW5fc291bmQpe1xuICAgICAgICAgICAgLy8gICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvc3RhcnQubXAzXCIpKSBcbiAgICAgICAgICAgIC8vICAgICAgfVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAvL3RoaXMubm9kZS5wYXJlbnQuZW1pdChcImNoYW5nZV9yb29tX3N0YXRlX2V2ZW50XCIsUm9vbVN0YXRlLlJPT01fUExBWUlORylcbiAgICAgICAgICAgIC8v5aaC5p6c6Ieq5bex5Zyw5Li777yM57uZ5Yqg5LiK5LiJ5byg5bqV54mMXG4gICAgICAgICAgICBpZihteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRD09bXlnbG9iYWwucGxheWVyRGF0YS5tYXN0ZXJfYWNjb3VudGlkKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnB1c2hUaHJlZUNhcmQuYmluZCh0aGlzKSwwLjIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgICAvL+azqOWGjOebkeWQrOS4gOS4qumAieaLqeeJjOa2iOaBryBcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2hvb3NlX2NhcmRfZXZlbnRcIixmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNob29zZV9jYXJkX2V2ZW50OlwiK0pTT04uc3RyaW5naWZ5KGV2ZW50KSlcbiAgICAgICAgICAgIHZhciBkZXRhaWwgPSBldmVudFxuICAgICAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnB1c2goZGV0YWlsKVxuICAgICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5jaG9vc2VfY2FyZF9ldmVudDpcIisgZXZlbnQpXG4gICAgICAgICAgICB2YXIgZGV0YWlsID0gZXZlbnRcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5jaG9vc2VfY2FyZF9kYXRhLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hvb3NlX2NhcmRfZGF0YVtpXS5jYXJkaWQ9PWRldGFpbCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5zcGxpY2UoaSwxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgfSxcblxuICAgIHN0YXJ0ICgpIHtcbiAgICAgXG4gICAgfSxcblxuICAgIC8v5aSE55CG5Y+R54mM55qE5pWI5p6cXG4gICAgX3J1bmFjdGl2ZV9wdXNoY2FyZCgpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiX3J1bmFjdGl2ZV9wdXNoY2FyZDpcIit0aGlzLmN1cl9pbmRleF9jYXJkKVxuICAgICAgICBpZih0aGlzLmN1cl9pbmRleF9jYXJkIDwgMCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInB1c2hjYXJkIGVuZFwiKVxuICAgICAgICAgICAgLy/lj5HniYzliqjnlLvlrozmiJDvvIzmmL7npLrmiqLlnLDkuLvmjInpkq5cbiAgICAgICAgICAgIC8vdGhpcy5yb2JVSS5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmZhcGFpX2VuZCA9IHRydWVcbiAgICAgICAgICAgIGlmKHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaXNvcGVuX3NvdW5kKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic3RhcnQgZmFwYWlfYXVkaW9JRFwiK3RoaXMuZmFwYWlfYXVkaW9JRCkgXG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcCh0aGlzLmZhcGFpX2F1ZGlvSUQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgIFxuXG4gICAgICAgICAgICAgIC8v6YCa55+lZ2FtZXNjZW5l6IqC54K577yM5YCS6K6h5pe2XG4gICAgICAgICAgICB2YXIgc2VuZGV2ZW50ID0gdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZFxuICAgICAgICAgICAgLy90aGlzLm5vZGUucGFyZW50LmVtaXQoXCJjYW5yb2JfZXZlbnRcIixzZW5kZXZlbnQpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy/ljp/mnInpgLvovpEgIFxuICAgICAgICAvLyB2YXIgbW92ZV9ub2RlID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY3VyX2luZGV4X2NhcmRdXG4gICAgICAgIC8vIG1vdmVfbm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgICAgIC8vIHZhciBuZXd4ID0gbW92ZV9ub2RlLnggKyAodGhpcy5jYXJkX3dpZHRoICogMC40KnRoaXMuY3VyX2luZGV4X2NhcmQpIC0gKHRoaXMuY2FyZF93aWR0aCAqIDAuNClcbiAgICAgICAgLy8gdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcbiAgICAgICAgLy8gbW92ZV9ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgICAgIC8vIHRoaXMuY3VyX2luZGV4X2NhcmQtLVxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXG5cbiAgICAgICAvLyB0aGlzLmN1cl9pbmRleF9jYXJkPTA7XG4gICAgICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLmNhcmRzX25vZHNbdGhpcy5jYXJkc19ub2RzLmxlbmd0aC10aGlzLmN1cl9pbmRleF9jYXJkLTFdXG5cdFx0aWYobW92ZV9ub2RlPT1udWxsKXJldHVyblxuICAgICAgICBtb3ZlX25vZGUuYWN0aXZlID0gdHJ1ZVxuICAgICAgICB0aGlzLnB1c2hfY2FyZF90bXAucHVzaChtb3ZlX25vZGUpXG5cdCAgICBpZihpc29wZW5fc291bmQpXG4gICAgICAgIHRoaXMuZmFwYWlfYXVkaW9JRCA9IGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC9mYXBhaTEubXAzXCIpKVxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMucHVzaF9jYXJkX3RtcC5sZW5ndGgtMTtpKyspe1xuICAgICAgICAgICAgICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLnB1c2hfY2FyZF90bXBbaV1cbiAgICAgICAgICAgICAgICB2YXIgbmV3eCA9IG1vdmVfbm9kZS54IC0gKHRoaXMuY2FyZF93aWR0aCAqIDAuNClcbiAgICAgICAgICAgICAgICB2YXIgYWN0aW9uID0gY2MubW92ZVRvKDAuMSwgY2MudjIobmV3eCwgLTI1MCkpO1xuICAgICAgICAgICAgICAgIG1vdmVfbm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN1cl9pbmRleF9jYXJkLS1cblx0XHQvLyB0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5fcnVuYWN0aXZlX3B1c2hjYXJkLmJpbmQodGhpcyksMC4wMylcbiAgICB9LFxuIFxuICAgIC8v5a+554mM5o6S5bqPXG4gICAgc29ydENhcmQoKXtcbiAgICAgICAgdGhpcy5jYXJkc19ub2RzLnNvcnQoZnVuY3Rpb24oeCx5KXtcbiAgICAgICAgICAgIHZhciBhID0geC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcbiAgICAgICAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcblxuICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAgYi52YWx1ZS1hLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiAhYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAgYi5raW5nLWEua2luZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy92YXIgeCA9IHRoaXMuY2FyZHNfbm9kc1swXS54O1xuICAgICAgICAvL+i/memHjOS9v+eUqOWbuuWumuWdkOagh++8jOWboOS4uuWPlnRoaXMuY2FyZHNfbm9kc1swXS54a+WPr+iDveaOkuW6j+S4uuWujOaIkO+8jOWvvOiHtHjplJnor69cbiAgICAgICAgLy/miYDku6XlgZoxMDAw5q+r56eS55qE5bu25pe2XG4gICAgICAgIHZhciB0aW1lb3V0ID0gMTAwMFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL3ZhciB4ID0gLTQxNy42IFxuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmNhcmRzX25vZHNbMF0ueDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic29ydCB4OlwiKyB4KVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzX25vZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXTtcbiAgICAgICAgICAgICAgICBjYXJkLnpJbmRleCA9IGk7IC8v6K6+572u54mM55qE5Y+g5Yqg5qyh5bqPLHppbmRleOi2iuWkp+aYvuekuuWcqOS4iumdolxuICAgICAgICAgICAgICAgIGNhcmQueCA9IHggKyBjYXJkLndpZHRoICogMC40ICogaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aW1lb3V0KTtcbiAgICAgICAgXG4gICAgICAgXG4gICAgfSxcblxuICBcbiAgICBwdXNoQ2FyZChkYXRhKXsvL+WPkeeJjCBcbiAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi52YWx1ZSAtIGEudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgIWIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIua2luZyAtIGEua2luZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgLy/liJvlu7pjYXJk6aKE5Yi25L2TXG4gICAgICB0aGlzLmNhcmRzX25vZHMgPSBbXVxuICAgICAgZm9yKHZhciBpPTA7aTxkYXRhLmxlbmd0aDtpKyspe1xuICAgICAgICBcbiAgICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxuICAgICAgICBjYXJkLnNjYWxlPTAuOFxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMubXlwYWl2aWV3XG4gICAgICAgIC8vY2FyZC54ID0gY2FyZC53aWR0aCAqIDAuNCAqICgxNyAtIDEpICogKC0wLjUpICsgY2FyZC53aWR0aCAqIDAuNCAqIDA7XG4gICAgICAgIGNhcmQueCA9IGNhcmQud2lkdGggKiAwLjQgKiAoLTAuNSkgKiAoLTE2KSArIGNhcmQud2lkdGggKiAwLjQgKiAwO1xuICAgICAgICAvL+i/memHjOWunueOsOS4uu+8jOavj+WPkeS4gOW8oOeJjO+8jOaUvuWcqOW3sue7j+WPkeeahOeJjOacgOWQju+8jOeEtuWQjuaVtOS9k+enu+WKqFxuICAgICAgICBjYXJkLnkgPSAtMjUwXG4gICAgICAgIGNhcmQuYWN0aXZlID0gZmFsc2VcblxuICAgICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKGRhdGFbaV0sbXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpXG4gICAgICAgIC8v5a2Y5YKo54mM55qE5L+h5oGvLOeUqOS6juWQjumdouWPkeeJjOaViOaenFxuICAgICAgICB0aGlzLmNhcmRzX25vZHMucHVzaChjYXJkKVxuICAgICAgICB0aGlzLmNhcmRfd2lkdGggPSBjYXJkLndpZHRoXG4gICAgICB9XG4gICAgICBcbiAgICAgIC8v5Yib5bu6M+W8oOW6leeJjFxuICAgICAgdGhpcy5ib3R0b21fY2FyZCA9IFtdXG4gICAgICBmb3IodmFyIGk9MDtpPDM7aSsrKXtcbiAgICAgICAgdmFyIGRpX2NhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxuICAgICAgICBkaV9jYXJkLnNjYWxlPTAuNFxuICAgICAgICBkaV9jYXJkLnBvc2l0aW9uLnggPSB0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnBvc2l0aW9uLnggXG5cdFx0ZGlfY2FyZC5wb3NpdGlvbi55PTBcbiAgICAgICAgLy/kuInlvKDniYzvvIzkuK3pl7TlnZDmoIflsLHmmK9ib3R0b21fY2FyZF9wb3Nfbm9kZeiKgueCueWdkOagh++8jFxuICAgICAgICAvLzAs5ZKMMuS4pOW8oOeJjOW3puWPs+enu+WKqHdpbmR0aCowLjRcbiAgICAgICAgaWYoaT09MCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRpX2NhcmQueCA9IGRpX2NhcmQueCAtIGRpX2NhcmQud2lkdGgqMC40XG4gICAgICAgIH1lbHNlIGlmKGk9PTIpe1xuICAgICAgICAgICAgZGlfY2FyZC54ID0gZGlfY2FyZC54ICsgZGlfY2FyZC53aWR0aCowLjRcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICAvL2RpX2NhcmQueCA9IGRpX2NhcmQud2lkdGgtaSpkaV9jYXJkLndpZHRoLTIwXG4gICAgICAgIC8vZGlfY2FyZC55PTYwXG4gICAgICAgIGRpX2NhcmQucGFyZW50ID0gdGhpcy5ib3R0b21fY2FyZF9wb3Nfbm9kZTsvLyB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZWluZ1VJXCIpLmRpemh1cGFpdmlldzsvL3RoaXMubm9kZS5nZXRDb21wb25lbnQoXCJkaXpodXBhaXZpZXdcIik7Ly8gIHRoaXMubm9kZS5wYXJlbnRcbiAgICAgICAgLy/lrZjlgqjlnKjlrrnlmajph4xcbiAgICAgICAgdGhpcy5ib3R0b21fY2FyZC5wdXNoKGRpX2NhcmQpXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy/nu5nnjqnlrrblj5HpgIHkuInlvKDlupXniYzlkI7vvIzov4cxcyzmiorniYzorr7nva7liLB5PS0yNTDkvY3nva7mlYjmnpxcbiAgICBzY2hlZHVsZVB1c2hUaHJlZUNhcmQoKXtcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmNhcmRzX25vZHMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXVxuICAgICAgICAgICAgaWYoY2FyZC55PT0tMjMwKXtcbiAgICAgICAgICAgICAgICBjYXJkLnkgPSAtMjUwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6S77yM5bm25pi+56S65Zyo5Y6f5pyJ54mM55qE5ZCO6Z2iXG4gICAgcHVzaFRocmVlQ2FyZCgpe1xuICAgICAgICAvL+avj+W8oOeJjOeahOWFtuWunuS9jee9riBcbiAgICAgICAgdmFyIGxhc3RfY2FyZF94ID0gIHRoaXMuY2FyZHNfbm9kc1t0aGlzLmNhcmRzX25vZHMubGVuZ3RoLTFdLnhcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmJvdHRvbV9jYXJkX2RhdGEubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXG4gICAgICAgICAgICBjYXJkLnNjYWxlPTAuOFxuICAgICAgICAgICAgY2FyZC5wYXJlbnQgPSB0aGlzLm15cGFpdmlld1xuICAgICAgICAgIFxuICAgICAgICAgICAgY2FyZC54ID0gbGFzdF9jYXJkX3ggKyAoKGkrMSkqdGhpcy5jYXJkX3dpZHRoICogMC40KVxuICAgICAgICAgICAgY2FyZC55ID0gLTIzMCAgLy/lhYjmiorlupXnm5jmlL7lnKgtMjMw77yM5Zyo6K6+572u5Liq5a6a5pe25Zmo5LiL56e75YiwLTI1MOeahOS9jee9rlxuICAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGhyZWVDYXJkIHg6XCIrY2FyZC54KVxuICAgICAgICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyh0aGlzLmJvdHRvbV9jYXJkX2RhdGFbaV0sbXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpXG4gICAgICAgICAgICBjYXJkLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuY2FyZHNfbm9kcy5wdXNoKGNhcmQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNvcnRDYXJkKClcbiAgICAgICAgLy/orr7nva7kuIDkuKrlrprml7blmajvvIzlnKgyc+WQju+8jOS/ruaUuXnlnZDmoIfkuLotMjUwXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuc2NoZWR1bGVQdXNoVGhyZWVDYXJkLmJpbmQodGhpcyksMilcblxuICAgIH0sXG5cbiAgICBkZXN0b3J5Q2FyZChhY2NvdW50aWQsY2hvb3NlX2NhcmQpe1xuICAgICAgICBpZihjaG9vc2VfY2FyZC5sZW5ndGg9PTApe1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvKuWHuueJjOmAu+i+kVxuICAgICAgICAgIDEuIOWwhumAieS4reeahOeJjCDku47niLboioLngrnkuK3np7vpmaRcbiAgICAgICAgICAyLiDku450aGlzLmNhcmRzX25vZHMg5pWw57uE5Lit77yM5Yig6ZmkIOmAieS4reeahOeJjCBcbiAgICAgICAgICAzLiDlsIYg4oCc6YCJ5Lit55qE54mM4oCdIOa3u+WKoOWIsOWHuueJjOWMuuWfn1xuICAgICAgICAgICAgICAzLjEg5riF56m65Ye654mM5Yy65Z+fXG4gICAgICAgICAgICAgIDMuMiDmt7vliqDlrZDoioLngrlcbiAgICAgICAgICAgICAgMy4zIOiuvue9rnNjYWxlXG4gICAgICAgICAgICAgIDMuNCDorr7nva5wb3NpdGlvblxuICAgICAgICAgIDQuICDph43mlrDorr7nva7miYvkuK3nmoTniYznmoTkvY3nva4gIHRoaXMudXBkYXRlQ2FyZHMoKTtcbiAgICAgICAgKi9cbiAgICAgICAgLy8xLzLmraXpqqTliKDpmaToh6rlt7HmiYvkuIrnmoRjYXJk6IqC54K5IFxuICAgICAgICB2YXIgZGVzdHJveV9jYXJkID0gW11cbiAgICAgICAgZm9yKHZhciBpPTA7aTxjaG9vc2VfY2FyZC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8dGhpcy5jYXJkc19ub2RzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgICAgIHZhciBjYXJkX2lkID0gdGhpcy5jYXJkc19ub2RzW2pdLmdldENvbXBvbmVudChcImNhcmRcIikuY2FyZF9pZFxuICAgICAgICAgICAgICAgIGlmKGNhcmRfaWQ9PWNob29zZV9jYXJkW2ldLmNhcmRpZCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVzdHJveSBjYXJkIGlkOlwiK2NhcmRfaWQpXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5jYXJkc19ub2RzW2pdLmRlc3Ryb3koKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhcmRzX25vZHNbal0ucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcblx0XHRcdFx0XHQvL3RoaXMuY2FyZHNfbm9kc1tqXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lfY2FyZC5wdXNoKHRoaXMuY2FyZHNfbm9kc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXJkc19ub2RzLnNwbGljZShqLDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hcHBlbmRDYXJkc1RvT3V0Wm9uZShhY2NvdW50aWQsZGVzdHJveV9jYXJkKVxuICAgICAgICB0aGlzLnVwZGF0ZUNhcmRzKClcblxuICAgIH0sXG5cbiAgICAvL+a4hemZpOaYvuekuuWHuueJjOiKgueCueWFqOmDqOWtkOiKgueCuSjlsLHmmK/miorlh7rniYznmoTmuIXnqbopXG4gICAgY2xlYXJPdXRab25lKGFjY291bnRpZCl7XG4gICAgICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcbiAgICAgICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQoYWNjb3VudGlkKVxuXHRcdGlmKG91dENhcmRfbm9kZT09bnVsbCl7cmV0dXJuO31cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gb3V0Q2FyZF9ub2RlLmNoaWxkcmVuO1xuICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkcmVuLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgdmFyIGNhcmQgPSBjaGlsZHJlbltpXTsgXG4gICAgICAgICAgICBjYXJkLmRlc3Ryb3koKVxuICAgICAgICB9XG4gICAgICAgIG91dENhcmRfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbih0cnVlKTtcbiAgICB9LFxuICAgIC8v5a+55Ye655qE54mM5YGa5o6S5bqPXG4gICAgcHVzaENhcmRTb3J0KGNhcmRzKXtcbiAgICAgICAgaWYoY2FyZHMubGVuZ3RoPT0xKXtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNhcmRzLnNvcnQoZnVuY3Rpb24oeCx5KXtcbiAgICAgICAgICAgIHZhciBhID0geC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcbiAgICAgICAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcblxuICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiLnZhbHVlIC0gYS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgIWIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYi5raW5nIC0gYS5raW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSxjYXJkcyx5b2Zmc2V0KXtcbiAgICAgICBvdXRDYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XG5cbiAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZSBsZW5ndGhcIitjYXJkcy5sZW5ndGgpXG4gICAgICAgLy/mt7vliqDmlrDnmoTlrZDoioLngrlcbiAgICAgICBmb3IodmFyIGk9MDtpPGNhcmRzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldOyBcbiAgICAgICAgICAgb3V0Q2FyZF9ub2RlLmFkZENoaWxkKGNhcmQsMTAwK2kpIC8v56ys5LqM5Liq5Y+C5pWw5pivem9yZGVyLOS/neivgeeJjOS4jeiDveiiq+mBruS9j1xuICAgICAgIH1cblxuICAgICAgIC8v5a+55Ye654mM6L+b6KGM5o6S5bqPXG4gICAgICAgLy/orr7nva7lh7rniYzoioLngrnnmoTlnZDmoIdcbiAgICAgICB2YXIgelBvaW50ID0gY2FyZHMubGVuZ3RoIC8gMjtcbiAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZSB6ZXJvUG9pbnQ6XCIrelBvaW50KVxuICAgICAgIGZvcih2YXIgaT0wO2k8Y2FyZHMubGVuZ3RoO2krKyl7XG4gICAgICAgIHZhciBjYXJkTm9kZSA9IG91dENhcmRfbm9kZS5nZXRDaGlsZHJlbigpW2ldXG4gICAgICAgIHZhciB4ID0gKGkgLSB6UG9pbnQpICogMzA7XG4gICAgICAgIHZhciB5ID0gY2FyZE5vZGUueSt5b2Zmc2V0OyAvL+WboOS4uuavj+S4quiKgueCuemcgOimgeeahFnkuI3kuIDmoLfvvIzlgZrlj4LmlbDkvKDlhaVcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIi0tLS0tY2FyZE5vZGU6IHg6XCIreCtcIiB5OlwiK3kpXG4gICAgICAgIGNhcmROb2RlLnNldFNjYWxlKDAuNSwgMC41KTsgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGNhcmROb2RlLnNldFBvc2l0aW9uKHgseSk7ICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICB9XG4gICAgfSxcbiAgICAvL+WwhiDigJzpgInkuK3nmoTniYzigJ0g5re75Yqg5Yiw5Ye654mM5Yy65Z+fXG4gICAgLy9kZXN0cm95X2NhcmTmmK/njqnlrrbmnKzmrKHlh7rnmoTniYxcbiAgICBhcHBlbmRDYXJkc1RvT3V0Wm9uZShhY2NvdW50aWQsZGVzdHJveV9jYXJkKXtcbiAgICAgICAgaWYoZGVzdHJveV9jYXJkLmxlbmd0aD09MCl7XG4gICAgICAgICAgIC8vIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8v5YWI57uZ5pys5qyh5Ye655qE54mM5YGa5LiA5Liq5o6S5bqPXG4gICAgICAgdGhpcy5wdXNoQ2FyZFNvcnQoZGVzdHJveV9jYXJkKVxuICAgICAgIC8vY29uc29sZS5sb2coXCJhcHBlbmRDYXJkc1RvT3V0Wm9uZVwiKVxuICAgICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcbiAgICAgICAvL+iOt+WPluWHuueJjOWMuuWfn+iKgueCuVxuICAgICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcbiAgICAgICB0aGlzLmFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUob3V0Q2FyZF9ub2RlLGRlc3Ryb3lfY2FyZCwzNjApXG4gICAgICAgLy9zY29uc29sZS5sb2coXCJPdXRab25lOlwiK291dENhcmRfbm9kZS5uYW1lKVxuXG4gICAgfSxcblxuICAgIC8v6YeN5paw5o6S5bqP5omL5LiK55qE54mMLOW5tuenu+WKqFxuICAgIHVwZGF0ZUNhcmRzKCl7XG4gICAgXG4gICAgICAgIHZhciB6ZXJvUG9pbnQgPSB0aGlzLmNhcmRzX25vZHMubGVuZ3RoIC8gMjtcbiAgICAgICAgLy92YXIgbGFzdF9jYXJkX3ggPSB0aGlzLmNhcmRzX25vZHNbdGhpcy5jYXJkc19ub2RzLmxlbmd0aC0xXS54XG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5jYXJkc19ub2RzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgdmFyIGNhcmROb2RlID0gdGhpcy5jYXJkc19ub2RzW2ldXG4gICAgICAgICAgICB2YXIgeCA9IChpIC0gemVyb1BvaW50KSoodGhpcy5jYXJkX3dpZHRoICogMC40KTtcbiAgICAgICAgICAgIGNhcmROb2RlLnNldFBvc2l0aW9uKHgsIC0yNTApOyAgXG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgXG4gICAgcGxheVB1c2hDYXJkU291bmQoY2FyZF9uYW1lKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJwbGF5UHVzaENhcmRTb3VuZDpcIitjYXJkX25hbWUpXG4gICAgICAgIFxuICAgICAgICBpZihjYXJkX25hbWU9PVwiXCIpe1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2goY2FyZF9uYW1lKXtcbiAgICAgICAgICAgIGNhc2UgQ2FyZHNWYWx1ZS5vbmUubmFtZTpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBDYXJkc1ZhbHVlLmRvdWJsZS5uYW1lOlxuICAgICAgICAgICAgICAgICAgICBpZihpc29wZW5fc291bmQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL2R1aXppLm1wM1wiKSkgXG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWsgIFxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcbiAgICBvbkJ1dHRvbkNsaWNrKGV2ZW50LGN1c3RvbURhdGEpe1xuXHRcdFxuICAgICAgICBzd2l0Y2goY3VzdG9tRGF0YSl7XG4gICAgICAgICAgICBjYXNlIFwiYnRuX3FpYW5kelwiOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnRuX3FpYW5kelwiKVxuICAgICAgICAgICAgICAgIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0Um9iU3RhdGUocWlhbl9zdGF0ZS5xaWFuKVxuXHRcdFx0XHR0aGlzLnVuc2NoZWR1bGUodGhpcy5mdW5VcCkvL+a4hemZpCDmiqLlnLDkuLsg5a6a5pe25ZmoXG5cdFx0XHRcdFxuICAgICAgICAgICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZihpc29wZW5fc291bmQpe1xuICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvd29tYW5famlhb19kaV96aHUub2dnXCIpKSBcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwiYnRuX2J1cWlhbmR6XCI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidG5fYnVxaWFuZHpcIilcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJvYlN0YXRlKHFpYW5fc3RhdGUuYnVxaWFuZylcblx0XHRcdFx0dGhpcy51bnNjaGVkdWxlKHRoaXMuZnVuVXApLy/muIXpmaQg5oqi5Zyw5Li7IOWumuaXtuWZqFxuXHRcdFx0XHRcbiAgICAgICAgICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgaWYoaXNvcGVuX3NvdW5kKXtcbiAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3dvbWFuX2J1X2ppYW8ub2dnXCIpKSBcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBicmVhayAgICBcbiAgICAgICAgICAgICBjYXNlIFwibm9wdXNoY2FyZFwiOiAgLy/kuI3lh7rniYxcbiAgICAgICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfYnVjaHVfY2FyZChbXSxudWxsKVxuICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXG5cdFx0XHRcdCB0aGlzLnVuc2NoZWR1bGUodGhpcy5mdW5VcDEpLy8g5riF6ZmkIOWHuueJjOWumuaXtuWZqFxuICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgIGNhc2UgXCJwdXNoY2FyZFwiOiAgIC8v5Ye654mMXG4gICAgICAgICAgICAgICAgIC8v5YWI6I635Y+W5pys5qyh5Ye654mM5pWw5o2uXG4gICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5sZW5ndGg9PTApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmc9XCLor7fpgInmi6nniYwhXCJcblx0XHRcdFx0XHR0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcblx0XHRcdFx0XHRcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nPVwiXCJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcblx0XHRcdFx0XHRyZXR1cm47Ly8g5LiN5Ye654mMIOWImei/lOWbnlxuICAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdCB0aGlzLnVuc2NoZWR1bGUodGhpcy5mdW5VcDEpLy8g5riF6ZmkIOWHuueJjOWumuaXtuWZqFxuICAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9jaHVfY2FyZCh0aGlzLmNob29zZV9jYXJkX2RhdGEsZnVuY3Rpb24oZXJyLGRhdGEpe1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0X2NodV9jYXJkOlwiK2VycilcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdF9jaHVfY2FyZFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50aXBzTGFiZWwuc3RyaW5nPT1cIlwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPSBkYXRhLm1zZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nPVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDIwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WHuueJjOWksei0pe+8jOaKiumAieaLqeeahOeJjOW9kuS9jVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmNhcmRzX25vZHMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmQgPSB0aGlzLmNhcmRzX25vZHNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkLmVtaXQoXCJyZXNldF9jYXJkX2ZsYWdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXG4gICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAvL+WHuueJjOaIkOWKn1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcF9jaHVfY2FyZCBkYXRhOlwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAvL+aSreaUvuWHuueJjOeahOWjsOmfs1xuICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVzcF9jaHVfY2FyZCBkYXRhOntcImFjY291bnRcIjpcIjI1MTk5MDFcIixcIm1zZ1wiOlwic3VjZXNzXCIsXCJjYXJkdmFsdWVcIjp7XCJuYW1lXCI6XCJEb3VibGVcIixcInZhbHVlXCI6MX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgLy97XCJ0eXBlXCI6XCJvdGhlcl9jaHVjYXJkX25vdGlmeVwiLFwicmVzdWx0XCI6MCxcImRhdGFcIjp7XCJhY2NvdW50aWRcIjpcIjI1MTk5MDFcIixcImNhcmRzXCI6W3tcImNhcmRpZFwiOjI0LFwiY2FyZF9kYXRhXCI6e1wiaW5kZXhcIjoyNCxcInZhbHVlXCI6NixcInNoYXBlXCI6MX19LHtcImNhcmRpZFwiOjI2LFwiY2FyZF9kYXRhXCI6e1wiaW5kZXhcIjoyNixcInZhbHVlXCI6NixcInNoYXBlXCI6M319XX0sXCJjYWxsQmFja0luZGV4XCI6MH1cbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlQdXNoQ2FyZFNvdW5kKGRhdGEuY2FyZHZhbHVlLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0b3J5Q2FyZChkYXRhLmFjY291bnQsdGhpcy5jaG9vc2VfY2FyZF9kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXG4gICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgICAgICAgICAgICAgLy90aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgY2FzZSBcInRpcGNhcmRcIjpcbiAgICAgICAgICAgICAgICAgYnJlYWsgICBcblx0XHRcdGNhc2UgXCJyZXR1cm5yb29tXCI6Ly/ph43mlrDov57mjqVcblx0XHRcdCAgICAgIFxuXHRcdFx0XHQvLyAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGIOmHjeaWsOi/nuaOpVwiKVxuXHRcdFx0XHQvLyAgbXlnbG9iYWwuc29ja2V0LmluaXRTb2NrZXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gXHQgIGNvbnNvbGUubG9nKFwi5Yid5aeL5YyWIOaIkOWKnyBpbml0U29ja2V0XCIpXG5cdFx0XHRcdC8vICBteWdsb2JhbC5hcGkubG9naW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdC8vICAgIGNvbnNvbGUubG9nKFwi6Ieq5Yqo55m75b2V5oiQ5YqfXCIpXG5cdFx0XHRcdC8vICAgICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxuXHRcdFx0IC8vICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfcmVfcm9vbSh7XCJyb29taWRcIjpnYW1lU2NlbmVfc2NyaXB0LnJvb21pZH0sZnVuY3Rpb24oZXJyLGRhdGEpe1xuXHRcdFx0XHQvLyBcdCAgLy/ph43mlrDov57mjqVcblx0XHRcdFx0Ly8gXHRcdCBpZihlcnI9PTApe1xuXHRcdFx0XHQvLyBcdFx0IHRoaXMucmV0dXJucm9vbS5hY3RpdmU9ZmFsc2U7XG5cdFx0XHRcdC8vIFx0XHQgY29uc29sZS5sb2coXCLph43mlrDov5vlhaXmiL/pl7Qg5oiQ5YqfXCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHRcdFx0XHRcdFx0IFxuXHRcdFx0XHQvLyBcdFx0IH1lbHNle1xuXHRcdFx0XHQvLyBcdFx0XHQgY29uc29sZS5sb2coXCLph43mlrDov5vlhaXmiL/pl7Qg5aSx6LSlXCIrZXJyKTtcblxuXHRcdFx0XHQvLyBcdFx0IH1cblx0XHRcdFx0Ly8gICAgICB9LmJpbmQodGhpcykpXG5cdFx0XHRcdFxuXHRcdFx0XHQvLyAgIH0uYmluZCh0aGlzKSlcblx0XHRcdFx0Ly8gICB9LmJpbmQodGhpcykpO1xuXHRcdFx0XHQgXG5cdFx0XHRcdCBicmVhayBcdFx0ICBcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KTtcbiJdfQ==