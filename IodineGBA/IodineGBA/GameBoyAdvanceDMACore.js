"use strict";
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2014 Grant Galitz
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 * The full license is available at http://www.gnu.org/licenses/gpl.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 */
function GameBoyAdvanceDMA(IOCore) {
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceDMA.prototype.DMA_REQUEST_TYPE = {
    PROHIBITED:        0,
    IMMEDIATE:         0x1,
    V_BLANK:           0x2,
    H_BLANK:           0x4,
    FIFO_A:            0x8,
    FIFO_B:            0x10,
    DISPLAY_SYNC:      0x20
}
GameBoyAdvanceDMA.prototype.initialize = function () {
    this.channels = [
        new GameBoyAdvanceDMA0(this),
        new GameBoyAdvanceDMA1(this),
        new GameBoyAdvanceDMA2(this),
        new GameBoyAdvanceDMA3(this)
    ];
    this.currentMatch = -1;
    this.fetch = 0;
    this.currentDMA = null;
}
GameBoyAdvanceDMA.prototype.writeDMASource0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource2 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource2(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMASource3 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMASource3(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination2 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination2(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMADestination3 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMADestination3(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAWordCount0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAWordCount0(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAWordCount1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAWordCount1(data | 0);
}
GameBoyAdvanceDMA.prototype.writeDMAControl0 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAControl0(data | 0);
}
GameBoyAdvanceDMA.prototype.readDMAControl0 = function (dmaChannel) {
    dmaChannel = dmaChannel | 0;
    return this.channels[dmaChannel | 0].readDMAControl0() | 0;
}
GameBoyAdvanceDMA.prototype.writeDMAControl1 = function (dmaChannel, data) {
    dmaChannel = dmaChannel | 0;
    data = data | 0;
    this.channels[dmaChannel | 0].writeDMAControl1(data | 0);
}
GameBoyAdvanceDMA.prototype.readDMAControl1 = function (dmaChannel) {
    dmaChannel = dmaChannel | 0;
    return this.channels[dmaChannel | 0].readDMAControl1() | 0;
}
GameBoyAdvanceDMA.prototype.getCurrentFetchValue = function () {
    return this.fetch | 0;
}
GameBoyAdvanceDMA.prototype.soundFIFOARequest = function () {
    this.channels[1].requestDMA(this.DMA_REQUEST_TYPE.FIFO_A | 0);
}
GameBoyAdvanceDMA.prototype.soundFIFOBRequest = function () {
    this.channels[2].requestDMA(this.DMA_REQUEST_TYPE.FIFO_B | 0);
}
GameBoyAdvanceDMA.prototype.gfxHBlankRequest = function () {
    this.requestDMA(this.DMA_REQUEST_TYPE.H_BLANK | 0);
}
GameBoyAdvanceDMA.prototype.gfxVBlankRequest = function () {
    this.requestDMA(this.DMA_REQUEST_TYPE.V_BLANK | 0);
}
GameBoyAdvanceDMA.prototype.gfxDisplaySyncRequest = function () {
    this.channels[3].requestDMA(this.DMA_REQUEST_TYPE.DISPLAY_SYNC | 0);
}
GameBoyAdvanceDMA.prototype.gfxDisplaySyncKillRequest = function () {
    this.channels[3].enabled &= ~this.DMA_REQUEST_TYPE.DISPLAY_SYNC;
    this.update();
}
GameBoyAdvanceDMA.prototype.requestDMA = function (DMAType) {
    DMAType = DMAType | 0;
    this.channels[0].requestDMA(DMAType | 0);
    this.channels[1].requestDMA(DMAType | 0);
    this.channels[2].requestDMA(DMAType | 0);
    this.channels[3].requestDMA(DMAType | 0);
}
GameBoyAdvanceDMA.prototype.update = function () {
    var lowestDMAFound = 4;
    for (var dmaPriority = 0; (dmaPriority | 0) < 4; dmaPriority = ((dmaPriority | 0) + 1) | 0) {
        if ((this.channels[dmaPriority | 0].enabled & this.channels[dmaPriority | 0].pending) > 0) {
            lowestDMAFound = dmaPriority | 0;
            break;
        }
    }
    if ((lowestDMAFound | 0) < 4) {
        //Found an active DMA:
        if ((this.currentMatch | 0) == -1) {
            this.IOCore.flagDMA();
        }
        if ((this.currentMatch | 0) != (lowestDMAFound | 0)) {
            //Re-broadcasting on address bus, so non-seq:
            this.IOCore.wait.NonSequentialBroadcast();
            this.currentMatch = lowestDMAFound | 0;
            //Get the current active DMA:
            this.currentDMA = this.channels[this.currentMatch & 0x3];
        }
    }
    else if ((this.currentMatch | 0) != -1) {
        //No active DMA found:
        this.currentMatch = -1;
        this.IOCore.deflagDMA();
        this.IOCore.updateCoreSpill();
    }
}
GameBoyAdvanceDMA.prototype.perform = function () {
    //Call the correct channel to process:
    this.currentDMA.handleDMACopy();
}
GameBoyAdvanceDMA.prototype.nextEventTime = function () {
    var clocks = this.channels[0].nextEventTime() | 0;
    var workbench = this.channels[1].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.channels[2].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    workbench = this.channels[3].nextEventTime() | 0;
    if ((clocks | 0) >= 0) {
        if ((workbench | 0) >= 0) {
            clocks = Math.min(clocks | 0, workbench | 0) | 0;
        }
    }
    else {
        clocks = workbench | 0;
    }
    return clocks | 0;
}