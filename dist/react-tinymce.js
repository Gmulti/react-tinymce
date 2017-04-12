(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("javascripts/components/TinyMCE.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _isEqual = require('lodash/lang/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _clone = require('lodash/lang/clone');

var _clone2 = _interopRequireDefault(_clone);

var _uuid = require('javascripts/helpers/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ucFirst = require('javascripts/helpers/ucFirst');

var _ucFirst2 = _interopRequireDefault(_ucFirst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Include all of the Native DOM and custom events from:
// https://github.com/tinymce/tinymce/blob/master/tools/docs/tinymce.Editor.js#L5-L12
var EVENTS = ['focusin', 'focusout', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'beforepaste', 'paste', 'cut', 'copy', 'selectionchange', 'mouseout', 'mouseenter', 'mouseleave', 'keydown', 'keypress', 'keyup', 'contextmenu', 'dragend', 'dragover', 'draggesture', 'dragdrop', 'drop', 'drag', 'BeforeRenderUI', 'SetAttrib', 'PreInit', 'PostRender', 'init', 'deactivate', 'activate', 'NodeChange', 'BeforeExecCommand', 'ExecCommand', 'show', 'hide', 'ProgressState', 'LoadContent', 'SaveContent', 'BeforeSetContent', 'SetContent', 'BeforeGetContent', 'GetContent', 'VisualAid', 'remove', 'submit', 'reset', 'BeforeAddUndo', 'AddUndo', 'change', 'undo', 'redo', 'ClearUndos', 'ObjectSelected', 'ObjectResizeStart', 'ObjectResized', 'PreProcess', 'PostProcess', 'focus', 'blur', 'dirty'];

// Note: because the capitalization of the events is weird, we're going to get
// some inconsistently-named handlers, for example compare:
// 'onMouseleave' and 'onNodeChange'
var HANDLER_NAMES = EVENTS.map(function (event) {
  return 'on' + (0, _ucFirst2.default)(event);
});

var TinyMCE = function (_React$Component) {
  _inherits(TinyMCE, _React$Component);

  function TinyMCE() {
    _classCallCheck(this, TinyMCE);

    return _possibleConstructorReturn(this, (TinyMCE.__proto__ || Object.getPrototypeOf(TinyMCE)).apply(this, arguments));
  }

  _createClass(TinyMCE, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.id = this.id || this.props.id || (0, _uuid2.default)();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var config = (0, _clone2.default)(this.props.config);
      this._init(config);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _isEqual2.default)(this.props.config, nextProps.config)) {
        this._init(nextProps.config, nextProps.content);
      }
      if (!(0, _isEqual2.default)(this.props.id, nextProps.id)) {
        this.id = nextProps.id;
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _isEqual2.default)(this.props.content, nextProps.content) || !(0, _isEqual2.default)(this.props.config, nextProps.config);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._remove();
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.config.inline ? _react2.default.createElement('div', {
        id: this.id,
        className: this.props.className,
        dangerouslySetInnerHTML: { __html: this.props.content }
      }) : _react2.default.createElement('textarea', {
        id: this.id,
        className: this.props.className,
        defaultValue: this.props.content
      });
    }
  }, {
    key: '_init',
    value: function _init(config, content) {
      var _this2 = this;

      if (this._isInit) {
        this._remove();
      }

      // hide the textarea that is me so that no one sees it
      (0, _reactDom.findDOMNode)(this).style.hidden = 'hidden';

      var setupCallback = config.setup;
      var hasSetupCallback = typeof setupCallback === 'function';

      config.selector = '#' + this.id;
      config.setup = function (editor) {
        EVENTS.forEach(function (event, index) {
          var handler = _this2.props[HANDLER_NAMES[index]];
          if (typeof handler !== 'function') return;
          editor.on(event, function (e) {
            // native DOM events don't have access to the editor so we pass it here
            handler(e, editor);
          });
        });
        // need to set content here because the textarea will still have the
        // old `this.props.content`
        if (content) {
          editor.on('init', function () {
            editor.setContent(content);
          });
        }
        if (hasSetupCallback) {
          setupCallback(editor);
        }
      };

      tinymce.init(config);

      (0, _reactDom.findDOMNode)(this).style.hidden = '';

      this._isInit = true;
    }
  }, {
    key: '_remove',
    value: function _remove() {
      tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
      this._isInit = false;
    }
  }]);

  return TinyMCE;
}(_react2.default.Component);

// add handler propTypes


HANDLER_NAMES.forEach(function (name) {
  TinyMCE.propTypes[name] = _react2.default.PropTypes.func;
});

exports.default = TinyMCE;

});

require.register("javascripts/helpers/ucFirst.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ucFirst;
function ucFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}

});

;require.register("javascripts/helpers/uuid.js", function(exports, require, module) {
'use strict';

var count = 0;
module.exports = function uuid() {
  return 'react-tinymce-' + count++;
};

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=react-tinymce.js.map