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
function GameBoyAdvanceIRQ(IOCore) {
    //Build references:
    this.IOCore = IOCore;
    this.initializeIRQState();
}
GameBoyAdvanceIRQ.prototype.initializeIRQState = function () {
    this.interruptsEnabled = 0;
    this.interruptsRequested = 0;
    this.IME = false;
}
GameBoyAdvanceIRQ.prototype.IRQMatch = function () {
    //Used to exit HALT:
    return ((this.interruptsEnabled & this.interruptsRequested) != 0);
}
GameBoyAdvanceIRQ.prototype.checkForIRQFire = function () {
    //Tell the CPU core when the emulated hardware is triggering an IRQ:
    this.IOCore.cpu.triggerIRQ((this.interruptsEnabled & this.interruptsRequested) != 0 && this.IME);
}
GameBoyAdvanceIRQ.prototype.requestIRQ = function (irqLineToSet) {
    irqLineToSet = irqLineToSet | 0;
    this.interruptsRequested |= irqLineToSet | 0;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.writeIME = function (data) {
    data = data | 0;
    this.IME = ((data & 0x1) == 0x1);
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIME = function () {
    return (this.IME ? 0xFF : 0xFE);
}
GameBoyAdvanceIRQ.prototype.writeIE0 = function (data) {
    data = data | 0;
    this.interruptsEnabled &= 0x3F00;
    this.interruptsEnabled |= data | 0;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIE0 = function () {
    return this.interruptsEnabled & 0xFF;
}
GameBoyAdvanceIRQ.prototype.writeIE1 = function (data) {
    data = data | 0;
    this.interruptsEnabled &= 0xFF;
    this.interruptsEnabled |= (data << 8) & 0x3F00;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIE1 = function () {
    return this.interruptsEnabled >> 8;
}
GameBoyAdvanceIRQ.prototype.writeIF0 = function (data) {
    data = data | 0;
    this.interruptsRequested &= ~data;
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIF0 = function () {
    return this.interruptsRequested & 0xFF;
}
GameBoyAdvanceIRQ.prototype.writeIF1 = function (data) {
    data = data | 0;
    this.interruptsRequested &= ~(data << 8);
    this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.readIF1 = function () {
    return this.interruptsRequested >> 8;
}
GameBoyAdvanceIRQ.prototype.nextEventTime = function () {
    var clocks = -1;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextVBlankIRQEventTime() | 0, 0x1) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextHBlankIRQEventTime() | 0, 0x2) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.gfx.nextVCounterIRQEventTime() | 0, 0x4) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer0IRQEventTime() | 0, 0x8) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer1IRQEventTime() | 0, 0x10) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer2IRQEventTime() | 0, 0x20) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.timer.nextTimer3IRQEventTime() | 0, 0x40) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.serial.nextIRQEventTime() | 0, 0x80) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[0].nextIRQEventTime() | 0, 0x100) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[1].nextIRQEventTime() | 0, 0x200) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[2].nextIRQEventTime() | 0, 0x400) | 0;
    clocks = this.findClosestEvent(clocks | 0, this.IOCore.dma.channels[3].nextIRQEventTime() | 0, 0x800) | 0;
    //JoyPad input state should never update while we're in halt:
    //clocks = this.findClosestEvent(clocks | 0, this.IOCore.joypad.nextIRQEventTime() | 0, 0x1000) | 0;
    //clocks = this.findClosestEvent(clocks | 0, this.IOCore.cartridge.nextIRQEventTime() | 0, 0x2000) | 0;
    return clocks | 0;
}
GameBoyAdvanceIRQ.prototype.nextIRQEventTime = function () {
    var clocks = -1;
    //Checks IME:
    if (this.IME) {
        clocks = this.nextEventTime() | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceIRQ.prototype.findClosestEvent = function (oldClocks, newClocks, flagID) {
    oldClocks = oldClocks | 0;
    newClocks = newClocks | 0;
    flagID = flagID | 0;
    if ((this.interruptsEnabled & flagID) != 0) {
        if ((newClocks | 0) >= 0) {
            if ((oldClocks | 0) >= 0) {
                oldClocks = Math.min(oldClocks | 0, newClocks | 0) | 0;
            }
            else {
                oldClocks = newClocks | 0;
            }
        }
    }
    return oldClocks | 0;
}