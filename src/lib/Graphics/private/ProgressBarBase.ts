/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {Gauge1DOptions} from './GaugeBase'
import {Gauge1D} from './GaugeBase'

export class ProgressBarOptions extends Gauge1DOptions
{
    public Texture: PIXI.Texture;
    constructor()
    {
        super();
    }
}

export abstract class ProgressBar extends Gauge1D
{
    private progressBarOptions: ProgressBarOptions;
    private sprite : PIXI.Sprite;
    private spriteMask : PIXI.Graphics;

    constructor(options?: ProgressBarOptions)
    {
        let progressBarOptions: ProgressBarOptions;
        if (!(options instanceof ProgressBarOptions))
        {
            progressBarOptions = new ProgressBarOptions();
        }
        else
        {
            progressBarOptions = options;
        }
        super(progressBarOptions);
        this.progressBarOptions = progressBarOptions;

        this.sprite = new PIXI.Sprite();
        this.spriteMask = new PIXI.Graphics();

        //Assign mask to sprite
        this.sprite.mask = this.spriteMask;            
        //Assign texture to sprite
        this.sprite.texture = this.progressBarOptions.Texture;

        //Assign spirite and mask to container
        super.addChild(this.sprite);
        super.addChild(this.spriteMask);
    }

    get Texture(): PIXI.Texture {return this.progressBarOptions.Texture; }
    set Texture(val: PIXI.Texture) 
    {
        this.progressBarOptions.Texture = val;
        this.sprite.texture = this.progressBarOptions.Texture;
    }

    protected get SpriteMask(): PIXI.Graphics { return this.spriteMask; }
    protected get Sprite(): PIXI.Sprite { return this.sprite; }
}
