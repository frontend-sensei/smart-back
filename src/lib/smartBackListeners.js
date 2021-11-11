export class SmartBackListeners {
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
    event.preventDefault();
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
