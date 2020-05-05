const socket  = require("socket.io")
// const mydb = require("./db.js")
const gamectr = require("./game/game_ctr.js")
const app = socket(3000)
//const db_config = require("./db_config.js")

// mydb.connect({
//    "host": "127.0.0.1",
//    "port": "3306",
//    "user": "root",
//    "password": "123456",
//    "database": "game_ddz"
// })

app.on("connection",function(socket){
   console.log("a new connectin")
   socket.emit("connection","connection  sucess")
   gamectr.new_connect(socket);
   
   // socket.on("notify",function(req){
   //    console.log("notify" + JSON.stringify(req))
   //    console.log("msg: "+req.cmd)
     
   //    var data = req.data
   //    switch(req.cmd){
   //       case "wxlogin":
   //          var uniqueId = data.uniqueID
   //          //console.log("login uniqueId:"+uniqueId)
   //          mydb.getPlayerInfoByUniqueID(uniqueId,function(err,result){
   //             if (err){
   //                console.log("getPlayerInfoByUniqueID err"+err)
   //             }else{
   //                if(result.length===0){
   //                   //没有用户数据，创建一个
                    
   //                  var userinfo = {
   //                      uniqueID:data.uniqueID,
   //                      accountID:data.accountID,
   //                      nickName:data.nickName,
   //                      goldCount:1000000,
   //                      avatarUrl:data.avatarUrl,
   //                  }
   //                  mydb.createPlayer(userinfo)
   //                  //data = [{"unique_id":"1328014","account_id":"2117836",
   //                  //"nick_name":"tiny543","gold_count":1000,
   //                  //"avatar_url":"http://xxx"}]
   //                  gamectr.login_success(
   //                     {
   //                      unique_id:data.uniqueID,
   //                      account_id:data.accountID,
   //                      nick_name:data.nickName,
   //                      gold_count:1000,
   //                      avatar_url:data.avatarUrl,
   //                     },
   //                     socket,
   //                     req.callindex
   //                  )
   //                }else{
   //                   //取到数据
   //                   console.log('data = ' + JSON.stringify(result));
   //                   gamectr.login_success(result[0],socket,req.callindex)
   //                }
   //             }
   //          })
   //          break
   //       default:
   //          console.log("default process msg: "+req.cmd)
			// //gamectr.cmd(data,socket,req.callindex)
			
   //          break;
   //    }
   // })
})



