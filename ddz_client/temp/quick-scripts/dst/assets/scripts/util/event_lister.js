
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util/event_lister.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd485eyCsiBLBqweDM7SjVQh', 'event_lister');
// scripts/util/event_lister.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var eventLister = function eventLister(obj) {
  var register = {};

  obj.on = function (type, method) {
    if (register.hasOwnProperty(type)) {
      register[type].push(method);
    } else {
      register[type] = [method];
    }
  };

  obj.fire = function (type) {
    if (register.hasOwnProperty(type)) {
      var methodList = register[type];

      for (var i = 0; i < methodList.length; ++i) {
        var handle = methodList[i];
        var args = [];

        for (var i = 1; i < arguments.length; ++i) {
          args.push(arguments[i]);
        } //handle.call(this,args)


        console.log("handle.call(this,args) type:" + type);
        handle.apply(this, args);
      }
    }
  };

  obj.removeLister = function (type) {
    register[type] = [];
  };

  obj.removeAllLister = function () {
    register = {};
  };

  return obj;
};

var _default = eventLister;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL3V0aWwvZXZlbnRfbGlzdGVyLmpzIl0sIm5hbWVzIjpbImV2ZW50TGlzdGVyIiwib2JqIiwicmVnaXN0ZXIiLCJvbiIsInR5cGUiLCJtZXRob2QiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJmaXJlIiwibWV0aG9kTGlzdCIsImkiLCJsZW5ndGgiLCJoYW5kbGUiLCJhcmdzIiwiYXJndW1lbnRzIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwicmVtb3ZlTGlzdGVyIiwicmVtb3ZlQWxsTGlzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBU0MsR0FBVCxFQUFhO0FBQzdCLE1BQUlDLFFBQVEsR0FBRyxFQUFmOztBQUVBRCxFQUFBQSxHQUFHLENBQUNFLEVBQUosR0FBUyxVQUFTQyxJQUFULEVBQWNDLE1BQWQsRUFBcUI7QUFDMUIsUUFBR0gsUUFBUSxDQUFDSSxjQUFULENBQXdCRixJQUF4QixDQUFILEVBQWlDO0FBQzdCRixNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixDQUFlRyxJQUFmLENBQW9CRixNQUFwQjtBQUNILEtBRkQsTUFFSztBQUNESCxNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixHQUFpQixDQUFDQyxNQUFELENBQWpCO0FBQ0g7QUFDSixHQU5EOztBQVFBSixFQUFBQSxHQUFHLENBQUNPLElBQUosR0FBVyxVQUFTSixJQUFULEVBQWM7QUFDckIsUUFBR0YsUUFBUSxDQUFDSSxjQUFULENBQXdCRixJQUF4QixDQUFILEVBQWtDO0FBQzlCLFVBQUlLLFVBQVUsR0FBR1AsUUFBUSxDQUFDRSxJQUFELENBQXpCOztBQUNBLFdBQUksSUFBSU0sQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDRCxVQUFVLENBQUNFLE1BQXpCLEVBQWdDLEVBQUVELENBQWxDLEVBQW9DO0FBQ2hDLFlBQUlFLE1BQU0sR0FBR0gsVUFBVSxDQUFDQyxDQUFELENBQXZCO0FBQ0EsWUFBSUcsSUFBSSxHQUFHLEVBQVg7O0FBQ0EsYUFBSSxJQUFJSCxDQUFDLEdBQUcsQ0FBWixFQUFjQSxDQUFDLEdBQUNJLFNBQVMsQ0FBQ0gsTUFBMUIsRUFBaUMsRUFBRUQsQ0FBbkMsRUFBcUM7QUFDakNHLFVBQUFBLElBQUksQ0FBQ04sSUFBTCxDQUFVTyxTQUFTLENBQUNKLENBQUQsQ0FBbkI7QUFDSCxTQUwrQixDQU9oQzs7O0FBQ0FLLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlDQUErQlosSUFBM0M7QUFDQVEsUUFBQUEsTUFBTSxDQUFDSyxLQUFQLENBQWEsSUFBYixFQUFrQkosSUFBbEI7QUFDSDtBQUNKO0FBQ0osR0FmRDs7QUFpQkFaLEVBQUFBLEdBQUcsQ0FBQ2lCLFlBQUosR0FBbUIsVUFBU2QsSUFBVCxFQUFjO0FBQzdCRixJQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixHQUFpQixFQUFqQjtBQUNILEdBRkQ7O0FBSUFILEVBQUFBLEdBQUcsQ0FBQ2tCLGVBQUosR0FBc0IsWUFBVTtBQUM1QmpCLElBQUFBLFFBQVEsR0FBRyxFQUFYO0FBQ0gsR0FGRDs7QUFJQSxTQUFPRCxHQUFQO0FBQ0gsQ0FyQ0Q7O2VBdUNlRCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXZlbnRMaXN0ZXIgPSBmdW5jdGlvbihvYmope1xuICAgIHZhciByZWdpc3RlciA9IHt9XG5cbiAgICBvYmoub24gPSBmdW5jdGlvbih0eXBlLG1ldGhvZCl7XG4gICAgICAgIGlmKHJlZ2lzdGVyLmhhc093blByb3BlcnR5KHR5cGUpKXtcbiAgICAgICAgICAgIHJlZ2lzdGVyW3R5cGVdLnB1c2gobWV0aG9kKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJlZ2lzdGVyW3R5cGVdID0gW21ldGhvZF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9iai5maXJlID0gZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIGlmKHJlZ2lzdGVyLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTGlzdCA9IHJlZ2lzdGVyW3R5cGVdXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPG1ldGhvZExpc3QubGVuZ3RoOysraSl7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9IG1ldGhvZExpc3RbaV1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTtpPGFyZ3VtZW50cy5sZW5ndGg7KytpKXtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL2hhbmRsZS5jYWxsKHRoaXMsYXJncylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRsZS5jYWxsKHRoaXMsYXJncykgdHlwZTpcIit0eXBlKVxuICAgICAgICAgICAgICAgIGhhbmRsZS5hcHBseSh0aGlzLGFyZ3MpXG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb2JqLnJlbW92ZUxpc3RlciA9IGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZWdpc3Rlclt0eXBlXSA9IFtdXG4gICAgfVxuXG4gICAgb2JqLnJlbW92ZUFsbExpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlZ2lzdGVyID0ge31cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50TGlzdGVyIl19