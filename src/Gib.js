import SpriteController from "./SpriteController";
import Timer from "./Timer";
import Laser from "./Laser";

export default class extends SpriteController {
  constructor(game, renderer, map, spriteSheet, input, particleSystem,
              textLayer, audio) {
    super(map);

    this.game = game;
    this.renderer = renderer;
    this.spriteSheet = spriteSheet;
    this.input = input;
    this.particleSystem = particleSystem;
    this.textLayer = textLayer;
    this.audio = audio;

    this.abilities = {
      propulsion: false,
      elevation: false,
      excavation: false,
      extermination: false,
      flotation: false
    };

    this.loaded = false;

    this.direction = 0.0;
    this.lastDirection = 0.0;

    this.facing = RIGHT;

    this.lives = 3;
    this.invincible = false;

    this.invincibilityTimer = new Timer(1000, () => {
      this.invincible = false;
    });

    this.invincibilityTimer.enabled = false;

    this.jumps = 0;

    this.movementTimer = new Timer(150, () => {
      this.audio.play('sawtooth', 250, 300, 0.05);
    }, true);

    this.drillingTimer = new Timer(50, () => {
      this.audio.play('sawtooth', 150, 200, 0.05);
    }, true);
  }

  init(sprite) {
    super.init(sprite);

    this.renderer.cameraX = this.x + SPRITE_SIZE / 2.0 - SCREEN_WIDTH / 2.0;
    this.renderer.cameraY = this.y + SPRITE_SIZE / 2.0 - SCREEN_HEIGHT / 2.0;

    this.lastPlatform = this.y;
  }

  update() {
    if (!this.loaded) {
      this.updateLives();

      this.loaded = true;
    }

    const tileLeft = this.tileAt(-1.0, 0.0);
    const tileRight = this.tileAt(1.0, 0.0);
    const tileAbove = this.tileAt(0.0, -1.0);
    const tileBelow = this.tileAt(0.0, 1.0);

    let drilling = false;

    if (tileBelow) {
      this.ay = 0.0;
      this.dy = 0.0;

      if (this.y - this.lastPlatform > 250.0) {
        this.renderer.shake();

        this.audio.play('sawtooth', 50, 150, 0.5);
      }

      this.lastPlatform = this.y;
      this.jumps = 0;
    } else if (tileAbove || (this.dy < 0 && !this.input.pressed(ACTION_A))) {
      this.ay = 0.002;
      this.dy = 0.0;
    } else {
      this.ay = 0.002;
    }

    if (this.input.x < 0.0 && this.abilities.propulsion) {
      if (this.ax > 0.0) {
        this.ax = 0.0;
      }

      if (!tileLeft) {
        this.ax += 0.001 * this.input.x;
      } else {
        this.dx = 0.0;
        this.ax = 0.0;

        if (this.abilities.excavation && this.input.pressed(ACTION_B) &&
            tileLeft.drill) {
          this.renderer.shake(5);
          this.drill(LEFT);
          tileLeft.drill();
          drilling = true;
        }
      }

      this.direction = -1.0;
      this.lastDirection = 0.0;

      this.facing = LEFT;
    } else if (this.input.x > 0.0 && this.abilities.propulsion) {
      if (this.ax < 0.0) {
        this.ax = 0.0;
      }

      if (!tileRight) {
        this.ax += 0.001 * this.input.x;;
      } else {
        this.dx = 0.0;
        this.ax = 0.0;

        if (this.abilities.excavation && this.input.pressed(ACTION_B) &&
            tileRight.drill) {
          this.renderer.shake(5);
          this.drill(RIGHT);
          tileRight.drill();
          drilling = true;
        }
      }

      this.direction = 1.0;
      this.lastDirection = 0.0;

      this.facing = RIGHT;
    } else {
      if (this.direction !== 0.0) {
        this.ax = -this.ax;

        this.lastDirection = this.direction;
        this.direction = 0.0;
      }

      if ((this.lastDirection > 0.0 && this.dx < 0.001) ||
          (this.lastDirection < 0.0 && this.dx > 0.001) ||
          tileLeft || tileRight) {
        this.dx = 0.0;
        this.ax = 0.0;
      }

      if (this.abilities.excavation && this.input.y < 0.0 &&
          this.input.pressed(ACTION_B) && tileAbove && tileAbove.drill) {
        this.renderer.shake(5);
        this.drill(UP);
        tileAbove.drill();
        drilling = true;
      } else if (this.abilities.excavation && this.input.y > 0.0 &&
                 this.input.pressed(ACTION_B) && tileBelow && tileBelow.drill) {
        this.renderer.shake(5);
        this.drill(DOWN);
        tileBelow.drill();
        drilling = true;
      }
    }

    this.drillingTimer.enabled = drilling;
    this.drillingTimer.update();

    if (this.abilities.extermination && this.input.justPressed(ACTION_B) &&
        !drilling) {
      const xOffset = this.facing === RIGHT ? 0 : -40;

      this.spriteSheet.spawnSprite(
        this.x + this.hitboxW / 2 + xOffset, this.y, PROJECTILE_Z, 0.0, 2.0,
        new Laser(this.map, this.facing, this.spriteSheet, this.particleSystem)
      );

      this.audio.play('square', 600, 800, 0.3);
    }

    if (this.ax > 0.002) {
      this.ax = 0.002;
    } else if (this.ax < -0.002) {
      this.ax = -0.002;
    }

    if (this.input.justPressed(ACTION_A) && this.abilities.elevation &&
        (this.ay === 0.0 ||
        (this.abilities.flotation && this.jumps < 2))) {
      this.dy = -0.9;
      this.jumps++;
      this.audio.play('sawtooth', 150, 500, 0.3);
    }

    this.movementTimer.enabled = this.direction !== 0.0 && !drilling;
    this.movementTimer.update();

    super.update();

    if (this.dx < -0.1) {
      this.kickUpDirt(this.x + SPRITE_SIZE - 2, tileBelow);
    } else if (this.dx > 0.1) {
      this.kickUpDirt(this.x + 1, tileBelow);
    }

    this.sprite.frameTimer.timeout = tileBelow ? 100 : 40;
    this.sprite.frameTimer.enabled = this.direction !== 0.0;
    this.sprite.frameDirection = Math.sign(this.direction);

    this.renderer.cameraX = this.x + SPRITE_SIZE / 2.0 - SCREEN_WIDTH / 2.0;
    this.renderer.cameraY = this.y + SPRITE_SIZE / 2.0 - SCREEN_HEIGHT / 2.0;

    this.invincibilityTimer.update();
  }

