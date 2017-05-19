/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
 
/// <reference path="../../lib/webpackRequire.ts" />

import {AnalogMeterCluster} from "../../parts/AnalogMeterCluster/AnalogMeterCluster";
import * as PIXI from "pixi.js";

import {DefiParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMParameterCode} from "../../lib/WebSocket/WebSocketCommunication";
import {SSMSwitchCode} from "../../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../../lib/WebSocket/WebSocketCommunication";

import {MeterApplication} from "../../lib/MeterApplication";

require("../AnalogMeterClusterApp.html");

window.onload = function()
{
    const meterapp = new AnalogMeterClusterApp();
    meterapp.run();
}

class AnalogMeterClusterApp extends MeterApplication
{
    protected setWebSocketOptions()
    {
        this.IsDefiWSEnabled = true;
        this.IsSSMWSEnabled = true;
        this.IsFUELTRIPWSEnabled = true;
        
        this.registerDefiParameterCode(DefiParameterCode.Engine_Speed, true);
        this.registerDefiParameterCode(DefiParameterCode.Manifold_Absolute_Pressure, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.FAST, true);
        this.registerSSMParameterCode(SSMParameterCode.Vehicle_Speed, ReadModeCode.SLOW, true);
        this.registerSSMParameterCode(SSMParameterCode.Coolant_Temperature, ReadModeCode.SLOW, true);
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.FAST, true);
        this.registerSSMParameterCode(SSMSwitchCode.getNumericCodeFromSwitchCode(SSMSwitchCode.Neutral_Position_Switch), ReadModeCode.SLOW, true);
    }
    
    protected setTextureFontPreloadOptions()
    {
        this.WebFontFamiliyNameToPreload = this.WebFontFamiliyNameToPreload.concat(AnalogMeterCluster.RequestedFontFamily);
        this.WebFontCSSURLToPreload = this.WebFontCSSURLToPreload.concat(AnalogMeterCluster.RequestedFontCSSURL);
        this.TexturePathToPreload = this.TexturePathToPreload.concat(AnalogMeterCluster.RequestedTexturePath);
    }
    
    protected setPIXIMeterPanel() : void
    {
        const app = new PIXI.Application(1366,768);
        document.body.appendChild(app.view);

        const meterCluster = new AnalogMeterCluster();
        app.stage.addChild(meterCluster);

        app.ticker.add(() => {
            const timestamp = PIXI.ticker.shared.lastTime;
            const tacho = this.DefiWS.getVal(DefiParameterCode.Engine_Speed, timestamp);
            const boost = this.DefiWS.getVal(DefiParameterCode.Manifold_Absolute_Pressure, timestamp);
            const speed = this.SSMWS.getVal(SSMParameterCode.Vehicle_Speed,timestamp);
            const waterTemp = this.SSMWS.getRawVal(SSMParameterCode.Coolant_Temperature);
            const trip = this.FUELTRIPWS.getTotalTrip();
            const fuel = this.FUELTRIPWS.getTotalGas();
            const gasMilage = this.FUELTRIPWS.getMomentGasMilage(timestamp);
            const neutralSw = this.SSMWS.getSwitchFlag(SSMSwitchCode.Neutral_Position_Switch);
            
            const geasPos = this.calcGearPosition(tacho, speed, neutralSw);
            
            meterCluster.Tacho = tacho;
            meterCluster.Boost = boost; 
            meterCluster.Speed = speed;
            meterCluster.WaterTemp = waterTemp;
            meterCluster.GearPos = geasPos;
            meterCluster.Trip = trip;
            meterCluster.Fuel = fuel;
            meterCluster.GasMilage = gasMilage;
        });
    }
}