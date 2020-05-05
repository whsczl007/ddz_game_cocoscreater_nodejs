import myglobal from "../mygolbal.js"

const api=function(){
	var that={}
    that.login=function(callback){
		if(localStorage.getItem("accountID")!=null){
			myglobal.playerData.accountID=localStorage.getItem("accountID");
		}
		localStorage.setItem("accountID",myglobal.playerData.accountID);
		myglobal.socket.request_wxLogin({
		    uniqueID:myglobal.playerData.uniqueID,
		    accountID:myglobal.playerData.accountID,
		    nickName:myglobal.playerData.nickName,
		    avatarUrl:myglobal.playerData.avatarUrl,
		},function(err,result){
		    //请求返回
		    //先隐藏等待UI
		    //this.wait_node.active = false
		    if(err!=0){
		       console.log("err:"+err)
		       return     
		    }
		
		    console.log("login sucess" + JSON.stringify(result))
		    myglobal.playerData.gobal_count = result.gold_count
			 myglobal.playerData.uniqueID=result.unique_id
			 myglobal.playerData.accountID=result.account_id;
			 myglobal.playerData.nickName=result.nick_name;
			 myglobal.playerData.avatarUrl=result.avatar_url;
			 myglobal.playerData.fkcount=result.fkcount;
		    if(callback){
				callback(result);
			}
		}.bind(this))
	}
	return that
}
	
export default api;
	
	