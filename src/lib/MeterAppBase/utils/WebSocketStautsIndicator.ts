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

import { IStatusIndicator } from "../obsolete/interfaces/IStatusIndicator";
import { WebsocketConnectionStatus } from "../WebsocketAppBackend/WebsocketConnectionStatus";

export class WebSocketStatusIndicator implements IStatusIndicator {
    private status = WebsocketConnectionStatus.Closed;
    private enabled = false;

    public get IndicatorState(): { isEnabled: boolean, status: WebsocketConnectionStatus } { return { isEnabled: this.enabled, status: this.status } }

    public get Status(): WebsocketConnectionStatus { return this.status }
    public get Enabled(): boolean { return this.enabled }

    SetEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
    SetStatus(status: WebsocketConnectionStatus): void {
        this.status = status;
    }
}