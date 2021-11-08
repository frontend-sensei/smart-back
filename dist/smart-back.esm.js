class SmartBackService {
  constructor(
    options = {},
    vendors = {
      _optionsClass: null,
      _uiClass: null,
      _nodesClass: null,
      _listenersClass: null,
      _listenersHandlingClass: null,
      _arrowClass: null,
      _movementClass: null,
    }
  ) {
    this._options = new vendors._optionsClass(options);

    this.classes = {
      wrapper: "smart-back",
      side: "smart-back__side",
      sideLeft: "smart-back__side--left",
      sideRight: "smart-back__side--right",
    };
    this.leftSideId = "smart_back_side_left";
    this.rightSideId = "smart_back_side_right";
    this.arrowId = "smart_back_arrow";

    this.TRANSITION_DURATION = this._options.validate(
      "transitionDuration",
      140
    );
    this.ARROW_TRIGGERING_OFFSET = this._options.validate(
      "arrowTriggeringOffset",
      2
    );
    this.STATIC_ACTIVE_TRANSLATE_X = this._options.validate(
      "staticActiveTranslateX",
      40
    );
    this.ENABLE_ARROW_MIRRORING = this._options.validate(
      "enableArrowMirroring",
      true
    );
    this.CALLBACK = this._options.validate(
      "callback",
      history.back.bind(window.history)
    );

    this._ui = vendors._uiClass;
    this._nodes = vendors._nodesClass;
    this._listeners = vendors._listenersClass;
    this._listenersHandling = vendors._listenersHandlingClass;
    this._arrow = vendors._arrowClass;
    this._movement = vendors._movementClass;

    this.render();
  }

  render() {
    this._ui = new this._ui(this);
    this._nodes = new this._nodes(this);
    this._listeners = new this._listeners(this);
    this._listenersHandling = new this._listenersHandling(this);
    this._arrow = new this._arrow(this);
    this._movement = new this._movement(this);
  }

  destroy() {
    this._ui.remove();
    this._listenersHandling.removeListeners();
    this._listenersHandling.removeAdditionalListeners();
  }
}

class SmartBackOptions {
  constructor(options) {
    this.options = options;
  }

  validate(propertyName, reserveValue) {
    if (this.options.hasOwnProperty(propertyName)) {
      return this.options[propertyName];
    }
    return reserveValue;
  }
}

class SmartBackUI {
  constructor(instance) {
    this.instance = instance;
    this.uiNode = null;
    this.render();
  }

  render() {
    const element = document.createElement("div");
    element.className = this.instance.classes.wrapper;
    element.innerHTML = this.getHTML();
    document.body.appendChild(element);
    this.uiNode = document.getElementsByClassName(
      this.instance.classes.wrapper
    )[0];
  }

  getHTML() {
    return `
      <div
        id="${this.instance.leftSideId}"
        class="${this.instance.classes.side} ${this.instance.classes.sideLeft}"
        data-side="left"
      ></div>
      <div
        id="${this.instance.rightSideId}"
        class="${this.instance.classes.side} ${this.instance.classes.sideRight}"
        data-side="right"
      ></div>
      <div id="${this.instance.arrowId}" class="smart-back__arrow">
        <div class="smart-back__arrow-part smart-back__arrow-part-1"></div>
        <div class="smart-back__arrow-part smart-back__arrow-part-2"></div>
      </div>
    `;
  }

  remove() {
    if (!this.uiNode) {
      return console.log("uiNode not found");
    }
    this.uiNode.remove();
    this.uiNode = null;
  }
}

class SmartBackNodes {
  constructor(instance) {
    this.instance = instance;
    this.sideNodes = {
      left: null,
      right: null,
    };
    this.arrowNode = null;
    this.getNodes();
  }

