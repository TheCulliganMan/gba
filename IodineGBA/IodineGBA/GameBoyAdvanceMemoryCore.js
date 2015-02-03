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
function GameBoyAdvanceMemory(IOCore) {
    //Reference to the emulator core:
    this.IOCore = IOCore;
    //WRAM Map Control Stuff:
    this.WRAMControlFlags = 0x20;
    //Load the BIOS:
    this.BIOS = getUint8Array(0x4000);
    this.BIOS16 = getUint16View(this.BIOS);
    this.BIOS32 = getInt32View(this.BIOS);
    this.loadBIOS();
    //Initialize Some RAM:
    this.externalRAM = getUint8Array(0x40000);
    this.externalRAM16 = getUint16View(this.externalRAM);
    this.externalRAM32 = getInt32View(this.externalRAM);
    this.internalRAM = getUint8Array(0x8000);
    this.internalRAM16 = getUint16View(this.internalRAM);
    this.internalRAM32 = getInt32View(this.internalRAM);
    this.lastBIOSREAD = 0;        //BIOS read bus last.
    //After all sub-objects initialized, initialize dispatches:
    var generator = new GameBoyAdvanceMemoryDispatchGenerator(this);
    this.readIO8 = generator.generateMemoryReadIO8();
    this.readIO16 = generator.generateMemoryReadIO16();
    this.writeIO8 = generator.generateMemoryWriteIO8();
    this.writeIO16 = generator.generateMemoryWriteIO16();
    this.memoryRead8 = this.memoryRead8Generated[1];
    this.memoryWrite8 = this.memoryWrite8Generated[1];
    this.memoryRead16 = this.memoryRead16Generated[1];
    this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
    this.memoryWrite16 = this.memoryWrite16Generated[1];
    this.memoryRead32 = this.memoryRead32Generated[1];
    this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
    this.memoryWrite32 = this.memoryWrite32Generated[1];
}
GameBoyAdvanceMemory.prototype.loadReferences = function () {
    //Initialize the various handler objects:
    this.dma = this.IOCore.dma;
    this.gfx = this.IOCore.gfx;
    this.sound = this.IOCore.sound;
    this.timer = this.IOCore.timer;
    this.irq = this.IOCore.irq;
    this.serial = this.IOCore.serial;
    this.joypad = this.IOCore.joypad;
    this.cartridge = this.IOCore.cartridge;
    this.wait = this.IOCore.wait;
    this.cpu = this.IOCore.cpu;
    this.saves = this.IOCore.saves;
}
GameBoyAdvanceMemory.prototype.writeExternalWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //External WRAM:
    this.wait.WRAMAccess();
    this.externalRAM[address & 0x3FFFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //External WRAM:
        this.wait.WRAMAccess();
        this.externalRAM16[(address >> 1) & 0x1FFFF] = data & 0xFFFF;
    }
    GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //External WRAM:
        this.wait.WRAMAccess32();
        this.externalRAM32[(address >> 2) & 0xFFFF] = data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
        //External WRAM:
        this.wait.WRAMAccess();
        address &= 0x3FFFE;
        this.externalRAM[address++] = data & 0xFF;
        this.externalRAM[address] = (data >> 8) & 0xFF;
    }
    GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
        //External WRAM:
        this.wait.WRAMAccess32();
        address &= 0x3FFFC;
        this.externalRAM[address++] = data & 0xFF;
        this.externalRAM[address++] = (data >> 8) & 0xFF;
        this.externalRAM[address++] = (data >> 16) & 0xFF;
        this.externalRAM[address] = data >>> 24;
    }
}
GameBoyAdvanceMemory.prototype.writeInternalWRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    //Internal WRAM:
    this.wait.singleClock();
    this.internalRAM[address & 0x7FFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //Internal WRAM:
        this.wait.singleClock();
        this.internalRAM16[(address >> 1) & 0x3FFF] = data & 0xFFFF;
    }
    GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
        address = address | 0;
        data = data | 0;
        //Internal WRAM:
        this.wait.singleClock();
        this.internalRAM32[(address >> 2) & 0x1FFF] = data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFE;
        this.internalRAM[address++] = data & 0xFF;
        this.internalRAM[address] = (data >> 8) & 0xFF;
    }
    GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFC;
        this.internalRAM[address++] = data & 0xFF;
        this.internalRAM[address++] = (data >> 8) & 0xFF;
        this.internalRAM[address++] = (data >> 16) & 0xFF;
        this.internalRAM[address] = data >>> 24;
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000302) {
        //IO Write:
        this.writeIO8[address & 0x3FF](this, data & 0xFF);
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM8(address | 0, data & 0xFF);
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000302) {
        //IO Write:
        address = address >> 1;
        this.writeIO16[address & 0x1FF](this, data & 0xFFFF);
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM16(address | 0, data & 0xFFFF);
    }
}
GameBoyAdvanceMemory.prototype.writeIODispatch32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Write:
        switch ((address >> 2) & 0xFF) {
            //4000000h - DISPCNT - LCD Control (Read/Write)
            //4000002h - Undocumented - Green Swap (R/W)
            case 0:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeDISPCNT0(data & 0xFF);
                this.gfx.writeDISPCNT1((data >> 8) & 0xFF);
                this.gfx.writeGreenSwap((data >> 16) & 0xFF);
                break;
            //4000004h - DISPSTAT - General LCD Status (Read/Write)
            //4000006h - VCOUNT - Vertical Counter (Read only)
            case 0x1:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeDISPSTAT0(data & 0xFF);
                this.gfx.writeDISPSTAT1((data >> 8) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
            //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
            case 0x2:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG0CNT0(data & 0xFF);
                this.gfx.writeBG0CNT1((data >> 8) & 0xFF);
                this.gfx.writeBG1CNT0((data >> 16) & 0xFF);
                this.gfx.writeBG1CNT1(data >>> 24);
                break;
            //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
            //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
            case 0x3:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2CNT0(data & 0xFF);
                this.gfx.writeBG2CNT1((data >> 8) & 0xFF);
                this.gfx.writeBG3CNT0((data >> 16) & 0xFF);
                this.gfx.writeBG3CNT1(data >>> 24);
                break;
            //4000010h - BG0HOFS - BG0 X-Offset (W)
            //4000012h - BG0VOFS - BG0 Y-Offset (W)
            case 0x4:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG0HOFS0(data & 0xFF);
                this.gfx.writeBG0HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG0VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG0VOFS1(data >>> 24);
                break;
            //4000014h - BG1HOFS - BG1 X-Offset (W)
            //4000016h - BG1VOFS - BG1 Y-Offset (W)
            case 0x5:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG1HOFS0(data & 0xFF);
                this.gfx.writeBG1HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG1VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG1VOFS1(data >>> 24);
                break;
            //4000018h - BG2HOFS - BG2 X-Offset (W)
            //400001Ah - BG2VOFS - BG2 Y-Offset (W)
            case 0x6:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2HOFS0(data & 0xFF);
                this.gfx.writeBG2HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG2VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG2VOFS1(data >>> 24);
                break;
            //400001Ch - BG3HOFS - BG3 X-Offset (W)
            //400001Eh - BG3VOFS - BG3 Y-Offset (W)
            case 0x7:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3HOFS0(data & 0xFF);
                this.gfx.writeBG3HOFS1((data >> 8) & 0xFF);
                this.gfx.writeBG3VOFS0((data >> 16) & 0xFF);
                this.gfx.writeBG3VOFS1(data >>> 24);
                break;
            //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
            //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
            case 0x8:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2PA0(data & 0xFF);
                this.gfx.writeBG2PA1((data >> 8) & 0xFF);
                this.gfx.writeBG2PB0((data >> 16) & 0xFF);
                this.gfx.writeBG2PB1(data >>> 24);
                break;
            //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
            //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
            case 0x9:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2PC0(data & 0xFF);
                this.gfx.writeBG2PC1((data >> 8) & 0xFF);
                this.gfx.writeBG2PD0((data >> 16) & 0xFF);
                this.gfx.writeBG2PD1(data >>> 24);
                break;
            //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
            //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
            case 0xA:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2X_L0(data & 0xFF);
                this.gfx.writeBG2X_L1((data >> 8) & 0xFF);
                this.gfx.writeBG2X_H0((data >> 16) & 0xFF);
                this.gfx.writeBG2X_H1(data >>> 24);
                break;
            //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
            //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
            case 0xB:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG2Y_L0(data & 0xFF);
                this.gfx.writeBG2Y_L1((data >> 8) & 0xFF);
                this.gfx.writeBG2Y_H0((data >> 16) & 0xFF);
                this.gfx.writeBG2Y_H1(data >>> 24);
                break;
            //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
            //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
            case 0xC:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3PA0(data & 0xFF);
                this.gfx.writeBG3PA1((data >> 8) & 0xFF);
                this.gfx.writeBG3PB0((data >> 16) & 0xFF);
                this.gfx.writeBG3PB1(data >>> 24);
                break;
            //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
            //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
            case 0xD:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3PC0(data & 0xFF);
                this.gfx.writeBG3PC1((data >> 8) & 0xFF);
                this.gfx.writeBG3PD0((data >> 16) & 0xFF);
                this.gfx.writeBG3PD1(data >>> 24);
                break;
            //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
            //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
            case 0xE:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3X_L0(data & 0xFF);
                this.gfx.writeBG3X_L1((data >> 8) & 0xFF);
                this.gfx.writeBG3X_H0((data >> 16) & 0xFF);
                this.gfx.writeBG3X_H1(data >>> 24);
                break;
            //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
            //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
            case 0xF:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBG3Y_L0(data & 0xFF);
                this.gfx.writeBG3Y_L1((data >> 8) & 0xFF);
                this.gfx.writeBG3Y_H0((data >> 16) & 0xFF);
                this.gfx.writeBG3Y_H1(data >>> 24);
                break;
            //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
            //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
            case 0x10:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWIN0H0(data & 0xFF);
                this.gfx.writeWIN0H1((data >> 8) & 0xFF);
                this.gfx.writeWIN1H0((data >> 16) & 0xFF);
                this.gfx.writeWIN1H1(data >>> 24);
                break;
            //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
            //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
            case 0x11:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWIN0V0(data & 0xFF);
                this.gfx.writeWIN0V1((data >> 8) & 0xFF);
                this.gfx.writeWIN1V0((data >> 16) & 0xFF);
                this.gfx.writeWIN1V1(data >>> 24);
                break;
            //4000048h - WININ - Control of Inside of Window(s) (R/W)
            //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
            case 0x12:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeWININ0(data & 0xFF);
                this.gfx.writeWININ1((data >> 8) & 0xFF);
                this.gfx.writeWINOUT0((data >> 16) & 0xFF);
                this.gfx.writeWINOUT1(data >>> 24);
                break;
            //400004Ch - MOSAIC - Mosaic Size (W)
            //400004Eh - NOT USED - ZERO
            case 0x13:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeMOSAIC0(data & 0xFF);
                this.gfx.writeMOSAIC1((data >> 8) & 0xFF);
                break;
            //4000050h - BLDCNT - Color Special Effects Selection (R/W)
            //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
            case 0x14:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBLDCNT0(data & 0xFF);
                this.gfx.writeBLDCNT1((data >> 8) & 0xFF);
                this.gfx.writeBLDALPHA0((data >> 16) & 0xFF);
                this.gfx.writeBLDALPHA1(data >>> 24);
                break;
            //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
            case 0x15:
                this.IOCore.updateGraphicsClocking();
                this.gfx.writeBLDY(data & 0xFF);
                break;
            //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
            //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
            //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
            case 0x18:
                    //NR10:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND1CNT_L(data & 0xFF);
                    //NR11:
                this.sound.writeSOUND1CNT_H0((data >> 16) & 0xFF);
                    //NR12:
                this.sound.writeSOUND1CNT_H1(data >>> 24);
                break;
            //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
            //4000066h - NOT USED - ZERO
            case 0x19:
                    //NR13:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND1CNT_X0(data & 0xFF);
                    //NR14:
                this.sound.writeSOUND1CNT_X1((data >> 8) & 0xFF);
                break;
            //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
            //400006Ah - NOT USED - ZERO
            case 0x1A:
                    //NR21:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND2CNT_L0(data & 0xFF);
                    //NR22:
                this.sound.writeSOUND2CNT_L1((data >> 8) & 0xFF);
                break;
            //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
            //400006Eh - NOT USED - ZERO
            case 0x1B:
                    //NR23:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND2CNT_H0(data & 0xFF);
                    //NR24:
                this.sound.writeSOUND2CNT_H1((data >> 8) & 0xFF);
                break;
            //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
            //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
            case 0x1C:
                    //NR30:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND3CNT_L(data & 0xFF);
                    //NR31:
                this.sound.writeSOUND3CNT_H0((data >> 16) & 0xFF);
                    //NR32:
                this.sound.writeSOUND3CNT_H1(data >>> 24);
                break;
            //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
            //4000076h - NOT USED - ZERO
            case 0x1D:
                    //NR33:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND3CNT_X0(data & 0xFF);
                    //NR34:
                this.sound.writeSOUND3CNT_X1((data >> 8) & 0xFF);
                break;
            //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
            //400007Ah - NOT USED - ZERO
            case 0x1E:
                    //NR41:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND4CNT_L0(data & 0xFF);
                    //NR42:
                this.sound.writeSOUND4CNT_L1((data >> 8) & 0xFF);
                break;
            //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
            //400007Eh - NOT USED - ZERO
            case 0x1F:
                    //NR43:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUND4CNT_H0(data & 0xFF);
                    //NR44:
                this.sound.writeSOUND4CNT_H1((data >> 8) & 0xFF);
                break;
            //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
            //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
            case 0x20:
                    //NR50:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDCNT_L0(data & 0xFF);
                    //NR51:
                this.sound.writeSOUNDCNT_L1((data >> 8) & 0xFF);
                this.sound.writeSOUNDCNT_H0((data >> 16) & 0xFF);
                this.sound.writeSOUNDCNT_H1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
            //4000086h - NOT USED - ZERO
            case 0x21:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDCNT_X(data & 0xFF);
                break;
            //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
            case 0x22:
                this.IOCore.updateTimerClocking();
                this.sound.writeSOUNDBIAS0(data & 0xFF);
                this.sound.writeSOUNDBIAS1((data >> 8) & 0xFF);
                break;
            //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
            //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
            //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x24:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0, data & 0xFF);
                this.sound.writeWAVE(0x1, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0x2, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0x3, data >>> 24);
                break;
            //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
            //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x25:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0x4, data & 0xFF);
                this.sound.writeWAVE(0x5, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0x6, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0x7, data >>> 24);
                break;
            //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
            //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x26:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0x8, data & 0xFF);
                this.sound.writeWAVE(0x9, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0xA, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0xB, data >>> 24);
                break;
            //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
            //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
            case 0x27:
                this.IOCore.updateTimerClocking();
                this.sound.writeWAVE(0xC, data & 0xFF);
                this.sound.writeWAVE(0xD, (data >> 8) & 0xFF);
                this.sound.writeWAVE(0xE, (data >> 16) & 0xFF);
                this.sound.writeWAVE(0xF, data >>> 24);
                break;
            //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
            //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
            case 0x28:
                this.IOCore.updateTimerClocking();
                this.sound.writeFIFOA(data & 0xFF);
                this.sound.writeFIFOA((data >> 8) & 0xFF);
                this.sound.writeFIFOA((data >> 16) & 0xFF);
                this.sound.writeFIFOA(data >>> 24);
                break;
            //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
            //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
            case 0x29:
                this.IOCore.updateTimerClocking();
                this.sound.writeFIFOB(data & 0xFF);
                this.sound.writeFIFOB((data >> 8) & 0xFF);
                this.sound.writeFIFOB((data >> 16) & 0xFF);
                this.sound.writeFIFOB(data >>> 24);
                break;
            //40000A8h through 40000AFh - NOT USED - GLITCHED
            //40000B0h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
            //40000B2h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
            case 0x2C:
                this.dma.writeDMASource0(0, data & 0xFF);
                this.dma.writeDMASource1(0, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(0, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(0, (data >> 24) & 0x7);    //Mask out the unused bits.
                break;
            //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
            //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
            case 0x2D:
                this.dma.writeDMADestination0(0, data & 0xFF);
                this.dma.writeDMADestination1(0, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(0, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(0, (data >> 24) & 0x7);
                break;
            //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
            //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
            case 0x2E:
                this.dma.writeDMAWordCount0(0, data & 0xFF);
                this.dma.writeDMAWordCount1(0, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(0, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(0, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
            //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
            case 0x2F:
                this.dma.writeDMASource0(1, data & 0xFF);
                this.dma.writeDMASource1(1, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(1, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(1, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
            //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
            case 0x30:
                this.dma.writeDMADestination0(1, data & 0xFF);
                this.dma.writeDMADestination1(1, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(1, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(1, (data >> 24) & 0x7);
                break;
            //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
            //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
            case 0x31:
                this.dma.writeDMAWordCount0(1, data & 0xFF);
                this.dma.writeDMAWordCount1(1, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(1, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(1, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
            //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
            case 0x32:
                this.dma.writeDMASource0(2, data & 0xFF);
                this.dma.writeDMASource1(2, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(2, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(2, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
            //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
            case 0x33:
                this.dma.writeDMADestination0(2, data & 0xFF);
                this.dma.writeDMADestination1(2, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(2, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(2, (data >> 24) & 0x7);
                break;
            //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
            //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
            case 0x34:
                this.dma.writeDMAWordCount0(2, data & 0xFF);
                this.dma.writeDMAWordCount1(2, (data >> 8) & 0x3F);
                this.dma.writeDMAControl0(2, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(2, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
            //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
            case 0x35:
                this.dma.writeDMASource0(3, data & 0xFF);
                this.dma.writeDMASource1(3, (data >> 8) & 0xFF);
                this.dma.writeDMASource2(3, (data >> 16) & 0xFF);
                this.dma.writeDMASource3(3, (data >> 24) & 0xF);    //Mask out the unused bits.
                break;
            //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
            //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
            case 0x36:
                this.dma.writeDMADestination0(3, data & 0xFF);
                this.dma.writeDMADestination1(3, (data >> 8) & 0xFF);
                this.dma.writeDMADestination2(3, (data >> 16) & 0xFF);
                this.dma.writeDMADestination3(3, (data >> 24) & 0xF);
                break;
            //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
            //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
            case 0x37:
                this.dma.writeDMAWordCount0(3, data & 0xFF);
                this.dma.writeDMAWordCount1(3, (data >> 8) & 0xFF);
                this.dma.writeDMAControl0(3, (data >> 16) & 0xFF);
                this.IOCore.updateCoreClocking();
                this.dma.writeDMAControl1(3, data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //40000E0h through 40000FFh - NOT USED - GLITCHED
            //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
            //4000102h - TM0CNT_H - Timer 0 Control (R/W)
            case 0x40:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM0CNT_L0(data & 0xFF);
                this.timer.writeTM0CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM0CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
            //4000106h - TM1CNT_H - Timer 1 Control (R/W)
            case 0x41:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM1CNT_L0(data & 0xFF);
                this.timer.writeTM1CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM1CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
            //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
            case 0x42:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM2CNT_L0(data & 0xFF);
                this.timer.writeTM2CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM2CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
            //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
            case 0x43:
                this.IOCore.updateTimerClocking();
                this.timer.writeTM3CNT_L0(data & 0xFF);
                this.timer.writeTM3CNT_L1((data >> 8) & 0xFF);
                this.timer.writeTM3CNT_H((data >> 16) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000110h through 400011Fh - NOT USED - GLITCHED
            //4000120h - Serial Data A (R/W)
            //4000122h - Serial Data B (R/W)
            case 0x48:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIODATA_A0(data & 0xFF);
                this.serial.writeSIODATA_A1((data >> 8) & 0xFF);
                this.serial.writeSIODATA_B0((data >> 16) & 0xFF);
                this.serial.writeSIODATA_B1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000124h - Serial Data C (R/W)
            //4000126h - Serial Data D (R/W)
            case 0x49:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIODATA_C0(data & 0xFF);
                this.serial.writeSIODATA_C1((data >> 8) & 0xFF);
                this.serial.writeSIODATA_D0((data >> 16) & 0xFF);
                this.serial.writeSIODATA_D1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
            //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
            case 0x4A:
                this.IOCore.updateSerialClocking();
                this.serial.writeSIOCNT0(data & 0xFF);
                this.serial.writeSIOCNT1((data >> 8) & 0xFF);
                this.serial.writeSIODATA8_0((data >> 16) & 0xFF);
                this.serial.writeSIODATA8_1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //400012Ch through 400012Fh - NOT USED - GLITCHED
            //4000130h - KEYINPUT - Key Status (R)
            //4000132h - KEYCNT - Key Interrupt Control (R/W)
            case 0x4C:
                this.joypad.writeKeyControl0((data >> 16) & 0xFF);
                this.joypad.writeKeyControl1(data >>> 24);
                break;
            //4000134h - RCNT (R/W) - Mode Selection
            case 0x4D:
                this.IOCore.updateSerialClocking();
                this.serial.writeRCNT0(data & 0xFF);
                this.serial.writeRCNT1((data >> 8) & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000136h through 400013Fh - NOT USED - GLITCHED
            //4000140h - JOYCNT - JOY BUS Control Register (R/W)
            case 0x50:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYCNT(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000142h through 400014Fh - NOT USED - GLITCHED
            //4000150h - JoyBus Receive (R/W)
            //4000152h - JoyBus Receive (R/W)
            case 0x54:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_RECV0(data & 0xFF);
                this.serial.writeJOYBUS_RECV1((data >> 8) & 0xFF);
                this.serial.writeJOYBUS_RECV2((data >> 16) & 0xFF);
                this.serial.writeJOYBUS_RECV3(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000154h - JoyBus Send (R/W)
            //4000156h - JoyBus Send (R/W)
            case 0x55:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_SEND0(data & 0xFF);
                this.serial.writeJOYBUS_SEND1((data >> 8) & 0xFF);
                this.serial.writeJOYBUS_SEND2((data >> 16) & 0xFF);
                this.serial.writeJOYBUS_SEND3(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000158h - JoyBus Stat (R/W)
            case 0x56:
                this.IOCore.updateSerialClocking();
                this.serial.writeJOYBUS_STAT(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000159h through 40001FFh - NOT USED - GLITCHED
            //4000200h - IE - Interrupt Enable Register (R/W)
            //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
            case 0x80:
                this.IOCore.updateCoreClocking();
                this.irq.writeIE0(data & 0xFF);
                this.irq.writeIE1((data >> 8) & 0xFF);
                this.irq.writeIF0((data >> 16) & 0xFF);
                this.irq.writeIF1(data >>> 24);
                this.IOCore.updateCoreEventTime();
                break;
            //4000204h - WAITCNT - Waitstate Control (R/W)
            //4000206h - WAITCNT - Waitstate Control (R/W)
            case 0x81:
                this.wait.writeWAITCNT0(data & 0xFF);
                this.wait.writeWAITCNT1((data >> 8) & 0xFF);
                break;
            //4000208h - IME - Interrupt Master Enable Register (R/W)
            case 0x82:
                this.IOCore.updateCoreClocking();
                this.irq.writeIME(data & 0xFF);
                this.IOCore.updateCoreEventTime();
                break;
            //4000209h through 40002FFh - NOT USED - GLITCHED
            //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
            //4000302h - NOT USED - ZERO
            case 0xC0:
                this.wait.writePOSTBOOT(data & 0xFF);
                this.wait.writeHALTCNT((data >> 8) & 0xFF);
        }
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        this.wait.writeConfigureWRAM32(data | 0);
    }
}
GameBoyAdvanceMemory.prototype.writeVRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writeVRAM8(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeVRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writeVRAM16(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeVRAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    this.gfx.writeVRAM32(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeOAM8 = function (address, data) {
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
}
GameBoyAdvanceMemory.prototype.writeOAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    this.gfx.writeOAM16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeOAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    this.gfx.writeOAM32(address & 0x3FC, data | 0);
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceMemory.prototype.writePalette8 = function (address, data) {
        address = address | 0;
        data = data | 0;
        this.IOCore.updateGraphicsClocking();
        this.wait.VRAMAccess();
        this.gfx.writePalette16(address & 0x3FE, Math.imul(data & 0xFF, 0x101) | 0);
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceMemory.prototype.writePalette8 = function (address, data) {
        data = data & 0xFF;
        this.IOCore.updateGraphicsClocking();
        this.wait.VRAMAccess();
        this.gfx.writePalette16(address & 0x3FE, (data * 0x101) | 0);
    }
}
GameBoyAdvanceMemory.prototype.writePalette16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    this.gfx.writePalette16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writePalette32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    this.gfx.writePalette32(address & 0x3FC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeROM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess(address | 0);
    this.cartridge.writeROM8(address & 0x1FFFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeROM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess(address | 0);
    this.cartridge.writeROM16(address & 0x1FFFFFE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeROM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.ROMAccess32(address | 0);
    this.cartridge.writeROM32(address & 0x1FFFFFC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeSRAM8 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM16 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFE, (data >> ((address & 0x2) << 3)) & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM32 = function (address, data) {
    address = address | 0;
    data = data | 0;
    this.wait.SRAMAccess();
    this.saves.writeSRAM(address & 0xFFFC, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.NOP = function (parentObj, data) {
    //Ignore the data write...
}
GameBoyAdvanceMemory.prototype.writeUnused = function () {
    //Ignore the data write...
    this.wait.singleClock();
}
GameBoyAdvanceMemory.prototype.remapWRAM = function (data) {
    data = data & 0x21;
    if ((data | 0) != (this.WRAMControlFlags | 0)) {
        switch (data | 0) {
            case 0:
                //Mirror Internal RAM to External:
                this.memoryWrite8 = this.memoryWrite8Generated[0];
                this.memoryRead8 = this.memoryRead8Generated[0];
                this.memoryWrite16 = this.memoryWrite16Generated[0];
                this.memoryRead16 = this.memoryRead16Generated[0];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[0];
                this.memoryWrite32 = this.memoryWrite32Generated[0];
                this.memoryRead32 = this.memoryRead32Generated[0];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[0];
                break;
            case 0x20:
                //Use External RAM:
                this.memoryWrite8 = this.memoryWrite8Generated[1];
                this.memoryRead8 = this.memoryRead8Generated[1];
                this.memoryWrite16 = this.memoryWrite16Generated[1];
                this.memoryRead16 = this.memoryRead16Generated[1];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
                this.memoryWrite32 = this.memoryWrite32Generated[1];
                this.memoryRead32 = this.memoryRead32Generated[1];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
                break;
            default:
                this.memoryWrite8 = this.memoryWrite8Generated[2];
                this.memoryRead8 = this.memoryRead8Generated[2];
                this.memoryWrite16 = this.memoryWrite16Generated[2];
                this.memoryRead16 = this.memoryRead16Generated[2];
                this.memoryReadCPU16 = this.memoryReadCPU16Generated[2];
                this.memoryWrite32 = this.memoryWrite32Generated[2];
                this.memoryRead32 = this.memoryRead32Generated[2];
                this.memoryReadCPU32 = this.memoryReadCPU32Generated[2];
        }
        this.WRAMControlFlags = data | 0;
    }
}
GameBoyAdvanceMemory.prototype.readBIOS8 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000) {
        if ((this.cpu.registers[15] | 0) < 0x4000) {
            //If reading from BIOS while executing it:
            data = this.BIOS[address & 0x3FFF] | 0;
        }
        else {
            //Not allowed to read from BIOS while executing outside of it:
            data = (this.lastBIOSREAD >> ((address & 0x3) << 3)) & 0xFF;
        }
    }
    else {
        data = this.readUnused8IO(address | 0) | 0;
    }
    return data | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
        address = address | 0;
        var data = 0;
        this.wait.singleClock();
        if ((address | 0) < 0x4000) {
            address = address >> 1;
            if ((this.cpu.registers[15] | 0) < 0x4000) {
                //If reading from BIOS while executing it:
                data = this.BIOS16[address & 0x1FFF] | 0;
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                data = (this.lastBIOSREAD >> ((address & 0x1) << 4)) & 0xFFFF;
            }
        }
        else {
            data = this.readUnused16IO(address | 0) | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
        address = address | 0;
        var data = 0;
        this.IOCore.updateCoreSingle();
        if ((address | 0) < 0x4000) {
            address = address >> 1;
            //If reading from BIOS while executing it:
            data = this.BIOS16[address & 0x1FFF] | 0;
            this.lastBIOSREAD = data | 0;
        }
        else {
            data = this.readUnused16IO(address | 0) | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
        address = address | 0;
        var data = 0;
        this.wait.singleClock();
        if ((address | 0) < 0x4000) {
            address = address >> 2;
            if ((this.cpu.registers[15] | 0) < 0x4000) {
                //If reading from BIOS while executing it:
                data = this.BIOS32[address & 0xFFF] | 0;
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                data = this.lastBIOSREAD | 0;
            }
        }
        else {
            data = this.IOCore.getCurrentFetchValue() | 0;
        }
        return data | 0;
    }
    GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
        address = address | 0;
        var data = 0;
        this.IOCore.updateCoreSingle();
        if ((address | 0) < 0x4000) {
            address = address >> 2;
            //If reading from BIOS while executing it:
            data = this.BIOS32[address & 0xFFF] | 0;
            this.lastBIOSREAD = data | 0;
        }
        else {
            data = this.IOCore.getCurrentFetchValue() | 0;
        }
        return data | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
        this.wait.singleClock();
        if (address < 0x4000) {
            if (this.cpu.registers[15] < 0x4000) {
                //If reading from BIOS while executing it:
                return this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                return (this.lastBIOSREAD >> ((address & 0x2) << 3)) & 0xFFFF;
            }
        }
        else {
            return this.readUnused16IO(address);
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
        this.IOCore.updateCoreSingle();
        if (address < 0x4000) {
            //If reading from BIOS while executing it:
            var data = this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
            this.lastBIOSREAD = data;
            return data;
        }
        else {
            return this.readUnused16IO(address);
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
        this.wait.singleClock();
        if (address < 0x4000) {
            if (this.cpu.registers[15] < 0x4000) {
                //If reading from BIOS while executing it:
                address &= -4;
                return this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16)  | (this.BIOS[address + 3] << 24);
            }
            else {
                //Not allowed to read from BIOS while executing outside of it:
                return this.lastBIOSREAD;
            }
        }
        else {
            return this.IOCore.getCurrentFetchValue();
        }
    }
    GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
        this.IOCore.updateCoreSingle();
        if (address < 0x4000) {
            //If reading from BIOS while executing it:
            address &= -4;
            var data = this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16)  | (this.BIOS[address + 3] << 24);
            this.lastBIOSREAD = data;
            return data;
        }
        else {
            return this.IOCore.getCurrentFetchValue();
        }
    }
}
GameBoyAdvanceMemory.prototype.readExternalWRAM8 = function (address) {
    address = address | 0;
    //External WRAM:
    this.wait.WRAMAccess();
    return this.externalRAM[address & 0x3FFFF] | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess();
        return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess16CPU();
        return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess32();
        return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
        address = address | 0;
        //External WRAM:
        this.wait.WRAMAccess32CPU();
        return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
        //External WRAM:
        this.wait.WRAMAccess();
        address &= 0x3FFFE;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
        //External WRAM:
        this.wait.WRAMAccess16CPU();
        address &= 0x3FFFE;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
        //External WRAM:
        this.wait.WRAMAccess32();
        address &= 0x3FFFC;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
    }
    GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
        //External WRAM:
        this.wait.WRAMAccess32CPU();
        address &= 0x3FFFC;
        return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
    }
}
GameBoyAdvanceMemory.prototype.readInternalWRAM8 = function (address) {
    address = address | 0;
    //Internal WRAM:
    this.wait.singleClock();
    return this.internalRAM[address & 0x7FFF] | 0;
}
if (__LITTLE_ENDIAN__) {
    GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.wait.singleClock();
        return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.wait.singleClock();
        return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
        address = address | 0;
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
    }
}
else {
    GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFE;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        address &= 0x7FFE;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
        //Internal WRAM:
        this.wait.singleClock();
        address &= 0x7FFC;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
    }
    GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
        //Internal WRAM:
        this.IOCore.updateCoreSingle();
        address &= 0x7FFC;
        return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
    }
}
GameBoyAdvanceMemory.prototype.readIODispatch8 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO8[address & 0x3FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM8(address | 0) | 0;
    }
    else {
        data = this.readUnused8IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        address = address >> 1;
        data = this.readIO16[address & 0x1FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM16(address | 0) | 0;
    }
    else {
        data = this.readUnused16IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16CPU = function (address) {
    address = address | 0;
    var data = 0;
    this.IOCore.updateCoreSingle();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        address = address >> 1;
        data = this.readIO16[address & 0x1FF](this) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM16(address | 0) | 0;
    }
    else {
        data = this.readUnused16IO(address | 0) | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32 = function (address) {
    address = address | 0;
    var data = 0;
    this.wait.singleClock();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO32(address | 0) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM32() | 0;
    }
    else {
        data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32CPU = function (address) {
    address = address | 0;
    var data = 0;
    this.IOCore.updateCoreSingle();
    if ((address | 0) < 0x4000304) {
        //IO Read:
        data = this.readIO32(address | 0) | 0;
    }
    else if ((address & 0x4000800) == 0x4000800) {
        //WRAM wait state control:
        data = this.wait.readConfigureWRAM32() | 0;
    }
    else {
        data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO32 = function (address) {
    address = address >> 2;
    var data = 0;
    switch (address & 0xFF) {
        //4000000h - DISPCNT - LCD Control (Read/Write)
        //4000002h - Undocumented - Green Swap (R/W)
        case 0:
            data = this.gfx.readDISPCNT0() |
            (this.gfx.readDISPCNT1() << 8) |
            (this.gfx.readGreenSwap() << 16);
            break;
        //4000004h - DISPSTAT - General LCD Status (Read/Write)
        //4000006h - VCOUNT - Vertical Counter (Read only)
        case 0x1:
            this.IOCore.updateGraphicsClocking();
            data = this.gfx.readDISPSTAT0() |
            (this.gfx.readDISPSTAT1() << 8) |
            (this.gfx.readVCOUNT() << 16);
            break;
        //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
        //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
        case 0x2:
            data = this.gfx.readBG0CNT0() |
            (this.gfx.readBG0CNT1() << 8) |
            (this.gfx.readBG1CNT0() << 16) |
            (this.gfx.readBG1CNT1() << 24);
            break;
        //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
        //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
        case 0x3:
            data = this.gfx.readBG2CNT0() |
            (this.gfx.readBG2CNT1() << 8) |
            (this.gfx.readBG3CNT0() << 16) |
            (this.gfx.readBG3CNT1() << 24);
            break;
        //4000010h through 4000047h - WRITE ONLY
        //4000048h - WININ - Control of Inside of Window(s) (R/W)
        //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
        case 0x12:
            data = this.gfx.readWININ0() |
            (this.gfx.readWININ1() << 8) |
            (this.gfx.readWINOUT0() << 16) |
            (this.gfx.readWINOUT1() << 24);
            break;
        //400004Ch - MOSAIC - Mosaic Size (W)
        //4000050h - BLDCNT - Color Special Effects Selection (R/W)
        //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
        case 0x14:
            data = this.gfx.readBLDCNT0() |
            (this.gfx.readBLDCNT1() << 8) |
            (this.gfx.readBLDALPHA0() << 16) |
            (this.gfx.readBLDALPHA1() << 24);
            break;
        //4000054h through 400005Fh - NOT USED - GLITCHED
        //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
        //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
        case 0x18:
            //NR10:
            //NR11:
            //NR12:
            data = this.sound.readSOUND1CNT_L() |
            (this.sound.readSOUND1CNT_H0() << 16) |
            (this.sound.readSOUND1CNT_H1() << 24);
            break;
        //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
        //4000066h - NOT USED - ZERO
        case 0x19:
            //NR14:
            data = this.sound.readSOUND1CNT_X() << 8;
            break;
        //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
        //400006Ah - NOT USED - ZERO
        case 0x1A:
            //NR21:
            //NR22:
            data = this.sound.readSOUND2CNT_L0() | (this.sound.readSOUND2CNT_L1() << 8);
            break;
        //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
        //400006Eh - NOT USED - ZERO
        case 0x1B:
            //NR24:
            data = this.sound.readSOUND2CNT_H() << 8;
            break;
        //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
        //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
        case 0x1C:
            //NR30:
            //NR32:
            data = this.sound.readSOUND3CNT_L() | (this.sound.readSOUND3CNT_H() << 24);
            break;
        //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
        //4000076h - NOT USED - ZERO
        case 0x1D:
            //NR34:
            data = this.sound.readSOUND3CNT_X() << 8;
            break;
        //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
        //400007Ah - NOT USED - ZERO
        case 0x1E:
            //NR42:
            data = this.sound.readSOUND4CNT_L() << 8;
            break;
        //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
        //400007Eh - NOT USED - ZERO
        case 0x1F:
            //NR43:
            //NR44:
            data = this.sound.readSOUND4CNT_H0() | (this.sound.readSOUND4CNT_H1() << 8);
            break;
        //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
        //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
        case 0x20:
            //NR50:
            //NR51:
            data = this.sound.readSOUNDCNT_L0() |
            (this.sound.readSOUNDCNT_L1() << 8) |
            (this.sound.readSOUNDCNT_H0() << 16) |
            (this.sound.readSOUNDCNT_H1() << 24);
            break;
        //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
        //4000086h - NOT USED - ZERO
        case 0x21:
            this.IOCore.updateTimerClocking();
            data = this.sound.readSOUNDCNT_X() | 0;
            break;
        //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
        //400008Ah - NOT USED - ZERO
        case 0x22:
            data = this.sound.readSOUNDBIAS0() | (this.sound.readSOUNDBIAS1() << 8);
            break;
        //400008Ch - NOT USED - GLITCHED
        //400008Eh - NOT USED - GLITCHED
        //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
        //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x24:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(0) |
            (this.sound.readWAVE(1) << 8) |
            (this.sound.readWAVE(2) << 16) |
            (this.sound.readWAVE(3) << 24);
            break;
        //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
        //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x25:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(4) |
            (this.sound.readWAVE(5) << 8) |
            (this.sound.readWAVE(6) << 16) |
            (this.sound.readWAVE(7) << 24);
            break;
        //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
        //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x26:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(8) |
            (this.sound.readWAVE(9) << 8) |
            (this.sound.readWAVE(10) << 16) |
            (this.sound.readWAVE(11) << 24);
            break;
        //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
        //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
        case 0x27:
            this.IOCore.updateTimerClocking();
            data = this.sound.readWAVE(12) |
            (this.sound.readWAVE(13) << 8) |
            (this.sound.readWAVE(14) << 16) |
            (this.sound.readWAVE(15) << 24);
            break;
        //40000A0h through 40000B9h - WRITE ONLY
        //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
        case 0x2E:
            data = (this.dma.readDMAControl0(0) << 16) | (this.dma.readDMAControl1(0) << 24);
            break;
        //40000BCh through 40000C5h - WRITE ONLY
        //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
        case 0x31:
            data = (this.dma.readDMAControl0(1) << 16) | (this.dma.readDMAControl1(1) << 24);
            break;
        //40000C8h through 40000D1h - WRITE ONLY
        //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
        case 0x34:
            data = (this.dma.readDMAControl0(2) << 16) | (this.dma.readDMAControl1(2) << 24);
            break;
        //40000D4h through 40000DDh - WRITE ONLY
        //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
        case 0x37:
            data = (this.dma.readDMAControl0(3) << 16) | (this.dma.readDMAControl1(3) << 24);
            break;
        //40000E0h through 40000FFh - NOT USED - GLITCHED
        //40000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
        //40000102h - TM0CNT_H - Timer 0 Control (R/W)
        case 0x40:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM0CNT_L0() |
            (this.timer.readTM0CNT_L1() << 8) |
            (this.timer.readTM0CNT_H() << 16);
            break;
        //40000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
        //40000106h - TM1CNT_H - Timer 1 Control (R/W)
        case 0x41:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM1CNT_L0() |
            (this.timer.readTM1CNT_L1() << 8) |
            (this.timer.readTM1CNT_H() << 16);
            break;
        //40000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
        //4000010Ah - TM2CNT_H - Timer 2 Control (R/W)
        case 0x42:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM2CNT_L0() |
            (this.timer.readTM2CNT_L1() << 8) |
            (this.timer.readTM2CNT_H() << 16);
            break;
        //4000010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
        //4000010Eh - TM3CNT_H - Timer 3 Control (R/W)
        case 0x43:
            this.IOCore.updateTimerClocking();
            data = this.timer.readTM3CNT_L0() |
            (this.timer.readTM3CNT_L1() << 8) |
            (this.timer.readTM3CNT_H() << 16);
            break;
        //40000110h through 400011Fh - NOT USED - GLITCHED
        //40000120h - Serial Data A (R/W)
        //40000122h - Serial Data B (R/W)
        case 0x48:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIODATA_A0() |
            (this.serial.readSIODATA_A1() << 8) |
            (this.serial.readSIODATA_B0() << 16) |
            (this.serial.readSIODATA_B1() << 24);
            break;
        //40000124h - Serial Data C (R/W)
        //40000126h - Serial Data D (R/W)
        case 0x49:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIODATA_C0() |
            (this.serial.readSIODATA_C1() << 8) |
            (this.serial.readSIODATA_D0() << 16) |
            (this.serial.readSIODATA_D1() << 24);
            break;
        //40000128h - SIOCNT - SIO Sub Mode Control (R/W)
        //4000012Ah - SIOMLT_SEND - Data Send Register (R/W)
        case 0x4A:
            this.IOCore.updateSerialClocking();
            data = this.serial.readSIOCNT0() |
            (this.serial.readSIOCNT1() << 8) |
            (this.serial.readSIODATA8_0() << 16) |
            (this.serial.readSIODATA8_1() << 24);
            break;
        //4000012Ch through 400012Fh - NOT USED - GLITCHED
        //40000130h - KEYINPUT - Key Status (R)
        //40000132h - KEYCNT - Key Interrupt Control (R/W)
        case 0x4C:
            data = this.joypad.readKeyStatus0() |
            (this.joypad.readKeyStatus1() << 8) |
            (this.joypad.readKeyControl0() << 16) |
            (this.joypad.readKeyControl1() << 24);
            break;
        //40000134h - RCNT (R/W) - Mode Selection
        //40000136h - NOT USED - ZERO
        case 0x4D:
            this.IOCore.updateSerialClocking();
            data = this.serial.readRCNT0() | (this.serial.readRCNT1() << 8);
            break;
        //40000138h through 400013Fh - NOT USED - GLITCHED
        //40000140h - JOYCNT - JOY BUS Control Register (R/W)
        //40000142h - NOT USED - ZERO
        case 0x50:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYCNT() | 0;
            break;
        //40000144h through 400014Fh - NOT USED - GLITCHED
        //40000150h - JoyBus Receive (R/W)
        //40000152h - JoyBus Receive (R/W)
        case 0x54:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_RECV0() |
            (this.serial.readJOYBUS_RECV1() << 8) |
            (this.serial.readJOYBUS_RECV2() << 16) |
            (this.serial.readJOYBUS_RECV3() << 24);
            break;
        //40000154h - JoyBus Send (R/W)
        //40000156h - JoyBus Send (R/W)
        case 0x55:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_SEND0() |
            (this.serial.readJOYBUS_SEND1() << 8) |
            (this.serial.readJOYBUS_SEND2() << 16) |
            (this.serial.readJOYBUS_SEND3() << 24);
            break;
        //40000158h - JoyBus Stat (R/W)
        //4000015Ah - NOT USED - ZERO
        case 0x56:
            this.IOCore.updateSerialClocking();
            data = this.serial.readJOYBUS_STAT() | 0;
            break;
        //4000015Ch through 40001FFh - NOT USED - GLITCHED
        //40000200h - IE - Interrupt Enable Register (R/W)
        //40000202h - IF - Interrupt Request Flags / IRQ Acknowledge
        case 0x80:
            this.IOCore.updateCoreSpillRetain();
            data = this.irq.readIE0() |
            (this.irq.readIE1() << 8) |
            (this.irq.readIF0() << 16) |
            (this.irq.readIF1() << 24);
            break;
        //40000204h - WAITCNT - Waitstate Control (R/W)
        //40000206h - NOT USED - ZERO
        case 0x81:
            data = this.wait.readWAITCNT0() | (this.wait.readWAITCNT1() << 8);
            break;
        //40000208h - IME - Interrupt Master Enable Register (R/W)
        //4000020Ah - NOT USED - ZERO
        case 0x82:
            data = this.irq.readIME() | 0;
            break;
        //4000020Ch through 40002FFh - NOT USED - GLITCHED
        //40000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
        //40000302h - NOT USED - ZERO
        case 0xC0:
            data = this.wait.readPOSTBOOT() | 0;
            break;
        //UNDEFINED / ILLEGAL:
        default:
            data = this.IOCore.getCurrentFetchValue() | 0;
    }
    return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM8(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM16(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readVRAM16(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    return this.gfx.readVRAM32(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32CPU();
    return this.gfx.readVRAM32(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM(address & 0x3FF) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccessCPU();
    return this.gfx.readOAM16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccess();
    return this.gfx.readOAM32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readOAM32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.OAMAccessCPU();
    return this.gfx.readOAM32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette8 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readPalette(address & 0x3FF) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette16 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess();
    return this.gfx.readPalette16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess16CPU();
    return this.gfx.readPalette16(address & 0x3FE) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette32 = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32();
    return this.gfx.readPalette32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readPalette32CPU = function (address) {
    address = address | 0;
    this.IOCore.updateGraphicsClocking();
    this.wait.VRAMAccess32CPU();
    return this.gfx.readPalette32(address & 0x3FC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM8 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM8(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess16CPU(address | 0);
    return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32 = function (address) {
    address = address | 0;
    this.wait.ROMAccess32(address | 0);
    return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess32CPU(address | 0);
    return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM28 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM8Space2(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216 = function (address) {
    address = address | 0;
    this.wait.ROMAccess(address | 0);
    return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess16CPU(address | 0);
    return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232 = function (address) {
    address = address | 0;
    this.wait.ROMAccess32(address | 0);
    return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232CPU = function (address) {
    address = address | 0;
    this.wait.ROMAccess32CPU(address | 0);
    return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readSRAM8 = function (address) {
    address = address | 0;
    this.wait.SRAMAccess();
    return this.saves.readSRAM(address & 0xFFFF) | 0;
}
if (typeof Math.imul == "function") {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
        address = address | 0;
        this.wait.SRAMAccess();
        return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
    }
    GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
        address = address | 0;
        this.wait.SRAMAccessCPU();
        return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
    }
}
GameBoyAdvanceMemory.prototype.readZero = function (parentObj) {
    return 0;
}
GameBoyAdvanceMemory.prototype.readUnused8 = function (address) {
    address = address | 0;
    this.wait.singleClock();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x3) << 3)) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused8IO = function (address) {
    address = address | 0;
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x3) << 3)) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO1 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO2 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() >>> 16;
}
GameBoyAdvanceMemory.prototype.readUnused16 = function (address) {
    address = address | 0;
    this.wait.singleClock();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16IO = function (address) {
    address = address | 0;
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16CPU = function (address) {
    address = address | 0;
    this.IOCore.updateCoreSingle();
    return (this.IOCore.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused32 = function () {
    this.wait.singleClock();
    return this.IOCore.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused32CPU = function () {
    this.IOCore.updateCoreSingle();
    return this.IOCore.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused0 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused1 = function (parentObj) {
    return (parentObj.IOCore.getCurrentFetchValue() >> 8) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused2 = function (parentObj) {
    return (parentObj.IOCore.getCurrentFetchValue() >> 16) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused3 = function (parentObj) {
    return parentObj.IOCore.getCurrentFetchValue() >>> 24;
}
GameBoyAdvanceMemory.prototype.loadBIOS = function () {
    //Ensure BIOS is of correct length:
    if ((this.IOCore.BIOS.length | 0) == 0x4000) {
        this.IOCore.BIOSFound = true;
        for (var index = 0; (index | 0) < 0x4000; index = ((index | 0) + 1) | 0) {
            this.BIOS[index & 0x3FFF] = this.IOCore.BIOS[index & 0x3FFF] & 0xFF;
        }
    }
    else {
        this.IOCore.BIOSFound = false;
    }
}
function generateMemoryTopLevelDispatch() {
    function compileMemoryReadDispatch(readUnused, readExternalWRAM, readInternalWRAM,
                                       readIODispatch, readPalette, readVRAM, readOAM,
                                       readROM, readROM2, readSRAM, readBIOS) {
        var code = "address = address | 0;var data = 0;switch (address >> 24) {";
        /*
         Decoder for the nibble at bits 24-27
         (Top 4 bits of the address falls through to default (unused),
         so the next nibble down is used for dispatch.):
         */
        /*
         BIOS Area (00000000-00003FFF)
         Unused (00004000-01FFFFFF)
         */
        code += "case 0:{data = this." + readBIOS + "(address | 0) | 0;break};";
        /*
         Unused (00004000-01FFFFFF)
         */
        /*
         WRAM - On-board Work RAM (02000000-0203FFFF)
         Unused (02040000-02FFFFFF)
         */
        code += "case 0x2:{data = this." + readExternalWRAM + "(address | 0) | 0;break};";
        /*
         WRAM - In-Chip Work RAM (03000000-03007FFF)
         Unused (03008000-03FFFFFF)
         */
        code += "case 0x3:{data = this." + readInternalWRAM + "(address | 0) | 0;break};";
        /*
         I/O Registers (04000000-040003FE)
         Unused (04000400-04FFFFFF)
         */
        code += "case 0x4:{data = this." + readIODispatch + "(address | 0) | 0;break};";
        /*
         BG/OBJ Palette RAM (05000000-050003FF)
         Unused (05000400-05FFFFFF)
         */
        code += "case 0x5:{data = this." + readPalette + "(address | 0) | 0;break};";
        /*
         VRAM - Video RAM (06000000-06017FFF)
         Unused (06018000-06FFFFFF)
         */
        code += "case 0x6:{data = this." + readVRAM + "(address | 0) | 0;break};";
        /*
         OAM - OBJ Attributes (07000000-070003FF)
         Unused (07000400-07FFFFFF)
         */
        code += "case 0x7:{data = this." + readOAM + "(address | 0) | 0;break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
         */
        code += "case 0x8:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
         */
        code += "case 0x9:";
        /*
         Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
         */
        code += "case 0xA:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
         */
        code += "case 0xB:{data = this." + readROM + "(address | 0) | 0;break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
         */
        code += "case 0xC:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
         */
        code += "case 0xD:{data = this." + readROM2 + "(address | 0) | 0;break};";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         */
        code += "case 0xE:";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         --UNDOCUMENTED MIRROR--
         */
        code += "case 0xF:{data = this." + readSRAM + "(address | 0) | 0;break};";
        /*
         Unused (0F000000-FFFFFFFF)
         */
        code += "default:{data = this." + readUnused + "(" + ((readUnused.slice(0, 12) == "readUnused32") ? "" : "address | 0") + ") | 0};";
        //Generate the function:
        code += "}return data | 0;";
        return Function("address", code);
    }
    function compileMemoryWriteDispatch(writeUnused, writeExternalWRAM, writeInternalWRAM,
                                        writeIODispatch, writePalette, writeVRAM,
                                        writeOAM, writeROM, writeSRAM) {
        var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
        /*
         Decoder for the nibble at bits 24-27
         (Top 4 bits of the address falls through to default (unused),
         so the next nibble down is used for dispatch.):
         */
        /*
         BIOS Area (00000000-00003FFF)
         Unused (00004000-01FFFFFF)
         */
        /*
         Unused (00004000-01FFFFFF)
         */
        /*
         WRAM - On-board Work RAM (02000000-0203FFFF)
         Unused (02040000-02FFFFFF)
         */
        code += "case 0x2:{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
        /*
         WRAM - In-Chip Work RAM (03000000-03007FFF)
         Unused (03008000-03FFFFFF)
         */
        code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
        /*
         I/O Registers (04000000-040003FE)
         Unused (04000400-04FFFFFF)
         */
        code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
        /*
         BG/OBJ Palette RAM (05000000-050003FF)
         Unused (05000400-05FFFFFF)
         */
        code += "case 0x5:{this." + writePalette + "(address | 0, data | 0);break};";
        /*
         VRAM - Video RAM (06000000-06017FFF)
         Unused (06018000-06FFFFFF)
         */
        code += "case 0x6:{this." + writeVRAM + "(address | 0, data | 0);break};";
        /*
         OAM - OBJ Attributes (07000000-070003FF)
         Unused (07000400-07FFFFFF)
         */
        code += "case 0x7:{this." + writeOAM + "(address | 0, data | 0);break};";
        /*
         Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
         */
        code += "case 0x8:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
         */
        code += "case 0x9:";
        /*
         Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
         */
        code += "case 0xA:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
         */
        code += "case 0xB:";
        /*
         Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
         */
        code += "case 0xC:";
        /*
         Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
         */
        code += "case 0xD:{this." + writeROM + "(address | 0, data | 0);break};";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         */
        code += "case 0xE:";
        /*
         Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
         --UNDOCUMENTED MIRROR--
         */
        code += "case 0xF:{this." + writeSRAM + "(address | 0, data | 0);break};";
        /*
         Unused (0F000000-FFFFFFFF)
         */
        code += "default:{this." + writeUnused + "()}";
        //Generate the function:
        code += "}";
        return Function("address", "data", code);
    }
    GameBoyAdvanceMemory.prototype.memoryRead8Generated = [
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readInternalWRAM8",
                                                                                        "readInternalWRAM8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        ),
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readExternalWRAM8",
                                                                                        "readInternalWRAM8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        ),
                                                             compileMemoryReadDispatch(
                                                                                        "readUnused8",
                                                                                        "readUnused8",
                                                                                        "readUnused8",
                                                                                        "readIODispatch8",
                                                                                        "readPalette8",
                                                                                        "readVRAM8",
                                                                                        "readOAM8",
                                                                                        "readROM8",
                                                                                        "readROM28",
                                                                                        "readSRAM8",
                                                                                        "readBIOS8"
                                                                                        )
                                                             ];
    GameBoyAdvanceMemory.prototype.memoryWrite8Generated = [
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         ),
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeExternalWRAM8",
                                                                                         "writeInternalWRAM8",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         ),
                                                             compileMemoryWriteDispatch(
                                                                                         "writeUnused",
                                                                                         "writeUnused",
                                                                                         "writeUnused",
                                                                                         "writeIODispatch8",
                                                                                         "writePalette8",
                                                                                         "writeVRAM8",
                                                                                         "writeOAM8",
                                                                                         "writeROM8",
                                                                                         "writeSRAM8"
                                                                                         )
                                                             ];
    GameBoyAdvanceMemory.prototype.memoryRead16Generated = [
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readInternalWRAM16",
                                                                                         "readInternalWRAM16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readExternalWRAM16",
                                                                                         "readInternalWRAM16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused16",
                                                                                         "readUnused16",
                                                                                         "readUnused16",
                                                                                         "readIODispatch16",
                                                                                         "readPalette16",
                                                                                         "readVRAM16",
                                                                                         "readOAM16",
                                                                                         "readROM16",
                                                                                         "readROM216",
                                                                                         "readSRAM16",
                                                                                         "readBIOS16"
                                                                                         )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryReadCPU16Generated = [
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readExternalWRAM16CPU",
                                                                                            "readInternalWRAM16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused16CPU",
                                                                                            "readUnused16CPU",
                                                                                            "readUnused16CPU",
                                                                                            "readIODispatch16CPU",
                                                                                            "readPalette16CPU",
                                                                                            "readVRAM16CPU",
                                                                                            "readOAM16CPU",
                                                                                            "readROM16CPU",
                                                                                            "readROM216CPU",
                                                                                            "readSRAM16CPU",
                                                                                            "readBIOS16CPU"
                                                                                            )
                                                                 ];
    GameBoyAdvanceMemory.prototype.memoryWrite16Generated = [
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeExternalWRAM16",
                                                                                          "writeInternalWRAM16",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeIODispatch16",
                                                                                          "writePalette16",
                                                                                          "writeVRAM16",
                                                                                          "writeOAM16",
                                                                                          "writeROM16",
                                                                                          "writeSRAM16"
                                                                                          )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryRead32Generated = [
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readInternalWRAM32",
                                                                                         "readInternalWRAM32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readExternalWRAM32",
                                                                                         "readInternalWRAM32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         ),
                                                              compileMemoryReadDispatch(
                                                                                         "readUnused32",
                                                                                         "readUnused32",
                                                                                         "readUnused32",
                                                                                         "readIODispatch32",
                                                                                         "readPalette32",
                                                                                         "readVRAM32",
                                                                                         "readOAM32",
                                                                                         "readROM32",
                                                                                         "readROM232",
                                                                                         "readSRAM32",
                                                                                         "readBIOS32"
                                                                                         )
                                                              ];
    GameBoyAdvanceMemory.prototype.memoryReadCPU32Generated = [
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readExternalWRAM32CPU",
                                                                                            "readInternalWRAM32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            ),
                                                                 compileMemoryReadDispatch(
                                                                                            "readUnused32CPU",
                                                                                            "readUnused32CPU",
                                                                                            "readUnused32CPU",
                                                                                            "readIODispatch32CPU",
                                                                                            "readPalette32CPU",
                                                                                            "readVRAM32CPU",
                                                                                            "readOAM32CPU",
                                                                                            "readROM32CPU",
                                                                                            "readROM232CPU",
                                                                                            "readSRAM32CPU",
                                                                                            "readBIOS32CPU"
                                                                                            )
                                                                 ];
    GameBoyAdvanceMemory.prototype.memoryWrite32Generated = [
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeExternalWRAM32",
                                                                                          "writeInternalWRAM32",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          ),
                                                              compileMemoryWriteDispatch(
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeUnused",
                                                                                          "writeIODispatch32",
                                                                                          "writePalette32",
                                                                                          "writeVRAM32",
                                                                                          "writeOAM32",
                                                                                          "writeROM32",
                                                                                          "writeSRAM32"
                                                                                          )
                                                              ];
}
generateMemoryTopLevelDispatch();