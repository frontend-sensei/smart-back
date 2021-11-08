export class SmartBackMovement {
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
