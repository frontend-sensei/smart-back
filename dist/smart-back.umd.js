(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SmartBack = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var SmartBackService = /*#__PURE__*/function () {
    function SmartBackService() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var vendors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        _optionsClass: null,
        _uiClass: null,
        _nodesClass: null,
        _listenersClass: null,
        _listenersHandlingClass: null,
        _arrowClass: null,
        _movementClass: null
      };

      _classCallCheck(this, SmartBackService);

      this._options = new vendors._optionsClass(options);
      this.classes = {
        wrapper: "smart-back",
        side: "smart-back__side",
        sideLeft: "smart-back__side--left",
        sideRight: "smart-back__side--right"
      };
      this.leftSideId = "smart_back_side_left";
      this.rightSideId = "smart_back_side_right";
      this.arrowId = "smart_back_arrow";
      this.TRANSITION_DURATION = this._options.validate("transitionDuration", 140);
      this.ARROW_TRIGGERING_OFFSET = this._options.validate("arrowTriggeringOffset", 2);
      this.STATIC_ACTIVE_TRANSLATE_X = this._options.validate("staticActiveTranslateX", 40);
      this.ENABLE_ARROW_MIRRORING = this._options.validate("enableArrowMirroring", true);
      this.CALLBACK = this._options.validate("callback", history.back.bind(window.history));
      this._ui = vendors._uiClass;
      this._nodes = vendors._nodesClass;
      this._listeners = vendors._listenersClass;
      this._listenersHandling = vendors._listenersHandlingClass;
      this._arrow = vendors._arrowClass;
      this._movement = vendors._movementClass;
      this.render();
    }

    _createClass(SmartBackService, [{
      key: "render",
      value: function render() {
        this._ui = new this._ui(this);
        this._nodes = new this._nodes(this);
        this._listeners = new this._listeners(this);
        this._listenersHandling = new this._listenersHandling(this);
        this._arrow = new this._arrow(this);
        this._movement = new this._movement(this);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._ui.remove();

        this._listenersHandling.removeListeners();

        this._listenersHandling.removeAdditionalListeners();
      }
    }]);

    return SmartBackService;
  }();

  var SmartBackOptions = /*#__PURE__*/function () {
    function SmartBackOptions(options) {
      _classCallCheck(this, SmartBackOptions);

      this.options = options;
    }

    _createClass(SmartBackOptions, [{
      key: "validate",
      value: function validate(propertyName, reserveValue) {
        if (this.options.hasOwnProperty(propertyName)) {
          return this.options[propertyName];
        }

        return reserveValue;
      }
    }]);

    return SmartBackOptions;
  }();

  var SmartBackUI = /*#__PURE__*/function () {
    function SmartBackUI(instance) {
      _classCallCheck(this, SmartBackUI);

      this.instance = instance;
      this.uiNode = null;
      this.render();
    }

    _createClass(SmartBackUI, [{
      key: "render",
      value: function render() {
        var element = document.createElement("div");
        element.className = this.instance.classes.wrapper;
        element.innerHTML = this.getHTML();
        document.body.appendChild(element);
        this.uiNode = document.getElementsByClassName(this.instance.classes.wrapper)[0];
      }
    }, {
      key: "getHTML",
      value: function getHTML() {
        return "\n      <div\n        id=\"".concat(this.instance.leftSideId, "\"\n        class=\"").concat(this.instance.classes.side, " ").concat(this.instance.classes.sideLeft, "\"\n        data-side=\"left\"\n      ></div>\n      <div\n        id=\"").concat(this.instance.rightSideId, "\"\n        class=\"").concat(this.instance.classes.side, " ").concat(this.instance.classes.sideRight, "\"\n        data-side=\"right\"\n      ></div>\n      <div id=\"").concat(this.instance.arrowId, "\" class=\"smart-back__arrow\">\n        <div class=\"smart-back__arrow-part smart-back__arrow-part-1\"></div>\n        <div class=\"smart-back__arrow-part smart-back__arrow-part-2\"></div>\n      </div>\n    ");
      }
    }, {
      key: "remove",
      value: function remove() {
        if (!this.uiNode) {
          return console.log("uiNode not found");
        }

        this.uiNode.remove();
        this.uiNode = null;
      }
    }]);

    return SmartBackUI;
  }();

  var SmartBackNodes = /*#__PURE__*/function () {
    function SmartBackNodes(instance) {
      _classCallCheck(this, SmartBackNodes);

      this.instance = instance;
      this.sideNodes = {
        left: null,
        right: null
      };
      this.arrowNode = null;
      this.getNodes();
    }

    _createClass(SmartBackNodes, [{
      key: "getNodes",
      value: function getNodes() {
        this.sideNodes = this.getSideNodes();
        this.arrowNode = this.getArrowNode();
      }
    }, {
      key: "getSideNodes",
      value: function getSideNodes() {
        var left = document.getElementById(this.instance.leftSideId);
        var right = document.getElementById(this.instance.rightSideId);

        if (!left) {
          throw new Error("Left side node not found!");
        }

        if (!right) {
          throw new Error("Right side node not found!");
        }

        return {
          left: left,
          right: right
        };
      }
    }, {
      key: "getArrowNode",
      value: function getArrowNode() {
        var arrowNode = document.getElementById(this.instance.arrowId);

        if (!arrowNode) {
          throw new Error("Arrow node not found!");
        }

        return arrowNode;
      }
    }]);

    return SmartBackNodes;
  }();

  var SmartBackListeners = /*#__PURE__*/function () {
    function SmartBackListeners(instance) {
      _classCallCheck(this, SmartBackListeners);

      this.instance = instance;
    }

    _createClass(SmartBackListeners, [{
      key: "touchstart",
      value: function touchstart(event) {
        var currentSide = event.target.dataset.side;

        if (!currentSide) {
          throw new Error("Attribute data-side not found");
        }

        this.instance._listenersHandling.registerAdditionalListeners();

        this.instance._movement.currentSide = currentSide;
        this.instance._movement.prevClientX = event.touches[0].clientX;
        this.instance._movement.prevClientY = event.touches[0].clientY;

        this.instance._arrow.setStyle("top", "".concat(event.touches[0].clientY - 55, "px"));
      }
    }, {
      key: "touchmove",
      value: function touchmove(event) {
        if (event.touches.length > 1) {
          this.instance._listenersHandling.removeAdditionalListeners();

          return;
        }

        if (this.instance._movement.needSkipEvent) {
          return;
        }

        this.instance._arrow.setStyle("left", "unset");

        this.instance._arrow.setStyle("right", "unset");

        this.instance._arrow.setStyle(this.instance._movement.currentSide, "-4px");

        this.instance._movement.getMovementDirections(event);

        this.instance._movement.movementAlongXHandler();
      }
    }, {
      key: "touchend",
      value: function touchend() {
        if (this.instance._arrow.isActive) {
          this.instance.CALLBACK();
        }

        this.resetToInitialState();
      }
    }, {
      key: "touchcancel",
      value: function touchcancel() {
        this.resetToInitialState();
      }
    }, {
      key: "resetToInitialState",
      value: function resetToInitialState() {
        this.instance._listenersHandling.removeAdditionalListeners();

        this.instance._arrow.setInactive();
      }
    }]);

    return SmartBackListeners;
  }();

  var SmartBackListenersHandling = /*#__PURE__*/function () {
    function SmartBackListenersHandling(instance) {
      _classCallCheck(this, SmartBackListenersHandling);

      this.instance = instance;
      this.boundListeners = {
        touchstart: instance._listeners.touchstart.bind(instance._listeners)
      };
      this.boundAdditionalListeners = {
        touchmove: instance._listeners.touchmove.bind(instance._listeners),
        touchend: instance._listeners.touchend.bind(instance._listeners),
        touchcancel: instance._listeners.touchcancel.bind(instance._listeners)
      };
      this.registerListeners();
    }

    _createClass(SmartBackListenersHandling, [{
      key: "registerListeners",
      value: function registerListeners() {
        this.listenersHandler("addEventListener");
      }
    }, {
      key: "removeListeners",
      value: function removeListeners() {
        this.listenersHandler("removeEventListener");
      }
    }, {
      key: "listenersHandler",
      value: function listenersHandler(listenerAction) {
        this.instance._nodes.sideNodes.left[listenerAction]("touchstart", this.boundListeners.touchstart, false);

        this.instance._nodes.sideNodes.right[listenerAction]("touchstart", this.boundListeners.touchstart, false);
      }
    }, {
      key: "registerAdditionalListeners",
      value: function registerAdditionalListeners() {
        this.additionalListenersHandler("addEventListener", this.instance._nodes.sideNodes.left);
        this.additionalListenersHandler("addEventListener", this.instance._nodes.sideNodes.right);
      }
    }, {
      key: "removeAdditionalListeners",
      value: function removeAdditionalListeners() {
        this.additionalListenersHandler("removeEventListener", this.instance._nodes.sideNodes.left);
        this.additionalListenersHandler("removeEventListener", this.instance._nodes.sideNodes.right);
      }
    }, {
      key: "additionalListenersHandler",
      value: function additionalListenersHandler(action, sideNode) {
        if (!sideNode) {
          throw new Error("Side node not found!");
        }

        sideNode[action]("touchmove", this.boundAdditionalListeners.touchmove, false);
        sideNode[action]("touchend", this.boundAdditionalListeners.touchend, false);
        sideNode[action]("touchcancel", this.boundAdditionalListeners.touchcancel, false);
      }
    }]);

    return SmartBackListenersHandling;
  }();

  var SmartBackArrow = /*#__PURE__*/function () {
    function SmartBackArrow(instance) {
      _classCallCheck(this, SmartBackArrow);

      this.instance = instance;
      this.isActive = false;
    }

    _createClass(SmartBackArrow, [{
      key: "setActive",
      value: function setActive() {
        var _this = this;

        this.instance._movement.needSkipEvent = true;
        this.arrowStateHandler("add");
        this.updateTransition("transform .".concat(this.instance.TRANSITION_DURATION, "s ease-in-out"));

        this.instance._arrow.updatePosition();

        setTimeout(function () {
          _this.updateTransition("unset");

          _this.instance._movement.needSkipEvent = false;
          _this.isActive = true;
        }, this.instance.TRANSITION_DURATION);
      }
    }, {
      key: "setInactive",
      value: function setInactive() {
        var _this2 = this;

        this.instance._movement.needSkipEvent = true;
        this.arrowStateHandler("remove");
        this.resetValues();
        setTimeout(function () {
          _this2.instance._movement.needSkipEvent = false;
          _this2.isActive = false;
        }, this.instance.TRANSITION_DURATION);
      }
    }, {
      key: "arrowStateHandler",
      value: function arrowStateHandler(actionName) {
        this.arrowClassHandler({
          actionName: actionName,
          className: this.instance.ENABLE_ARROW_MIRRORING ? "smart-back__arrow--active-from-".concat(this.instance._movement.currentSide) : "smart-back__arrow--active"
        });
      }
    }, {
      key: "arrowClassHandler",
      value: function arrowClassHandler(_ref) {
        var actionName = _ref.actionName,
            className = _ref.className;
        this.classHandler({
          id: this.instance.arrowId,
          actionName: actionName,
          className: className
        });
      }
    }, {
      key: "classHandler",
      value: function classHandler(_ref2) {
        var id = _ref2.id,
            _ref2$actionName = _ref2.actionName,
            actionName = _ref2$actionName === void 0 ? "" : _ref2$actionName,
            className = _ref2.className;
        var element = document.getElementById(id);

        if (!element) {
          throw new Error("Element with id: \"".concat(id, "\" not found"));
        }

        var classListHandler = element.classList[actionName];

        if (!classListHandler) {
          throw new Error("ClassList handler with name: \"".concat(actionName, "\" not found"));
        }

        document.getElementById(id).classList[actionName](className);
      }
    }, {
      key: "updatePosition",
      value: function updatePosition() {
        this.setStyle("transform", "translate(".concat(this.instance._movement.translateX, "px, ").concat(this.instance._movement.translateY, "px)"));
      }
    }, {
      key: "setStyle",
      value: function setStyle(style, value) {
        this.updateNodeStyle(style, value);
      }
    }, {
      key: "updateNodeStyle",
      value: function updateNodeStyle(style, value) {
        this.instance._nodes.arrowNode.style[style] = value;
      }
    }, {
      key: "updateTransition",
      value: function updateTransition(value) {
        this.updateCSSVar("--sb-arrow-transition", value);
      }
    }, {
      key: "updateCSSVar",
      value: function updateCSSVar(name, value) {
        document.documentElement.style.setProperty(name, value);
      }
    }, {
      key: "resetValues",
      value: function resetValues() {
        var _this3 = this;

        this.updateTransition("transform .1s ease-in-out");
        this.setStyle("transform", "translate(0,0)");
        setTimeout(function () {
          _this3.instance._movement.resetValues();

          _this3.updateTransition("unset");
        }, this.instance.TRANSITION_DURATION);
      }
    }]);

    return SmartBackArrow;
  }();

  var SmartBackMovement = /*#__PURE__*/function () {
    function SmartBackMovement(instance) {
      _classCallCheck(this, SmartBackMovement);

      this.instance = instance;
      this.needSkipEvent = false;
      this.currentSide = "";
      this.currentDirections = {
        horizontal: "",
        vertical: ""
      };
      this.prevClientX = 0;
      this.prevClientY = 0;
      this.translateX = 0;
      this.translateY = 0;
      this.variationAlongX = 0.4;
      this.variationAlongY = 0.4;
      this.movedToCancelAlongX = 0;
      this.isNeedBreak = false;
      this.variationLimit = 0.045;
      this.subtrahendValueAlongY = 0.002;
      this.subtrahendValueAlongX = 0.002;
    }

    _createClass(SmartBackMovement, [{
      key: "getMovementDirections",
      value: function getMovementDirections(event) {
        var _event$touches$ = event.touches[0],
            clientX = _event$touches$.clientX,
            clientY = _event$touches$.clientY;

        if (this.prevClientX < clientX) {
          this.currentDirections.horizontal = "right";
        } else if (this.prevClientX > clientX) {
          this.currentDirections.horizontal = "left";
        } else if (this.prevClientX === clientX) {
          this.currentDirections.horizontal = "";
        }

        if (this.prevClientY < clientY) {
          this.currentDirections.vertical = "bottom";
        } else if (this.prevClientY > clientY) {
          this.currentDirections.vertical = "top";
        } else if (this.prevClientY === clientY) {
          this.currentDirections.vertical = "";
        }

        this.prevClientX = clientX;
        this.prevClientY = clientY;
      }
    }, {
      key: "movementAlongXHandler",
      value: function movementAlongXHandler() {
        this.isNeedBreak = false;

        if (this.currentSide === "right") {
          if (this.currentDirections.horizontal === "left") {
            this.movementTowardsActivation(this.translateX - this.variationAlongX, this.translateX > -this.instance.ARROW_TRIGGERING_OFFSET, -this.instance.STATIC_ACTIVE_TRANSLATE_X);
          }

          if (this.currentDirections.horizontal === "right") {
            this.movementTowardsDeactivation(this.translateX + this.variationAlongX);
          }
        }

        if (this.currentSide === "left") {
          if (this.currentDirections.horizontal === "right") {
            this.movementTowardsActivation(this.translateX + this.variationAlongX, this.translateX < this.instance.ARROW_TRIGGERING_OFFSET, this.instance.STATIC_ACTIVE_TRANSLATE_X);
          }

          if (this.currentDirections.horizontal === "left") {
            this.movementTowardsDeactivation(this.translateX - this.variationAlongX);
          }
        }

        if (this.instance._arrow.isActive && !this.isNeedBreak) {
          this.movementAlongYHandler();
        }
      }
    }, {
      key: "movementAlongYHandler",
      value: function movementAlongYHandler() {
        if (this.currentDirections.vertical === "top") {
          this.translateY -= this.variationAlongY;
        } else if (this.currentDirections.vertical === "bottom") {
          this.translateY += this.variationAlongY;
        }

        this.instance._arrow.updatePosition();

        if (this.variationAlongY < this.variationLimit) {
          return;
        }

        this.variationAlongY -= this.subtrahendValueAlongY;
      }
    }, {
      key: "movementTowardsActivation",
      value: function movementTowardsActivation(translateX, isTranslateXReachedOffset, activeTranslateX) {
        this.movedToCancelAlongX = 0;
        this.translateX = translateX;

        if (isTranslateXReachedOffset) {
          return;
        }

        if (!this.instance._arrow.isActive) {
          this.translateX += activeTranslateX;

          this.instance._arrow.setActive();

          return;
        }

        this.instance._arrow.updatePosition();

        if (this.variationAlongX < this.variationLimit) {
          return;
        }

        this.variationAlongX -= this.subtrahendValueAlongX;
      }
    }, {
      key: "movementTowardsDeactivation",
      value: function movementTowardsDeactivation(translateX) {
        if (!this.instance._arrow.isActive) {
          return this.needBreak();
        }

        if (this.movedToCancelAlongX === this.instance.ARROW_TRIGGERING_OFFSET) {
          this.instance._arrow.setInactive();

          return this.needBreak();
        }

        this.movedToCancelAlongX += 1;

        if (this.movedToCancelAlongX < this.instance.ARROW_TRIGGERING_OFFSET) {
          this.translateX = translateX;

          this.instance._arrow.updatePosition();
        }
      }
    }, {
      key: "needBreak",
      value: function needBreak() {
        this.isNeedBreak = true;
      }
    }, {
      key: "resetValues",
      value: function resetValues() {
        this.variationAlongX = 0.4;
        this.variationAlongY = 0.4;
        this.translateX = 0;
        this.translateY = 0;
        this.movedToCancelAlongX = 0;
      }
    }]);

    return SmartBackMovement;
  }();

  var vendors = {
    _optionsClass: SmartBackOptions,
    _uiClass: SmartBackUI,
    _nodesClass: SmartBackNodes,
    _listenersClass: SmartBackListeners,
    _listenersHandlingClass: SmartBackListenersHandling,
    _arrowClass: SmartBackArrow,
    _movementClass: SmartBackMovement
  };
  var SmartBack = function SmartBack(options) {
    _classCallCheck(this, SmartBack);

    return new SmartBackService(options, vendors);
  };

  return SmartBack;

})));
