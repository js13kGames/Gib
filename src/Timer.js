export default class {
  constructor(timeout, callback, repeating = false) {
    this.timeout = timeout;
    this.callback = callback;
    this.repeating = repeating;

    this.progress = 0;
    this.enabled = true;
  }

  update(deltaTime) {
    if (!this.enabled) {
      return;
    }

    this.progress += deltaTime;

    if (this.progress >= this.timeout) {
      this.callback();

      if (this.repeating) {
        this.progress -= this.timeout;
      } else {
        this.enabled = false;
      }
    }
  }
}
