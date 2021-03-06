import Timer from "./Timer";

export default class {
  constructor(game, input, textLayer, audio) {
    this.game = game;
    this.input = input;
    this.textLayer = textLayer;
    this.audio = audio;

    textLayer.titleText = textLayer.createCenteredSegment(
      8, 'GIB', 256, TEXT_ANIMATED
    );

    textLayer.helpText = textLayer.createCenteredSegment(
      480, 'PRESS START TO BEGIN', 32, TEXT_FLASHING, 600
    );

    this.loaded = false;
    this.started = false;

    this.timer = new Timer(1000);
  }

  update() {
    this.timer.update();

    if (!this.loaded) {
      this.loaded = true;
    }

    if (this.input.justPressed(ACTION_A) && !this.timer.enabled) {
      this.textLayer.titleText = null;
      this.textLayer.helpText = null;

      this.game.start();
    }
  }
}
