
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util/api.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '98703S7275J1qUi6zlgq+O6', 'api');
// scripts/util/api.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var api = function api() {
  var that = {};

  that.login = function (callback) {
    if (localStorage.getItem("accountID") != null) {
      _mygolbal["default"].playerData.accountID = localStorage.getItem("accountID");
    }

    localStorage.setItem("accountID", _mygolbal["default"].playerData.accountID);

    _mygolbal["default"].socket.request_wxLogin({
      uniqueID: _mygolbal["default"].playerData.uniqueID,
      accountID: _mygolbal["default"].playerData.accountID,
      nickName: _mygolbal["default"].playerData.nickName,
      avatarUrl: _mygolbal["default"].playerData.avatarUrl
    }, function (err, result) {
      //请求返回
      //先隐藏等待UI
      //this.wait_node.active = false
      if (err != 0) {
        console.log("err:" + err);
        return;
      }

      console.log("login sucess" + JSON.stringify(result));
      _mygolbal["default"].playerData.gobal_count = result.gold_count;
      _mygolbal["default"].playerData.uniqueID = result.unique_id;
      _mygolbal["default"].playerData.accountID = result.account_id;
      _mygolbal["default"].playerData.nickName = result.nick_name;
      _mygolbal["default"].playerData.avatarUrl = result.avatar_url;
      _mygolbal["default"].playerData.fkcount = result.fkcount;

      if (callback) {
        callback(result);
      }
    }.bind(this));
  };

  return that;
};

