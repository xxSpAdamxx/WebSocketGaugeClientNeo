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

import * as WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import { WebstorageHandler } from "./Webstorage/WebstorageHandler";
import { WebsocketObjectCollection } from "./WebSocketObjectCollection";
import { MeterApplicationOption } from "./options/MeterApplicationOption";
import { ApplicationNavbar } from './reactParts/ApplicationNavbar';
import { StringListLogger } from "./utils/StringListLogger";
import PIXIApplication from "./reactParts/PIXIApplication";

import 'bootstrap/dist/css/bootstrap.min.css'

const VIEWPORT_ATTRIBUTE = "width=device-width, minimal-ui, initial-scale=1.0";

export class MeterApplication {
    private Option = new MeterApplicationOption();
    private Logger = new StringListLogger();
    constructor(option: MeterApplicationOption) {
        this.Option = option;
    }

    public Run(): void {
        const webStorage = new WebstorageHandler();

        const preserveDrawingBuffer = localStorage.getItem("preserveDrawingBuffer") === "true" ? true : false;
        const pixiApp = new PIXI.Application({ width: this.Option.width, height: this.Option.height, preserveDrawingBuffer: preserveDrawingBuffer })
        // Append PIXI.js application to document body
        pixiApp.view.style.width = "100vw";
        pixiApp.view.style.touchAction = "auto";
        pixiApp.view.style.pointerEvents = "none";

        // Set viewport meta-tag
        this.setViewPortMetaTag();
        // Set fullscreen tag for android and ios
        this.setWebAppCapable();

        const webSocketCollection = new WebsocketObjectCollection(this.Logger, this.Option);

        const rootElement = document.getElementById("root");
        ReactDOM.render(
            <Fragment>
            <ApplicationNavbar 
                defaultOptionDialogContent={{host : webStorage.WebsocketServerHome, wsHostSameAsHttpHost : webStorage.WSServerSameAsHttp, pixijsPreserveDrawingBuffer : webStorage.PreserveDrawingBuffer} }
                defaultWSInterval = { webStorage.WSInterval }
                onOptionDialogSet = { c => {
                    webStorage.PreserveDrawingBuffer = c.pixijsPreserveDrawingBuffer;
                    webStorage.WSServerSameAsHttp = c.wsHostSameAsHttpHost;
                    webStorage.WebsocketServerHome = c.host;
                }}
                onWSIntervalDialogSet = {interval => webStorage.WSInterval = interval}
                onFUELTripResetDialogSet = { () => webSocketCollection.FUELTRIPWS.SendReset() }
                logList = {this.Logger.Content}
                websocketStatusList = {webSocketCollection.WebsocketStates}
            />
            <PIXIApplication application={pixiApp} />
            </Fragment>
            , rootElement);

        // Preload Fonts -> textures-> parts
        this.preloadFonts(() => this.preloadTextures(() => this.Option.SetupPIXIMeterPanel(pixiApp, webSocketCollection)));

        webSocketCollection.Run();
    }

    private preloadFonts(callBack: () => void) {
        const webFontFamilyWithoutOverlap = this.Option.PreloadResource.WebFontFamiliyName.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );
        const webFontCSSURLWithoutOverlap = this.Option.PreloadResource.WebFontCSSURL.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );

        // call callBack() without loading fonts if the webFontFamily and webFoutCSSURL contains no elements.
        if (webFontFamilyWithoutOverlap.length === 0 && webFontCSSURLWithoutOverlap.length === 0)
            callBack();

        WebFont.load(
            {
                custom:
                {
                    families: webFontFamilyWithoutOverlap,
                    urls: webFontCSSURLWithoutOverlap
                },
                active: () => { callBack(); }
            }
        );
    }

    private preloadTextures(callBack: () => void) {
        const texturePathWithoutOverlap = this.Option.PreloadResource.TexturePath.Array.filter(
            (x, i, self) => {
                return self.indexOf(x) === i;
            }
        );

        for (let i = 0; i < texturePathWithoutOverlap.length; i++) {
            const texturePath = texturePathWithoutOverlap[i];
            PIXI.Loader.shared.add(texturePath);
        }

        PIXI.Loader.shared.load(() => {
            callBack();
        }
        );
    }

    private setViewPortMetaTag() {
        const metalist = document.getElementsByTagName('meta');
        let hasMeta = false;

        for (let i = 0; i < metalist.length; i++) {
            const name = metalist[i].getAttribute('name');
            if (name && name.toLowerCase() === 'viewport') {
                metalist[i].setAttribute('content', VIEWPORT_ATTRIBUTE);
                hasMeta = true;
                break;
            }
        }
        if (!hasMeta) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', VIEWPORT_ATTRIBUTE);
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }

    private setWebAppCapable(): void {
        {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'apple-mobile-web-app-capable');
            meta.setAttribute('content', 'yes');
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
        {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'mobile-web-app-capable');
            meta.setAttribute('content', 'yes');
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }

}