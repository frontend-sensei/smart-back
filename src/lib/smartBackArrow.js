export class SmartBackArrow {
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
