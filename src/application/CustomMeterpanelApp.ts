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
 
// This is required to webpack font/texture/html files
/// <reference path="../lib/webpackRequire.ts" />

import * as PIXI from "pixi.js";

//Import application base class
import {MeterApplicationBase} from "../lib/MeterAppBase/MeterApplicationBase";

//Import meter parts
import {DigiTachoPanel} from "../parts/DigiTachoPanel/DigiTachoPanel";
import {BoostGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {ThrottleGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
//// Changed from original DigitalMFD-ELM327DemoApp.ts
//import {WaterTempGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";
import {WaterTempGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
// Added
import {MassAirFlowGaugePanel} from "../parts/CircularGauges/FullCircularGaugePanel";
import {BatteryVoltageGaugePanel} from "../parts/CircularGauges/SemiCircularGaugePanel";

//Import enumuator of parameter code
import {OBDIIParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {ReadModeCode} from "../lib/WebSocket/WebSocketCommunication";

//For including entry point html file in webpack
require("./CustomMeterpanelApp.html");

window.onload = function()
{
    const meterapp = new DigitalMFD_ELM327DemoApp(720, 1280);
    meterapp.run();
}

class DigitalMFD_ELM327DemoApp extends MeterApplicationBase
{
    /**
     * Put code to set up websocket communication.
     */
    protected setWebSocketOptions()
    {
        //Enable ELM327 websocket client
        this.IsELM327WSEnabled = true;
        
        this.registerELM327ParameterCode(OBDIIParameterCode.Engine_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Vehicle_Speed, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Throttle_Opening_Angle, ReadModeCode.SLOWandFAST, true);        
        this.registerELM327ParameterCode(OBDIIParameterCode.Coolant_Temperature, ReadModeCode.SLOW, false); 
        this.registerELM327ParameterCode(OBDIIParameterCode.Manifold_Absolute_Pressure, ReadModeCode.SLOWandFAST, true);
        // add
        this.registerELM327ParameterCode(OBDIIParameterCode.Mass_Air_Flow, ReadModeCode.SLOWandFAST, true);
        this.registerELM327ParameterCode(OBDIIParameterCode.Battery_Voltage, ReadModeCode.SLOW, false);
    }
    /**
     * Put code to register resources (texture image files, fonts) to preload.
     */
    protected setTextureFontPreloadOptions()
    {
        this.registerWebFontFamilyNameToPreload(ThrottleGaugePanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(DigiTachoPanel.RequestedFontFamily);
        this.registerWebFontFamilyNameToPreload(BoostGaugePanel.RequestedFontFamily);
    
        this.registerWebFontCSSURLToPreload(ThrottleGaugePanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(DigiTachoPanel.RequestedFontCSSURL);
        this.registerWebFontCSSURLToPreload(BoostGaugePanel.RequestedFontCSSURL);
        
        this.registerTexturePathToPreload(ThrottleGaugePanel.RequestedTexturePath);
        this.registerTexturePathToPreload(DigiTachoPanel.RequestedTexturePath);
        this.registerTexturePathToPreload(BoostGaugePanel.RequestedTexturePath);
    }
    
    /**
     * Put code to setup pixi.js meter panel.
     */
    protected setPIXIMeterPanel()
    {
        // Construct meter panel parts.
        const digiTachoPanel = new DigiTachoPanel();
        digiTachoPanel.position.set(0,0);
        digiTachoPanel.scale.set(1.15);
        
        const boostPanel = new BoostGaugePanel();
        boostPanel.position.set(0,800);
        boostPanel.scale.set(0.85);                
        
        // Add
        const massAirFlowPanel = new MassAirFlowGaugePanel();
        massAirFlowPanel.scale.set(0.85);
        massAirFlowPanel.position.set(360,360);
        
        const waterTempPanel = new WaterTempGaugePanel();
        waterTempPanel.position.set(0,360);
        waterTempPanel.scale.set(0.85);
                
        const throttlePanel = new ThrottleGaugePanel();
        throttlePanel.position.set(360,720);
        throttlePanel.scale.set(0.85);
        
        const batteryVoltPanel = new BatteryVoltageGaugePanel();
        batteryVoltPanel.position.set(360,990);
        batteryVoltPanel.scale.set(0.85);

        // Put meter panel parts to stage.
        this.stage.addChild(digiTachoPanel);
        this.stage.addChild(boostPanel);
        this.stage.addChild(waterTempPanel);
        this.stage.addChild(throttlePanel);
        //Add
        this.stage.addChild(massAirFlowPanel);
        this.stage.addChild(batteryVoltPanel);
        
        // Define ticker method to update meter view (this ticker method will be called every frame).
        this.ticker.add(() => 
        {
            // Take timestamp of animation frame. (This time stamp is needed to interpolate meter sensor reading).
            const timestamp = PIXI.ticker.shared.lastTime;
            // Get sensor information from websocket communication objects.
            const tacho = this.ELM327WS.getVal(OBDIIParameterCode.Engine_Speed, timestamp);
            const speed = this.ELM327WS.getVal(OBDIIParameterCode.Vehicle_Speed, timestamp);
            const neutralSw = false;
            const gearPos = this.calculateGearPosition(tacho, speed, neutralSw);
            const boost = this.ELM327WS.getVal(OBDIIParameterCode.Manifold_Absolute_Pressure, timestamp)  * 0.0101972 - 1 //convert kPa to kgf/cm2 and relative pressure;
            
            const waterTemp = this.ELM327WS.getRawVal(OBDIIParameterCode.Coolant_Temperature);
            const throttle = this.ELM327WS.getVal(OBDIIParameterCode.Throttle_Opening_Angle, timestamp);
            const batteryVolt = this.ELM327WS.getRawVal(OBDIIParameterCode.Battery_Voltage);
            const massAirFlow = this.ELM327WS.getVal(OBDIIParameterCode.Mass_Air_Flow, timestamp);
            
            // Update meter panel value by sensor data.
            digiTachoPanel.Speed = speed;
            digiTachoPanel.Tacho = tacho;
            digiTachoPanel.GearPos = gearPos;
            waterTempPanel.Value = waterTemp;
            throttlePanel.Value = throttle;
            boostPanel.Value = boost;
            batteryVoltPanel.Value = batteryVolt;
            massAirFlowPanel.Value = massAirFlow/10;
       });
    }
}