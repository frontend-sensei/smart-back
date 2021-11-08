// @ts-nocheck
import { SmartBack } from "../lib/smartBack";

describe("SmartBack Nodes", () => {
  it("should return side nodes", () => {
    const smartBack = new SmartBack();
    const sideNodes = smartBack._nodes.getSideNodes();
    const leftNode = sideNodes.left;
    const rightNode = sideNodes.right;
    expect(leftNode).not.toBeNull();
    expect(rightNode).not.toBeNull();
  });

  it("should return arrow node", () => {
    const smartBack = new SmartBack();
    const arrowNode = smartBack._nodes.getArrowNode();
    expect(arrowNode).not.toBeNull();
  });

  it("should save nodes", () => {
    const smartBack = new SmartBack();
    smartBack._nodes.getNodes();
    const sideNodes = smartBack._nodes.sideNodes;
    const arrowNode = smartBack._nodes.arrowNode;
    expect(sideNodes).not.toBeNull();
    expect(arrowNode).not.toBeNull();
  });
});
