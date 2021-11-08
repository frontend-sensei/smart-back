import { SmartBackService } from "./smartBackService";

import { SmartBackOptions } from "./smartBackOptions";
import { SmartBackUI } from "./smartBackUI";
import { SmartBackNodes } from "./smartBackNodes";
import { SmartBackListeners } from "./smartBackListeners";
import { SmartBackListenersHandling } from "./smartBackListenersHandling";
import { SmartBackArrow } from "./smartBackArrow";
import { SmartBackMovement } from "./smartBackMovement";

const vendors = {
  _optionsClass: SmartBackOptions,
  _uiClass: SmartBackUI,
  _nodesClass: SmartBackNodes,
  _listenersClass: SmartBackListeners,
  _listenersHandlingClass: SmartBackListenersHandling,
  _arrowClass: SmartBackArrow,
  _movementClass: SmartBackMovement,
};

export class SmartBack {
  constructor(options) {
    return new SmartBackService(options, vendors);
  }
}
