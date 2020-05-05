//表示一张牌对象
module.exports = function(value,shape,king){
    var that = {}
    that.index = -1
    if(value){
       that.value = value
    }
   
    if(shape){
       that.shape = shape
    }
    
    if(king!=undefined){
        that.king = king
    }
	
	that.getInfo=function(){
		return {"index":that.index,"value":that.value,"shape":that.shape,"king":that.king}
	}
    return that
}



