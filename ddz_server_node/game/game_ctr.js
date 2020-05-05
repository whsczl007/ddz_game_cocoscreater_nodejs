const Player = require("./player.js")
const Room = require("./room.js")
const config = require("../defines.js")
const mydb = require("../db.js")
mydb.connect(config.db_config)

var _player_logined_list = {}
// exports._sockets={}
var _room_infos = []

exports.new_connect=function(socket){
	var player = Player({},this)
	
	socket.on("notify",function(cmd){
		player.on_notify(cmd);
	});
	player._notify = function(type, result ,data, callBackIndex) {
	  console.log('notify =' + JSON.stringify(data));
	  socket.emit('notify', {
        type: type,
        result:result,
        data: data,
        callBackIndex: callBackIndex
       });
	}
	player.login_success=function(player){
		 _player_logined_list[player._accountID]=player;
		//_sockets[player._accountID]=socket
	}
	socket.on("disconnect",function(){
	     console.log("player disconnect "+player._accountID)
		 if(typeof(_player_logined_list[player._accountID])!=undefined){
			delete (_player_logined_list[player._accountID])
		 }
		 player.disconnect();
	})
	
	
	
	
}
// exports.login_success = function(playerInfo,socket,callindex){
//   //  var player = Player(playerInfo,socket,callindex,this)
	
//     //_player_list.push(player)
	
// 	player.loginresp(callindex);
	
	
// }


exports.create_room =async function(roomInfo,own_player,callback){
 
    //检测用户是否能创建房间
    //检查金币数量是否足够
	var level_config=config.createRoomConfig[roomInfo.level];
    var needgold = level_config.needCostGold
    console.log("create room needglobal:"+needgold)
    
    if(own_player._gold < needgold){//金币数不足
        callback(-1,{data:"gold not enough"}) 
        return 
    }
	if(own_player._fkcount<1){//房卡不足
		callback(-1,{data:"room card not enough"})
		return 
	}
	
	// var r= mydb.updatePlayergold(own_player._accountID,-1*needgold);// 减入场分
	// if(r==false){
	// 	callback(-1,{data:"gold - error"})
	// 	return 
	// }
	// own_player._gold+=-1*needgold
	
	
	
    r= mydb.updatePlayerfkcount(own_player._accountID,-1);// 减房卡
	if(r==false){
		callback(-1,{data:"fkcount - error"})
		return 
	}
	own_player._fkcount--;
	
	var room = Room(roomInfo,own_player)
	
	r= await mydb.kf_log(room.room_id,own_player._accountID,own_player._fkcount);
	if(r==false){
		callback(-1,{data:"fk log - error"})
		return 
	}
	 room.kf_log_id=r.insertId;// 开房记录id
	
	room._gamesctr=this;
	_room_infos.push(room)
    room.jion_player(own_player)
    if (callback){
        callback(0,{
                    room:room,
                    data:{
                           roomid:room.room_id,
                           bottom:level_config.bottom,
                           rate:level_config.rate
                         }
                   })
        }

}


// exports.re_room = function(data,player,callback){//游戏中断线 重新 回到 房间 并恢复 牌局
//     //console.log("jion_room AA"+data.roomid)
// 	console.log("请求 重新进入"+player._accountID +" 房间"+data.roomid)
	
//     for(var i=0;i<_room_infos.length;++i){
//         //console.log("_room_infos[i] BB:"+_room_infos[i].room_id)
// 		var room_info=_room_infos[i];
		
//         if(room_info.room_id === data.roomid){
			
//             //console.log("----jion_room sucess roomid:"+data.roomid)
		        
// 			room_info.re_room(player,callback) 
// 	        return		
			
//         }
//     }
	
// 	//return false

//     if(callback){
//         callback("no found room:"+data.roomid)
//     }
// }
 
//notify{"type":"joinroom_resp","result":null,"data":{"data":{"roomid":"714950","gold":100}},"callBackIndex":3}
exports.jion_room = function(data,player,callback){
    //console.log("jion_room AA"+data.roomid)
    for(var i=0;i<_room_infos.length;++i){
        //console.log("_room_infos[i] BB:"+_room_infos[i].room_id)
		var room_info=_room_infos[i];
		
        if(room_info.room_id === data.roomid){
            //console.log("----jion_room sucess roomid:"+data.roomid)
			if(room_info.clearRoom()){//判断  房间是否已解散
				callback("room "+data.roomid+" already cleaned");
				return 
			}
			
		    for(var i=0;i<room_info._player_list.length;i++){
				if(room_info._player_list[i]._accountID==player._accountID){
					console.log("重新回到房间"+player._accountID);
			      //this.re_room(data,player,callback)
				  room_info.re_room(player,callback) 
				  return
				}
			} 
			 
			if(room_info._player_list.length>2){
				callback("room "+data.roomid+" having "+room_info._player_list.length+" players")
				return 
			}
			console.log("your gold "+player._gold+" needed "+room_info.needCostGold);
			if(player._gold<room_info.needCostGold){//
			    callback("your gold "+player._gold+" needed "+room_info.needCostGold)
				return 
			}
			
            var p= room_info.jion_player(player) 
            if(callback){
                resp = {
                    room:room_info,
					player:p,
                    data:{
                          roomid:room_info.room_id,
                          bottom:room_info.bottom,
                          rate:room_info.rate,
                          gold:room_info.gold,
						  seatindex:p._seatindex
						  
                        }
                }
                callback(0,resp)
                return
            } 
        }
    }

    if(callback){
        callback("room "+data.roomid+" not exists")
    }
} 
 
 exports.delete_room=function(roomid){
	 for(var i=0;i<_room_infos.length;++i){
	     //console.log("_room_infos[i] BB:"+_room_infos[i].room_id)
	 	var room_info=_room_infos[i];
	 	
	     if(room_info.room_id ===roomid){
		 _room_infos.splice(i,1); 
		 console.log("房间收回成功 "+roomid);
		 return ;
		 }
	}
	 console.log("房间收回失败 "+roomid);
 }
 
