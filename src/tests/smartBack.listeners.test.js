// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

let smartBack = new SmartBack();

beforeEach(() => {
  smartBack = new SmartBack();
});

const getBaseEvent = () => {
  return {
    touches: {
      0: {
        clientX: 302,
        clientY: 172,
      },
      length: 1,
    },
    target: {
      dataset: {
        side: "left",
      },
    },
    preventDefault: () => false,
  };
};

describe("SmartBack Listeners", () => {
  it("touchstart: should prevent event", () => {
    const event = getBaseEvent();
    delete event.target.dataset.side;

    expect(() => {
      smartBack._listeners.touchstart(event);
    }).toThrow("Attribute data-side not found");
  });

  it("touchstart: should save values", () => {
    const event = getBaseEvent();

    smartBack._listeners.touchstart(event);
    const clientY = event.touches[0].clientY;
    const clientX = event.touches[0].clientX;
    const datasetSide = event.target.dataset.side;
    const currentSide = smartBack._movement.currentSide;
    const prevClientX = smartBack._movement.prevClientX;
    const prevClientY = smartBack._movement.prevClientY;

    expect(currentSide).toBe(datasetSide);
    expect(prevClientX).toBe(clientX);
    expect(prevClientY).toBe(clientY);
  });

  it("touchmove: should prevent event", () => {
    const event = getBaseEvent();
    event.touches.length = 2;
    const removeAdditionalListenersFn =
      (smartBack._listenersHandling.removeAdditionalListeners = jest.fn());

    smartBack._listeners.touchmove(event);

    expect(removeAdditionalListenersFn).toHaveBeenCalled();
  });

  it("touchmove: should skip event", () => {
    const event = getBaseEvent();
    const setStyleFn = (smartBack._arrow.setStyle = jest.fn());
    smartBack._movement.needSkipEvent = true;

    smartBack._listeners.touchmove(event);

    expect(setStyleFn).toHaveBeenCalledTimes(0);
  });

  it("touchmove: should not skip event", () => {
    const event = getBaseEvent();
    const setStyleFn = (smartBack._arrow.setStyle = jest.fn());
    const getMovementDirectionsFn = (smartBack._movement.getMovementDirections =
      jest.fn());
    const movementAlongXHandlerFn = (smartBack._movement.movementAlongXHandler =
      jest.fn());

    smartBack._listeners.touchmove(event);

    expect(setStyleFn).toHaveBeenCalledTimes(3);
    expect(getMovementDirectionsFn).toHaveBeenCalledTimes(1);
    expect(movementAlongXHandlerFn).toHaveBeenCalledTimes(1);
  });

  it("touchend: should call callback", () => {
    smartBack._arrow.isActive = true;
    const CALLBACKFn = (smartBack.CALLBACK = jest.fn());
    const resetToInitialStateFn = (smartBack._listeners.resetToInitialState =
      jest.fn());

    smartBack._listeners.touchend();

    expect(CALLBACKFn).toHaveBeenCalledTimes(1);
    expect(resetToInitialStateFn).toHaveBeenCalledTimes(1);
  });

  it("touchend: should not call callback", () => {
    smartBack._arrow.isActive = false;
    const CALLBACKFn = (smartBack.CALLBACK = jest.fn());
    const resetToInitialStateFn = (smartBack._listeners.resetToInitialState =
      jest.fn());

    smartBack._listeners.touchend();

    expect(CALLBACKFn).toHaveBeenCalledTimes(0);
    expect(resetToInitialStateFn).toHaveBeenCalledTimes(1);
  });

  it("touchcancel: should call resetToInitialState", () => {
    const resetToInitialStateFn = (smartBack._listeners.resetToInitialState =
      jest.fn());

    smartBack._listeners.touchcancel();

    expect(resetToInitialStateFn).toHaveBeenCalledTimes(1);
  });

  it("resetToInitialState: should call methods", () => {
    const removeAdditionalListenersFn =
      (smartBack._listenersHandling.removeAdditionalListeners = jest.fn());
    const setInactiveFn = (smartBack._arrow.setInactive = jest.fn());

    smartBack._listeners.resetToInitialState();

    expect(removeAdditionalListenersFn).toHaveBeenCalledTimes(1);
    expect(setInactiveFn).toHaveBeenCalledTimes(1);
  });
});
