export class SmartBackListenersHandling {
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
