
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util/waitnode.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '17318Pv1MxELb6d+o/SHo0s', 'waitnode');
// scripts/util/waitnode.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    loadimage_target: cc.Node,
    _isShow: false,
    lblContent: cc.Label
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    this.node.active = this._isShow;
  },
  update: function update(dt) {
    this.loadimage_target.rotation = this.loadimage_target.rotation - dt * 45;
  },
  //content为label显示的内容
  show: function show(content) {
    this._isShow = true;

    if (this.node) {
      this.node.active = this._isShow;
    }

    if (this.lblContent) {
      if (content == null) {
        content = "";
      }

      this.lblContent.string = content;
    }
  },
  hide: function hide() {
    this._isShow = false;

    if (this.node) {
      this.node.active = this._isShow;
    }
  }
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL3V0aWwvd2FpdG5vZGUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsb2FkaW1hZ2VfdGFyZ2V0IiwiTm9kZSIsIl9pc1Nob3ciLCJsYmxDb250ZW50IiwiTGFiZWwiLCJzdGFydCIsIm5vZGUiLCJhY3RpdmUiLCJ1cGRhdGUiLCJkdCIsInJvdGF0aW9uIiwic2hvdyIsImNvbnRlbnQiLCJzdHJpbmciLCJoaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsZ0JBQWdCLEVBQUNKLEVBQUUsQ0FBQ0ssSUFEWjtBQUVSQyxJQUFBQSxPQUFPLEVBQUMsS0FGQTtBQUdSQyxJQUFBQSxVQUFVLEVBQUNQLEVBQUUsQ0FBQ1E7QUFITixHQUhQO0FBU0w7QUFFQTtBQUVBQyxFQUFBQSxLQWJLLG1CQWFJO0FBQ0wsU0FBS0MsSUFBTCxDQUFVQyxNQUFWLEdBQW1CLEtBQUtMLE9BQXhCO0FBQ0gsR0FmSTtBQWlCTE0sRUFBQUEsTUFqQkssa0JBaUJHQyxFQWpCSCxFQWlCTztBQUNSLFNBQUtULGdCQUFMLENBQXNCVSxRQUF0QixHQUFpQyxLQUFLVixnQkFBTCxDQUFzQlUsUUFBdEIsR0FBaUNELEVBQUUsR0FBQyxFQUFyRTtBQUNILEdBbkJJO0FBcUJMO0FBQ0FFLEVBQUFBLElBdEJLLGdCQXNCQUMsT0F0QkEsRUFzQlE7QUFDVCxTQUFLVixPQUFMLEdBQWUsSUFBZjs7QUFDQSxRQUFHLEtBQUtJLElBQVIsRUFBYTtBQUNULFdBQUtBLElBQUwsQ0FBVUMsTUFBVixHQUFtQixLQUFLTCxPQUF4QjtBQUNIOztBQUNELFFBQUcsS0FBS0MsVUFBUixFQUFtQjtBQUNmLFVBQUdTLE9BQU8sSUFBSSxJQUFkLEVBQW1CO0FBQ2ZBLFFBQUFBLE9BQU8sR0FBRyxFQUFWO0FBQ0g7O0FBQ0QsV0FBS1QsVUFBTCxDQUFnQlUsTUFBaEIsR0FBeUJELE9BQXpCO0FBQ0g7QUFDSixHQWpDSTtBQW1DTEUsRUFBQUEsSUFuQ0ssa0JBbUNDO0FBQ0YsU0FBS1osT0FBTCxHQUFlLEtBQWY7O0FBQ0EsUUFBRyxLQUFLSSxJQUFSLEVBQWE7QUFDVCxXQUFLQSxJQUFMLENBQVVDLE1BQVYsR0FBbUIsS0FBS0wsT0FBeEI7QUFDSDtBQUNKO0FBeENJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbG9hZGltYWdlX3RhcmdldDpjYy5Ob2RlLFxuICAgICAgICBfaXNTaG93OmZhbHNlLFxuICAgICAgICBsYmxDb250ZW50OmNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAgIC8vIG9uTG9hZCAoKSB7fSxcblxuICAgIHN0YXJ0ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRoaXMuX2lzU2hvdztcbiAgICB9LFxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICB0aGlzLmxvYWRpbWFnZV90YXJnZXQucm90YXRpb24gPSB0aGlzLmxvYWRpbWFnZV90YXJnZXQucm90YXRpb24gLSBkdCo0NTtcbiAgICB9LFxuXG4gICAgLy9jb250ZW505Li6bGFiZWzmmL7npLrnmoTlhoXlrrlcbiAgICBzaG93KGNvbnRlbnQpe1xuICAgICAgICB0aGlzLl9pc1Nob3cgPSB0cnVlO1xuICAgICAgICBpZih0aGlzLm5vZGUpe1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRoaXMuX2lzU2hvdzsgICBcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmxibENvbnRlbnQpe1xuICAgICAgICAgICAgaWYoY29udGVudCA9PSBudWxsKXtcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGJsQ29udGVudC5zdHJpbmcgPSBjb250ZW50O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhpZGUoKXtcbiAgICAgICAgdGhpcy5faXNTaG93ID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMubm9kZSl7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdGhpcy5faXNTaG93OyAgIFxuICAgICAgICB9XG4gICAgfVxuXG59KTtcbiJdfQ==