import { Tween, Easing } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';

export function animateScale(sprite: PIXI.Sprite, duration: number) {
    new Tween(sprite.scale)
        .to({ x: 0, y: 0 }, duration)
        .easing(Easing.Quadratic.Out)
        .start();
}

export function animateOpacity(sprite: PIXI.Sprite, duration: number) {
    new Tween(sprite)
        .to({ alpha: 0 }, duration)
        .easing(Easing.Quadratic.Out)
        .onComplete(() => {
            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
        })
        .start();
}
