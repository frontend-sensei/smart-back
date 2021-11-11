// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

let smartBack = null;

beforeEach(() => {
  smartBack = new SmartBack();
});

jest.spyOn(global, "setTimeout");

describe("SmartBack Arrow", () => {
  it("setActive: should call methods and set properties before timeout", () => {
    jest.useFakeTimers();
    const arrowStateHandlerFn = (smartBack._arrow.arrowStateHandler =
      jest.fn());
    const updateTransitionFn = (smartBack._arrow.updateTransition = jest.fn());
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());

    smartBack._arrow.setActive();
    const needSkipEvent = smartBack._movement.needSkipEvent;

    expect(needSkipEvent).toBeTruthy();
    expect(arrowStateHandlerFn).toHaveBeenCalledWith("add");
    expect(updateTransitionFn).toHaveBeenNthCalledWith(
      1,
      `transform .${smartBack.TRANSITION_DURATION}s ease-in-out`
    );
    expect(updatePositionFn).toHaveBeenCalled();
  });

  it("setActive: should call methods and set properties after timeout", () => {
    jest.useFakeTimers();
    const updateTransitionFn = (smartBack._arrow.updateTransition = jest.fn());
    const vibrateFn = (smartBack._arrow.vibrate = jest.fn());

    smartBack._arrow.setActive();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      smartBack.TRANSITION_DURATION
    );

    jest.runAllTimers();
    const needSkipEvent = smartBack._movement.needSkipEvent;
    const isActive = smartBack._arrow.isActive;

    expect(updateTransitionFn).toHaveBeenNthCalledWith(2, "unset");
    expect(vibrateFn).toHaveBeenCalled();
    expect(needSkipEvent).toBeFalsy();
    expect(isActive).toBeTruthy();
  });

  it("setInactive: should call methods and set properties before timeout", () => {
    jest.useFakeTimers();
    const arrowStateHandlerFn = (smartBack._arrow.arrowStateHandler =
      jest.fn());
    const resetValuesFn = (smartBack._arrow.resetValues = jest.fn());

    smartBack._arrow.setInactive();
    const needSkipEvent = smartBack._movement.needSkipEvent;

    expect(needSkipEvent).toBeTruthy();
    expect(arrowStateHandlerFn).toHaveBeenCalledWith("remove");
    expect(resetValuesFn).toHaveBeenCalled();
  });

  it("setInactive: should call methods and set properties after timeout", () => {
    jest.useFakeTimers();

    smartBack._arrow.setInactive();
    jest.runAllTimers();
    const needSkipEvent = smartBack._movement.needSkipEvent;
    const isActive = smartBack._arrow.isActive;

    expect(needSkipEvent).toBeFalsy();
    expect(isActive).toBeFalsy();
  });

  it("arrowStateHandler: should call arrowClassHandler", () => {
    const actionName = "add";
    const handlerArguments = {
      actionName,
      className: smartBack.ENABLE_ARROW_MIRRORING
        ? `smart-back__arrow--active-from-${smartBack._movement.currentSide}`
        : "smart-back__arrow--active",
    };
    const arrowClassHandlerFn = (smartBack._arrow.arrowClassHandler =
      jest.fn());

    smartBack._arrow.arrowStateHandler(actionName);

    expect(arrowClassHandlerFn).toHaveBeenCalledWith(handlerArguments);
  });

  it("arrowClassHandler: should call classHandler", () => {
    const actionName = "add";
    const className = "smart-back__arrow--active";
    const handlerArguments = {
      actionName,
      className,
    };
    const classHandlerArguments = {
      id: smartBack.arrowId,
      actionName,
      className,
    };
    const classHandlerFn = (smartBack._arrow.classHandler = jest.fn());

    smartBack._arrow.arrowClassHandler(handlerArguments);

    expect(classHandlerFn).toHaveBeenCalledWith(classHandlerArguments);
  });

  it("classHandler: should fails with wrong id", () => {
    const id = "wrongElementId";
    const actionName = "add";
    const className = "smart-back__arrow--active";
    const classHandlerArguments = {
      id,
      actionName,
      className,
    };

    expect(() => {
      smartBack._arrow.classHandler(classHandlerArguments);
    }).toThrow(`Element with id: "${id}" not found`);
  });

  it("classHandler: should fails with wrong action name", () => {
    const id = smartBack.arrowId;
    const actionName = "wrongActionName";
    const className = "smart-back__arrow--active";
    const classHandlerArguments = {
      id,
      actionName,
      className,
    };

    expect(() => {
      smartBack._arrow.classHandler(classHandlerArguments);
    }).toThrow(`ClassList handler with name: "${actionName}" not found`);
  });

  it("classHandler: should add class to element", () => {
    const id = smartBack.arrowId;
    const actionName = "add";
    const className = "smart-back__arrow--active";
    const classHandlerArguments = {
      id,
      actionName,
      className,
    };

    smartBack._arrow.classHandler(classHandlerArguments);
    const element = document.getElementById(id);

    expect(element.classList.contains("smart-back__arrow--active")).toBe(true);
  });

  it("updatePosition: should call setStyle", () => {
    const setStyleFn = (smartBack._arrow.setStyle = jest.fn());

    smartBack._arrow.updatePosition();

    expect(setStyleFn).toHaveBeenCalledWith(
      "transform",
      `translate(${smartBack._movement.translateX}px, ${smartBack._movement.translateY}px)`
    );
  });

  it("setStyle: should call updateNodeStyle", () => {
    const style = "top";
    const value = "10px";
    const updateNodeStyleFn = (smartBack._arrow.updateNodeStyle = jest.fn());

    smartBack._arrow.setStyle(style, value);

    expect(updateNodeStyleFn).toHaveBeenCalledWith(style, value);
  });

  it("updateNodeStyle: should set style", () => {
    const style = "top";
    const value = "10px";

    smartBack._arrow.updateNodeStyle(style, value);
    const nodeStyle = smartBack._nodes.arrowNode.style[style];

    expect(nodeStyle).toEqual(value);
  });

  it("updateTransition: should call updateCSSVar", () => {
    const updateCSSVarFn = (smartBack._arrow.updateCSSVar = jest.fn());
    const value = "unset";

    smartBack._arrow.updateTransition(value);

    expect(updateCSSVarFn).toHaveBeenCalledWith("--sb-arrow-transition", value);
  });

  it("resetValues: should call methods before timeout", () => {
    const updateTransitionFn = (smartBack._arrow.updateTransition = jest.fn());
    const setStyleFn = (smartBack._arrow.setStyle = jest.fn());

    smartBack._arrow.resetValues();

    expect(updateTransitionFn).toHaveBeenCalledWith(
      "transform .1s ease-in-out"
    );
    expect(setStyleFn).toHaveBeenCalledWith("transform", "translate(0,0)");
  });

  it("resetValues: should call methods after timeout", () => {
    jest.useFakeTimers();
    const resetValuesFn = (smartBack._movement.resetValues = jest.fn());
    const updateTransitionFn = (smartBack._arrow.updateTransition = jest.fn());

    smartBack._arrow.resetValues();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      smartBack.TRANSITION_DURATION
    );

    jest.runAllTimers();

    expect(resetValuesFn).toHaveBeenCalled();
    expect(updateTransitionFn).toHaveBeenCalledWith("unset");
  });
});
