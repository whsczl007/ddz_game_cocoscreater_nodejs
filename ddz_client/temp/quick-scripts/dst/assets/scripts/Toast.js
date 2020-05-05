
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Toast.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a6a99S8QuZNIb2i+H1Ucv49', 'Toast');
// scripts/Toast.js

"use strict";

var Toast = {
  _toast: null,
  // prefab
  _detailLabel: null,
  // 内容
  _animSpeed: 0.3 // 动画速度

};
/**
 * detailString :   内容 string 类型.

 * duration:        动画速度 default = 0.3.
*/

Toast.init = function (callback) {
  if (Toast._toast != null) {
    callback();
    return;
  } // 加载 prefab 创建


  cc.loader.loadRes("Toast", cc.Prefab, function (error, prefab) {
    if (error) {
      cc.error(error);
      return;
    } // 实例 


    var toast = cc.instantiate(prefab); // Toast 持有

    Toast._toast = toast; // 动画 
    //  var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
    //var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
    // self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(Toast._animSpeed, 255), cc.scaleTo(Toast._animSpeed, 1.0)), cbFadeIn);
    //self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Toast._animSpeed, 0), cc.scaleTo(Toast._animSpeed, 2.0)), cbFadeOut);
    // 获取子节点

    Toast._detailLabel = cc.find("detailLabel", Toast).getComponent(cc.Label); // 父视图

    Toast._toast.parent = cc.director.getScene()._children[0]; // cc.find("Canvas");

    callback();
  });
}; // 参数


Toast.configToast = function (detailString, animSpeed) {
  // 内容
  Toast._detailLabel.string = detailString; // 是否需要取消按钮
}; // 执行弹进动画


Toast.startFadeIn = function () {
  // cc.eventManager.pauseTarget(Toast._Toast, true);
  //      Toast._Toast.position.x=0;
  // Toast._Toast.position.y=0;//= cc.p(0, 0);
  //      Toast._Toast.setScale(2);
  //      Toast._Toast.opacity = 0;
  cc.tween(Toast._toast).to(0.1, {
    position: cc.v2(0, 0),
    scale: 1,
    opacity: 255
  }).start(); // Toast._Toast.runAction(self.actionFadeIn);
}; // 执行弹出动画


Toast.startFadeOut = function () {
  // cc.eventManager.pauseTarget(Toast._Toast, true);
  //Toast._Toast.runAction(self.actionFadeOut);
  cc.tween(Toast._toast).to(Toast._animSpeed, {
    position: cc.v2(0, -1000),
    scale: 1,
    opacity: 0
  }).start();
}; // 弹进动画完成回调


Toast.onFadeInFinish = function () {//cc.eventManager.resumeTarget(Toast._Toast, true);
}; // 弹出动画完成回调


Toast.onFadeOutFinish = function () {
  Toast.onDestory();
}; // 按钮点击事件


Toast.onButtonClicked = function (event) {
  if (event.target.name == "enterButton") {
    if (Toast._enterCallBack) {
      Toast._enterCallBack();
    }
  }

  Toast.startFadeOut();
}; // 销毁 Toast (内存管理还没搞懂，暂且这样写吧~v~)


Toast.onDestory = function () {
  Toast._toast.destroy(); // Toast._enterCallBack = null;


  Toast._toast = null;
  Toast._detailLabel = null; // Toast._cancelButton = null;
  // Toast._enterButton = null;

  Toast._animSpeed = 0.3;
};

Toast.show = function (detailString, animSpeed) {
  // 引用
  //var self = this;
  Toast._animSpeed = animSpeed ? animSpeed : Toast._animSpeed;
  Toast.init(function () {
    // 展现 Toast
    Toast.startFadeIn(); // 参数

    Toast.configToast(detailString, animSpeed);
  });
};

