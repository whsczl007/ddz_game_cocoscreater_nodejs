var Alert = {
    _alert: null,           // prefab
    _detailLabel:   null,   // 内容
	_alertBackground:null,
    _cancelButton:  null,   // 确定按钮
    _enterButton:   null,   // 取消按钮
    _enterCallBack: null,   // 回调事件
    _animSpeed:     0.3,    // 动画速度
	_isshowing:false
};

/**
 * detailString :   内容 string 类型.
 * enterCallBack:   确定点击事件回调  function 类型.
 * neeCancel:       是否展示取消按钮 bool 类型 default YES.
 * duration:        动画速度 default = 0.3.
*/




		//return
// Alert.ini=function(){
// 	var self=this;
	
	


	Alert.init=function(callback){
		
		if(Alert._isshowing)return;
		Alert._isshowing=true;
		//if(Alert._alert!=null){callback(); return}
		// 加载 prefab 创建
		cc.loader.loadRes("Alert", cc.Prefab, function (error, prefab) {
		
		    if (error) {
		        cc.error(error);
		        return;
		    }
		
		    // 实例 
		    var alert = cc.instantiate(prefab);
		
		    // Alert 持有
		    Alert._alert = alert;
		
		    // 动画 
		  //  var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
		    //var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
		   // self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(Alert._animSpeed, 255), cc.scaleTo(Alert._animSpeed, 1.0)), cbFadeIn);
		    //self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Alert._animSpeed, 0), cc.scaleTo(Alert._animSpeed, 2.0)), cbFadeOut);
		      
		     
		    // 获取子节点
			Alert._alertBackground= cc.find("alertBackground", alert)
		    Alert._detailLabel = cc.find("alertBackground/detailLabel", alert).getComponent(cc.Label);
		    Alert._cancelButton = cc.find("alertBackground/cancelButton", alert);
		    Alert._enterButton = cc.find("alertBackground/enterButton", alert);
		
		    // 添加点击事件
		    Alert._enterButton.on('click', Alert.onButtonClicked, self);
		    Alert._cancelButton.on('click', Alert.onButtonClicked, self);
		
		    // 父视图
		    Alert._alert.parent =cc.director.getScene()._children[0];// cc.find("Canvas");
		   callback();
	});
	}

    // 参数
    Alert.configAlert = function (detailString, enterCallBack, needCancel, animSpeed) {

        // 回调
        Alert._enterCallBack = enterCallBack;

        // 内容
        Alert._detailLabel.string = detailString;
        // 是否需要取消按钮
        if (needCancel || needCancel == undefined) { // 显示
            Alert._cancelButton.active = true;
        } else {  // 隐藏
            Alert._cancelButton.active = false;
            Alert._enterButton.x = 0;
        }
    };

    // 执行弹进动画
    Alert.startFadeIn = function () {
       // cc.eventManager.pauseTarget(Alert._alert, true);
   //      Alert._alert.position.x=0;
		 // Alert._alert.position.y=0;//= cc.p(0, 0);
   //      Alert._alert.setScale(2);
   //      Alert._alert.opacity = 0;
		
		cc.tween(Alert._alert).to(Alert._animSpeed,{ position: cc.v2(0,0),scale:1,opacity:255}).start()
		
       // Alert._alert.runAction(self.actionFadeIn);
    };

    // 执行弹出动画
    Alert.startFadeOut = function () {
       // cc.eventManager.pauseTarget(Alert._alert, true);
	   
        //Alert._alert.runAction(self.actionFadeOut);
		cc.tween(Alert._alert).to(Alert._animSpeed,{ position: cc.v2(0,-1000),scale:1,opacity:0}).start()
		Alert._isshowing=false
    };

    // 弹进动画完成回调
    Alert.onFadeInFinish = function () {
        //cc.eventManager.resumeTarget(Alert._alert, true);
    };

    // 弹出动画完成回调
    Alert.onFadeOutFinish = function () {
        Alert.onDestory();
    };

    // 按钮点击事件
    Alert.onButtonClicked = function(event){
        if(event.target.name == "enterButton"){
            if(Alert._enterCallBack){
                Alert._enterCallBack();
            }
        }
        Alert.startFadeOut();
    };

    // 销毁 alert (内存管理还没搞懂，暂且这样写吧~v~)
    Alert.onDestory = function () {
        Alert._alert.destroy();
        Alert._enterCallBack = null;
        Alert._alert = null;
        Alert._detailLabel = null;
        Alert._cancelButton = null;
        Alert._enterButton = null;
        Alert._animSpeed = 0.3;
    };




Alert.show = function (detailString, enterCallBack, needCancel, animSpeed) {

    // 引用
    //var self = this;
	
    Alert._animSpeed = animSpeed ? animSpeed : Alert._animSpeed;
       
		Alert.init(function(){
			// 展现 alert
			Alert.startFadeIn();
			
			// 参数
			Alert.configAlert(detailString, enterCallBack, needCancel, animSpeed);
		});
		
		
}	
	
Alert.toast=function(detailString,animSpeed){
	Alert._animSpeed = animSpeed ? animSpeed : Alert._animSpeed;
	Alert.init(function(){
		Alert._alertBackground.color=cc.color(0x0f0f0f);
		Alert.startFadeIn();
	});
}	