
const config = require("../defines.js")

	
	
module.exports = function(info,gamectr){
	
   //console.log("playerinfo:"+ JSON.stringify(info))
   const mydb = require("../db.js")
   mydb.connect(config.db_config)
   
   var that = {}
   that._nickName = info.nick_name;    //用户昵称
   that._accountID = info.account_id;  //用户账号
   that._avatarUrl = info.avatar_url;  //头像
   that._gold = info.gold_count;       //当前金币
   that._fkcount=info._fkcount;//房卡数
   //that.token=null;
   // that._socket = socket
   that._gamesctr = gamectr
   that._room = undefined //所在房间的引用
   that._seatindex = 0   //在房间的位置
   that._isready = false //当前在房间的状态 是否点击了准备按钮
   that._isonline=true   //当前是否 在线
   
  // that._state=
   that._cards = []      //当前手上的牌
   //内部使用的发送数据函数
 //    that._notify = function (type, result ,data, callBackIndex) {
    
	// console.log('notify =' + JSON.stringify(data));
  
 //    if(typeof(that.gamectr._sockets[that._accountID])!="undefined"){
		
	// }
	// // that.gamectr._sockets[that._accountID].emit('notify', {
	// that._socket.emit('notify', {
 //        type: type,
 //        result:result,
 //        data: data,
 //        callBackIndex: callBackIndex
 //    });
	
// };
   
  
   //通知客户端登录成功，返回数据
   //_notify("login_resp",0,{goldcount:that._gold},callindex)

   // that._socket.on("disconnect",function(){
   //      console.log("player disconnect")
   //      if(that._room){
   //          that._room.playerOffLine(that)
   //      }
   // })
   that.disconnect=function(){
	   console.log("player disconnect "+that._accountID)
	   if(that._room){
	       that._room.playerOffLine(that)
	   }
   }
   that.loginresp=function(callindex){
	  that._notify("login_resp",0,{goldcount:that._gold},callindex)
   }
   that._pushupdateInfo=function(infolist){
	   
	    that._notify("updateinfo_notify",0,{infolist:infolist},null)
   }
   that.copyFromPlayer=function(p){// 
	   that._nickName = p._nickName;    //用户昵称
	    that._accountID = p._accountID ;  //用户账号
	    that._avatarUrl = p._avatarUrl;  //头像
	    that._gold =  p._gold;       //当前金币
		that._fkcount=p._fkcount
	    //that.token=null;
	    // that._socket = socket
	  
	    that._seatindex = p._seatindex  //在房间的位置
	    that._isready = p._isready //当前在房间的状态 是否点击了准备按钮
	    that._isonline=p._isonline   //当前是否 在线
	   // that._state=
	    that._cards = p._cards      //当前手上的牌
	    //内部使用的发送数据函数
   } 
   //删除玩家出过的牌
   that.removePushCards = function(remve_cards){
        if(remve_cards.length==0){
            return 
        }

        for(var i=0;i<remve_cards.length;i++){
            var rcard = remve_cards[i]
            if(rcard==null){
                continue
            } 
            
            for(var j=0;j<that._cards.length;j++){
				if(typeof(that._cards[j])=="undefined")continue;// 
                if(rcard.cardid==that._cards[j].index){
                    that._cards.splice(j,1)
                }
            }
           
        }
   },
   that.auto_login= function(data,callback){
	   var accountID = data.accountID
	   //console.log("login uniqueId:"+uniqueId)
		// var arrays=await mydb.getPlayerInfoByAccountID(accountID,null);
		// console.log("arrays"+JSON.stringify(arrays));
		// return;
	   mydb.getPlayerInfoByAccountID(accountID,function(err,result){
	      if (err){
	         console.log("getPlayerInfoByaccountID err"+err)
	      }else{
	   			var userinfo={};
	         if(result.length===0){
	            //没有用户数据，创建一个
	           
	            userinfo = {
	               unique_id:data.uniqueID,
	               account_id:data.accountID,
	               nick_name:data.nickName,
	               avatar_url:data.avatarUrl,
	            }
	           mydb.createPlayer(userinfo,function(){
				    console.log("自动注册成功")
					that.auto_login(data,function(data1){
									   console.log("注册并登录成功")
									   callback(data1);
					});
			   })
			  
	           
	   					     
	         }else{
	            //取到数据
	            console.log("登录成功 = " + JSON.stringify(result));
	   			userinfo=result[0];		
                callback(userinfo)
	         }
			}
			});
   },

   //data分3个部分 cmd,{data},callindex
   // that._socket.on("notify",function(req){
	   that.on_notify=function(req){
        var cmd = req.cmd
        var data = req.data
        var callindex = req.callindex
		//mydb=mydb;
        console.log("_notify" + JSON.stringify(req))
		
		if(cmd!="wxlogin"&&!that._accountID){//未登录
		   
			that._notify("not_logined",null,null,null);
			return 
		}
		
		
        switch(cmd){
			
			case "wxlogin":
			    //当前金币
					 
					 that.auto_login(data,function(userinfo){
						 that._nickName = userinfo.nick_name;    //用户昵称
						 that._accountID = userinfo.account_id;  //用户账号
						 that._avatarUrl = userinfo.avatar_url;  //头像
						 that._gold = userinfo.gold_count;       //当前金币
						 that._fkcount=userinfo.fkcount;// 房卡数量
						 
						 that._notify("login_resp",0,userinfo,req.callindex)
						 that.login_success(that)
					 })
					
			   
			   break;
			
			
            case "createroom_req":
                that._gamesctr.create_room(data,that,function(err,result){
                    if(err!=0){
                        console.log("create_room err:"+ err)
                    }else{
                        that._room = result.room
                        console.log("create_room:"+ result)
                    }
                   
                   that._notify("createroom_resp",err,result.data,callindex)
                })

                break;
                case "joinroom_req":
                   
                    that._gamesctr.jion_room(req.data,that,function(err,result){
                        if(err){
                            console.log("joinroom_req err"+ err)
                           that._notify("joinroom_resp",err,null,callindex)
                        }else{
                            //加入房间成功
						    console.log("加入房间成功")
                            that._room = result.room
							that._seatindex=result.data.seatindex
							that.copyFromPlayer(result.player)
                           that._notify("joinroom_resp",err,result.data,callindex)
                        }

                    })
                    break
				// case "reroom_req"://游戏中掉线 重新回到游戏
				// 	that._gamesctr.re_room(req.data,that,function(err,result){
						
				// 	 if(err){
				// 		 console.log("reroom_resp err 错误"+ err)
				// 		that._notify("reroom_resp",err,result,callindex)
				// 	 }else{
				// 		that._room = result.room //重新回到游戏 成功
				// 		console.log("reroom_resp 成功"+result.data);
				// 		that._notify("reroom_resp",err,result.data,callindex)
				// 	 }
				// 	})
				// 	break;
				case "recovery_req":// 恢复游戏信息
					var info= that._room.RoomInfoofPlayer(that)// 恢复 牌局信息
					console
					if(info){
						that._notify("recovery_resp",0,info,callindex)
					}
					
					break
				case "resetroom_req"://测试 重置游戏
				      that._room.reset_game(req.data);
					 that._notify("resetroom_resp",0,req.data,callindex)
					  
					 break
                    case "enterroom_req":
                        if(that._room) {
                            that._room.enter_room(that,function(err,result){
                                if(err!=0){
                                   that._notify("enter_room_resp",err,{},callindex)
                                }else{
                                    //enterroom成功
                                    that._seatindex =  result.seatindex
                                   that._notify("enter_room_resp",err,result,callindex)
                                }
                              
                            })
                           
                        }else{
                            console.log("that._room is null")
                        }
                        
                        break
                     case "player_ready_notify":   //玩家准备消息通知
                         if(that._room){
                            that._isready = true 
                            that._room.playerReady(that)
                         }
                         break 
                     case "player_start_notify": //客户端:房主发送开始游戏消息
                           if(that._room){
                            that._room.playerStart(that,function(err,result){
                                if(err){
                                    console.log("player_start_notify err"+ err)
                                   that._notify("player_start_notify",err,result,callindex)
                                }else{ 
                                    //加入房间成功
                                    
                                   that._notify("player_start_notify",err,result,callindex)
                                }
        
                            })
                           }
                           break  
							 
				    case "player_leave_room"://客户端 玩家请求离开房间
					         if(that._room){
								 that._room.playerLeave(that,function(err,result){
									 if(err){
									     console.log("player_leave_room_resp err"+ err)
									    that._notify("player_leave_room_resp",err,result,callindex)
									 }else{ 
									     //离开房间成功
									    that._notify("player_leave_room_resp",err,result,callindex)
									 }
								 });
							 }
							 break
                      case "player_rob_notify":  //客户端发送抢地主消息
                           if(that._room){
                            that._room.playerRobmaster(that,data)
                           }
                           break 
                       case "chu_bu_card_req":   //客户端发送出牌消息
                           //  if(that._room){
                           //      that._room.playerBuChuCard(that,data)
                           //  }
                           // break   
                       case "chu_card_req":
                            if(that._room){
                                if(that._room.cur_chu_card_player._accountID!=that._accountID){
									console.log("不到你出牌"+that._room.cur_chu_card_player._accountID+","+that._room.cur_chu_card_player._seatindex+" "+that._accountID+","+that._seatindex);
									return;
								}
                                console.log("that._room")
                                that._room.playerChuCard(that,data,function(err,result){
                                    if(err){
                                      console.log("playerChuCard cb err:"+err+" "+result)
                                     that._notify("chu_card_req",err,result.data,callindex)
                                     return ;          
                                    }
                                    that._notify("chu_card_req",0,result.data,callindex)
                                })
                            }
                           break         
            default:
                break;    
        }
   }

   that.sendPlayerJoinRoom = function(data){
    console.log("player join room notify" + JSON.stringify(data))
    that._notify("player_joinroom_notify",0,data,0)
   }

   //发送有玩家准备好消息
   that.sendplayerReady = function(data){
       //console.log("sendplayerReady accountid:"+data)
      that._notify("player_ready_notify",0,data,0)
   }
   
   //发送有玩家离开房间消息
   that.sendplayerDisconnect = function(data){
       console.log("sendplayerDisconnect accountid:"+data._accountID)
      that._notify("player_disconnect_notify",0,data,0)
   }
   //发送有玩家 游戏中掉线消息
   that.sendplayerDisonline = function(data){
       console.log("sendplayerDisonline accountid:"+data.accountid)
      that._notify("player_disonline_notify",0,data,0)
   }
   //发送有 玩家 游戏中 掉线重连 成功消息
   that.sendPlayerReRoom=function(data){
	   console.log("sendplayerReonline 通知重新连接  "+that._accountID+" ,  accountid:"+data.accountid)

	  that._notify("player_reonline_notify",0,data,0)
   }
   that.gameStart = function(){
       //console.log("player gameStart")
      that._notify("gameStart_notify",0,{},0)
   }
   that.gameFinish = function(data){  //游戏完成 
       //console.log("player gameStart")
      that._notify("gameFinish_notify",0,data,0)
   }

   that.sendPlayerChangeManage = function(data){
         console.log("sendPlayerChangeManage: account:"+data)
        that._notify("changehousemanage_notify",0,data,0)
   }

   that.sendCard = function(data){
    that._cards = data
    that._notify("pushcard_notify",0,data,0)
   }
   
   //发送谁可以抢地主
    that.SendCanRob = function(data){
        console.log("SendCanRob"+data)
       that._notify("canrob_notify",0,data,0)
    }

    //通知抢地主状态
    that.sendRobState = function(data){
       that._notify("canrob_state_notify",0,data,0)
    }

    //发送当前地主是谁
    that.SendChangeMaster = function(data){
       that._notify("change_master_notify",0,data,0)
    }

    //发送给客户端:显示底牌
    that.SendShowBottomCard = function(data){
       that._notify("change_showcard_notify",0,data,0)
    }

    that.SendChuCard = function(data){
       that._notify("can_chu_card_notify",0,data,0)
    }

    that.sendRoomState = function(data){
       that._notify("room_state_notify",0,data,0)
    }

    //通知：其他玩家出牌广播
    that.SendOtherChuCard = function(data){
       that._notify("other_chucard_notify",0,data,0)
    }
    return that
}
