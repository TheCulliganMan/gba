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
function GameBoyAdvanceWait(IOCore) {
    this.IOCore = IOCore;
    this.memory = this.IOCore.memory;
}
GameBoyAdvanceWait.prototype.GAMEPAKWaitStateTable = [
    5, 4, 3, 9
];
GameBoyAdvanceWait.prototype.initialize = function () {
    this.WRAMConfiguration = 0xD000020;     //WRAM configuration control register current data.
    this.WRAMWaitState = 3;                 //External WRAM wait state.
    this.SRAMWaitState = 5;                 //SRAM wait state.
    this.nonSequential = 0x100;             //Non-sequential access bit-flag.
    this.nonSequentialROM = 0;              //Non-sequential access bit-flag for ROM prebuffer bug emulation.
    this.nonSequentialPrebuffer = 0x100;    //Non-sequential access bit-flag for ROM prebuffer emulation.
    this.romPrebufferContinued = 0x100;     //Non-sequential access bit-flag for ROM prebuffer emulation.
    this.ROMPrebuffer = 0;                  //Tracking of the size of the prebuffer cache.
    this.prebufferClocks = 0;               //Tracking clocks for prebuffer cache.
    this.WAITCNT0 = 0;                      //WAITCNT0 control register data.
    this.WAITCNT1 = 0;                      //WAITCNT1 control register data.
    this.POSTBOOT = 0;                      //POSTBOOT control register data.
    this.isRendering = 1;                   //Are we doing memory during screen draw?
    this.isOAMRendering = 1;                //Are we doing memory during OAM draw?
    //Create the wait state address translation cache:
    this.waitStateClocks = getUint8Array(0x200);
    this.waitStateClocksFull = getUint8Array(0x200);
    //Wait State 0:
    //Non-Synchronous:
    this.waitStateClocks[0x108] = 5;
    this.waitStateClocks[0x109] = 5;
    //Synchronous:
    this.waitStateClocks[0x8] = 3;
    this.waitStateClocks[0x9] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x108] = 8;
    this.waitStateClocksFull[0x109] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0x8] = 6;
    this.waitStateClocksFull[0x9] = 6;
    //Wait State 1:
    //Non-Synchronous:
    this.waitStateClocks[0x10A] = 5;
    this.waitStateClocks[0x10B] = 5;
    //Synchronous:
    this.waitStateClocks[0xA] = 3;
    this.waitStateClocks[0xB] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x10A] = 8;
    this.waitStateClocksFull[0x10B] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0xA] = 6;
    this.waitStateClocksFull[0xB] = 6;
    //Wait State 2:
    //Non-Synchronous:
    this.waitStateClocks[0x10C] = 5;
    this.waitStateClocks[0x10D] = 5;
    //Synchronous:
    this.waitStateClocks[0xC] = 3;
    this.waitStateClocks[0xD] = 3;
    //Non-Synchronous Full:
    this.waitStateClocksFull[0x10C] = 8;
    this.waitStateClocksFull[0x10D] = 8;
    //Synchronous Full:
    this.waitStateClocksFull[0xC] = 6;
    this.waitStateClocksFull[0xD] = 6;
    //Initialize out some dynamic references:
    this.getROMRead16 = this.getROMRead16NoPrefetch;
    this.getROMRead32 = this.getROMRead32NoPrefetch;
    this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
    this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
}
GameBoyAdvanceWait.prototype.writeWAITCNT0 = function (data) {
    data = data | 0;
    this.SRAMWaitState = this.GAMEPAKWaitStateTable[data & 0x3] | 0;
    this.waitStateClocks[0x108] = this.waitStateClocks[0x109] = this.GAMEPAKWaitStateTable[(data >> 2) & 0x3] | 0;
    this.waitStateClocks[0x8] = this.waitStateClocks[0x9] =  ((data & 0x10) == 0x10) ? 0x2 : 0x3;
    this.waitStateClocksFull[0x8] = this.waitStateClocksFull[0x9] = ((((this.waitStateClocks[0x8] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocks[0x10A] = this.waitStateClocks[0x10B] = this.GAMEPAKWaitStateTable[(data >> 5) & 0x3] | 0;
    this.waitStateClocks[0xA] = this.waitStateClocks[0xB] =  (data > 0x7F) ? 0x2 : 0x5;
    this.waitStateClocksFull[0xA] = this.waitStateClocksFull[0xB] = ((((this.waitStateClocks[0xA] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocksFull[0x108] = this.waitStateClocksFull[0x109] = ((this.waitStateClocks[0x108] | 0) + (this.waitStateClocks[0x8] | 0) - 1) | 0;
    this.waitStateClocksFull[0x10A] = this.waitStateClocksFull[0x10B] = ((this.waitStateClocks[0x10A] | 0) + (this.waitStateClocks[0xA] | 0) - 1) | 0;
    this.WAITCNT0 = data | 0;
}
GameBoyAdvanceWait.prototype.readWAITCNT0 = function () {
    return this.WAITCNT0 | 0;
}
GameBoyAdvanceWait.prototype.writeWAITCNT1 = function (data) {
    data = data | 0;
    this.waitStateClocks[0x10C] = this.waitStateClocks[0x10D] = this.GAMEPAKWaitStateTable[data & 0x3] | 0;
    this.waitStateClocks[0xC] = this.waitStateClocks[0xD] =  ((data & 0x4) == 0x4) ? 0x2 : 0x9;
    this.waitStateClocksFull[0xC] = this.waitStateClocksFull[0xD] = ((((this.waitStateClocks[0xC] | 0) - 1) << 1) + 1) | 0;
    this.waitStateClocksFull[0x10C] = this.waitStateClocksFull[0x10D] = ((this.waitStateClocks[0x10C] | 0) + (this.waitStateClocks[0xC] | 0) - 1) | 0;
    if ((data & 0x40) == 0) {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
        this.getROMRead16 = this.getROMRead16NoPrefetch;
        this.getROMRead32 = this.getROMRead32NoPrefetch;
        this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
        this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
    }
    else {
        this.getROMRead16 = this.getROMRead16Prefetch;
        this.getROMRead32 = this.getROMRead32Prefetch;
        this.CPUInternalCyclePrefetch = this.multiClock;
        this.CPUInternalSingleCyclePrefetch = this.singleClock;
        this.nonSequentialROM = 0;
        this.nonSequentialPrebuffer = 0x100;
        this.romPrebufferContinued = 0x100;
    }
    this.WAITCNT1 = data & 0x5F;
}
GameBoyAdvanceWait.prototype.readWAITCNT1 = function () {
    return this.WAITCNT1 | 0;
}
GameBoyAdvanceWait.prototype.writePOSTBOOT = function (data) {
    this.POSTBOOT = data | 0;
}
GameBoyAdvanceWait.prototype.readPOSTBOOT = function () {
    return this.POSTBOOT | 0;
}
GameBoyAdvanceWait.prototype.writeHALTCNT = function (data) {
    data = data | 0;
    //HALT/STOP mode entrance:
    if ((data & 0x80) == 0) {
        //Halt:
        this.IOCore.flagHalt();
    }
    else {
        //Stop:
        this.IOCore.flagStop();
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    switch (address & 0x3) {
        case 0:
            this.memory.remapWRAM(data & 0x21);
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF00) | data;
            break;
        case 1:
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF00FF) | (data << 8);
            break;
        case 2:
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFF00FFFF) | (data << 16);
            break;
        default:
            this.WRAMWaitState = (0x10 - (data & 0xF)) | 0;
            this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF) | (data << 24);
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    if ((address & 0x2) == 0) {
        this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF0000) | (data & 0xFFFF);
        this.memory.remapWRAM(data & 0x21);
    }
    else {
        this.WRAMConfiguration = (data << 16) | (this.WRAMConfiguration & 0xFFFF);
        this.WRAMWaitState = (0x10 - ((data >> 8) & 0xF)) | 0;
    }
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM32 = function (data) {
    data = data | 0;
    this.WRAMConfiguration = data | 0;
    this.WRAMWaitState = (0x10 - ((data >> 24) & 0xF)) | 0;
    this.memory.remapWRAM(data & 0x21);
}
GameBoyAdvanceWait.prototype.readConfigureWRAM8 = function (address) {
    address = address | 0;
    var data = 0;
    switch (address & 0x3) {
        case 0:
            data = this.WRAMConfiguration & 0x2F;
            break;
        case 3:
            data = this.WRAMConfiguration >>> 24;
    }
    return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM16 = function (address) {
    address = address | 0;
    var data = 0;
    if ((address & 0x2) == 0) {
        data = this.WRAMConfiguration & 0x2F;
    }
    else {
        data = (this.WRAMConfiguration >> 16) & 0xFF00;
    }
    return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM32 = function () {
    return this.WRAMConfiguration & 0xFF00002F;
}
GameBoyAdvanceWait.prototype.CPUInternalCycleNoPrefetch = function (clocks) {
    clocks = clocks | 0;
    //Clock for idle CPU time:
    this.IOCore.updateCore(clocks | 0);
    //Prebuffer bug:
    this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.CPUInternalSingleCycleNoPrefetch = function () {
    //Clock for idle CPU time:
    this.IOCore.updateCoreSingle();
    //Not enough time for prebuffer buffering, so skip it.
    //Prebuffer bug:
    this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.checkPrebufferBug = function () {
    //Issue a non-sequential cycle for the next read if we did an I-cycle:
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000) {
        this.nonSequentialROM = 0x100;
    }
}
GameBoyAdvanceWait.prototype.check128kAlignmentBug = function (address) {
    address = address | 0;
    if ((address & 0x1FFFF) == 0) {
        this.NonSequentialBroadcast();
    }
}
GameBoyAdvanceWait.prototype.prefetchROMInRAM = function (address) {
    address = address | 0;
    while ((this.prebufferClocks | 0) >= (this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0)) {
        if ((this.ROMPrebuffer | 0) == 8) {
            this.prebufferClocks = 0;
            break;
        }
        else {
            this.prebufferClocks = ((this.prebufferClocks | 0) - (this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0)) | 0;
            this.ROMPrebuffer = ((this.ROMPrebuffer | 0) + 1) | 0;
            this.romPrebufferContinued = 0;
            this.nonSequentialPrebuffer = 0;
            this.nonSequential = 0;
        }
    }
}
GameBoyAdvanceWait.prototype.multiClock = function (clocks) {
    clocks = clocks | 0;
    this.IOCore.updateCore(clocks | 0);
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000 && (this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + (clocks | 0)) | 0;
    }
    else {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
    }
}
GameBoyAdvanceWait.prototype.singleClock = function () {
    this.IOCore.updateCoreSingle();
    var address = this.IOCore.cpu.registers[15] | 0;
    if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000 && (this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
    else {
        this.ROMPrebuffer = 0;
        this.prebufferClocks = 0;
    }
}
GameBoyAdvanceWait.prototype.doZeroWait16 = function () {
    //Check for ROM prefetching:
    //We were already in ROM, so if prefetch do so as sequential:
    //Only case for non-sequential ROM prefetch is invalid anyways:
    this.ROMPrebuffer = ((this.ROMPrebuffer | 0) - 1) | 0;
    //Clock for fetch time:
    this.IOCore.updateCoreSingle();
    if ((this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
}
GameBoyAdvanceWait.prototype.doZeroWait32 = function () {
    //Check for ROM prefetching:
    //We were already in ROM, so if prefetch do so as sequential:
    //Only case for non-sequential ROM prefetch is invalid anyways:
    this.ROMPrebuffer = ((this.ROMPrebuffer | 0) - 2) | 0;
    //Clock for fetch time:
    this.IOCore.updateCoreSingle();
    if ((this.prebufferClocks | 0) < 0xFF) {
        this.prebufferClocks = ((this.prebufferClocks | 0) + 1) | 0;
    }
}
GameBoyAdvanceWait.prototype.getROMRead16Prefetch = function (address) {
    //Caching enabled:
    address = address | 0;
    this.prefetchROMInRAM(address | 0);
    if ((this.ROMPrebuffer | 0) > 0) {
        //Cache hit:
        this.doZeroWait16();
    }
    else {
        //Cache is empty:
        this.IOCore.updateCore(((this.waitStateClocks[address | this.nonSequentialPrebuffer] | 0) - (this.prebufferClocks | 0)) | 0);
        this.romPrebufferContinued = 0;
        this.prebufferClocks = 0;
        this.nonSequential = 0;
        this.nonSequentialPrebuffer = 0;
    }
}
GameBoyAdvanceWait.prototype.getROMRead16NoPrefetch = function (address) {
    //Caching disabled:
    address = address | 0;
    this.IOCore.updateCore(this.waitStateClocks[address | this.nonSequential | this.nonSequentialROM] | 0);
    this.prebufferClocks = 0;
    this.nonSequentialROM = 0;
    this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.getROMRead32Prefetch = function (address) {
    //Caching enabled:
    address = address | 0;
    this.prefetchROMInRAM(address | 0);
    switch (this.ROMPrebuffer | 0) {
        case 0:
            //Cache miss:
            this.IOCore.updateCore(((this.waitStateClocksFull[address | this.nonSequentialPrebuffer] | 0) - (this.prebufferClocks | 0)) | 0);
            this.romPrebufferContinued = 0;
            this.prebufferClocks = 0;
            this.nonSequential = 0;
            this.nonSequentialPrebuffer = 0;
            break;
        case 1:
            //Partial miss if only 16 bits out of 32 bits stored:
            this.IOCore.updateCore(((this.waitStateClocks[address & 0xFF] | 0) - (this.prebufferClocks | 0)) | 0);
            this.prebufferClocks = 0;
            this.ROMPrebuffer = 0;
            break;
        default:
            //Cache hit:
            this.doZeroWait32();
    }
}
GameBoyAdvanceWait.prototype.getROMRead32NoPrefetch = function (address) {
    //Caching disabled:
    address = address | 0;
    this.IOCore.updateCore(this.waitStateClocksFull[address | this.nonSequential | this.nonSequentialROM] | 0);
    this.prebufferClocks = 0;
    this.nonSequentialROM = 0;
    this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcast = function () {
    this.nonSequential = 0x100;
    this.nonSequentialPrebuffer = 0x100 & this.romPrebufferContinued;
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcastClear = function () {
    this.ROMPrebuffer = 0;
    this.prebufferClocks = 0;
    this.nonSequential = 0x100;
    this.nonSequentialPrebuffer = 0x100;
    this.romPrebufferContinued = 0x100;
}
GameBoyAdvanceWait.prototype.WRAMAccess = function () {
    this.multiClock(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess16CPU = function () {
    this.IOCore.updateCore(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess32 = function () {
    this.multiClock(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.WRAMAccess32CPU = function () {
    this.IOCore.updateCore(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.ROMAccess = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.IOCore.updateCore(this.waitStateClocks[(address >> 24) | this.nonSequential] | 0);
    this.nonSequential = 0;
    this.romPrebufferContinued = 0x100;
    this.nonSequentialPrebuffer = 0x100;
}
GameBoyAdvanceWait.prototype.ROMAccess16CPU = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.getROMRead16(address >> 24);
}
GameBoyAdvanceWait.prototype.ROMAccess32 = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.IOCore.updateCore(this.waitStateClocksFull[(address >> 24) | this.nonSequential] | 0);
    this.nonSequential = 0;
    this.romPrebufferContinued = 0x100;
    this.nonSequentialPrebuffer = 0x100;
}
GameBoyAdvanceWait.prototype.ROMAccess32CPU = function (address) {
    address = address | 0;
    this.check128kAlignmentBug(address | 0);
    this.getROMRead32(address >> 24);
}
GameBoyAdvanceWait.prototype.SRAMAccess = function () {
    this.multiClock(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.SRAMAccessCPU = function () {
    this.IOCore.updateCore(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess = function () {
    this.multiClock(this.isRendering | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess16CPU = function () {
    this.IOCore.updateCore(this.isRendering | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess32 = function () {
    this.multiClock(this.isRendering << 1);
}
GameBoyAdvanceWait.prototype.VRAMAccess32CPU = function () {
    this.IOCore.updateCore(this.isRendering << 1);
}
GameBoyAdvanceWait.prototype.OAMAccess = function () {
    this.multiClock(this.isOAMRendering | 0);
}
GameBoyAdvanceWait.prototype.OAMAccessCPU = function () {
    this.IOCore.updateCore(this.isOAMRendering | 0);
}
GameBoyAdvanceWait.prototype.updateRenderStatus = function (isRendering, isOAMRendering) {
    this.isRendering = isRendering | 0;
    this.isOAMRendering = isOAMRendering | 0;
}