var _default = api;
exports["default"] = _default;
module.exports = exports["default"];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL3V0aWwvYXBpLmpzIl0sIm5hbWVzIjpbImFwaSIsInRoYXQiLCJsb2dpbiIsImNhbGxiYWNrIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIm15Z2xvYmFsIiwicGxheWVyRGF0YSIsImFjY291bnRJRCIsInNldEl0ZW0iLCJzb2NrZXQiLCJyZXF1ZXN0X3d4TG9naW4iLCJ1bmlxdWVJRCIsIm5pY2tOYW1lIiwiYXZhdGFyVXJsIiwiZXJyIiwicmVzdWx0IiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJnb2JhbF9jb3VudCIsImdvbGRfY291bnQiLCJ1bmlxdWVfaWQiLCJhY2NvdW50X2lkIiwibmlja19uYW1lIiwiYXZhdGFyX3VybCIsImZrY291bnQiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxHQUFHLEdBQUMsU0FBSkEsR0FBSSxHQUFVO0FBQ25CLE1BQUlDLElBQUksR0FBQyxFQUFUOztBQUNHQSxFQUFBQSxJQUFJLENBQUNDLEtBQUwsR0FBVyxVQUFTQyxRQUFULEVBQWtCO0FBQy9CLFFBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixXQUFyQixLQUFtQyxJQUF0QyxFQUEyQztBQUMxQ0MsMkJBQVNDLFVBQVQsQ0FBb0JDLFNBQXBCLEdBQThCSixZQUFZLENBQUNDLE9BQWIsQ0FBcUIsV0FBckIsQ0FBOUI7QUFDQTs7QUFDREQsSUFBQUEsWUFBWSxDQUFDSyxPQUFiLENBQXFCLFdBQXJCLEVBQWlDSCxxQkFBU0MsVUFBVCxDQUFvQkMsU0FBckQ7O0FBQ0FGLHlCQUFTSSxNQUFULENBQWdCQyxlQUFoQixDQUFnQztBQUM1QkMsTUFBQUEsUUFBUSxFQUFDTixxQkFBU0MsVUFBVCxDQUFvQkssUUFERDtBQUU1QkosTUFBQUEsU0FBUyxFQUFDRixxQkFBU0MsVUFBVCxDQUFvQkMsU0FGRjtBQUc1QkssTUFBQUEsUUFBUSxFQUFDUCxxQkFBU0MsVUFBVCxDQUFvQk0sUUFIRDtBQUk1QkMsTUFBQUEsU0FBUyxFQUFDUixxQkFBU0MsVUFBVCxDQUFvQk87QUFKRixLQUFoQyxFQUtFLFVBQVNDLEdBQVQsRUFBYUMsTUFBYixFQUFvQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxVQUFHRCxHQUFHLElBQUUsQ0FBUixFQUFVO0FBQ1BFLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQU9ILEdBQW5CO0FBQ0E7QUFDRjs7QUFFREUsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksaUJBQWlCQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUosTUFBZixDQUE3QjtBQUNBViwyQkFBU0MsVUFBVCxDQUFvQmMsV0FBcEIsR0FBa0NMLE1BQU0sQ0FBQ00sVUFBekM7QUFDRmhCLDJCQUFTQyxVQUFULENBQW9CSyxRQUFwQixHQUE2QkksTUFBTSxDQUFDTyxTQUFwQztBQUNBakIsMkJBQVNDLFVBQVQsQ0FBb0JDLFNBQXBCLEdBQThCUSxNQUFNLENBQUNRLFVBQXJDO0FBQ0FsQiwyQkFBU0MsVUFBVCxDQUFvQk0sUUFBcEIsR0FBNkJHLE1BQU0sQ0FBQ1MsU0FBcEM7QUFDQW5CLDJCQUFTQyxVQUFULENBQW9CTyxTQUFwQixHQUE4QkUsTUFBTSxDQUFDVSxVQUFyQztBQUNBcEIsMkJBQVNDLFVBQVQsQ0FBb0JvQixPQUFwQixHQUE0QlgsTUFBTSxDQUFDVyxPQUFuQzs7QUFDRSxVQUFHeEIsUUFBSCxFQUFZO0FBQ2RBLFFBQUFBLFFBQVEsQ0FBQ2EsTUFBRCxDQUFSO0FBQ0E7QUFDRCxLQW5CQyxDQW1CQVksSUFuQkEsQ0FtQkssSUFuQkwsQ0FMRjtBQXlCQSxHQTlCRTs7QUErQkgsU0FBTzNCLElBQVA7QUFDQSxDQWxDRDs7ZUFvQ2VEIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcblxuY29uc3QgYXBpPWZ1bmN0aW9uKCl7XG5cdHZhciB0aGF0PXt9XG4gICAgdGhhdC5sb2dpbj1mdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0aWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50SURcIikhPW51bGwpe1xuXHRcdFx0bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQ9bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50SURcIik7XG5cdFx0fVxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudElEXCIsbXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpO1xuXHRcdG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0X3d4TG9naW4oe1xuXHRcdCAgICB1bmlxdWVJRDpteWdsb2JhbC5wbGF5ZXJEYXRhLnVuaXF1ZUlELFxuXHRcdCAgICBhY2NvdW50SUQ6bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQsXG5cdFx0ICAgIG5pY2tOYW1lOm15Z2xvYmFsLnBsYXllckRhdGEubmlja05hbWUsXG5cdFx0ICAgIGF2YXRhclVybDpteWdsb2JhbC5wbGF5ZXJEYXRhLmF2YXRhclVybCxcblx0XHR9LGZ1bmN0aW9uKGVycixyZXN1bHQpe1xuXHRcdCAgICAvL+ivt+axgui/lOWbnlxuXHRcdCAgICAvL+WFiOmakOiXj+etieW+hVVJXG5cdFx0ICAgIC8vdGhpcy53YWl0X25vZGUuYWN0aXZlID0gZmFsc2Vcblx0XHQgICAgaWYoZXJyIT0wKXtcblx0XHQgICAgICAgY29uc29sZS5sb2coXCJlcnI6XCIrZXJyKVxuXHRcdCAgICAgICByZXR1cm4gICAgIFxuXHRcdCAgICB9XG5cdFx0XG5cdFx0ICAgIGNvbnNvbGUubG9nKFwibG9naW4gc3VjZXNzXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxuXHRcdCAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmdvYmFsX2NvdW50ID0gcmVzdWx0LmdvbGRfY291bnRcblx0XHRcdCBteWdsb2JhbC5wbGF5ZXJEYXRhLnVuaXF1ZUlEPXJlc3VsdC51bmlxdWVfaWRcblx0XHRcdCBteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRD1yZXN1bHQuYWNjb3VudF9pZDtcblx0XHRcdCBteWdsb2JhbC5wbGF5ZXJEYXRhLm5pY2tOYW1lPXJlc3VsdC5uaWNrX25hbWU7XG5cdFx0XHQgbXlnbG9iYWwucGxheWVyRGF0YS5hdmF0YXJVcmw9cmVzdWx0LmF2YXRhcl91cmw7XG5cdFx0XHQgbXlnbG9iYWwucGxheWVyRGF0YS5ma2NvdW50PXJlc3VsdC5ma2NvdW50O1xuXHRcdCAgICBpZihjYWxsYmFjayl7XG5cdFx0XHRcdGNhbGxiYWNrKHJlc3VsdCk7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKVxuXHR9XG5cdHJldHVybiB0aGF0XG59XG5cdFxuZXhwb3J0IGRlZmF1bHQgYXBpO1xuXHRcblx0Il19