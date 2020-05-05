const config = require("../defines.js")
const Carder = require("./carder.js")

const RoomState = {
    ROOM_INVALID: -1,//等待游戏
    ROOM_WAITREADY: 1,  //等待游戏
    ROOM_GAMESTART: 2,  //开始游戏
    ROOM_PUSHCARD: 3,   //发牌
    ROOM_ROBSTATE:4,    //抢地主
    ROOM_SHOWBOTTOMCARD:5, //显示底牌
    ROOM_PLAYING:6,     //出牌阶段  
	ROOM_WIN:7
}
const getRandomStr = function (count) {
    var str = '';
    for (var i = 0 ; i < count ; i ++){
        str += Math.floor(Math.random() * 10);
    }
    return str;
}



module.exports = function(roominfo,player){
	const mydb = require("../db.js")
	mydb.connect(config.db_config)
	
    var that = {}
    that.room_id = getRandomStr(6)
    that._player_list = []
    console.log("creat room id:"+that.room_id)

    console.log("roominfo.level:"+roominfo.level)
    var tconfig = config.createRoomConfig[roominfo.level]
    //console.log("config"+JSON.stringify(tconfig))
    //mydb=mydb;
    that.own_player = player              //创建房间的玩家
    that.bottom = tconfig.bottom
    that.rate = tconfig.rate              //倍数  
    that.gold =  that.rate * that.bottom //基数 
	that.needCostGold=tconfig.needCostGold;//等级分 (进入该房间 门槛分数)
	that.ruchang_score=that.gold;// 开局分 (每局开始前 扣已次)                                      
    that.house_manage = player          //房主(不是地主)
    that.time_of_player_chupai=60000;// 玩家出牌超时时间 
	that.is_ruchang_score_log={};//开局扣分记录
	//that.cur_waitchucard  =null
    // const retell_player_join=function(){// 玩家 重连
    // 	for(var i=0;i<that._player_list.length;i++){
    // 	var player=that._player_list[i];
    // 	var playerInfo={
    // 	    accountid:player._accountID,
    // 	    nick_name:player._nickName,
    // 	    avatarUrl:player._avatarUrl,
    // 	    goldcount:player._gold,
    // 	    seatindex:null  //player.seatindex,//该 座位号 应该由 系统查找
    // 	}
    // 	//把用户信息广播个给房间其他用户
    // 	for(var j=0;j<that._player_list.length;j++){
    	           
    // 	    that._player_list[j].sendPlayerJoinRoom(playerInfo)
    // 	}
    // 	}
    	
    // } 
   that.getSeatIndex = function(playerlist){
       var seatindex = 1
       if(playerlist.length==0){
           return seatindex
       }
   
       var index = 1
       for(var i=0;i<playerlist.length;i++){
           if(index!=playerlist[i]._seatindex){
               return index
           }
           index++
       }
   
       return index
   }
    that.printGame=function(){
   	console.log(" 游戏 info");
   	var info={};
   	info.state =that.state //房间状态
	info.roomid=that.room_id
   	//初始化发牌器对象
   	//实例化牌和洗牌在构造函数完成
   	//info.lostplayer = that.lostplayer //下一次抢地主玩家
   	///info.robplayer = that.robplayer //复制一份房间内player,做抢地主操作
   	//info.room_master = that.room_master //房间地主引用
   	//info.three_cards = that.three_cards  //三张底牌
   	//info.playing_cards = that.playing_cards //存储出牌的用户(一轮)
   	//info.cur_push_card_list = that.cur_push_card_list //当前玩家出牌列表
   	//info.last_push_card_list = that.last_push_card_list //玩家上一次出的牌
   	info.last_push_card_accountid = that.last_push_card_accountid  //最后一个出牌的accountid
    info._player_list=[];
   	for(var i=0;i<that._player_list.length;i++){
   		var player=that._player_list[i];
   		var _info=that.printPlayer(player);
		info._player_list.push(_info);
   	}
   	
   	console.log(JSON.stringify(info));
   }
   
   that.RoomInfoofPlayer=function(player){
	   // if(that.state!=RoomState.ROOM_PLAYING){
		  //  return null;
	   // }
	   
	   //发送 恢复牌局信息
	   var info={};
	   info.state =that.state //房间状态
	   info.room_id=that.room_id;
	   
	   info.house_manage=that.house_manage._accountID//房主
	  if(that.room_master)
	   info.room_master = that.room_master._accountID //地主引用
	   if(that.three_cards&&that.three_cards[3])
	   info.three_cards =that.carder.toInfoArray(that.three_cards[3])  //三张底牌
	   
	  if(that.last_push_card_list)info.last_push_card_list = that.last_push_card_list //玩家上一次出的非空牌
	   if(that.last_push_card_accountid)info.last_push_card_accountid=that.last_push_card_accountid//上次有出非空牌的玩家
	   info.bottom = that.bottom//底分
	   info.rate = that.rate //倍数
	   var tmp_array_players=[];
	   for(var i=0;i<that._player_list.length;i++){
		   tmp_array_players.push(that.infoPlayer(that._player_list[i]));
	   }
	   info._player_list=tmp_array_players;// 当前玩家列表
	   
	   info._cards=that.carder.toInfoArray(player._cards);// 手牌
	   
	   if(that.cur_waitchucard){
		   info.cur_waitchucard=that.cur_waitchucard 
		   info.cur_waitchucard.now=parseInt(Date.now()/1000)
	   } //当前到谁出牌 及定时器
	   
	   return info;
   }
   
   that.printPlayer=function(player){
   	  var _info={};
   	  _info._nickName = player._nickName;    //用户昵称
   	  _info._accountID = player._accountID;  //用户账号
   	  _info._avatarUrl = player._avatarUrl;  //头像
	  _info.room_id=that.room_id
   	  _info._gold = player._gold;       //当前金币
   	  _info._seatindex = player._seatindex   //在房间的位置
   	  _info._isready = player._isready //当前在房间的状态 是否点击了准备按钮
   	  _info._cards = that.carder.printCard(that.carder.toCardlist(player._cards))     //当前手上的牌
   	  _info._isonline=player._isonline;
	  
   	  return _info;
   }
   that.infoPlayer=function(player){
   	  var _info={};
   	  _info._nickName = player._nickName;    //用户昵称
   	  _info._accountID = player._accountID;  //用户账号
   	  _info._avatarUrl = player._avatarUrl;  //头像
   	  _info.room_id=that.room_id
   	  //_info._gold = player._gold;       //当前金币
   	  _info._seatindex = player._seatindex   //在房间的位置
   	  _info._isready = player._isready //当前在房间的状态 是否点击了准备按钮
   	  //_info._cards = that.carder.printCard(that.carder.toCardlist(player._cards))     //当前手上的牌
   	  _info._isonline=player._isonline;
   	  
   	  return _info;
   }
   
   that.log_startgame=function(){
	   
	 var info={};
	 info.room_id=that.room_id;
	 info.room_log_id=that.room_log_id;
	 info.refer_room_log_id=that.refer_room_log_id;
	 var tmp_array_players=[];
	 var tmp_array_cards=[];
	 
	 for(var i=0;i<that._player_list.length;i++){
	 	var player=that._player_list[i];
		tmp_array_players.push(player._accountID);
		for(var j=0;j<player._cards.length;j++){
			var card=player._cards[j];
			tmp_array_cards.push(card.index)
		}
		tmp_array_cards.push(":")
	 }
	 
	 info.players=tmp_array_players.join(",");
	 info.cards=tmp_array_cards.join(",")
	 info.fz=that.house_manage._accountID;
	 info.dz=that.room_master._accountID;
	 
	 var tmp_array_cards_dz=[];
	 for(var i=0;i<that.three_cards[3].length;i++){
		 var card=that.three_cards[3][i];
		 tmp_array_cards_dz.push(card.index)
	 }
	 info.dzp=tmp_array_cards_dz.join(",")
	 
	 
	 info.difen=that.bottom;
     info.beishu=that.rate;  
	 info.starttime=parseInt( Date.now()/1000)
	 info.status=0;
	 
	 
	 mydb.insert(info,"t_game_logs",function(msg){
		 console.log("存入日志成功")
	 });
	   
   }
   
   
	 that.resetGame=function(){
		console.log("重置 游戏");
		that.state = RoomState.ROOM_INVALID //房间状态
		//初始化发牌器对象
		that.carder = Carder()  //发牌对象
		//实例化牌和洗牌在构造函数完成
		that.lostplayer = undefined //下一次抢地主玩家
	//	that.robplayer = [] //复制一份房间内player,做抢地主操作
		that.robplayer_index=0;//当前 抢地主 的玩家序号
		that.room_master = undefined //房间地主引用
		that.three_cards = []  //三张底牌
		that.playing_cards = [] //存储出牌的用户(一轮)
		that.cur_push_card_list = [] //当前玩家出牌列表
		that.last_push_card_list = [] //玩家上一次出的牌
		that.last_push_card_accountid = 0  //最后一个出牌的accountid
		that.room_log_id=that.room_id+"_"+parseInt(Date.now()/1000)
		that.refer_room_log_id=that.kf_log_id;// 开房记录id
		that.is_ruchang_score_log={};//开局扣分记录
		
		// if(typeof(that.refer_room_log_id)=="undefined"){
		// 	that.refer_room_log_id=that.room_log_id
		// }
		
		for(var i=0;i<that._player_list.length;i++){//重置游戏的时候 强制将不在线的玩家 踢出 房间
		    if(that._player_list[i]._isonline==false){//如果玩家已掉线
				for(var j=0;j<that._player_list.length;j++){
					if(j==i)continue;
					var p=that._player_list[i];
					var playerInfo={
					    accountid:p._accountID
					    // nick_name:p._nickName,
					    // avatarUrl:p._avatarUrl,
					    // goldcount:p._gold,
					    // seatindex:p._seatindex  //player.seatindex,//该 座位号 应该由 系统查找
					}
					that._player_list[j].sendplayerDisconnect(playerInfo);//通知其它玩家 ,该玩家已离开房间
				}
				 that._player_list.splice(i,1)// 删除该玩家
			}
		}

		//retell_player_join();
		that.printGame();
	}
	that.resetGame()
	
	
     that.changeState = function(state){
	     console.log("状态改变"+state);
        if(that.state==state){
			console.log("状态相同")
           // return   
        }
        that.state = state
        switch(state){
            
            case RoomState.ROOM_INVALID:
			      
				 that.resetGame();
			      
			     for(var i=0;i<that._player_list.length;i++){
					 that._player_list[i]._isready=false;
					 that._player_list[i]._cards=[];
					 //console.log("推送 状态改变"+ that._player_list[i]._accountID+" "+RoomState.ROOM_INVALID)
			         that._player_list[i].sendRoomState(RoomState.ROOM_INVALID)
			     }
				 console.log("状态改变 重置"+ state);
				 // setTimeout(function(){
					//  console.log("状态改变-1 resetGame()" );
				 //    resetGame();
				 // },1000);
                 break
		    case RoomState.ROOM_WAITREADY:
			     break
            case RoomState.ROOM_GAMESTART:
                that.gameStart()
                //切换到发牌状态
                that.changeState(RoomState.ROOM_PUSHCARD)
				that.printGame()
				
                break
            case RoomState.ROOM_PUSHCARD:
                console.log("push card state")
                //这个函数把54张牌分成4份[玩家1，玩家2，玩家3,底牌]
                that.three_cards = that.carder.splitThreeCards()
                for(var i=0;i<that._player_list.length;i++){
					//console.log("发牌 "+that.carder.printCard(that.carder.toCardlist(that.three_cards[i])));
                    that._player_list[i].sendCard(that.three_cards[i])
                }
                //切换到抢地主状态
                that.changeState(RoomState.ROOM_ROBSTATE)
                break
             case RoomState.ROOM_ROBSTATE:
                 console.log("change ROOM_ROBSTATE state")
                 // that.robplayer=[]
                 // for(var i=that._player_list.length-1;i>=0;i--){
                 //    that.robplayer.push(that._player_list[i])
                 // }
				 that.robplayer_index=that._player_list.length;
                 // console.log("that.robplayer length:"+that.robplayer.length)
				 console.log("that.robplayer length:"+that.robplayer_index)
                 that.turnRob()
                 break   
             case RoomState.ROOM_SHOWBOTTOMCARD:
                 //暂停s，让玩家看行底牌
                // setTimeout(function(){
					// if(that.state!=RoomState.ROOM_SHOWBOTTOMCARD)return;
					 
                    that.changeState(RoomState.ROOM_PLAYING)
                    //下个当前状态给客户端
                    for(var i=0;i<that._player_list.length;i++){
                        that._player_list[i].sendRoomState(RoomState.ROOM_PLAYING)
                    }
                 //},1000)
                 break  
             case RoomState.ROOM_PLAYING:
                 
                 that.resetChuCardPlayer()
                 //下发出牌消息  
                 that.turnchuCard()
				 that.log_startgame();//记录当前牌局 初始信息
				 
                 break      
            default: 
                break    
        }
    }

    that.jion_player = function(player){
        if(player){
			that._player_list.sort(function(x,y){
			    return Number(x._seatindex)-Number(y._seatindex)
			})
            player._seatindex = that.getSeatIndex(that._player_list) // 获取新的 座位id
           var playerInfo={
                accountid:player._accountID,
                nick_name:player._nickName,
                avatarUrl:player._avatarUrl,
                goldcount:player._gold,
                seatindex:player._seatindex,
            }
            //把用户信息广播给房间其他用户
            for(var i=0;i<that._player_list.length;i++){

                that._player_list[i].sendPlayerJoinRoom(playerInfo)
            }
            that._player_list.push(player)  
          
        }
		return  player;
    }
	that.re_room=function(player,callback){
		
	
		// if(that.state<RoomState.ROOM_GAMESTART){// 游戏已结束或未开始
		//    callback("游戏已结束或未开始") 
		//    return 		
		// }
		
		var p=null;
		for(var i=0;i<that._player_list.length;i++){
			if(that._player_list[i]._accountID!=player._accountID){
				continue
			}
			p=that._player_list[i];
		    
			
		    player.copyFromPlayer(p);
		   // p._socket=player._socket;//其它资料不变 ,只替换 socket,更新这些状态
		   // p._room=player._room;
		    //p._gamesctr=player._gamectr;
			
			player._isonline=true;
			//player._isready=false;
		    that._player_list[i]=player;
		}
		if(p==null){ // 重连失败,您已离开房间
		  if(callback){
			 callback("重连失败,您已离开房间") 
		  }
		  return 
		}
		
		if(callback){
		    resp = {
		        room:that,
				player:player,
		        data:{
		              roomid:that.room_id,
		              bottom:that.bottom,
		              rate:that.rate,
		              gold:that.gold,
					  seatindex:player._seatindex
		            }
		    }
			console.log("重新回到房间成功")
		    callback(0,resp)
		}
		

		
		
		
		//把用户重新连接成功 广播给房间其他用户
		var playerInfo={
		     accountid:player._accountID,
		     nick_name:player._nickName,
		     avatarUrl:player._avatarUrl,
		     goldcount:player._gold,
		     seatindex:player._seatindex,
		 }   
		for(var i=0;i<that._player_list.length;i++){
		       
		    that._player_list[i].sendPlayerReRoom(playerInfo)
		}
	
	}
	that.reset_game=function(player){//调试用
		console.log("玩家请求 重置游戏");
		//resetGame();
		// for(var i=0;i<that._player_list.length;i++){
		//     that._player_list[i].gameFinish("000000");
		// } 
		
		that.changeState(RoomState.ROOM_INVALID);
	}
    
    that.enter_room = function(player,callback){
        //获取房间内其他玩家数据
        var player_data = []
        console.log("enter_room _player_list.length:"+that._player_list.length)
        for(var i=0;i<that._player_list.length;i++){
            var data = {
                accountid:that._player_list[i]._accountID,
                nick_name:that._player_list[i]._nickName,
                avatarUrl:that._player_list[i]._avatarUrl,
                goldcount:that._player_list[i]._gold,
                seatindex:that._player_list[i]._seatindex,
                isready:that._player_list[i]._isready,
				isonline:that._player_list[i]._isonline
            }
            player_data.push(data)
            console.log("enter_room userdata:"+JSON.stringify(data))
        }

        
        //var seatid = getSeatIndex(this._player_list) //分配一个座位号
        if(callback){
            var enterroom_para = {
                seatindex: player._seatindex, //自己在房间内的位置
                roomid:that.room_id,      //房间roomid
                playerdata: player_data,  //房间内玩家用户列表
                housemanageid:that.house_manage._accountID, 
            }
            callback(0,enterroom_para)
            //https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564763901986&di=82c257959de2c29ea027a4c2a00952e0&imgtype=0&src=http%3A%2F%2Fimages.liqucn.com%2Fimg%2Fh1%2Fh988%2Fimg201711250941030_info400X400.jpg
       }
	   that.printGame();
    }
	
	
    //重新设置房主
     that.changeHouseManage = function(player){
        if(player){
            that.house_manage = player
            //这里需要加上，掉线用户accountid过去
            for(var i=0;i<that._player_list.length;i++){
                that._player_list[i].sendPlayerChangeManage(that.house_manage._accountID)
            }
        }
    }
	
	that.playerLeave=function(player,callback){
		console.log("玩家 请求离开房间"+player._accountID);//
		
		if(that.state>=RoomState.ROOM_GAMESTART){ 
			//游戏中 则  视作逃跑 ,强制解除 游戏,并将 逃跑玩家入场分 平分给 另外两位玩家
			
			
			 that.changeState(RoomState.ROOM_INVALID);// 切換到 贏狀態
			 that.jisuan_fenshu_tp(player._accountID);// 结算分数 逃跑分数
			for(var i=0;i<that._player_list.length;i++){
			    that._player_list[i].gameFinish({winner:that._player_list[i]._accountID,you_dt_score: that._player_list[i].dt_score});
			}
			mydb.update({"winner":-1,"finishtime":parseInt(Date.now()/1000),"remark":"逃跑"+player._accountID},"t_game_logs",{"room_log_id":that.room_log_id},null)
			
			that.playerOffLine(player);// 推送玩家离开 消息
			//that.changeState(RoomState.ROOM_INVALID);//切换到 初始状态
		}else{
		    that.playerOffLine(player);// 推送玩家离开 消息
		}
		//游戏中 则  视作逃跑 ,强制解除 游戏,并将 逃跑玩家入场分 平分给 另外两位玩家
		
	}
    //玩家掉线接口
    that.playerOffLine = function(player){
        //通知房间内那个用户掉线,并且用用户列表删除   分情况,游戏中不能删除,非游戏中则可以删除
		var player_leave_or_offline=0;
        for(var i=0;i<that._player_list.length;i++){
            if(that._player_list[i]._accountID === player._accountID){
				
				if(that.state<RoomState.ROOM_GAMESTART){//游戏未 开始 
				   that._player_list.splice(i,1)   // 游戏未开始 则 从房间移除该玩家
				   player_leave_or_offline=0;//玩家 离开房间
				}else{
				   that._player_list[i]._isonline=false;//  游戏已开始 则 设置为玩家已掉线状态
				   player_leave_or_offline=1; // 玩家 游戏中掉线
				}
				
                //判断是否为房主掉线
                if(that.house_manage._accountID == player._accountID){
                    if(that._player_list.length>=1){
                        that.changeHouseManage(that._player_list[0])
                    }
                }
			 break;
            }
        }
		for(var i=0;i<that._player_list.length;i++){// 推送通知其它玩家 该玩家掉线
		  console.log("通知 "+that._player_list[i]._accountID+" : "+player._accountID+" 已下线");
		  if(player_leave_or_offline ==0){
			  that._player_list[i].sendplayerDisconnect({"accountid":player._accountID,"roomstate":that.state});
		  }else{
			  that._player_list[i].sendplayerDisonline({"accountid":player._accountID,"roomstate":that.state});
		  }
		}
		//that.printGame();
    }

    that.playerReady = function(player){
        //告诉房间里所有用户，有玩家ready
        for(var i=0;i<that._player_list.length;i++){
            that._player_list[i].sendplayerReady(player._accountID)
        }
    }

    //下发开始游戏消息
     that.gameStart = function(){
        for(var i=0;i<that._player_list.length;i++){
            that._player_list[i].gameStart()
        }
    }
	//判断游戏是否 结束
	that.isGameFinished=function(){
		
		// if(that.clearRoom()){// 没有玩家在线则  回收 房间
		//    return true	
		// }
		
		if(that.state==RoomState.ROOM_WIN){
			return true;
		}
		
		  var winner_index=that.isGameWinner();
		 
		 if(winner_index!=-1){
			 that.changeState(RoomState.ROOM_WIN);// 切換到 贏狀態
			 that.jisuan_fenshu();//计分
			for(var i=0;i<that._player_list.length;i++){
			    that._player_list[i].gameFinish({winner:that._player_list[winner_index]._accountID,you_dt_score: that._player_list[i].dt_score});
			}
			mydb.update({"winner":that._player_list[winner_index]._accountID,"finishtime":parseInt(Date.now()/1000)},"t_game_logs",{"room_log_id":that.room_log_id},null)
			
			that.changeState(RoomState.ROOM_INVALID);//切换到 初始状态

			that.clearPlayerOfGlod();//清理 不够入场费的玩家
			//that.printGame()
			
	        return true; 
		 }
		 
		 return false;
	}
	
	that.clearRoom=function(){
		var online_count=0;
		for(var i=0;i<that._player_list.length;i++){
					 if(that._player_list[i]._isonline){
						 console.log("在线"+that.room_id+" "+that._player_list[i]._accountID)
						 online_count++
					 }
		}
		if(online_count==0){ 
					 //没有人在线
					 console.log("没有人在线 回收room"+that.room_id);
					 that._gamesctr.delete_room(that.room_id);
					 return true
		}
		return false;
	}
    
	that.isGameWinner=function(){
		for(var i=0;i<that._player_list.length;i++){
		    if(that._player_list[i]._cards.length==0){
				var p=that._player_list[i];
				console.log("没牌了 "+JSON.stringify(that.printPlayer(p)));
				that.winner_index=i;
				return i;
			}
		}
		return -1;
	}
	that.updategolds=function(){//推送
		var tmp_array_playergolds=[];
		//扣取 入场分 
		 for(var i=0;i<that._player_list.length;i++){
		       var player=that._player_list[i];
			  tmp_array_playergolds.push({accountID:player._accountID,goldcount:player._gold})
		 }
		 for(var i=0;i<that._player_list.length;i++){
		     that._player_list[i]._pushupdateInfo(tmp_array_playergolds);//推送更新玩家分数
		 }
	}
	
	that.jian_fenshu=function(_accountID,score){// 扣除 玩家 入场分
		var r= mydb.updatePlayergold(_accountID,score);// 减入场分
		if(r==false){
		  //callback(-1,{data:"gold - error"})
			return false
		}
		return true;
	}
	that.jisuan_fenshu=function(){//计算得分 正常输赢
	     var dz_win=-1;//地主输 or 赢
		   if(that._player_list[that.winner_index]._accountID==that.room_master._accountID){
			   dz_win=1; //底主赢
		   }
		   for(var i=0;i<that._player_list.length;i++){//计算 玩家 分数
		   var player=that._player_list[i];
		     var score=that.gold;
		     if(player._accountID==that.room_master._accountID){
			   score=2*dz_win*score;//  地主 双倍输赢
			 }else{
			   score=-1*dz_win*score;// 非地主 玩家 单倍输赢
			 }
			 player.dt_score=score;// 玩家输赢分 
			 score+=that.ruchang_score;//加上 返回 的入场分
			 
			 if(score!=0)mydb.updatePlayergold(player._accountID,score)//更新玩家分数
			 player._gold+=score;
			 
		   }
		   that.updategolds();// 推送玩家最新分数
    }
	
	that.jisuan_fenshu_tp=function(tp_accountID){//计算得分 玩家逃跑 双倍扣取 积分
		  
		  
		   for(var i=0;i<that._player_list.length;i++){//计算 玩家 分数
		   var player=that._player_list[i];
		     var score=that.gold;
		     if(player._accountID==tp_accountID){//逃跑玩家
			   score=-2*score;//双倍扣分
			 }
			   
			 
			 player.dt_score=score;// 玩家输赢分 
			 score+=that.ruchang_score;//加上 返回 的入场分
			 
			 if(score!=0)mydb.updatePlayergold(player._accountID,score)//更新玩家分数
			 player._gold+=score;
			 
		   }
		   that.updategolds();// 推送玩家最新分数
	}
  
    //发送下个玩家，开始抢地主
     that.turnRob = function(){
		 that.is_has_on=1;
        if(that.robplayer_index==0){
            //都抢过了，需要确定最终地主人选,直接退出
            console.log("rob player end")
			if(that.room_master==null){
				that.room_master=that._player_list[0];
			}
            that.changeMaster(that.room_master._accountID)
			//将 底牌 添加到地主手中
			for(var i=0;i<that._player_list.length;i++){
			  if( that._player_list[i]._accountID==that.room_master._accountID){
				   //that._player_list[i]._cards=
				   that._player_list[i]._cards.concat(that.three_cards[3]);// 合并地主牌
			  }
			}
			 
            //改变房间状态，显示底牌
            that.changeState(RoomState.ROOM_SHOWBOTTOMCARD)
            return
        }

        //弹出已经抢过的用户
        //var can_player = that.robplayer.pop()
		that.robplayer_index--;
		    if(that.robplayer_index<0 &&that.room_master==undefined){
				that.room_master = that._player_list[0];  
			    return
			}
		var can_player=that._player_list[that.robplayer_index];
		
        // if(that.robplayer_index<0 && that.room_master==undefined){
        //     //没有抢地主，并且都抢过了,就设置为最后抢的玩家
        //     that.room_master = can_player  
        //     //return   
        // }
		
		// if(can_player._isonline==false){//抢地主时 掉线 则跳过该玩家
		    
		// 	that.turnRob();
		// 	return;
		// }
       
        for(var i=0;i<that._player_list.length;i++){
            //通知下一个可以抢地主的玩家
			console.log("到谁抢地主"+can_player._accountID);
            that._player_list[i].SendCanRob({"_accountID":can_player._accountID,"now":parseInt(Date.now()/1000),"next_time":parseInt((Date.now()+that.time_of_player_chupai)/1000)})
        }
		
		clearTimeout(that.timeoutObj);
		
		that.is_has_on=0;
		
		that.timeoutObj = setTimeout(() => {
		  if(that.state!=RoomState.ROOM_ROBSTATE){
		    					console.log(" 游戏不在抢地主状态 ");
		    					return;
		  }
		  if(that.is_has_on==0){
		     console.log(that.time_of_player_chupai/1000+' 秒后 自动 跳转到下一位 抢地主' +can_player._accountID);
		     //is_next_on=1;
			 console.log("超时不抢地主"+can_player._accountID);
			 that.playerRobmaster(can_player,config.qian_state.buqiang);//不抢地主 通知下一位 抢
		  }
		}, that.time_of_player_chupai);
		
		  
    }

    //客户端到服务器: 发送地主改变的消息
     that.changeMaster = function(){
        for(var i=0;i<that._player_list.length;i++){
            that._player_list[i].SendChangeMaster(that.room_master._accountID)
        }

        //显示底牌
        for(var i=0;i<that._player_list.length;i++){
            //把三张底牌的消息发送给房间里的用户
            that._player_list[i].SendShowBottomCard(that.three_cards[3])
        }

    }
	that.clearPlayerOfGlod=function(){//清理 不够 入场费的玩家
		
		var is_has_gold_not_enough=false;//是否 全部玩家分数足够 
		//判断是有都准备成功
		for(var i=0;i<that._player_list.length;i++){
		       var player=that._player_list[i];
				if(typeof( that.is_ruchang_score_log[player._accountID])!="undefined"){
					console.log("已扣过分数 "+player._accountID);
					continue;//该玩家已经扣过入场分
				}
				if(player._gold-that.ruchang_score<0){
					console.log("玩家不够入场费 已踢出房间"+player._accountID)
					 that.playerOffLine(player);//踢出房间
					 is_has_gold_not_enough=true;
					 continue 
				}
		}
		return is_has_gold_not_enough;
		
	}
    //房主点击开始游戏按钮
    that.playerStart = function(player,cb){
        if(that._player_list.length != 3){
            if(cb){
                cb(-2,"玩家不足3人")
            }
            return
        }
          
		if(that.clearPlayerOfGlod()){//有玩家分数不够入场费
			  if(cb){
			      cb(-2,"有玩家分数不够")
			  }
			  return
		}
		  
		var is_all_ready=1;//是否 全部玩家准备好
		
        //判断是有都准备成功
        for(var i=0;i<that._player_list.length;i++){
            if(that._player_list[i]._accountID!=that.house_manage._accountID){
                if(that._player_list[i]._isready==false){
                    cb(-3,"有玩家未准备")
                    return 
                }
            }
        }
	   
		
		
		 
		 var is_all_jianfen=1;//是否 全部减分成功
		 
		
		var tmp_array_playergolds=[];
		//扣取 入场分 
		 for(var i=0;i<that._player_list.length;i++){
	           var player=that._player_list[i];
			   if(typeof( that.is_ruchang_score_log[player._accountID])!="undefined"){
				   console.log("玩家已扣 入场费"+player._accountID)
				   continue;//该玩家已经扣过入场分
			   }
			   
			   
			  var r=that.jian_fenshu(player._accountID,-1*that.ruchang_score)//扣取入场分数(数据库)
		      if(!r){
				  that.playerOffLine(player);//踢出房间
				  is_all_jianfen=0;  //否 全部减分成功
				  continue;
			  }
			  player._gold+=-1*that.ruchang_score;//扣玩家分数(内存)
			  that.is_ruchang_score_log[player._accountID]={accountID:player._accountID,goldcount:player._gold}// 记录已经扣过入场分
			  //player._pushupdateInfo();//推送 玩家最新 分数
			  tmp_array_playergolds.push({accountID:player._accountID,goldcount:player._gold})
		 }
		 for(var i=0;i<that._player_list.length;i++){
		     that._player_list[i]._pushupdateInfo(tmp_array_playergolds);//推送更新玩家分数
		 }
		 
		 if(is_all_jianfen==0)
		 {
		     cb(-6,"有玩家分数扣取失败")
		     return
		 }
		

        //开始游戏
        if(cb){
            cb(0,{})
        }

        //下发游戏开始广播消息
        //gameStart()
		
		// 将 玩家按座位号排序
		that._player_list.sort(function(x,y){
            return Number(x._seatindex)-Number(y._seatindex)
        })
		
        that.changeState(RoomState.ROOM_GAMESTART)
		that.printGame();
    }
    
    //一轮出牌完毕，调用这个函数重置出牌数组
    that.resetChuCardPlayer = function(){
		console.log("一轮出牌完成")
        var master_index = 0 //地主在列表中的位置 座位号
        for(var i=that._player_list.length-1;i>=0;i--){
           if(that._player_list[i]._accountID==that.room_master._accountID){
               master_index = i
           }
        }
        //重新计算出牌的顺序
	
		
        var index = master_index
        for(var i=that._player_list.length-1;i>=0;i--){
           var real_index = index % that._player_list.length
           console.log("real_index:"+real_index)
           that.playing_cards[i] = that._player_list[real_index]
           index++
        }

        //如果上一个出牌的人是自己，在一轮完毕后要从新设置为空
        //如果上一个出牌的人不是自己，就不用处理
        var next_push_player_account = that.playing_cards[that.playing_cards.length-1]._accountID
        if(that.last_push_card_accountid == next_push_player_account){
           that.last_push_card_list = []
           that.last_push_card_accountid = 0
        }
        
    }

      //通知下一位出牌
       that.turnchuCard = function(){
		   if(that.state!=RoomState.ROOM_PLAYING){
			   
		   }
		   
         //that.is_has_on=0;//  30秒后 下一个用户 是否出牌
		 //that.timeoutObj=null;
		that.is_has_on=1;//有人出牌
		clearTimeout(that.timeoutObj);
		
		
		if(that.playing_cards.length==0){
		    that.resetChuCardPlayer()
		}
		
        
		 that.cur_chu_card_player = that.playing_cards.pop()
		 that.cur_waitchucard={"_accountID":that.cur_chu_card_player._accountID,
			  "now":parseInt(Date.now()/1000),"next_time":parseInt((Date.now()+that.time_of_player_chupai)/1000)};
        for(var i=0;i<that._player_list.length;i++){
              //通知下一个出牌的玩家
              that._player_list[i].SendChuCard(that.cur_waitchucard)
        }
	      
	 
		
		that.is_has_on=0;
		
		that.timeoutObj = setTimeout(() => {
		  if(that.state!=RoomState.ROOM_PLAYING){
				console.log(" 游戏已结束  ");
				return;
		  }
		  if(that.is_has_on==0){
		     console.log(that.time_of_player_chupai/1000+' 秒后 自动 跳转到下一位 出牌人' +that.cur_chu_card_player._accountID);
		     //is_next_on=1;
			 that.playerChuCard(that.cur_chu_card_player,[]);//不出牌 通知下一位 出牌
		  }
		}, that.time_of_player_chupai);
		
		
      }

    //客户端发送到服务器:出牌消息
    // that.playerBuChuCard = function(player,data){
    //      if(player){
	   //     console.log("不出牌" +player._accountID);
	   //     that.sendPlayerPushCard(player,[]);// 发送  出 空牌的 消息
	   //   }
    //     //一轮出牌完毕，调用这个函数重置出牌数组
    //     if(that.playing_cards.length==0){
    //         that.resetChuCardPlayer()
    //     }
    //     that.turnchuCard()
    // }

     //玩家出牌日志
	 that.log_PlayerPushCard=function(player,cards){
		 var log={};
		 log.room_id=that.room_id;
		 log.room_log_id=that.room_log_id;
		 log.player_id=player._accountID;
		 log._act="出牌";
		 log.addtime=parseInt(Date.now()/1000);
		 var tmp_array_cards=[];
		 for(var i=0;i<cards.length;i++){
			 tmp_array_cards.push(cards[i]["card_data"]["index"]);
		 }
		 log.log=tmp_array_cards.join(",")
		 log.seat_index=player._seatindex;
		 var r=mydb.insert(log,"t_game_logs_detail");
		 console.log("存入出牌日志 "+r)
		 
	 }
	 

    //广播玩家出牌的消息
    //player出牌的玩家
     that.sendPlayerPushCard = function(player,cards){
        if(player==null){// || cards.length==0){
            return
        }

        for(var i=0;i<that._player_list.length;i++){
            //不转发给自己
            if(that._player_list[i]==player){
                continue
            }
            data = {
                accountid:player._accountID,
                cards:cards,
            }
            that._player_list[i].SendOtherChuCard(data)
      }
	  
	  
		
      player.removePushCards(cards)
	  that.log_PlayerPushCard(player,cards);
	  console.log("player cards count:",JSON.stringify(player._cards),player._cards.length)
	  console.log("player cards:",that.carder.printCard(that.carder.toCardlist(player._cards)));
	  // if(player._cards.length==0){
		 //  console.log(" winner ",player._accountID);
	  // }
	  that.printGame();
    }
	
    //玩家出牌
    that.playerChuCard = function(player,data,cb){
        console.log("playerChuCard"+JSON.stringify(data))
		
         //当前没有出牌,不用走下面判断
         if(data==0){
			 that.is_has_on=1;
            resp = {
                data:{
                      account:player._accountID,
                      msg:"choose card sucess",
                    }
            }
            if(cb)cb(0,resp)
            //让下一个玩家出牌,并发送消息
          // that.playerBuChuCard(player,null)
		  
		  //通知下一位出牌
		   that.turnchuCard()
		   //把该玩家出的牌广播给其他玩家
		   that.sendPlayerPushCard(player,[])
			return;
        }
        //that.cur_push_card_list = data
        //先判断自己是否有这么几张牌
        //先判断牌型是否满足规则
        var cardvalue = that.carder.IsCanPushs(data)
        if(cardvalue==undefined){
            resp = {
                data:{
                      account:player._accountID,
                      msg:"不可用牌型",
                    }
            }
            cb(-1,resp)
            return
        }
      
            //和上次玩家出牌进行比较
			  //bug  上次如果是自己出牌,则不需要判断 上次牌大小
            if(that.last_push_card_list.length!=0 && that.last_push_card_accountid != player._accountID
&& false==that.carder.compareWithCard(that.last_push_card_list,data)){
	// if( false==that.carder.compareWithCard(that.last_push_card_list,data)){
                resp = {
                    data:{
                          account:player._accountID,
                          msg:"当前牌太小",
                          cardvalue:cardvalue,
                        }
                }
                cb(-2,resp)
				return 
            }
			// else{
                //出牌成功
				that.is_has_on=1;
                that.last_push_card_list = data
                that.last_push_card_accountid = player._accountID
                resp = {
                    data:{
                          account:player._accountID,
                          msg:"choose card sucess",
                          cardvalue:cardvalue,
                        }
                }
                //回调函数会给出牌玩家发送出牌成功消息 
                cb(0,resp)
                //通知下一个玩家出牌
                //that.playerBuChuCard(player,null)
				//把该玩家出的牌广播给其他玩家
				that.sendPlayerPushCard(player,data)
				if(!that.isGameFinished()){//如果沒有 結束,則通知下一位
				//通知下一位出牌
				 that.turnchuCard()
				 }
               
				
            // }

          
        // }
    }
    //客户端到服务器: 处理玩家抢地主消息
    that.playerRobmaster = function(player,data){
		that.is_has_on=1;
        console.log("playerRobmaster"+player._accountID+" value:"+data)
        if(config.qian_state.buqiang==data){
            //记录当前抢到地主的玩家id
        
        }else if(config.qian_state.qian==data){
            that.room_master = player
        }else{
            console.log("playerRobmaster state error:"+data)
        }
        if(player==null){
            console.log("trun rob master end")
            return
        }
        //广播这个用户抢地主状态(抢了或者不抢)
        var value = data
        for(var i=0;i<that._player_list.length;i++){
            data={
                accountid:player._accountID,
                state:value,
				now:parseInt(Date.now()/1000),
				next_time:parseInt((Date.now()+that.time_of_player_chupai)/1000)
            }
			console.log("广播这个用户抢地主状态(抢了或者不抢)"+JSON.stringify(data));
            that._player_list[i].sendRobState(data)
        }
    that.turnRob()
  }
  
  return that
}



