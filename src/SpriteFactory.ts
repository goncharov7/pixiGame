import * as PIXI from "pixi.js";
import { Score } from "./Score";

export class SpriteFactory {
    private app: PIXI.Application;
    private score: Score;

    constructor(app: PIXI.Application, score: Score) {
        this.app = app;
        this.score = score;
    }

    public createRandomSprite(): PIXI.Sprite {
        const types = ["triangle", "circle", "square"];
        const type = types[Math.floor(Math.random() * types.length)];

        const sprite = this.getSprite(type);

        const spriteWidth = sprite.width;
        const spriteHeight = sprite.height;

        const paddingTop = 60;
        const paddingLeft = 20;
        const paddingRight = 20;

        const x = Math.random() * (this.app.screen.width - spriteWidth - paddingLeft - paddingRight) + paddingLeft;
        const y = Math.random() * (this.app.screen.height - spriteHeight - paddingTop) + paddingTop;

        sprite.position.set(x, y);
        sprite.anchor.set(0.5, 0.5);
        sprite.alpha = 1;

        return sprite;
    }

    private getSprite(type: string): PIXI.Sprite {
        const graphics = new PIXI.Graphics();
        switch (type) {
            case "triangle":
                graphics.beginFill(0x00ff00).drawPolygon([0, 0, 100, 0, 50, 100]).endFill();
                break;
            case "circle":
                graphics.beginFill(0xff0000).drawCircle(50, 50, 50).endFill(); // Удвоение радиуса и сдвиг
                break;
            case "square":
                graphics.beginFill(0x0000ff).drawRect(0, 0, 100, 100).endFill(); // Удвоение ширины и высоты
                break;
        }

        const texture = this.app.renderer.generateTexture(graphics);
        return new PIXI.Sprite(texture);
    }
}
