// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

describe("SmartBack UI", () => {
  it("should be rendered", () => {
    const smartBack = new SmartBack();
    const uiNode = smartBack._ui.uiNode;
    expect(uiNode).not.toBeNull();
  });

  it("should be removed", () => {
    const smartBack = new SmartBack();
    smartBack._ui.remove();
    const uiNode = smartBack._ui.uiNode;
    expect(uiNode).toBeNull();
  });
});
