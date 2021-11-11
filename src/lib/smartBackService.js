export class SmartBackService {
  constructor(
    options = {},
    vendors = {
      _optionsClass: null,
      _uiClass: null,
      _nodesClass: null,
      _listenersClass: null,
      _listenersHandlingClass: null,
      _arrowClass: null,
      _movementClass: null,
    }
  ) {
    this._options = new vendors._optionsClass(options);

    this.classes = {
      wrapper: "smart-back",
      side: "smart-back__side",
      sideLeft: "smart-back__side--left",
      sideRight: "smart-back__side--right",
    };
    this.leftSideId = "smart_back_side_left";
    this.rightSideId = "smart_back_side_right";
    this.arrowId = "smart_back_arrow";

    this.TRANSITION_DURATION = this._options.validate(
      "transitionDuration",
      140
    );
    this.ARROW_TRIGGERING_OFFSET = this._options.validate(
      "arrowTriggeringOffset",
      2
    );
    this.STATIC_ACTIVE_TRANSLATE_X = this._options.validate(
      "staticActiveTranslateX",
      40
    );
    this.ENABLE_ARROW_MIRRORING = this._options.validate(
      "enableArrowMirroring",
      true
    );
    this.VIBRATION = this._options.validate("vibration", 10);
    this.CALLBACK = this._options.validate(
      "callback",
      history.back.bind(window.history)
    );

    this._ui = vendors._uiClass;
    this._nodes = vendors._nodesClass;
    this._listeners = vendors._listenersClass;
    this._listenersHandling = vendors._listenersHandlingClass;
    this._arrow = vendors._arrowClass;
    this._movement = vendors._movementClass;

    this.render();
  }

  render() {
    this._ui = new this._ui(this);
    this._nodes = new this._nodes(this);
    this._listeners = new this._listeners(this);
    this._listenersHandling = new this._listenersHandling(this);
    this._arrow = new this._arrow(this);
    this._movement = new this._movement(this);
  }

  destroy() {
    this._ui.remove();
    this._listenersHandling.removeListeners();
    this._listenersHandling.removeAdditionalListeners();
  }
}
