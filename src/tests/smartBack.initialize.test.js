// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

describe("SmartBack", () => {
  it("should renders without options", () => {
    const smartBack = new SmartBack();
    expect(smartBack).toMatchSnapshot();
  });

  it("should renders with options", () => {
    const options = {
      transitionDuration: "150",
      arrowTriggeringOffset: "10",
      staticActiveTranslateX: "50",
      enableArrowMirroring: false,
      callback: () => console.log("Done!"),
    };
    const smartBack = new SmartBack(options);
    expect(smartBack).toMatchSnapshot();
  });
});
