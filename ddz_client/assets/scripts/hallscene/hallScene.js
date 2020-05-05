import myglobal from "./../mygolbal.js"

cc.Class({
    extends: cc.Component, 

    properties: {
        nickname_label:cc.Label,
        headimage:cc.Sprite,
        gobal_count:cc.Label,
        creatroom_prefabs:cc.Prefab,
        joinroom_prefabs:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       this.nickname_label.string = myglobal.playerData.nickName
       this.gobal_count.string = "" + myglobal.playerData.gobal_count
	   var str = myglobal.playerData.avatarUrl
	   //console.log(str)
	   var head_image_path = "UI/headimage/" + str
	   cc.loader.loadRes(head_image_path,cc.SpriteFrame,function(err,spriteFrame) {
	       if (err) {
	           console.log(err.message || err);
	           return;
	       }          
	        this.headimage.spriteFrame = spriteFrame;        
	       }.bind(this));
     },

    start () {

    },
     btn_bangzhu(){
		cc.sys.openURL('https://github.com/whsczl007/ddz_game_cocoscreater_nodejs'); 
	 },
	 
    // update (dt) {},

    onButtonClick(event,customData){
        switch(customData){
            case "create_room":
                var creator_Room = cc.instantiate(this.creatroom_prefabs)
                creator_Room.parent = this.node 
                creator_Room.zIndex = 100
                break
            case "join_room":
                var join_Room = cc.instantiate(this.joinroom_prefabs)
                join_Room.parent = this.node 
                join_Room.zIndex = 100
                break
            default:
                break
        }
    }
});