  getNodes() {
    this.sideNodes = this.getSideNodes();
    this.arrowNode = this.getArrowNode();
  }
  getSideNodes() {
    const left = document.getElementById(this.instance.leftSideId);
    const right = document.getElementById(this.instance.rightSideId);
    if (!left) {
      throw new Error("Left side node not found!");
    }
    if (!right) {
      throw new Error("Right side node not found!");
    }

    return {
      left,
      right,
    };
  }
  getArrowNode() {
    const arrowNode = document.getElementById(this.instance.arrowId);
    if (!arrowNode) {
      throw new Error("Arrow node not found!");
    }
    return arrowNode;
  }
}

class SmartBackListeners {
  constructor(instance) {
    this.instance = instance;
  }

  touchstart(event) {
    const currentSide = event.target.dataset.side;
    if (!currentSide) {
      throw new Error("Attribute data-side not found");
    }

    this.instance._listenersHandling.registerAdditionalListeners();
    this.instance._movement.currentSide = currentSide;

    this.instance._movement.prevClientX = event.touches[0].clientX;
    this.instance._movement.prevClientY = event.touches[0].clientY;

    this.instance._arrow.setStyle("top", `${event.touches[0].clientY - 55}px`);
  }
  touchmove(event) {
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
  touchend() {
    if (this.instance._arrow.isActive) {
      this.instance.CALLBACK();
    }
    this.resetToInitialState();
  }
  touchcancel() {
    this.resetToInitialState();
  }
  resetToInitialState() {
    this.instance._listenersHandling.removeAdditionalListeners();
    this.instance._arrow.setInactive();
  }
}

class SmartBackListenersHandling {
  constructor(instance) {
    this.instance = instance;
    this.boundListeners = {
      touchstart: instance._listeners.touchstart.bind(instance._listeners),
    };
    this.boundAdditionalListeners = {
      touchmove: instance._listeners.touchmove.bind(instance._listeners),
      touchend: instance._listeners.touchend.bind(instance._listeners),
      touchcancel: instance._listeners.touchcancel.bind(instance._listeners),
    };
    this.registerListeners();
  }

  registerListeners() {
    this.listenersHandler("addEventListener");
  }
  removeListeners() {
    this.listenersHandler("removeEventListener");
  }
  listenersHandler(listenerAction) {
    this.instance._nodes.sideNodes.left[listenerAction](
      "touchstart",
      this.boundListeners.touchstart,
      false
    );
    this.instance._nodes.sideNodes.right[listenerAction](
      "touchstart",
      this.boundListeners.touchstart,
      false
    );
  }

  registerAdditionalListeners() {
    this.additionalListenersHandler(
      "addEventListener",
      this.instance._nodes.sideNodes.left
    );
    this.additionalListenersHandler(
      "addEventListener",
      this.instance._nodes.sideNodes.right
    );
  }
  removeAdditionalListeners() {
    this.additionalListenersHandler(
      "removeEventListener",
      this.instance._nodes.sideNodes.left
    );
    this.additionalListenersHandler(
      "removeEventListener",
      this.instance._nodes.sideNodes.right
    );
  }
  additionalListenersHandler(action, sideNode) {
    if (!sideNode) {
      throw new Error("Side node not found!");
    }
    sideNode[action](
      "touchmove",
      this.boundAdditionalListeners.touchmove,
      false
    );
    sideNode[action]("touchend", this.boundAdditionalListeners.touchend, false);
    sideNode[action](
      "touchcancel",
      this.boundAdditionalListeners.touchcancel,
      false
    );
  }
}

class SmartBackArrow {
  constructor(instance) {
    this.instance = instance;
    this.isActive = false;
  }

