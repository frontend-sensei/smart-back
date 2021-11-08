export class SmartBackNodes {
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
