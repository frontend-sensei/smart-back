export class SmartBackUI {
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
