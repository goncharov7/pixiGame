import * as PIXI from 'pixi.js';

declare const VERSION: string;

declare module 'pixi.js' {
    interface Sprite {
        buttonMode?: boolean;
    }
}