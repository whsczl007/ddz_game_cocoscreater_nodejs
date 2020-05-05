import myglobal from "../../mygolbal.js"
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    _createroom(level,callback){
        if(level<0 || level>4){
			callback("create room level error"+ level)
            console.log("create room level error"+ level)
            return
        }

        // var global = 0
        // if (rate==1){
        //     global = 10
        // }else if(rate==2){
        //     global = 20
        // }else if(rate==3){
        //     global = 30
        // }else if(rate==4){
        //     global = 40
        // }

        var room_para = {
               // global:global,
                level:level
                }
                //播放一个等待动画
				
                myglobal.socket.request_creatroom(room_para,function(err,result){
                    if (err!=0){
                        console.log("create_room err:"+err)
						callback(err,result)
                    }else{
                        console.log("create_room" + JSON.stringify(result))
                        //网络数据包
                        myglobal.playerData.bottom = result.bottom
                        myglobal.playerData.rate = result.rate
                        cc.director.loadScene("gameScene")
						callback(0)
                    }

                })
    },

    // update (dt) {},
    onButtonClick(event,customData){
		var callback=function(err,result){//
			 if(err==0){
			  this.node.destroy()
			 }else{
				 Toast.show(result);
			 }
			 
			 //
		}.bind(this)
        switch(customData){
            case "create_room_1":
                  this._createroom(1,callback)
                  break
            case "create_room_2":
                  this._createroom(2,callback)
                  break
            case "create_room_3":
                  this._createroom(3,callback)
                  break
            case "create_room_4":
                  this._createroom(4,callback)
                  break
            case "create_room_close":
                  this.node.destroy() 
                break       
            default:
                break
        }
       // this.node.destroy() 

    }

});
