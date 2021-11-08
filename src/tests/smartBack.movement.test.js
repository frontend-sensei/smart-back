// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

let smartBack = null;

beforeEach(() => {
  smartBack = new SmartBack();
});

const event = {
  touches: {
    0: {
      clientX: 300,
      clientY: 300,
    },
  },
};

describe("SmartBack Listeners", () => {
  it('getMovementDirections: horizontal direction should be "right"', () => {
    smartBack._movement.prevClientX = 250;

    smartBack._movement.getMovementDirections(event);
    const horizontalDirection =
      smartBack._movement.currentDirections.horizontal;

    expect(horizontalDirection).toEqual("right");
  });

  it('getMovementDirections: horizontal direction should be "left"', () => {
    smartBack._movement.prevClientX = 350;

    smartBack._movement.getMovementDirections(event);
    const horizontalDirection =
      smartBack._movement.currentDirections.horizontal;

    expect(horizontalDirection).toEqual("left");
  });

  it('getMovementDirections: horizontal direction should be ""', () => {
    smartBack._movement.prevClientX = 300;

    smartBack._movement.getMovementDirections(event);
    const horizontalDirection =
      smartBack._movement.currentDirections.horizontal;

    expect(horizontalDirection).toEqual("");
  });

  it('getMovementDirections: vertical direction should be "bottom"', () => {
    smartBack._movement.prevClientY = 250;

    smartBack._movement.getMovementDirections(event);
    const verticalDirection = smartBack._movement.currentDirections.vertical;

    expect(verticalDirection).toEqual("bottom");
  });

  it('getMovementDirections: vertical direction should be "top"', () => {
    smartBack._movement.prevClientY = 350;

    smartBack._movement.getMovementDirections(event);
    const verticalDirection = smartBack._movement.currentDirections.vertical;

    expect(verticalDirection).toEqual("top");
  });

  it('getMovementDirections: vertical direction should be ""', () => {
    smartBack._movement.prevClientY = 300;

    smartBack._movement.getMovementDirections(event);
    const verticalDirection = smartBack._movement.currentDirections.vertical;

    expect(verticalDirection).toEqual("");
  });

  describe("movementAlongXHandler", () => {
    describe("right side", () => {
      it("horizontal direction - left", () => {
        smartBack._movement.currentSide = "right";
        smartBack._movement.currentDirections.horizontal = "left";
        const movementTowardsActivationFn =
          (smartBack._movement.movementTowardsActivation = jest.fn());

        smartBack._movement.movementAlongXHandler(event);

        expect(movementTowardsActivationFn).toHaveBeenCalledWith(
          smartBack._movement.translateX - smartBack._movement.variationAlongX,
          smartBack._movement.translateX > -smartBack.ARROW_TRIGGERING_OFFSET,
          -smartBack.STATIC_ACTIVE_TRANSLATE_X
        );
      });

      it("horizontal direction - right", () => {
        smartBack._movement.currentSide = "right";
        smartBack._movement.currentDirections.horizontal = "right";
        const movementTowardsDeactivationFn =
          (smartBack._movement.movementTowardsDeactivation = jest.fn());

        smartBack._movement.movementAlongXHandler(event);

        expect(movementTowardsDeactivationFn).toHaveBeenCalledWith(
          smartBack._movement.translateX + smartBack._movement.variationAlongX
        );
      });
    });

    describe("left side", () => {
      it("horizontal direction - left", () => {
        smartBack._movement.currentSide = "left";
        smartBack._movement.currentDirections.horizontal = "right";
        const movementTowardsActivationFn =
          (smartBack._movement.movementTowardsActivation = jest.fn());

        smartBack._movement.movementAlongXHandler(event);

        expect(movementTowardsActivationFn).toHaveBeenCalledWith(
          smartBack._movement.translateX + smartBack._movement.variationAlongX,
          smartBack._movement.translateX < smartBack.ARROW_TRIGGERING_OFFSET,
          smartBack.STATIC_ACTIVE_TRANSLATE_X
        );
      });

      it("horizontal direction - right", () => {
        smartBack._movement.currentSide = "left";
        smartBack._movement.currentDirections.horizontal = "left";
        const movementTowardsDeactivationFn =
          (smartBack._movement.movementTowardsDeactivation = jest.fn());

        smartBack._movement.movementAlongXHandler(event);

        expect(movementTowardsDeactivationFn).toHaveBeenCalledWith(
          smartBack._movement.translateX - smartBack._movement.variationAlongX
        );
      });
    });

    it("should call movementAlongYHandler", () => {
      smartBack._arrow.isActive = true;
      smartBack._movement.isNeedBreak = false;
      const movementAlongYHandlerFn =
        (smartBack._movement.movementAlongYHandler = jest.fn());

      smartBack._movement.movementAlongXHandler(event);

      expect(movementAlongYHandlerFn).toHaveBeenCalled();
    });

    it("should not call movementAlongYHandler", () => {
      smartBack._arrow.isActive = false;
      smartBack._movement.isNeedBreak = false;
      const movementAlongYHandlerFn =
        (smartBack._movement.movementAlongYHandler = jest.fn());

      smartBack._movement.movementAlongXHandler(event);

      expect(movementAlongYHandlerFn).toHaveBeenCalledTimes(0);
    });
  });

  it("movementAlongYHandler: vertical direction - top", () => {
    smartBack._movement.currentDirections.vertical = "top";
    const prevTranslateY = smartBack._movement.translateY;
    const variationAlongY = smartBack._movement.variationAlongY;

    smartBack._movement.movementAlongYHandler();
    const translateY = smartBack._movement.translateY;

    expect(translateY).toEqual(prevTranslateY - variationAlongY);
  });

  it("movementAlongYHandler: vertical direction - bottom", () => {
    smartBack._movement.currentDirections.vertical = "bottom";
    const prevTranslateY = smartBack._movement.translateY;
    const variationAlongY = smartBack._movement.variationAlongY;

    smartBack._movement.movementAlongYHandler();
    const translateY = smartBack._movement.translateY;

    expect(translateY).toEqual(prevTranslateY + variationAlongY);
  });

  it("movementAlongYHandler: should call updatePosition", () => {
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());

    smartBack._movement.movementAlongYHandler();

    expect(updatePositionFn).toHaveBeenCalled();
  });

  it("movementAlongYHandler: should not decrease variationAlongY", () => {
    const initialVariationAlongY = (smartBack._movement.variationAlongY =
      smartBack._movement.variationLimit - 0.005);

    smartBack._movement.movementAlongYHandler();
    const variationAlongY = smartBack._movement.variationAlongY;

    expect(variationAlongY).toEqual(initialVariationAlongY);
  });

  it("movementAlongYHandler: should decrease variationAlongY", () => {
    const initialVariationAlongY = (smartBack._movement.variationAlongY =
      smartBack._movement.variationLimit + 0.005);

    smartBack._movement.movementAlongYHandler();
    const variationAlongY = smartBack._movement.variationAlongY;
    const expectedVariationAlongY =
      initialVariationAlongY - smartBack._movement.subtrahendValueAlongY;

    expect(variationAlongY).toEqual(expectedVariationAlongY);
  });

  it("movementTowardsActivation: should reset movedToCancelAlongX", () => {
    smartBack._movement.movementTowardsActivation(10, true, 10);
    const movedToCancelAlongX = smartBack._movement.movedToCancelAlongX;

    expect(movedToCancelAlongX).toEqual(0);
  });

  it("movementTowardsActivation: should call setActive", () => {
    const setActiveFn = (smartBack._arrow.setActive = jest.fn());
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());
    smartBack._arrow.isActive = false;

    smartBack._movement.movementTowardsActivation(10, false, 10);

    expect(setActiveFn).toHaveBeenCalled();
    expect(updatePositionFn).toHaveBeenCalledTimes(0);
  });

  it("movementTowardsActivation: should call updatePosition", () => {
    const setActiveFn = (smartBack._arrow.setActive = jest.fn());
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());
    smartBack._arrow.isActive = true;

    smartBack._movement.movementTowardsActivation(10, false, 10);

    expect(setActiveFn).toHaveBeenCalledTimes(0);
    expect(updatePositionFn).toHaveBeenCalled();
  });

  it("movementTowardsDeactivation: should call needBreak", () => {
    const needBreakFn = (smartBack._movement.needBreak = jest.fn());
    const setInactiveFn = (smartBack._arrow.setInactive = jest.fn());
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());
    smartBack._arrow.isActive = false;

    smartBack._movement.movementTowardsDeactivation(10);

    expect(needBreakFn).toHaveBeenCalledTimes(1);
    expect(setInactiveFn).toHaveBeenCalledTimes(0);
    expect(updatePositionFn).toHaveBeenCalledTimes(0);
  });

  it("movementTowardsDeactivation: should call setInactive and needBreak", () => {
    const needBreakFn = (smartBack._movement.needBreak = jest.fn());
    const setInactiveFn = (smartBack._arrow.setInactive = jest.fn());
    smartBack._arrow.isActive = true;
    smartBack._movement.movedToCancelAlongX = smartBack.ARROW_TRIGGERING_OFFSET;

    smartBack._movement.movementTowardsDeactivation(10);

    expect(setInactiveFn).toHaveBeenCalledTimes(1);
    expect(needBreakFn).toHaveBeenCalledTimes(1);
  });

  it("movementTowardsDeactivation: should call updatePosition", () => {
    const needBreakFn = (smartBack._movement.needBreak = jest.fn());
    const setInactiveFn = (smartBack._arrow.setInactive = jest.fn());
    const updatePositionFn = (smartBack._arrow.updatePosition = jest.fn());
    smartBack._arrow.isActive = true;
    smartBack._movement.movedToCancelAlongX =
      smartBack.ARROW_TRIGGERING_OFFSET - 10;

    smartBack._movement.movementTowardsDeactivation(10);

    expect(needBreakFn).toHaveBeenCalledTimes(0);
    expect(setInactiveFn).toHaveBeenCalledTimes(0);
    expect(updatePositionFn).toHaveBeenCalledTimes(1);
  });

  it("needBreak: should set needBreak to true", () => {
    smartBack._movement.needBreak();
    const isNeedBreak = smartBack._movement.isNeedBreak;

    expect(isNeedBreak).toBe(true);
  });
});