  updateLives() {
    let text = '';

    for (let i = 0; i < Math.max(3, this.lives); i++) {
      text += this.lives > i ? '<' : '/';
    }

    this.textLayer.livesText = this.textLayer.createSegment(10, 10, text, 32);
  }

  damage() {
    if (this.invincible) {
      return;
    }

    this.invincible = true;
    this.invincibilityTimer.reset();

    this.lives--;
    this.updateLives();

    this.sprite.flash();

    this.audio.play('sawtooth', 100, 200, 0.3);

    if (this.lives === 1) {
      this.audio.speak('WARNING! DAMAGE CRITICAL!');
    }

    this.renderer.shake();

    if (this.lives === 0) {
      this.sprite.disable();

      for (let i = 0; i < 100; i++) {
        this.particleSystem.emitParticle(
          this.left + Math.random() * this.hitboxW,
          this.top + Math.random() * this.hitboxH,
          0.73, 0.73, 0.73,
          (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25,
          700.0
        );
      }

      this.game.over();
    }
  }

  drill(direction) {
    const count = Math.random() * 30;

    let x = 0;
    let y = 0;

    switch (direction) {
    case UP:
      x = this.x + SPRITE_SIZE / 2;
      y = this.y;
      break;
    case DOWN:
      x = this.x + SPRITE_SIZE / 2;
      y = this.y + SPRITE_SIZE;
      break;
    case LEFT:
      x = this.x;
      y = this.y + SPRITE_SIZE / 2;
      break;
    case RIGHT:
      x = this.x + SPRITE_SIZE;
      y = this.y + SPRITE_SIZE / 2;
      break;
    }

    for (let i = 0; i < count; i++) {
      let dx = 0.0;
      let dy = 0.0;

      switch (direction) {
      case UP:
        dx = Math.random() * 0.5 - 0.25;
        dy = Math.random() * 0.25;
        break;
      case DOWN:
        dx = Math.random() * 0.5 - 0.25;
        dy = -Math.random() * 0.25;
        break;
      case LEFT:
        dx = Math.random() * 0.25;
        dy = Math.random() * 0.5 - 0.25;
        break;
      case RIGHT:
        dx = -Math.random() * 0.25;
        dy = Math.random() * 0.5 - 0.25;
        break;
      }

      const type = Math.random() < 0.75;

      const r = type ? 1.0 : 0.93;
      const g = type ? 0.46 : 0.93;
      const b = 0.46;

      this.particleSystem.emitParticle(x, y, r, g, b, dx, dy, 300.0);
    }
  }

  kickUpDirt(x, tileType) {
    if (!tileType) {
      return;
    }

    const count = Math.random() * 2;

    const r = tileType == '1' ? 0.0 : 0.4;
    const g = tileType == '1' ? 0.8 : 0.27;
    const b = tileType == '1' ? 0.33 : 0.0;

    const direction = x < this.x + SPRITE_SIZE / 2 ? -1 : 1;

    for (let i = 0; i < count; i++) {
      this.particleSystem.emitParticle(
        x, this.y + SPRITE_SIZE - 1,
        r, g, b,
        direction * Math.random() * 0.25, -Math.random() * 0.25,
        200.0
      );
    }
  }
}
