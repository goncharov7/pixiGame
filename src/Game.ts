import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import { SpriteManager } from './SpriteManager';
import { Score } from './Score';

export class Game {
    private app: PIXI.Application;
    private score: Score;
    private spriteManager: SpriteManager;
    private startTime: number;
    private gameDuration = 60000;
    private spawnInterval = 800;
    private lastSpawnTime: number = 0;

    private scoreText: PIXI.Text;
    private timerText: PIXI.Text;

    constructor() {
        this.app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x565E73});
        document.body.appendChild(this.app.view as HTMLCanvasElement);

        this.score = new Score();
        this.spriteManager = new SpriteManager(this.app, this.score);

        this.startTime = Date.now();

        this.scoreText = new PIXI.Text(`Score: 0`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'right',
        });
        this.scoreText.x = this.app.screen.width - 105;
        this.scoreText.y = 10;

        this.timerText = new PIXI.Text(`Time: 60`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'left',
        });
        this.timerText.x = 10;
        this.timerText.y = 10;

        this.app.stage.addChild(this.scoreText);
        this.app.stage.addChild(this.timerText);

        this.app.ticker.add(() => this.update());
        this.animate();
    }

    private update() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.startTime;

        const remainingTime = Math.max(0, Math.floor((this.gameDuration - elapsed) / 1000));
        this.timerText.text = `Time: ${remainingTime}`;

        this.scoreText.text = `Score: ${this.score.getPoints()}`;

        if (elapsed > this.gameDuration) {
            this.endGame();
            return;
        }

        if (currentTime - this.lastSpawnTime > this.spawnInterval) {
            this.spriteManager.spawnRandomSprite();
            this.lastSpawnTime = currentTime;
        }
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
    }

    private endGame() {
        this.app.ticker.stop();

        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.8);
        overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        overlay.endFill();
        this.app.stage.addChild(overlay);

        const finalText = new PIXI.Text(`Game Over! Your Score: ${this.score.getPoints()}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xFFFFFF,
            align: 'center',
        });
        finalText.x = this.app.screen.width / 2 - finalText.width / 2;
        finalText.y = this.app.screen.height / 2 - finalText.height / 2;

        new TWEEN.Tween(finalText.scale)
            .to({ x: 1.5, y: 1.5 }, 2500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();

        this.app.stage.addChild(finalText);

        const restartButton = new PIXI.Text('Restart', {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xFFFF00,
            align: 'center',
        });
        restartButton.x = this.app.screen.width / 2 - restartButton.width / 2;
        restartButton.y = finalText.y + finalText.height + 20;

        restartButton.interactive = true;
        restartButton.buttonMode = true;

        restartButton.on('pointerdown', () => {
            this.restartGame();
        });

        new TWEEN.Tween(restartButton.scale)
            .to({ x: 1.2, y: 1.2 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.app.stage.addChild(restartButton);

        new TWEEN.Tween(overlay)
            .to({ alpha: 0 }, 2500)
            .start();
    }

    private restartGame() {
        this.score = new Score();
        this.spriteManager = new SpriteManager(this.app, this.score);
        this.startTime = Date.now();
        this.app.stage.removeChildren();
        this.app.stage.addChild(this.scoreText);
        this.app.stage.addChild(this.timerText);
        this.app.ticker.start();
    }
}