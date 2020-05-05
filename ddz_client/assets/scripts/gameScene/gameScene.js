import myglobal from "../mygolbal.js"

cc.Class({
    extends: cc.Component,

    properties: {
        di_label:cc.Label,
        beishu_label:cc.Label,
        roomid_label:cc.Label,
        player_node_prefabs:cc.Prefab,
        //绑定玩家座位,下面有3个子节点
        players_seat_pos:cc.Node,
        
    },
    //本局结束，做状态清除
    gameEnd(){
       console.log("本局结束,做 状态 清除")
    },
	recovery_game(){
		myglobal.socket.request_recovery({},function(err,result){//尝试 恢复牌局
		    console.log("request_recovery_resp"+ JSON.stringify(result))
			//Toast.show(JSON.stringify(result));
		    if(err!=0){
		       console.log("request_recovery_resp err:"+err)
		    }else{
			
	        this.ResetUI_with_data(result);	
				
			}
		}.bind(this));
	},
	ResetUI_with_data(data){
		this.roomstate=data.state;
		
		var gameingUI=this.node.getChildByName("gameingUI");
						gameingUI.active=(this.roomstate==RoomState.ROOM_PLAYING?true:false);
		var gameingUI_script= this.node.getChildByName("gameingUI").getComponent("gameingUI");
		gameingUI_script.ResetUI_()
		
		
			var gamebeforeUI = this.node.getChildByName("gamebeforeUI")
			    if(this.roomstate==RoomState.ROOM_PLAYING){//游戏中
				    gamebeforeUI.active=false;
				}
				else{
			        gamebeforeUI.active = this.roomstate==RoomState.ROOM_PLAYING? false:true
			        gamebeforeUI.emit("init")
				}
		
		 if(this.roomstate==RoomState.ROOM_PLAYING){// 游戏中
		   if(typeof(data._cards)!="undefined"&&data._cards.length>0){//显示手牌
		      gameingUI_script.show_mycards(data._cards);
		   }
		   if(typeof(data.three_cards)!="undefined"&&data.three_cards.length>0){//显示地主牌
		       gameingUI_script.show_bottom_cards(data.three_cards)  
		   }
		   if(typeof(data.cur_waitchucard)!="undefined"){//当前谁出牌
		     gameingUI_script.now_whocan_chupai(data.cur_waitchucard);
		   }
		   if(typeof(data.last_push_card_accountid)!="undefined"){//上次出的非空牌
			   gameingUI_script.show_chupai({"accountid":data.last_push_card_accountid,"cards":data.last_push_card_list});
		   }
		   
		  }
		   
		   
	},
	
	returnback(){//返回上一页
		
		
		//cc.director.loadScene("hallScene")
		
		if(this.roomstate>=RoomState.ROOM_GAMESTART){
			 Alert.show("游戏进行中,确定离开吗",function(){
				 this.leaveroom()
			 }.bind(this)); 
		}else{
		// 	//离开房间
		 	this.leaveroom();
		}	
	},
	leaveroom(){// 离开房间
	   cc.director.loadScene("hallScene")
	   myglobal.socket.requestLeaveRoom();
	},
	// onLoad(){
		
	// },
	onDestroy(){
	   myglobal.socket._event.removeAllLister();	
	},
    onLoad () {
		var that=this;
        this.playerNodeList = []
		this.playerdata_list=[]
        this.di_label.string = "底:" +  myglobal.playerData.bottom
        this.beishu_label.string = "倍数:" + myglobal.playerData.rate
        this.roomstate = RoomState.ROOM_INVALID
        //监听，给其他玩家发牌(内部事件)
        this.node.on("pushcard_other_event",function(){
            console.log("gamescene pushcard_other_event")
            for(var i=0;i<that.playerNodeList.length;i++){
                    var node = that.playerNodeList[i]
                    if(node){
                    //给playernode节点发送事件
                        node.emit("push_card_event")
                    }
            }
        }.bind(this))

        //监听房间状态改变事件
        myglobal.socket.onRoomChangeState(function(data){
            //回调的函数参数是进入房间用户消息
            console.log("onRoomChangeState:"+data)
            that.roomstate = data
			if(that.roomstate==RoomState.ROOM_INVALID){//
			//重置游戏
				console.log("服务器 重置 游戏");
				//var gamebefore_node = this.node.getChildByName("gameingUI")
				that.node.getChildByName("gameingUI").getComponent("gameingUI").ResetUI_()

				//gamebefore_node.emit("init")
				
			}
        }.bind(this))
		
		myglobal.socket.onPlayerDisconnect(function(data){
			console.log("onPlayerDisconnect 玩家离开房间:"+data.accountid+" ") //某个玩家离开房间
			Toast.show(data.accountid+" 离开房间");
	
			that.deletePlayerNode(data);
	        if(data.accountid==myglobal.playerData.accountID){
				console.log("您被踢出房间")
				cc.director.loadScene("hallScene")
			}		
		}.bind(this));
		myglobal.socket.onPlayerDisonline(function(data){
			console.log("onPlayerDisonline 玩家掉线:"+data.accountid+" ") //某个玩家 游戏中掉线
			that.offlinePlayerNode(data);
		}.bind(this));
		myglobal.socket.onPlayerReonline(function(data){
			console.log("onPlayerReonline 玩家重新连接成功:"+data.accountid+" ") //某个玩家 游戏中掉线重连成功通知
			that.onlinePlayerNode(data);
		}.bind(this));
		
	  
		 
		 
        //
		myglobal.socket.onSocketClosed(function(data){
			console.log("onSocketClosed:"+data)
			 Alert.show("您掉线啦,请重新登录!",function(){
				 cc.director.loadScene("loginScene");
				 return;
				 // if(this.roomstate!=RoomState.ROOM_PLAYING){
				 // 		  cc.director.loadScene("loginScene");
				 // 		  return;
				 // }
				 	
				 // var node=this.node.getChildByName("gameingUI").getComponent("gameingUI");
				 // 	node.returnroom.active=true;
				 	
				 	
				 },false);
				 
		}.bind(this));
			
		myglobal.socket.onNotLogined(function(data){
			console.log("您未登录!")
			Alert.show("您未登录,请重新登录!",function(){
				cc.director.loadScene("loginScene");
			})
		}.bind(this));
			
		
	
		
		
		this.node.on("onCanChuCard_gameScene",function(data){
			console.log("等待玩家出牌 ",JSON.stringify(data));
			//通知 可以出牌
			for(var i=0;i<that.playerNodeList.length;i++){
			    var node = that.playerNodeList[i]
			    if(node){
					node.emit("onCanChuCard_playernode",data);
				}
			}
		}.bind(this));
        this.node.on("canrob_event",function(event){
            console.log("gamescene canrob_event:"+event)
            //通知给playernode子节点
            for(var i=0;i<that.playerNodeList.length;i++){
                var node = that.playerNodeList[i]
                if(node){
                    //给playernode节点发送事件
                    node.emit("playernode_canrob_event",event)
                }
            }
        }.bind(this))
		

        this.node.on("choose_card_event",function(event){
            console.log("--------choose_card_event-----------")
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               console.log("get childer name gameingUI")
               return
            }
            gameui_node.emit("choose_card_event",event)
           
        }.bind(this))

        this.node.on("unchoose_card_event",function(event){
            console.log("--------unchoose_card_event-----------")
            var gameui_node =  this.node.getChildByName("gameingUI")
            if(gameui_node==null){
               console.log("get childer name gameingUI")
               return
            }
            gameui_node.emit("unchoose_card_event",event)
        }.bind(this))
        //监听给玩家添加三张底牌
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

        myglobal.socket.request_enter_room({},function(err,result){
            console.log("enter_room_resp"+ JSON.stringify(result))
            if(err!=0){
               console.log("enter_room_resp err:"+err)
            }else{
             
              //enter_room成功
              //notify ={"seatid":1,"playerdata":[{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}]}
                var seatid = result.seatindex //自己在房间里的seatid
                that.playerdata_list_pos = []  //3个用户创建一个空用户列表
                //this.setPlayerSeatPos(seatid)

                var playerdata_list = result.playerdata
                var roomid = result.roomid
				that.roomid=result.roomid
                that.roomid_label.string = "房间号:" + roomid
                myglobal.playerData.housemanageid = result.housemanageid
                myglobal.playerData.seat_index=seatid;
                for(var i=0;i<playerdata_list.length;i++){
                    //consol.log("this----"+this)
                    that.addPlayerNode(playerdata_list[i])
                }

                if(isopen_sound){
                    cc.audioEngine.stopAll()
                    cc.audioEngine.play(cc.url.raw("resources/sound/bg.mp3"),true) 
                }
            }
           // var gamebefore_node = this.node.getChildByName("gamebeforeUI")
            //gamebefore_node.emit("init")
			
			//this.node.getChildByName("gameingUI").getComponent("gameingUI").ResetUI_()
			
			
			that.recovery_game();
			
        }.bind(this))

        //在进入房间后，注册其他玩家进入房间的事件
        myglobal.socket.onPlayerJoinRoom(function(join_playerdata){
            //回调的函数参数是进入房间用户消息
            console.log("onPlayerJoinRoom:"+JSON.stringify(join_playerdata))
            Toast.show(join_playerdata.accountid+" 进入房间");
			that.addPlayerNode(join_playerdata)
        }.bind(this))
        
        //回调参数是发送准备消息的accountid
        myglobal.socket.onPlayerReady(function(data){
            console.log("-------onPlayerReady:"+data)
            for(var i=0;i<that.playerNodeList.length;i++){
                var node = that.playerNodeList[i]
                if(node){
                    node.emit("player_ready_notify",data)
                }
            }
        })

        myglobal.socket.onGameStart(function(){
            for(var i=0;i<that.playerNodeList.length;i++){
                var node = that.playerNodeList[i]
                if(node){
                    node.emit("gamestart_event")
                }
            }

        //隐藏gamebeforeUI节点
        var gamebeforeUI = this.node.getChildByName("gamebeforeUI")
            if(gamebeforeUI){
                gamebeforeUI.active = false
            }
        }.bind(this))

              //监听服务器玩家抢地主消息
        myglobal.socket.onRobState(function(event){
                console.log("-----onRobState"+JSON.stringify(event))
                //onRobState{"accountid":"2162866","state":1}
                for(var i=0;i<that.playerNodeList.length;i++){
                    var node = that.playerNodeList[i]
                    if(node){
                        //给playernode节点发送事件
                        node.emit("playernode_rob_state_event",event)
                    }
                }
        }.bind(this))

        //注册监听服务器确定地主消息
        myglobal.socket.onChangeMaster(function(event){
            console.log("onChangeMaster"+event)
            //保存一下地主id
            myglobal.playerData.master_accountid = event
            for(var i=0;i<that.playerNodeList.length;i++){
                var node = that.playerNodeList[i]
                if(node){
                    //给playernode节点发送事件
                    node.emit("playernode_changemaster_event",event)
                }
            }
        }.bind(this))
        
        //注册监听服务器显示底牌消息
        myglobal.socket.onShowBottomCard(function(event){
           console.log("onShowBottomCard---------"+event)
           var gameui_node =  this.node.getChildByName("gameingUI")
           if(gameui_node==null){
              console.log("get childer name gameingUI")
              return
           }
           gameui_node.emit("show_bottom_card_event",event)
        }.bind(this))
		
		//更新玩家分数
		myglobal.socket.onUpdateinfo(function(event){
			
			for(var i=0;i< this.playerNodeList.length;i++){
				this.playerNodeList[i].getComponent("player_node").updateGold(event.infolist)
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

    addPlayerNode(player_data){
        var playernode_inst = cc.instantiate(this.player_node_prefabs)
        playernode_inst.parent = this.node
      
         
        //玩家在room里的位置索引(逻辑位置)
        var index = (player_data.seatindex+3-myglobal.playerData.seat_index)%3;//     this.playerdata_list_pos[player_data.seatindex]
        console.log("我座位号"+myglobal.playerData.seat_index+" ,玩家座位号"+player_data.seatindex+ " "+index)
        playernode_inst.position = this.players_seat_pos.children[index].position
        playernode_inst.getComponent("player_node").init_data(player_data,index)
		//创建的节点存储在gamescene的列表中
		this.playerNodeList.push(playernode_inst)
    },
	deletePlayerNode(p){//某个玩家 离开房间
		 // const _this=this;
	      for(var i=0;i<this.playerNodeList.length;i++){
			  console.log("is delete "+this.playerNodeList[i].getComponent("player_node").accountid+":"+p.accountid);
			  if(this.playerNodeList[i].getComponent("player_node").accountid==p.accountid){
				  console.log("delete "+i+":"+p.accountid);
				      var j=i;
					  // setTimeout(function () {
				        this.playerNodeList[j].removeFromParent();
				        this.playerNodeList[j].destroy();
				        // delete(_this.playerNodeList[j]);
						//this.playerNodeList[j].removeListener();
						this.playerNodeList.splice(j,1);
				      // }.bind(this),100);
				  
			  }
		  }
		
	},
	getPlayerNodeByAccountid(accountid){
		const _this=this;
		for(var i=0;i<_this.playerNodeList.length;i++){
					//  console.log("is delete "+_this.playerNodeList[i].getComponent("player_node").accountid+":"+accountid);
		    if(_this.playerNodeList[i].getComponent("player_node").accountid==accountid){
				return _this.playerNodeList[i];
			}
		}
	},
	offlinePlayerNode(p){//某个玩家 游戏中掉线
		const _this=this;
		 var node= _this.getPlayerNodeByAccountid(p.accountid);
		 node.getComponent("player_node").onOffLine();
		// for(var i=0;i<_this.playerdata_list.length;i++){
		//   if(_this.playerdata_list[i].accountid==p.accountid){
		// 	  _this.playerNodeList[i].getComponent("player_node").onOffLine();
		//   }
		// }
	},
	onlinePlayerNode(p){//某个玩家 游戏中掉线重新连接成功
		const _this=this;
		// for(var i=0;i<_this.playerdata_list.length;i++){//
		//   if(_this.playerdata_list[i].accountid==p.accountid){
		// 	  _this.playerNodeList[i].getComponent("player_node").onOnLine();
		//   }
		// }
		var node= _this.getPlayerNodeByAccountid(p.accountid);
		node.getComponent("player_node").onOnLine();
		
		if(p.accountid==myglobal.playerData.accountID){// 自己掉线重连成功
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
    getUserOutCardPosByAccount(accountid){
        console.log("getUserOutCardPosByAccount accountid:"+accountid)
        for(var i=0;i<this.playerNodeList.length;i++){
            var node = this.playerNodeList[i]
            if(node){
                //获取节点绑定的组件
                var node_script = node.getComponent("player_node")
                //如果accountid和player_node节点绑定的accountid相同
                //接获取player_node的子节点
                if(node_script.accountid===accountid){
                  var seat_node = this.players_seat_pos.children[node_script.seat_index]
                  var index_name = "cardsoutzone"+node_script.seat_index
                  //console.log("getUserOutCardPosByAccount index_name:"+index_name)
                  var out_card_node = seat_node.getChildByName(index_name)
                  //console.log("OutZone:"+ out_card_node.name)
                  return out_card_node
                }
            }
        }

        return null
    },
    // update (dt) {},
});
