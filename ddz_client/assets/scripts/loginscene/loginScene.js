import myglobal from "../mygolbal.js"
cc.Class({
    extends: cc.Component,

    properties: {
       wait_node:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //console.log("qian_state.qian:"+ qian_state.qian)
        if(isopen_sound){
            cc.audioEngine.play(cc.url.raw("resources/sound/login_bg.ogg"),true) 
         }
           
         myglobal.socket.initSocket()
    },
    
    start () {
    },
	
	
    
    onButtonCilck(event,customData){
        switch(customData){
            case "wx_login":
                console.log("wx_login request")
                
                //this.wait_node.active = true
    //             if(localStorage.getItem("accountID")!=null){
				// 	myglobal.playerData.accountID=localStorage.getItem("accountID");
				// }
				// localStorage.setItem("accountID",myglobal.playerData.accountID);
    //             myglobal.socket.request_wxLogin({
    //                 uniqueID:myglobal.playerData.uniqueID,
    //                 accountID:myglobal.playerData.accountID,
    //                 nickName:myglobal.playerData.nickName,
    //                 avatarUrl:myglobal.playerData.avatarUrl,
    //             },function(err,result){
    //                 //请求返回
    //                 //先隐藏等待UI
    //                 //this.wait_node.active = false
    //                 if(err!=0){
    //                    console.log("err:"+err)
    //                    return     
    //                 }

    //                 console.log("login sucess" + JSON.stringify(result))
    //                 myglobal.playerData.gobal_count = result.goldcount
    //                 cc.director.loadScene("hallScene")
    //             }.bind(this))
				myglobal.api.login(function(data){
					cc.director.loadScene("hallScene")
				}.bind(this));
                break
				// case "guest_btn":
				// cc.director.loadScene("hallScene")
				
				// break;
            default:
			      // cc.director.loadScene("hallScene")
			
                break
        }
    }
    // update (dt) {},


});
