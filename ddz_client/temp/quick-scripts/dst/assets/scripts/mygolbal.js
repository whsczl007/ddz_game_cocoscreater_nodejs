
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/mygolbal.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd9667atqdBHIb60A67blB9L', 'mygolbal');
// scripts/mygolbal.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket_ctr = _interopRequireDefault(require("./data/socket_ctr.js"));

var _player = _interopRequireDefault(require("./data/player.js"));

var _event_lister = _interopRequireDefault(require("./util/event_lister.js"));

var _api = _interopRequireDefault(require("./util/api.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var myglobal = {} || myglobal;
myglobal.socket = (0, _socket_ctr["default"])();
myglobal.playerData = (0, _player["default"])();
myglobal.eventlister = (0, _event_lister["default"])({});
myglobal.api = (0, _api["default"])();
var _default = myglobal;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL215Z29sYmFsLmpzIl0sIm5hbWVzIjpbIm15Z2xvYmFsIiwic29ja2V0IiwicGxheWVyRGF0YSIsImV2ZW50bGlzdGVyIiwiYXBpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUcsTUFBTUEsUUFBdkI7QUFDQUEsUUFBUSxDQUFDQyxNQUFULEdBQWtCLDZCQUFsQjtBQUNBRCxRQUFRLENBQUNFLFVBQVQsR0FBc0IseUJBQXRCO0FBQ0FGLFFBQVEsQ0FBQ0csV0FBVCxHQUF1Qiw4QkFBWSxFQUFaLENBQXZCO0FBQ0FILFFBQVEsQ0FBQ0ksR0FBVCxHQUFjLHNCQUFkO2VBQ2VKIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0Y3RyIGZyb20gXCIuL2RhdGEvc29ja2V0X2N0ci5qc1wiXG5pbXBvcnQgcGxheWVyZGF0YSBmcm9tIFwiLi9kYXRhL3BsYXllci5qc1wiXG5pbXBvcnQgZXZlbnRsaXN0ZXIgZnJvbSBcIi4vdXRpbC9ldmVudF9saXN0ZXIuanNcIlxuaW1wb3J0IGFwaSBmcm9tIFwiLi91dGlsL2FwaS5qc1wiXG5cbmNvbnN0IG15Z2xvYmFsID0ge30gfHwgbXlnbG9iYWxcbm15Z2xvYmFsLnNvY2tldCA9IHNvY2tldGN0cigpXG5teWdsb2JhbC5wbGF5ZXJEYXRhID0gcGxheWVyZGF0YSgpXG5teWdsb2JhbC5ldmVudGxpc3RlciA9IGV2ZW50bGlzdGVyKHt9KVxubXlnbG9iYWwuYXBpPSBhcGkoKVxuZXhwb3J0IGRlZmF1bHQgbXlnbG9iYWxcbiJdfQ==