  setActive() {
    this.instance._movement.needSkipEvent = true;

    this.arrowStateHandler("add");
    this.updateTransition(
      `transform .${this.instance.TRANSITION_DURATION}s ease-in-out`
    );
    this.instance._arrow.updatePosition();
    setTimeout(() => {
      this.updateTransition("unset");
      this.instance._movement.needSkipEvent = false;
      this.isActive = true;
    }, this.instance.TRANSITION_DURATION);
  }
  setInactive() {
    this.instance._movement.needSkipEvent = true;

    this.arrowStateHandler("remove");
    this.resetValues();
    setTimeout(() => {
      this.instance._movement.needSkipEvent = false;
      this.isActive = false;
    }, this.instance.TRANSITION_DURATION);
  }
  arrowStateHandler(actionName) {
    this.arrowClassHandler({
      actionName,
      className: this.instance.ENABLE_ARROW_MIRRORING
        ? `smart-back__arrow--active-from-${this.instance._movement.currentSide}`
        : "smart-back__arrow--active",
    });
  }
  arrowClassHandler({ actionName, className }) {
    this.classHandler({
      id: this.instance.arrowId,
      actionName,
      className,
    });
  }
  classHandler({ id, actionName = "", className }) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id: "${id}" not found`);
    }

    const classListHandler = element.classList[actionName];
    if (!classListHandler) {
      throw new Error(`ClassList handler with name: "${actionName}" not found`);
    }

    document.getElementById(id).classList[actionName](className);
  }
  updatePosition() {
    this.setStyle(
      "transform",
      `translate(${this.instance._movement.translateX}px, ${this.instance._movement.translateY}px)`
    );
  }
  setStyle(style, value) {
    this.updateNodeStyle(style, value);
  }
  updateNodeStyle(style, value) {
    this.instance._nodes.arrowNode.style[style] = value;
  }
  updateTransition(value) {
    this.updateCSSVar("--sb-arrow-transition", value);
  }
  updateCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }
  resetValues() {
    this.updateTransition("transform .1s ease-in-out");
    this.setStyle("transform", "translate(0,0)");
    setTimeout(() => {
      this.instance._movement.resetValues();
      this.updateTransition("unset");
    }, this.instance.TRANSITION_DURATION);
  }
}

class SmartBackMovement {
  constructor(instance) {
    this.instance = instance;
    this.needSkipEvent = false;
    this.currentSide = "";
    this.currentDirections = {
      horizontal: "",
      vertical: "",
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

  getMovementDirections(event) {
    const { clientX, clientY } = event.touches[0];

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

  movementAlongXHandler() {
    this.isNeedBreak = false;

    if (this.currentSide === "right") {
      if (this.currentDirections.horizontal === "left") {
        this.movementTowardsActivation(
          this.translateX - this.variationAlongX,
          this.translateX > -this.instance.ARROW_TRIGGERING_OFFSET,
          -this.instance.STATIC_ACTIVE_TRANSLATE_X
        );
      }
      if (this.currentDirections.horizontal === "right") {
        this.movementTowardsDeactivation(
          this.translateX + this.variationAlongX
        );
      }
    }

    if (this.currentSide === "left") {
      if (this.currentDirections.horizontal === "right") {
        this.movementTowardsActivation(
          this.translateX + this.variationAlongX,
          this.translateX < this.instance.ARROW_TRIGGERING_OFFSET,
          this.instance.STATIC_ACTIVE_TRANSLATE_X
        );
      }
      if (this.currentDirections.horizontal === "left") {
        this.movementTowardsDeactivation(
          this.translateX - this.variationAlongX
        );
      }
    }

    if (this.instance._arrow.isActive && !this.isNeedBreak) {
      this.movementAlongYHandler();
    }
  }
  movementAlongYHandler() {
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

  movementTowardsActivation(
    translateX,
    isTranslateXReachedOffset,
    activeTranslateX
  ) {
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
  movementTowardsDeactivation(translateX) {
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

  needBreak() {
    this.isNeedBreak = true;
  }
  resetValues() {
    this.variationAlongX = 0.4;
    this.variationAlongY = 0.4;
    this.translateX = 0;
    this.translateY = 0;
    this.movedToCancelAlongX = 0;
  }
}

const vendors = {
  _optionsClass: SmartBackOptions,
  _uiClass: SmartBackUI,
  _nodesClass: SmartBackNodes,
  _listenersClass: SmartBackListeners,
  _listenersHandlingClass: SmartBackListenersHandling,
  _arrowClass: SmartBackArrow,
  _movementClass: SmartBackMovement,
};

class SmartBack {
  constructor(options) {
    return new SmartBackService(options, vendors);
  }
}

export default SmartBack;
