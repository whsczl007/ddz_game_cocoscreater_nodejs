var Toast = {
    _toast: null,           // prefab
    _detailLabel:   null,   // 内容
    _animSpeed:     1.2,    // 动画速度
};

/**
 * detailString :   内容 string 类型.

 * duration:        动画速度 default = 0.3.
*/







	Toast.init=function(callback){
		
		if(Toast._toast!=null){callback(); return}
		// 加载 prefab 创建
		cc.loader.loadRes("Toast", cc.Prefab, function (error, prefab) {
		
		    if (error) {
		        cc.error(error);
		        return;
		    }
		
		    // 实例 
		    var toast = cc.instantiate(prefab);
		
		    // Toast 持有
		    Toast._toast = toast;
		
		    // 动画 
		  //  var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
		    //var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
		   // self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(Toast._animSpeed, 255), cc.scaleTo(Toast._animSpeed, 1.0)), cbFadeIn);
		    //self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Toast._animSpeed, 0), cc.scaleTo(Toast._animSpeed, 2.0)), cbFadeOut);
		      
		     
		    // 获取子节点
		    Toast._detailLabel = cc.find("detailLabel", toast).getComponent(cc.Label);
		    //Toast._detailLabel.zIndex=10000
		    // 父视图
		    Toast._toast.parent =cc.director.getScene()._children[0];// cc.find("Canvas");
		    Toast._toast.zIndex=10000
			callback();
	});
	}

    // 参数
    Toast.configToast = function (detailString,animSpeed) {


        // 内容
        Toast._detailLabel.string = detailString;
        // 是否需要取消按钮
        
    };

    // 执行弹进动画
    Toast.startFadeIn = function () {
       // cc.eventManager.pauseTarget(Toast._Toast, true);
   //      Toast._Toast.position.x=0;
		 // Toast._Toast.position.y=0;//= cc.p(0, 0);
   //      Toast._Toast.setScale(2);
   //      Toast._Toast.opacity = 0;
		
		cc.tween(Toast._toast).to(0.01,{opacity:255}).start()
		
       // Toast._Toast.runAction(self.actionFadeIn);
    };

    // 执行弹出动画
    Toast.startFadeOut = function (delay) {
       // cc.eventManager.pauseTarget(Toast._Toast, true);
	   
        //Toast._Toast.runAction(self.actionFadeOut);
		// cc.tween(Toast._toast).delay(delay).to(0.01,{opacity:0}).call(() => { 
		// 	cc.log('This is a callback')
		
		// 	 Toast._detailLabel.string=""

		// }).start()
		setTimeout(function(){
			Toast._detailLabel.string=""
		},delay*1000);
		
    };

    // // 弹进动画完成回调
    // Toast.onFadeInFinish = function () {
    //     //cc.eventManager.resumeTarget(Toast._Toast, true);
    // };

    // // 弹出动画完成回调
    // Toast.onFadeOutFinish = function () {
    //     Toast.onDestory();
    // };

    // 按钮点击事件
    // Toast.onButtonClicked = function(event){
    //     if(event.target.name == "enterButton"){
    //         if(Toast._enterCallBack){
    //             Toast._enterCallBack();
    //         }
    //     }
    //     Toast.startFadeOut();
    // };

    // 销毁 Toast (内存管理还没搞懂，暂且这样写吧~v~)
    // Toast.onDestory = function () {
    //     Toast._toast.destroy();
    //     // Toast._enterCallBack = null;
    //     Toast._toast = null;
    //     Toast._detailLabel = null;
    //     // Toast._cancelButton = null;
    //     // Toast._enterButton = null;
    //     // Toast._animSpeed = 0.3;
    // };




Toast.show = function (detailString, animSpeed) {

    // 引用
    //var self = this;
	
    Toast._animSpeed = 1.2;//animSpeed ? animSpeed : Toast._animSpeed;
       
		Toast.init(function(){
			// 展现 Toast
			Toast.startFadeIn();
			
			// 参数
			Toast.configToast(detailString);
			Toast.startFadeOut(Toast._animSpeed)
			//cc.scheduleOnce(Toast.startFadeOut,Toast._animSpeed);
		});
		
		
}	
	
// Toast.toast=function(detailString,animSpeed){
// 	Toast._animSpeed = animSpeed ? animSpeed : Toast._animSpeed;
// 	Toast.init(function(){
// 		//Toast._ToastBackground.color=cc.color(0x0f0f0f);
// 		Toast.startFadeIn();
// 	});
// }	