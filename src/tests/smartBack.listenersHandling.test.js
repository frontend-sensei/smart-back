// @ts-nocheck
import { SmartBack } from "../lib/smartBack";
import { ListenerTracker } from "./utils/listenersTracker";

let smartBack = null;
let listenerTracker = null;

beforeEach(() => {
  listenerTracker = new ListenerTracker().init();
  smartBack = new SmartBack();
});

const additionalListenersTypes = ["touchmove", "touchend", "touchcancel"];
const getAdditionalListenersCount = (nodeListeners = []) => {
  const additionalListenersCount = nodeListeners.reduce(
    (accumulator, listener) => {
      const listenerIncludes = additionalListenersTypes.includes(listener.type);
      if (listenerIncludes) {
        return accumulator + 1;
      }
      return accumulator;
    },
    0
  );

  return additionalListenersCount;
};

describe("SmartBack Listeners handling", () => {
  it("registerListeners: should call listenersHandler", () => {
    const listenersHandlerFn = (smartBack._listenersHandling.listenersHandler =
      jest.fn());

    smartBack._listenersHandling.registerListeners();

    expect(listenersHandlerFn).toHaveBeenCalledWith("addEventListener");
  });

  it("removeListeners: should call listenersHandler", () => {
    const listenersHandlerFn = (smartBack._listenersHandling.listenersHandler =
      jest.fn());

    smartBack._listenersHandling.removeListeners();

    expect(listenersHandlerFn).toHaveBeenCalledWith("removeEventListener");
  });

  it("listenersHandler: should add listeners", () => {
    const leftNode = smartBack._nodes.sideNodes.left;
    const rightNode = smartBack._nodes.sideNodes.right;

    const leftNodeListener = leftNode
      .getEventListeners()
      .find((listenerObj) => listenerObj.type === "touchstart");
    const rightNodeListener = rightNode
      .getEventListeners()
      .find((listenerObj) => listenerObj.type === "touchstart");

    expect(leftNodeListener).toBeTruthy();
    expect(rightNodeListener).toBeTruthy();
  });

  it("listenersHandler: should remove listeners", () => {
    const leftNode = smartBack._nodes.sideNodes.left;
    const rightNode = smartBack._nodes.sideNodes.right;

    smartBack._listenersHandling.listenersHandler("removeEventListener");

    const leftNodeListener = leftNode
      .getEventListeners()
      .find((listenerObj) => listenerObj.type === "touchstart");
    const rightNodeListener = rightNode
      .getEventListeners()
      .find((listenerObj) => listenerObj.type === "touchstart");

    expect(leftNodeListener).toBeUndefined();
    expect(rightNodeListener).toBeUndefined();
  });

  it("registerAdditionalListeners: should call additionalListenersHandler", () => {
    const additionalListenersHandlerFn =
      (smartBack._listenersHandling.additionalListenersHandler = jest.fn());

    smartBack._listenersHandling.registerAdditionalListeners();

    expect(additionalListenersHandlerFn).toHaveBeenNthCalledWith(
      1,
      "addEventListener",
      smartBack._nodes.sideNodes.left
    );
    expect(additionalListenersHandlerFn).toHaveBeenNthCalledWith(
      2,
      "addEventListener",
      smartBack._nodes.sideNodes.right
    );
  });

  it("removeAdditionalListeners: should call additionalListenersHandler", () => {
    const additionalListenersHandlerFn =
      (smartBack._listenersHandling.additionalListenersHandler = jest.fn());

    smartBack._listenersHandling.removeAdditionalListeners();

    expect(additionalListenersHandlerFn).toHaveBeenNthCalledWith(
      1,
      "removeEventListener",
      smartBack._nodes.sideNodes.left
    );
    expect(additionalListenersHandlerFn).toHaveBeenNthCalledWith(
      2,
      "removeEventListener",
      smartBack._nodes.sideNodes.right
    );
  });

  it("additionalListenersHandler: should throw error", () => {
    const action = "addEventListener";
    const sideNode = null;

    expect(() => {
      smartBack._listenersHandling.additionalListenersHandler(action, sideNode);
    }).toThrow("Side node not found!");
  });

  it("additionalListenersHandler: should add additional listeners", () => {
    const action = "addEventListener";
    const sideNode = smartBack._nodes.sideNodes.right;

    smartBack._listenersHandling.additionalListenersHandler(action, sideNode);
    const nodeListeners = sideNode.getEventListeners();
    const additionalListenersCount = getAdditionalListenersCount(nodeListeners);

    expect(additionalListenersCount).toBe(3);
  });

  it("additionalListenersHandler: should add and remove additional listeners", () => {
    const sideNode = smartBack._nodes.sideNodes.right;

    smartBack._listenersHandling.additionalListenersHandler(
      "addEventListener",
      sideNode
    );
    smartBack._listenersHandling.additionalListenersHandler(
      "removeEventListener",
      sideNode
    );
    const nodeListeners = sideNode.getEventListeners();
    const additionalListenersCount = getAdditionalListenersCount(nodeListeners);

    expect(additionalListenersCount).toBe(0);
  });
});