Toast.toast = function (detailString, animSpeed) {
  Toast._animSpeed = animSpeed ? animSpeed : Toast._animSpeed;
  Toast.init(function () {
    //Toast._ToastBackground.color=cc.color(0x0f0f0f);
    Toast.startFadeIn();
  });
};

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL1RvYXN0LmpzIl0sIm5hbWVzIjpbIlRvYXN0IiwiX3RvYXN0IiwiX2RldGFpbExhYmVsIiwiX2FuaW1TcGVlZCIsImluaXQiLCJjYWxsYmFjayIsImNjIiwibG9hZGVyIiwibG9hZFJlcyIsIlByZWZhYiIsImVycm9yIiwicHJlZmFiIiwidG9hc3QiLCJpbnN0YW50aWF0ZSIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInBhcmVudCIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJfY2hpbGRyZW4iLCJjb25maWdUb2FzdCIsImRldGFpbFN0cmluZyIsImFuaW1TcGVlZCIsInN0cmluZyIsInN0YXJ0RmFkZUluIiwidHdlZW4iLCJ0byIsInBvc2l0aW9uIiwidjIiLCJzY2FsZSIsIm9wYWNpdHkiLCJzdGFydCIsInN0YXJ0RmFkZU91dCIsIm9uRmFkZUluRmluaXNoIiwib25GYWRlT3V0RmluaXNoIiwib25EZXN0b3J5Iiwib25CdXR0b25DbGlja2VkIiwiZXZlbnQiLCJ0YXJnZXQiLCJuYW1lIiwiX2VudGVyQ2FsbEJhY2siLCJkZXN0cm95Iiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxLQUFLLEdBQUc7QUFDUkMsRUFBQUEsTUFBTSxFQUFFLElBREE7QUFDZ0I7QUFDeEJDLEVBQUFBLFlBQVksRUFBSSxJQUZSO0FBRWdCO0FBQ3hCQyxFQUFBQSxVQUFVLEVBQU0sR0FIUixDQUdnQjs7QUFIaEIsQ0FBWjtBQU1BOzs7Ozs7QUFZQ0gsS0FBSyxDQUFDSSxJQUFOLEdBQVcsVUFBU0MsUUFBVCxFQUFrQjtBQUU1QixNQUFHTCxLQUFLLENBQUNDLE1BQU4sSUFBYyxJQUFqQixFQUFzQjtBQUFDSSxJQUFBQSxRQUFRO0FBQUk7QUFBTyxHQUZkLENBRzVCOzs7QUFDQUMsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLE9BQVYsQ0FBa0IsT0FBbEIsRUFBMkJGLEVBQUUsQ0FBQ0csTUFB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QUUxQjs7O0FBQ0ExQyxFQUFBQSxLQUFLLENBQUNDLE1BQU4sR0FBZSxJQUFmO0FBQ0FELEVBQUFBLEtBQUssQ0FBQ0UsWUFBTixHQUFxQixJQUFyQixDQUowQixDQUsxQjtBQUNBOztBQUNBRixFQUFBQSxLQUFLLENBQUNHLFVBQU4sR0FBbUIsR0FBbkI7QUFDSCxDQVJEOztBQWFKSCxLQUFLLENBQUMyQyxJQUFOLEdBQWEsVUFBVXJCLFlBQVYsRUFBd0JDLFNBQXhCLEVBQW1DO0FBRTVDO0FBQ0E7QUFFQXZCLEVBQUFBLEtBQUssQ0FBQ0csVUFBTixHQUFtQm9CLFNBQVMsR0FBR0EsU0FBSCxHQUFldkIsS0FBSyxDQUFDRyxVQUFqRDtBQUVGSCxFQUFBQSxLQUFLLENBQUNJLElBQU4sQ0FBVyxZQUFVO0FBQ3BCO0FBQ0FKLElBQUFBLEtBQUssQ0FBQ3lCLFdBQU4sR0FGb0IsQ0FJcEI7O0FBQ0F6QixJQUFBQSxLQUFLLENBQUNxQixXQUFOLENBQWtCQyxZQUFsQixFQUErQkMsU0FBL0I7QUFDQSxHQU5EO0FBU0QsQ0FoQkQ7O0FBa0JBdkIsS0FBSyxDQUFDWSxLQUFOLEdBQVksVUFBU1UsWUFBVCxFQUFzQkMsU0FBdEIsRUFBZ0M7QUFDM0N2QixFQUFBQSxLQUFLLENBQUNHLFVBQU4sR0FBbUJvQixTQUFTLEdBQUdBLFNBQUgsR0FBZXZCLEtBQUssQ0FBQ0csVUFBakQ7QUFDQUgsRUFBQUEsS0FBSyxDQUFDSSxJQUFOLENBQVcsWUFBVTtBQUNwQjtBQUNBSixJQUFBQSxLQUFLLENBQUN5QixXQUFOO0FBQ0EsR0FIRDtBQUlBLENBTkQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBUb2FzdCA9IHtcbiAgICBfdG9hc3Q6IG51bGwsICAgICAgICAgICAvLyBwcmVmYWJcbiAgICBfZGV0YWlsTGFiZWw6ICAgbnVsbCwgICAvLyDlhoXlrrlcbiAgICBfYW5pbVNwZWVkOiAgICAgMC4zLCAgICAvLyDliqjnlLvpgJ/luqZcbn07XG5cbi8qKlxuICogZGV0YWlsU3RyaW5nIDogICDlhoXlrrkgc3RyaW5nIOexu+Weiy5cblxuICogZHVyYXRpb246ICAgICAgICDliqjnlLvpgJ/luqYgZGVmYXVsdCA9IDAuMy5cbiovXG5cblxuXG5cblxuXG5cblx0VG9hc3QuaW5pdD1mdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0XG5cdFx0aWYoVG9hc3QuX3RvYXN0IT1udWxsKXtjYWxsYmFjaygpOyByZXR1cm59XG5cdFx0Ly8g5Yqg6L29IHByZWZhYiDliJvlu7pcblx0XHRjYy5sb2FkZXIubG9hZFJlcyhcIlRvYXN0XCIsIGNjLlByZWZhYiwgZnVuY3Rpb24gKGVycm9yLCBwcmVmYWIpIHtcblx0XHRcblx0XHQgICAgaWYgKGVycm9yKSB7XG5cdFx0ICAgICAgICBjYy5lcnJvcihlcnJvcik7XG5cdFx0ICAgICAgICByZXR1cm47XG5cdFx0ICAgIH1cblx0XHRcblx0XHQgICAgLy8g5a6e5L6LIFxuXHRcdCAgICB2YXIgdG9hc3QgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuXHRcdFxuXHRcdCAgICAvLyBUb2FzdCDmjIHmnIlcblx0XHQgICAgVG9hc3QuX3RvYXN0ID0gdG9hc3Q7XG5cdFx0XG5cdFx0ICAgIC8vIOWKqOeUuyBcblx0XHQgIC8vICB2YXIgY2JGYWRlT3V0ID0gY2MuY2FsbEZ1bmMoc2VsZi5vbkZhZGVPdXRGaW5pc2gsIHNlbGYpO1xuXHRcdCAgICAvL3ZhciBjYkZhZGVJbiA9IGNjLmNhbGxGdW5jKHNlbGYub25GYWRlSW5GaW5pc2gsIHNlbGYpO1xuXHRcdCAgIC8vIHNlbGYuYWN0aW9uRmFkZUluID0gY2Muc2VxdWVuY2UoY2Muc3Bhd24oY2MuZmFkZVRvKFRvYXN0Ll9hbmltU3BlZWQsIDI1NSksIGNjLnNjYWxlVG8oVG9hc3QuX2FuaW1TcGVlZCwgMS4wKSksIGNiRmFkZUluKTtcblx0XHQgICAgLy9zZWxmLmFjdGlvbkZhZGVPdXQgPSBjYy5zZXF1ZW5jZShjYy5zcGF3bihjYy5mYWRlVG8oVG9hc3QuX2FuaW1TcGVlZCwgMCksIGNjLnNjYWxlVG8oVG9hc3QuX2FuaW1TcGVlZCwgMi4wKSksIGNiRmFkZU91dCk7XG5cdFx0ICAgICAgXG5cdFx0ICAgICBcblx0XHQgICAgLy8g6I635Y+W5a2Q6IqC54K5XG5cdFx0ICAgIFRvYXN0Ll9kZXRhaWxMYWJlbCA9IGNjLmZpbmQoXCJkZXRhaWxMYWJlbFwiLCBUb2FzdCkuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcblx0XHQgICBcblx0XHQgICAgLy8g54i26KeG5Zu+XG5cdFx0ICAgIFRvYXN0Ll90b2FzdC5wYXJlbnQgPWNjLmRpcmVjdG9yLmdldFNjZW5lKCkuX2NoaWxkcmVuWzBdOy8vIGNjLmZpbmQoXCJDYW52YXNcIik7XG5cdFx0ICAgY2FsbGJhY2soKTtcblx0fSk7XG5cdH1cblxuICAgIC8vIOWPguaVsFxuICAgIFRvYXN0LmNvbmZpZ1RvYXN0ID0gZnVuY3Rpb24gKGRldGFpbFN0cmluZyxhbmltU3BlZWQpIHtcblxuXG4gICAgICAgIC8vIOWGheWuuVxuICAgICAgICBUb2FzdC5fZGV0YWlsTGFiZWwuc3RyaW5nID0gZGV0YWlsU3RyaW5nO1xuICAgICAgICAvLyDmmK/lkKbpnIDopoHlj5bmtojmjInpkq5cbiAgICAgICAgXG4gICAgfTtcblxuICAgIC8vIOaJp+ihjOW8uei/m+WKqOeUu1xuICAgIFRvYXN0LnN0YXJ0RmFkZUluID0gZnVuY3Rpb24gKCkge1xuICAgICAgIC8vIGNjLmV2ZW50TWFuYWdlci5wYXVzZVRhcmdldChUb2FzdC5fVG9hc3QsIHRydWUpO1xuICAgLy8gICAgICBUb2FzdC5fVG9hc3QucG9zaXRpb24ueD0wO1xuXHRcdCAvLyBUb2FzdC5fVG9hc3QucG9zaXRpb24ueT0wOy8vPSBjYy5wKDAsIDApO1xuICAgLy8gICAgICBUb2FzdC5fVG9hc3Quc2V0U2NhbGUoMik7XG4gICAvLyAgICAgIFRvYXN0Ll9Ub2FzdC5vcGFjaXR5ID0gMDtcblx0XHRcblx0XHRjYy50d2VlbihUb2FzdC5fdG9hc3QpLnRvKDAuMSx7IHBvc2l0aW9uOiBjYy52MigwLDApLHNjYWxlOjEsb3BhY2l0eToyNTV9KS5zdGFydCgpXG5cdFx0XG4gICAgICAgLy8gVG9hc3QuX1RvYXN0LnJ1bkFjdGlvbihzZWxmLmFjdGlvbkZhZGVJbik7XG4gICAgfTtcblxuICAgIC8vIOaJp+ihjOW8ueWHuuWKqOeUu1xuICAgIFRvYXN0LnN0YXJ0RmFkZU91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAvLyBjYy5ldmVudE1hbmFnZXIucGF1c2VUYXJnZXQoVG9hc3QuX1RvYXN0LCB0cnVlKTtcblx0ICAgXG4gICAgICAgIC8vVG9hc3QuX1RvYXN0LnJ1bkFjdGlvbihzZWxmLmFjdGlvbkZhZGVPdXQpO1xuXHRcdGNjLnR3ZWVuKFRvYXN0Ll90b2FzdCkudG8oVG9hc3QuX2FuaW1TcGVlZCx7IHBvc2l0aW9uOiBjYy52MigwLC0xMDAwKSxzY2FsZToxLG9wYWNpdHk6MH0pLnN0YXJ0KClcblx0XHRcbiAgICB9O1xuXG4gICAgLy8g5by56L+b5Yqo55S75a6M5oiQ5Zue6LCDXG4gICAgVG9hc3Qub25GYWRlSW5GaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldChUb2FzdC5fVG9hc3QsIHRydWUpO1xuICAgIH07XG5cbiAgICAvLyDlvLnlh7rliqjnlLvlrozmiJDlm57osINcbiAgICBUb2FzdC5vbkZhZGVPdXRGaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFRvYXN0Lm9uRGVzdG9yeSgpO1xuICAgIH07XG5cbiAgICAvLyDmjInpkq7ngrnlh7vkuovku7ZcbiAgICBUb2FzdC5vbkJ1dHRvbkNsaWNrZWQgPSBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LnRhcmdldC5uYW1lID09IFwiZW50ZXJCdXR0b25cIil7XG4gICAgICAgICAgICBpZihUb2FzdC5fZW50ZXJDYWxsQmFjayl7XG4gICAgICAgICAgICAgICAgVG9hc3QuX2VudGVyQ2FsbEJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBUb2FzdC5zdGFydEZhZGVPdXQoKTtcbiAgICB9O1xuXG4gICAgLy8g6ZSA5q+BIFRvYXN0ICjlhoXlrZjnrqHnkIbov5jmsqHmkJ7mh4LvvIzmmoLkuJTov5nmoLflhpnlkKd+dn4pXG4gICAgVG9hc3Qub25EZXN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBUb2FzdC5fdG9hc3QuZGVzdHJveSgpO1xuICAgICAgICAvLyBUb2FzdC5fZW50ZXJDYWxsQmFjayA9IG51bGw7XG4gICAgICAgIFRvYXN0Ll90b2FzdCA9IG51bGw7XG4gICAgICAgIFRvYXN0Ll9kZXRhaWxMYWJlbCA9IG51bGw7XG4gICAgICAgIC8vIFRvYXN0Ll9jYW5jZWxCdXR0b24gPSBudWxsO1xuICAgICAgICAvLyBUb2FzdC5fZW50ZXJCdXR0b24gPSBudWxsO1xuICAgICAgICBUb2FzdC5fYW5pbVNwZWVkID0gMC4zO1xuICAgIH07XG5cblxuXG5cblRvYXN0LnNob3cgPSBmdW5jdGlvbiAoZGV0YWlsU3RyaW5nLCBhbmltU3BlZWQpIHtcblxuICAgIC8vIOW8leeUqFxuICAgIC8vdmFyIHNlbGYgPSB0aGlzO1xuXHRcbiAgICBUb2FzdC5fYW5pbVNwZWVkID0gYW5pbVNwZWVkID8gYW5pbVNwZWVkIDogVG9hc3QuX2FuaW1TcGVlZDtcbiAgICAgICBcblx0XHRUb2FzdC5pbml0KGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyDlsZXnjrAgVG9hc3Rcblx0XHRcdFRvYXN0LnN0YXJ0RmFkZUluKCk7XG5cdFx0XHRcblx0XHRcdC8vIOWPguaVsFxuXHRcdFx0VG9hc3QuY29uZmlnVG9hc3QoZGV0YWlsU3RyaW5nLGFuaW1TcGVlZCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0XG59XHRcblx0XG5Ub2FzdC50b2FzdD1mdW5jdGlvbihkZXRhaWxTdHJpbmcsYW5pbVNwZWVkKXtcblx0VG9hc3QuX2FuaW1TcGVlZCA9IGFuaW1TcGVlZCA/IGFuaW1TcGVlZCA6IFRvYXN0Ll9hbmltU3BlZWQ7XG5cdFRvYXN0LmluaXQoZnVuY3Rpb24oKXtcblx0XHQvL1RvYXN0Ll9Ub2FzdEJhY2tncm91bmQuY29sb3I9Y2MuY29sb3IoMHgwZjBmMGYpO1xuXHRcdFRvYXN0LnN0YXJ0RmFkZUluKCk7XG5cdH0pO1xufVx0Il19