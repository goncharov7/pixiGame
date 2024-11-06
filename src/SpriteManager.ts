import * as PIXI from "pixi.js";
import { Score } from "./Score";
import { Tween, Easing } from "@tweenjs/tween.js";
import { SpriteFactory } from "./SpriteFactory";

export class SpriteManager {
    private app: PIXI.Application;
    private score: Score;
    private spriteFactory: SpriteFactory;

    constructor(app: PIXI.Application, score: Score) {
        this.app = app;
        this.score = score;
        this.spriteFactory = new SpriteFactory(app, score);
    }

    public spawnRandomSprite() {
        const sprite = this.spriteFactory.createRandomSprite();
        this.app.stage.addChild(sprite);

        this.animateSprite(sprite);
    }

    private animateSprite(sprite: PIXI.Sprite): void {
        const scaleTween = new Tween(sprite.scale).to({ x: 0, y: 0 }, 2500).easing(Easing.Quadratic.Out).start();

        sprite.interactive = true;
        sprite.buttonMode = true;

        sprite.on("pointerdown", () => {
            sprite.off("pointerdown");
            scaleTween.stop();

            new Tween(sprite)
                .to({ alpha: 0 }, 1000)
                .easing(Easing.Quadratic.Out)
                .onComplete(() => {
                    if (this.app.stage.children.includes(sprite)) {
                        this.app.stage.removeChild(sprite);
                    }
                })
                .start();

            this.score.increment();
        });
    }
}
