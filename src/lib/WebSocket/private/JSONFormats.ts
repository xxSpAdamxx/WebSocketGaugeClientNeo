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


export interface IJSONMessage
{
    mode : string;
}

export class ResetJSONMessage implements IJSONMessage
{
    public mode : string = "RESET";
}

export class VALJSONMessage implements IJSONMessage
{
    public mode:string = "VAL";
    public val : {[key : string] : number;};
}

export class StringVALJSONMessage implements IJSONMessage
{
    public mode:string = "VAL";
    public val : {[key : string] : string;}; 
}


export class ErrorJSONMessage implements IJSONMessage
{
    public mode: string = "ERR";
    public msg: string;
}

export class ResponseJSONMessage implements IJSONMessage
{
    public mode: string = "RES";
    public msg: string;
}

export class MomentFuelTripJSONMessage implements IJSONMessage
{
    public mode: string = "MOMENT_FUELTRIP";
    public moment_gasmilage : number;
    public total_gas : number;
    public total_trip : number;
    public total_gasmilage : number;
}

export class SectFuelTripJSONMessage implements IJSONMessage
{
    public mode: string = "SECT_FUELTRIP";
    public sect_span: number;
    public sect_trip : number[];
    public sect_gas : number[];
    public sect_gasmilage : number[];
}

export class SectSpanJSONMessage implements IJSONMessage
{
    public mode : string = "SECT_SPAN";
    public sect_span : number;
}

export class SectStoreMaxJSONMessage implements IJSONMessage
{
    public mode : string = "SECT_STOREMAX";
    public storemax : number;
}

export class SendWSSendJSONMessage implements IJSONMessage
{
    public mode : string;
    public code : string;
    public flag : boolean;
}
export class SendWSIntervalJSONMessage implements IJSONMessage
{
    public mode : string;
    public interval : number;
}
export class SendCOMReadJSONMessage implements IJSONMessage
{
    mode : string;
    code : string;
    read_mode : string;
    flag : boolean;
}
export class SendSlowReadIntervalJSONMessage implements IJSONMessage
{
    mode : string;
    interval : number;
}

