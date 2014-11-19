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
function GameBoyAdvanceMemoryDispatchGenerator(memory) {
    this.memory = memory;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryReadIO8 = function () {
    var readIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    readIO[0] = function (parentObj) {
        return parentObj.gfx.readDISPCNT0() | 0;
    }
    //4000001h - DISPCNT - LCD Control (Read/Write)
    readIO[0x1] = function (parentObj) {
        return parentObj.gfx.readDISPCNT1() | 0;
    }
    //4000002h - Undocumented - Green Swap (R/W)
    readIO[0x2] = function (parentObj) {
        return parentObj.gfx.readGreenSwap() | 0;
    }
    //4000003h - Undocumented - Green Swap (R/W)
    readIO[0x3] = this.memory.readZero;
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x4] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT0() | 0;
    }
    //4000005h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x5] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT1() | 0;
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    readIO[0x6] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readVCOUNT() | 0;
    }
    //4000007h - VCOUNT - Vertical Counter (Read only)
    readIO[0x7] = this.memory.readZero;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x8] = function (parentObj) {
        return parentObj.gfx.readBG0CNT0() | 0;
    }
    //4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x9] = function (parentObj) {
        return parentObj.gfx.readBG0CNT1() | 0;
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xA] = function (parentObj) {
        return parentObj.gfx.readBG1CNT0() | 0;
    }
    //400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xB] = function (parentObj) {
        return parentObj.gfx.readBG1CNT1() | 0;
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xC] = function (parentObj) {
        return parentObj.gfx.readBG2CNT0() | 0;
    }
    //400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xD] = function (parentObj) {
        return parentObj.gfx.readBG2CNT1() | 0;
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xE] = function (parentObj) {
        return parentObj.gfx.readBG3CNT0() | 0;
    }
    //400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xF] = function (parentObj) {
        return parentObj.gfx.readBG3CNT1() | 0;
    }
    //4000010h through 4000047h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0x10, 0x47);
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x48] = function (parentObj) {
        return parentObj.gfx.readWININ0() | 0;
    }
    //4000049h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x49] = function (parentObj) {
        return parentObj.gfx.readWININ1() | 0;
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4A] = function (parentObj) {
        return parentObj.gfx.readWINOUT0() | 0;
    }
    //400004AB- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4B] = function (parentObj) {
        return parentObj.gfx.readWINOUT1() | 0;
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    readIO[0x4C] = this.memory.readUnused0;
    //400004Dh - MOSAIC - Mosaic Size (W)
    readIO[0x4D] = this.memory.readUnused1;
    //400004Eh - NOT USED - ZERO
    readIO[0x4E] = this.memory.readUnused2;
    //400004Fh - NOT USED - ZERO
    readIO[0x4F] = this.memory.readUnused3;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x50] = function (parentObj) {
        return parentObj.gfx.readBLDCNT0() | 0;
    }
    //4000051h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x51] = function (parentObj) {
        return parentObj.gfx.readBLDCNT1() | 0;
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x52] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA0() | 0;
    }
    //4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x53] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA1() | 0;
    }
    //4000054h through 400005Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x54, 0x5F);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    readIO[0x60] = function (parentObj) {
        //NR10:
        return parentObj.sound.readSOUND1CNT_L() | 0;
    }
    //4000061h - NOT USED - ZERO
    readIO[0x61] = this.memory.readZero;
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x62] = function (parentObj) {
        //NR11:
        return parentObj.sound.readSOUND1CNT_H0() | 0;
    }
    //4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x63] = function (parentObj) {
        //NR12:
        return parentObj.sound.readSOUND1CNT_H1() | 0;
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x64] = this.memory.readZero;
    //4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x65] = function (parentObj) {
        //NR14:
        return parentObj.sound.readSOUND1CNT_X() | 0;
    }
    //4000066h - NOT USED - ZERO
    readIO[0x66] = this.memory.readZero;
    //4000067h - NOT USED - ZERO
    readIO[0x67] = this.memory.readZero;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x68] = function (parentObj) {
        //NR21:
        return parentObj.sound.readSOUND2CNT_L0() | 0;
    }
    //4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x69] = function (parentObj) {
        //NR22:
        return parentObj.sound.readSOUND2CNT_L1() | 0;
    }
    //400006Ah - NOT USED - ZERO
    readIO[0x6A] = this.memory.readZero;
    //400006Bh - NOT USED - ZERO
    readIO[0x6B] = this.memory.readZero;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6C] = this.memory.readZero;
    //400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6D] = function (parentObj) {
        //NR24:
        return parentObj.sound.readSOUND2CNT_H() | 0;
    }
    //400006Eh - NOT USED - ZERO
    readIO[0x6E] = this.memory.readZero;
    //400006Fh - NOT USED - ZERO
    readIO[0x6F] = this.memory.readZero;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x70] = function (parentObj) {
        //NR30:
        return parentObj.sound.readSOUND3CNT_L() | 0;
    }
    //4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x71] = this.memory.readZero;
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x72] = this.memory.readZero;
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x73] = function (parentObj) {
        //NR32:
        return parentObj.sound.readSOUND3CNT_H() | 0;
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x74] = this.memory.readZero;
    //4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x75] = function (parentObj) {
        //NR34:
        return parentObj.sound.readSOUND3CNT_X() | 0;
    }
    //4000076h - NOT USED - ZERO
    readIO[0x76] = this.memory.readZero;
    //4000077h - NOT USED - ZERO
    readIO[0x77] = this.memory.readZero;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x78] = this.memory.readZero;
    //4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x79] = function (parentObj) {
        //NR42:
        return parentObj.sound.readSOUND4CNT_L() | 0;
    }
    //400007Ah - NOT USED - ZERO
    readIO[0x7A] = this.memory.readZero;
    //400007Bh - NOT USED - ZERO
    readIO[0x7B] = this.memory.readZero;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7C] = function (parentObj) {
        //NR43:
        return parentObj.sound.readSOUND4CNT_H0() | 0;
    }
    //400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7D] = function (parentObj) {
        //NR44:
        return parentObj.sound.readSOUND4CNT_H1() | 0;
    }
    //400007Eh - NOT USED - ZERO
    readIO[0x7E] = this.memory.readZero;
    //400007Fh - NOT USED - ZERO
    readIO[0x7F] = this.memory.readZero;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x80] = function (parentObj) {
        //NR50:
        return parentObj.sound.readSOUNDCNT_L0() | 0;
    }
    //4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x81] = function (parentObj) {
        //NR51:
        return parentObj.sound.readSOUNDCNT_L1() | 0;
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x82] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H0() | 0;
    }
    //4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x83] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H1() | 0;
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    readIO[0x84] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readSOUNDCNT_X() | 0;
    }
    //4000085h - NOT USED - ZERO
    readIO[0x85] = this.memory.readZero;
    //4000086h - NOT USED - ZERO
    readIO[0x86] = this.memory.readZero;
    //4000087h - NOT USED - ZERO
    readIO[0x87] = this.memory.readZero;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x88] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS0() | 0;
    }
    //4000089h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x89] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS1() | 0;
    }
    //400008Ah - NOT USED - ZERO
    readIO[0x8A] = this.memory.readZero;
    //400008Bh - NOT USED - ZERO
    readIO[0x8B] = this.memory.readZero;
    //400008Ch - NOT USED - GLITCHED
    readIO[0x8C] = this.memory.readUnused0;
    //400008Dh - NOT USED - GLITCHED
    readIO[0x8D] = this.memory.readUnused1;
    //400008Eh - NOT USED - GLITCHED
    readIO[0x8E] = this.memory.readUnused2;
    //400008Fh - NOT USED - GLITCHED
    readIO[0x8F] = this.memory.readUnused3;
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x90] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(0) | 0;
    }
    //4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x91] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(1) | 0;
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x92] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(2) | 0;
    }
    //4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x93] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(3) | 0;
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x94] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(4) | 0;
    }
    //4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x95] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(5) | 0;
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x96] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(6) | 0;
    }
    //4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x97] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(7) | 0;
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x98] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(8) | 0;
    }
    //4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x99] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(9) | 0;
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9A] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(10) | 0;
    }
    //400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9B] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(11) | 0;
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9C] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(12) | 0;
    }
    //400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9D] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(13) | 0;
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9E] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(14) | 0;
    }
    //400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9F] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(15) | 0;
    }
    //40000A0h through 40000B9h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xA0, 0xB9);
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBA] = function (parentObj) {
        return parentObj.dma.readDMAControl0(0) | 0;
    }
    //40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBB] = function (parentObj) {
        return parentObj.dma.readDMAControl1(0) | 0;
    }
    //40000BCh through 40000C5h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xBC, 0xC5);
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC6] = function (parentObj) {
        return parentObj.dma.readDMAControl0(1) | 0;
    }
    //40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC7] = function (parentObj) {
        return parentObj.dma.readDMAControl1(1) | 0;
    }
    //40000C8h through 40000D1h - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xC8, 0xD1);
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD2] = function (parentObj) {
        return parentObj.dma.readDMAControl0(2) | 0;
    }
    //40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD3] = function (parentObj) {
        return parentObj.dma.readDMAControl1(2) | 0;
    }
    //40000D4h through 40000DDh - WRITE ONLY
    this.fillReadTableUnused8(readIO, 0xD4, 0xDD);
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDE] = function (parentObj) {
        return parentObj.dma.readDMAControl0(3) | 0;
    }
    //40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDF] = function (parentObj) {
        return parentObj.dma.readDMAControl1(3) | 0;
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0xE0, 0xFF);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x100] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L0() | 0;
    }
    //4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x101] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L1() | 0;
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x102] = function (parentObj) {
        return parentObj.timer.readTM0CNT_H() | 0;
    }
    //4000103h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x103] = this.memory.readZero;
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x104] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L0() | 0;
    }
    //4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x105] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L1() | 0;
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x106] = function (parentObj) {
        return parentObj.timer.readTM1CNT_H() | 0;
    }
    //4000107h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x107] = this.memory.readZero;
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x108] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L0() | 0;
    }
    //4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x109] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L1() | 0;
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10A] = function (parentObj) {
        return parentObj.timer.readTM2CNT_H() | 0;
    }
    //400010Bh - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10B] = this.memory.readZero;
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10C] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L0() | 0;
    }
    //400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10D] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L1() | 0;
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10E] = function (parentObj) {
        return parentObj.timer.readTM3CNT_H() | 0;
    }
    //400010Fh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10F] = this.memory.readZero;
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x110, 0x11F);
    //4000120h - Serial Data A (R/W)
    readIO[0x120] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A0() | 0;
    }
    //4000121h - Serial Data A (R/W)
    readIO[0x121] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A1() | 0;
    }
    //4000122h - Serial Data B (R/W)
    readIO[0x122] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B0() | 0;
    }
    //4000123h - Serial Data B (R/W)
    readIO[0x123] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B1() | 0;
    }
    //4000124h - Serial Data C (R/W)
    readIO[0x124] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C0() | 0;
    }
    //4000125h - Serial Data C (R/W)
    readIO[0x125] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C1() | 0;
    }
    //4000126h - Serial Data D (R/W)
    readIO[0x126] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D0() | 0;
    }
    //4000127h - Serial Data D (R/W)
    readIO[0x127] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D1() | 0;
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x128] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT0() | 0;
    }
    //4000129h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x129] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT1() | 0;
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12A] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_0() | 0;
    }
    //400012Bh - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12B] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_1() | 0;
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x12C, 0x12F);
    //4000130h - KEYINPUT - Key Status (R)
    readIO[0x130] = function (parentObj) {
        return parentObj.joypad.readKeyStatus0() | 0;
    }
    //4000131h - KEYINPUT - Key Status (R)
    readIO[0x131] = function (parentObj) {
        return parentObj.joypad.readKeyStatus1() | 0;
    }
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x132] = function (parentObj) {
        return parentObj.joypad.readKeyControl0() | 0;
    }
    //4000133h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x133] = function (parentObj) {
        return parentObj.joypad.readKeyControl1() | 0;
    }
    //4000134h - RCNT (R/W) - Mode Selection
    readIO[0x134] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT0() | 0;
    }
    //4000135h - RCNT (R/W) - Mode Selection
    readIO[0x135] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT1() | 0;
    }
    //4000136h - NOT USED - ZERO
    readIO[0x136] = this.memory.readZero;
    //4000137h - NOT USED - ZERO
    readIO[0x137] = this.memory.readZero;
    //4000138h through 400013Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x138, 0x13F);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x140] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYCNT() | 0;
    }
    //4000141h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x141] = this.memory.readZero;
    //4000142h - NOT USED - ZERO
    readIO[0x142] = this.memory.readZero;
    //4000143h - NOT USED - ZERO
    readIO[0x143] = this.memory.readZero;
    //4000144h through 400014Fh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x144, 0x14F);
    //4000150h - JoyBus Receive (R/W)
    readIO[0x150] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV0() | 0;
    }
    //4000151h - JoyBus Receive (R/W)
    readIO[0x151] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV1() | 0;
    }
    //4000152h - JoyBus Receive (R/W)
    readIO[0x152] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV2() | 0;
    }
    //4000153h - JoyBus Receive (R/W)
    readIO[0x153] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV3() | 0;
    }
    //4000154h - JoyBus Send (R/W)
    readIO[0x154] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND0() | 0;
    }
    //4000155h - JoyBus Send (R/W)
    readIO[0x155] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND1() | 0;
    }
    //4000156h - JoyBus Send (R/W)
    readIO[0x156] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND2() | 0;
    }
    //4000157h - JoyBus Send (R/W)
    readIO[0x157] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND3() | 0;
    }
    //4000158h - JoyBus Stat (R/W)
    readIO[0x158] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_STAT() | 0;
    }
    //4000159h - JoyBus Stat (R/W)
    readIO[0x159] = this.memory.readZero;
    //400015Ah - NOT USED - ZERO
    readIO[0x15A] = this.memory.readZero;
    //400015Bh - NOT USED - ZERO
    readIO[0x15B] = this.memory.readZero;
    //400015Ch through 40001FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x15C, 0x1FF);
    //4000200h - IE - Interrupt Enable Register (R/W)
    readIO[0x200] = function (parentObj) {
        return parentObj.irq.readIE0() | 0;
    }
    //4000201h - IE - Interrupt Enable Register (R/W)
    readIO[0x201] = function (parentObj) {
        return parentObj.irq.readIE1() | 0;
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x202] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF0() | 0;
    }
    //4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x203] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF1() | 0;
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    readIO[0x204] = function (parentObj) {
        return parentObj.wait.readWAITCNT0() | 0;
    }
    //4000205h - WAITCNT - Waitstate Control (R/W)
    readIO[0x205] = function (parentObj) {
        return parentObj.wait.readWAITCNT1() | 0;
    }
    //4000206h - NOT USED - ZERO
    readIO[0x206] = this.memory.readZero;
    //4000207h - NOT USED - ZERO
    readIO[0x207] = this.memory.readZero;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x208] = function (parentObj) {
        return parentObj.irq.readIME() | 0;
    }
    //4000209h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x209] = this.memory.readZero;
    //400020Ah - NOT USED - ZERO
    readIO[0x20A] = this.memory.readZero;
    //400020Bh - NOT USED - ZERO
    readIO[0x20B] = this.memory.readZero;
    //400020Ch through 40002FFh - NOT USED - GLITCHED
    this.fillReadTableUnused8(readIO, 0x20C, 0x2FF);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    readIO[0x300] = function (parentObj) {
        return parentObj.wait.readPOSTBOOT() | 0;
    }
    //4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
    readIO[0x301] = this.memory.readZero;
    //4000302h - NOT USED - ZERO
    readIO[0x302] = this.memory.readZero;
    //4000303h - NOT USED - ZERO
    readIO[0x303] = this.memory.readZero;
    return readIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryReadIO16 = function () {
    var readIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    readIO[0] = function (parentObj) {
        return parentObj.gfx.readDISPCNT0() | (parentObj.gfx.readDISPCNT1() << 8);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    readIO[0x2 >> 1] = function (parentObj) {
        return parentObj.gfx.readGreenSwap() | 0;
    }
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    readIO[0x4 >> 1] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readDISPSTAT0() | (parentObj.gfx.readDISPSTAT1() << 8);
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    readIO[0x6 >> 1] = function (parentObj) {
        parentObj.IOCore.updateGraphicsClocking();
        return parentObj.gfx.readVCOUNT() | 0;
    }
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    readIO[0x8 >> 1] = function (parentObj) {
        return parentObj.gfx.readBG0CNT0() | (parentObj.gfx.readBG0CNT1() << 8);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    readIO[0xA >> 1] = function (parentObj) {
        return parentObj.gfx.readBG1CNT0() | (parentObj.gfx.readBG1CNT1() << 8);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    readIO[0xC >> 1] = function (parentObj) {
        return parentObj.gfx.readBG2CNT0() | (parentObj.gfx.readBG2CNT1() << 8);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    readIO[0xE >> 1] = function (parentObj) {
        return parentObj.gfx.readBG3CNT0() | (parentObj.gfx.readBG3CNT1() << 8);
    }
    //4000010h through 4000047h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0x10 >> 1, 0x46 >> 1);
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    readIO[0x48 >> 1] = function (parentObj) {
        return parentObj.gfx.readWININ0() | (parentObj.gfx.readWININ1() << 8);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    readIO[0x4A >> 1] = function (parentObj) {
        return parentObj.gfx.readWINOUT0() | (parentObj.gfx.readWINOUT1() << 8);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    readIO[0x4C >> 1] = this.memory.readUnused16IO1;
    //400004Eh - NOT USED - ZERO
    readIO[0x4E >> 1] = this.memory.readUnused16IO2;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    readIO[0x50 >> 1] = function (parentObj) {
        return parentObj.gfx.readBLDCNT0() | (parentObj.gfx.readBLDCNT1() << 8);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    readIO[0x52 >> 1] = function (parentObj) {
        return parentObj.gfx.readBLDALPHA0() | (parentObj.gfx.readBLDALPHA1() << 8);
    }
    //4000054h through 400005Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x54 >> 1, 0x5E >> 1);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    readIO[0x60 >> 1] = function (parentObj) {
        //NR10:
        return parentObj.sound.readSOUND1CNT_L() | 0;
    }
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    readIO[0x62 >> 1] = function (parentObj) {
        //NR11:
        //NR12:
        return parentObj.sound.readSOUND1CNT_H0() | (parentObj.sound.readSOUND1CNT_H1() << 8);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    readIO[0x64 >> 1] = function (parentObj) {
        //NR14:
        return parentObj.sound.readSOUND1CNT_X() << 8;
    }
    //4000066h - NOT USED - ZERO
    readIO[0x66 >> 1] = this.memory.readZero;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    readIO[0x68 >> 1] = function (parentObj) {
        //NR21:
        //NR22:
        return parentObj.sound.readSOUND2CNT_L0() | (parentObj.sound.readSOUND2CNT_L1() << 8);
    }
    //400006Ah - NOT USED - ZERO
    readIO[0x6A >> 1] = this.memory.readZero;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    readIO[0x6C >> 1] = function (parentObj) {
        //NR24:
        return parentObj.sound.readSOUND2CNT_H() << 8;
    }
    //400006Eh - NOT USED - ZERO
    readIO[0x6E >> 1] = this.memory.readZero;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    readIO[0x70 >> 1] = function (parentObj) {
        //NR30:
        return parentObj.sound.readSOUND3CNT_L() | 0;
    }
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    readIO[0x72 >> 1] = function (parentObj) {
        //NR32:
        return parentObj.sound.readSOUND3CNT_H() << 8;
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    readIO[0x74 >> 1] = function (parentObj) {
        //NR34:
        return parentObj.sound.readSOUND3CNT_X() << 8;
    }
    //4000076h - NOT USED - ZERO
    readIO[0x76 >> 1] = this.memory.readZero;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    readIO[0x78 >> 1] = function (parentObj) {
        //NR42:
        return parentObj.sound.readSOUND4CNT_L() << 8;
    }
    //400007Ah - NOT USED - ZERO
    readIO[0x7A >> 1] = this.memory.readZero;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    readIO[0x7C >> 1] = function (parentObj) {
        //NR43:
        //NR44:
        return parentObj.sound.readSOUND4CNT_H0() | (parentObj.sound.readSOUND4CNT_H1() << 8);
    }
    //400007Eh - NOT USED - ZERO
    readIO[0x7E >> 1] = this.memory.readZero;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    readIO[0x80 >> 1] = function (parentObj) {
        //NR50:
        //NR51:
        return parentObj.sound.readSOUNDCNT_L0() | (parentObj.sound.readSOUNDCNT_L1() << 8);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    readIO[0x82 >> 1] = function (parentObj) {
        return parentObj.sound.readSOUNDCNT_H0() | (parentObj.sound.readSOUNDCNT_H1() << 8);
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    readIO[0x84 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readSOUNDCNT_X() | 0;
    }
    //4000086h - NOT USED - ZERO
    readIO[0x86 >> 1] = this.memory.readZero;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
    readIO[0x88 >> 1] = function (parentObj) {
        return parentObj.sound.readSOUNDBIAS0() | (parentObj.sound.readSOUNDBIAS1() << 8);
    }
    //400008Ah - NOT USED - ZERO
    readIO[0x8A >> 1] = this.memory.readZero;
    //400008Ch - NOT USED - GLITCHED
    readIO[0x8C >> 1] = this.memory.readUnused16IO1;
    //400008Eh - NOT USED - GLITCHED
    readIO[0x8E >> 1] = this.memory.readUnused16IO2;
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x90 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(0) | (parentObj.sound.readWAVE(1) << 8);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x92 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(2) | (parentObj.sound.readWAVE(3) << 8);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x94 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(4) | (parentObj.sound.readWAVE(5) << 8);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x96 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(6) | (parentObj.sound.readWAVE(7) << 8);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x98 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(8) | (parentObj.sound.readWAVE(9) << 8);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9A >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(10) | (parentObj.sound.readWAVE(11) << 8);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9C >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(12) | (parentObj.sound.readWAVE(13) << 8);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    readIO[0x9E >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.sound.readWAVE(14) | (parentObj.sound.readWAVE(15) << 8);
    }
    //40000A0h through 40000B9h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xA0 >> 1, 0xB8 >> 1);
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    readIO[0xBA >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(0) | (parentObj.dma.readDMAControl1(0) << 8);
    }
    //40000BCh through 40000C5h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xBC >> 1, 0xC4 >> 1);
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    readIO[0xC6 >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(1) | (parentObj.dma.readDMAControl1(1) << 8);
    }
    //40000C8h through 40000D1h - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xC8 >> 1, 0xD0 >> 1);
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    readIO[0xD2 >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(2) | (parentObj.dma.readDMAControl1(2) << 8);
    }
    //40000D4h through 40000DDh - WRITE ONLY
    this.fillReadTableUnused16(readIO, 0xD4 >> 1, 0xDC >> 1);
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    readIO[0xDE >> 1] = function (parentObj) {
        return parentObj.dma.readDMAControl0(3) | (parentObj.dma.readDMAControl1(3) << 8);
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0xE0 >> 1, 0xFE >> 1);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    readIO[0x100 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM0CNT_L0() | (parentObj.timer.readTM0CNT_L1() << 8);
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    readIO[0x102 >> 1] = function (parentObj) {
        return parentObj.timer.readTM0CNT_H() | 0;
    }
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    readIO[0x104 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM1CNT_L0() | (parentObj.timer.readTM1CNT_L1() << 8);
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    readIO[0x106 >> 1] = function (parentObj) {
        return parentObj.timer.readTM1CNT_H() | 0;
    }
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    readIO[0x108 >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM2CNT_L0() | (parentObj.timer.readTM2CNT_L1() << 8);
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    readIO[0x10A >> 1] = function (parentObj) {
        return parentObj.timer.readTM2CNT_H() | 0;
    }
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    readIO[0x10C >> 1] = function (parentObj) {
        parentObj.IOCore.updateTimerClocking();
        return parentObj.timer.readTM3CNT_L0() | (parentObj.timer.readTM3CNT_L1() << 8);
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    readIO[0x10E >> 1] = function (parentObj) {
        return parentObj.timer.readTM3CNT_H() | 0;
    }
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x110 >> 1, 0x11E >> 1);
    //4000120h - Serial Data A (R/W)
    readIO[0x120 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_A0() | (parentObj.serial.readSIODATA_A1() << 8);
    }
    //4000122h - Serial Data B (R/W)
    readIO[0x122 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_B0() | (parentObj.serial.readSIODATA_B1() << 8);
    }
    //4000124h - Serial Data C (R/W)
    readIO[0x124 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_C0() | (parentObj.serial.readSIODATA_C1() << 8);
    }
    //4000126h - Serial Data D (R/W)
    readIO[0x126 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA_D0() | (parentObj.serial.readSIODATA_D1() << 8);
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    readIO[0x128 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIOCNT0() | (parentObj.serial.readSIOCNT1() << 8);
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    readIO[0x12A >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readSIODATA8_0() | (parentObj.serial.readSIODATA8_1() << 8);
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x12C >> 1, 0x12E >> 1);
    //4000130h - KEYINPUT - Key Status (R)
    readIO[0x130 >> 1] = function (parentObj) {
        return parentObj.joypad.readKeyStatus0() | (parentObj.joypad.readKeyStatus1() << 8);
    }
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    readIO[0x132 >> 1] = function (parentObj) {
        return parentObj.joypad.readKeyControl0() | (parentObj.joypad.readKeyControl1() << 8);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    readIO[0x134 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readRCNT0() | (parentObj.serial.readRCNT1() << 8);
    }
    //4000136h - NOT USED - ZERO
    readIO[0x136 >> 1] = this.memory.readZero;
    //4000138h through 400013Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x138 >> 1, 0x13E >> 1);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    readIO[0x140 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYCNT() | 0;
    }
    //4000142h - NOT USED - ZERO
    readIO[0x142 >> 1] = this.memory.readZero;
    //4000144h through 400014Fh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x144 >> 1, 0x14E >> 1);
    //4000150h - JoyBus Receive (R/W)
    readIO[0x150 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV0() | (parentObj.serial.readJOYBUS_RECV1() << 8);
    }
    //4000152h - JoyBus Receive (R/W)
    readIO[0x152 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_RECV2() | (parentObj.serial.readJOYBUS_RECV3() << 8);
    }
    //4000154h - JoyBus Send (R/W)
    readIO[0x154 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND0() | (parentObj.serial.readJOYBUS_SEND1() << 8);
    }
    //4000156h - JoyBus Send (R/W)
    readIO[0x156 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_SEND2() | (parentObj.serial.readJOYBUS_SEND3() << 8);
    }
    //4000158h - JoyBus Stat (R/W)
    readIO[0x158 >> 1] = function (parentObj) {
        parentObj.IOCore.updateSerialClocking();
        return parentObj.serial.readJOYBUS_STAT() | 0;
    }
    //400015Ah - NOT USED - ZERO
    readIO[0x15A >> 1] = this.memory.readZero;
    //400015Ch through 40001FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x15C >> 1, 0x1FE >> 1);
    //4000200h - IE - Interrupt Enable Register (R/W)
    readIO[0x200 >> 1] = function (parentObj) {
        return parentObj.irq.readIE0() | (parentObj.irq.readIE1() << 8);
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    readIO[0x202 >> 1] = function (parentObj) {
        parentObj.IOCore.updateCoreSpillRetain();
        return parentObj.irq.readIF0() | (parentObj.irq.readIF1() << 8);
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    readIO[0x204 >> 1] = function (parentObj) {
        return parentObj.wait.readWAITCNT0() | (parentObj.wait.readWAITCNT1() << 8);
    }
    //4000206h - NOT USED - ZERO
    readIO[0x206 >> 1] = this.memory.readZero;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    readIO[0x208 >> 1] = function (parentObj) {
        return parentObj.irq.readIME() | 0;
    }
    //400020Ah - NOT USED - ZERO
    readIO[0x20A >> 1] = this.memory.readZero;
    //400020Ch through 40002FFh - NOT USED - GLITCHED
    this.fillReadTableUnused16(readIO, 0x20C >> 1, 0x2FE >> 1);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    readIO[0x300 >> 1] = function (parentObj) {
        return parentObj.wait.readPOSTBOOT() | 0;
    }
    //4000302h - NOT USED - ZERO
    readIO[0x302 >> 1] = this.memory.readZero;
    return readIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillReadTableUnused8 = function (readIO, from, to) {
    //Fill in slots of the i/o read table:
    while (from <= to) {
        readIO[from++] = this.memory.readUnused0;
        readIO[from++] = this.memory.readUnused1;
        readIO[from++] = this.memory.readUnused2;
        readIO[from++] = this.memory.readUnused3;
    }
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillReadTableUnused16 = function (readIO, from, to) {
    //Fill in slots of the i/o read table:
    while (from <= to) {
        if ((from & 0x1) == 0) {
            readIO[from++] = this.memory.readUnused16IO1;
        }
        else {
            readIO[from++] = this.memory.readUnused16IO2;
        }
    }
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryWriteIO8 = function () {
    var writeIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    writeIO[0] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT0(data | 0);
    }
    //4000001h - DISPCNT - LCD Control (Read/Write)
    writeIO[0x1] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT1(data | 0);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    writeIO[0x2] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeGreenSwap(data | 0);
    }
    //4000003h - Undocumented - Green Swap (R/W)
    writeIO[0x3] = this.memory.NOP;
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x4] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000005h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x5] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x6] = this.memory.NOP;
    //4000007h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x7] = this.memory.NOP;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x8] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT0(data | 0);
    }
    //4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x9] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT1(data | 0);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xA] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT0(data | 0);
    }
    //400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xB] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT1(data | 0);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xC] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT0(data | 0);
    }
    //400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xD] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT1(data | 0);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xE] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT0(data | 0);
    }
    //400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xF] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT1(data | 0);
    }
    //4000010h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x10] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS0(data | 0);
    }
    //4000011h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x11] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS1(data | 0);
    }
    //4000012h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x12] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS0(data | 0);
    }
    //4000013h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x13] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS1(data | 0);
    }
    //4000014h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x14] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS0(data | 0);
    }
    //4000015h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x15] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS1(data | 0);
    }
    //4000016h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x16] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS0(data | 0);
    }
    //4000017h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x17] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS1(data | 0);
    }
    //4000018h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x18] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS0(data | 0);
    }
    //4000019h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x19] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS1(data | 0);
    }
    //400001Ah - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS0(data | 0);
    }
    //400001Bh - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS1(data | 0);
    }
    //400001Ch - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS0(data | 0);
    }
    //400001Dh - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS1(data | 0);
    }
    //400001Eh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS0(data | 0);
    }
    //400001Fh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS1(data | 0);
    }
    //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x20] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA0(data | 0);
    }
    //4000021h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x21] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA1(data | 0);
    }
    //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x22] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB0(data | 0);
    }
    //4000023h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x23] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB1(data | 0);
    }
    //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x24] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC0(data | 0);
    }
    //4000025h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x25] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC1(data | 0);
    }
    //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x26] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD0(data | 0);
    }
    //4000027h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x27] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD1(data | 0);
    }
    //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x28] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L0(data | 0);
    }
    //4000029h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x29] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L1(data | 0);
    }
    //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H0(data | 0);
    }
    //400002Bh - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H1(data | 0);
    }
    //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L0(data | 0);
    }
    //400002Dh - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L1(data | 0);
    }
    //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H0(data | 0);
    }
    //400002Fh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H1(data | 0);
    }
    //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x30] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA0(data | 0);
    }
    //4000031h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x31] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA1(data | 0);
    }
    //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x32] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB0(data | 0);
    }
    //4000033h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x33] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB1(data | 0);
    }
    //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x34] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC0(data | 0);
    }
    //4000035h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x35] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC1(data | 0);
    }
    //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x36] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD0(data | 0);
    }
    //4000037h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x37] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD1(data | 0);
    }
    //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x38] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L0(data | 0);
    }
    //4000039h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x39] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L1(data | 0);
    }
    //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H0(data | 0);
    }
    //400003Bh - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H1(data | 0);
    }
    //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L0(data | 0);
    }
    //400003Dh - BGY_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L1(data | 0);
    }
    //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3E] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H0(data | 0);
    }
    //400003Fh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3F] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H1(data | 0);
    }
    //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x40] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H0(data | 0);
    }
    //4000041h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x41] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H1(data | 0);
    }
    //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x42] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H0(data | 0);
    }
    //4000043h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x43] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H1(data | 0);
    }
    //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x44] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V0(data | 0);
    }
    //4000045h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x45] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V1(data | 0);
    }
    //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x46] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V0(data | 0);
    }
    //4000047h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x47] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V1(data | 0);
    }
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x48] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ0(data | 0);
    }
    //4000049h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x49] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ1(data | 0);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4A] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT0(data | 0);
    }
    //400004AB- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4B] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT1(data | 0);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    writeIO[0x4C] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC0(data | 0);
    }
    //400004Dh - MOSAIC - Mosaic Size (W)
    writeIO[0x4D] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC1(data | 0);
    }
    //400004Eh - NOT USED - ZERO
    writeIO[0x4E] = this.memory.NOP;
    //400004Fh - NOT USED - ZERO
    writeIO[0x4F] = this.memory.NOP;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x50] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT0(data | 0);
    }
    //4000051h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x51] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT1(data | 0);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x52] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA0(data | 0);
    }
    //4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x53] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA1(data | 0);
    }
    //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
    writeIO[0x54] = function (parentObj, data) {
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDY(data | 0);
    }
    //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x55, 0x5F);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    writeIO[0x60] = function (parentObj, data) {
        //NR10:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_L(data | 0);
    }
    //4000061h - NOT USED - ZERO
    writeIO[0x61] = this.memory.NOP;
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x62] = function (parentObj, data) {
        //NR11:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H0(data | 0);
    }
    //4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x63] = function (parentObj, data) {
        //NR12:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H1(data | 0);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x64] = function (parentObj, data) {
        //NR13:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X0(data | 0);
    }
    //4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x65] = function (parentObj, data) {
        //NR14:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X1(data | 0);
    }
    //4000066h - NOT USED - ZERO
    writeIO[0x66] = this.memory.NOP;
    //4000067h - NOT USED - ZERO
    writeIO[0x67] = this.memory.NOP;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x68] = function (parentObj, data) {
        //NR21:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L0(data | 0);
    }
    //4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x69] = function (parentObj, data) {
        //NR22:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L1(data | 0);
    }
    //400006Ah - NOT USED - ZERO
    writeIO[0x6A] = this.memory.NOP;
    //400006Bh - NOT USED - ZERO
    writeIO[0x6B] = this.memory.NOP;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6C] = function (parentObj, data) {
        //NR23:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H0(data | 0);
    }
    //400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6D] = function (parentObj, data) {
        //NR24:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H1(data | 0);
    }
    //400006Eh - NOT USED - ZERO
    writeIO[0x6E] = this.memory.NOP;
    //400006Fh - NOT USED - ZERO
    writeIO[0x6F] = this.memory.NOP;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x70] = function (parentObj, data) {
        //NR30:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_L(data | 0);
    }
    //4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x71] = this.memory.NOP;
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x72] = function (parentObj, data) {
        //NR31:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H0(data | 0);
    }
    //4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x73] = function (parentObj, data) {
        //NR32:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H1(data | 0);
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x74] = function (parentObj, data) {
        //NR33:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X0(data | 0);
    }
    //4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x75] = function (parentObj, data) {
        //NR34:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X1(data | 0);
    }
    //4000076h - NOT USED - ZERO
    writeIO[0x76] = this.memory.NOP;
    //4000077h - NOT USED - ZERO
    writeIO[0x77] = this.memory.NOP;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x78] = function (parentObj, data) {
        //NR41:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L0(data | 0);
    }
    //4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x79] = function (parentObj, data) {
        //NR42:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L1(data | 0);
    }
    //400007Ah - NOT USED - ZERO
    writeIO[0x7A] = this.memory.NOP;
    //400007Bh - NOT USED - ZERO
    writeIO[0x7B] = this.memory.NOP;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7C] = function (parentObj, data) {
        //NR43:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H0(data | 0);
    }
    //400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7D] = function (parentObj, data) {
        //NR44:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H1(data | 0);
    }
    //400007Eh - NOT USED - ZERO
    writeIO[0x7E] = this.memory.NOP;
    //400007Fh - NOT USED - ZERO
    writeIO[0x7F] = this.memory.NOP;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x80] = function (parentObj, data) {
        //NR50:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L0(data | 0);
    }
    //4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x81] = function (parentObj, data) {
        //NR51:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L1(data | 0);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x82] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H0(data | 0);
    }
    //4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x83] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    writeIO[0x84] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_X(data | 0);
    }
    //4000085h - NOT USED - ZERO
    writeIO[0x85] = this.memory.NOP;
    //4000086h - NOT USED - ZERO
    writeIO[0x86] = this.memory.NOP;
    //4000087h - NOT USED - ZERO
    writeIO[0x87] = this.memory.NOP;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x88] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS0(data | 0);
    }
    //4000089h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x89] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS1(data | 0);
    }
    //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x8A, 0x8F);
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x90] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0, data | 0);
    }
    //4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x91] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x1, data | 0);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x92] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x2, data | 0);
    }
    //4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x93] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x3, data | 0);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x94] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x4, data | 0);
    }
    //4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x95] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x5, data | 0);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x96] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x6, data | 0);
    }
    //4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x97] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x7, data | 0);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x98] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x8, data | 0);
    }
    //4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x99] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x9, data | 0);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9A] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xA, data | 0);
    }
    //400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9B] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xB, data | 0);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9C] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xC, data | 0);
    }
    //400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9D] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xD, data | 0);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9E] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xE, data | 0);
    }
    //400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9F] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xF, data | 0);
    }
    //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA0] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A1h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA1] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA2] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A3h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA3] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data | 0);
    }
    //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA4] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A5h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA5] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA6] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A7h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA7] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data | 0);
    }
    //40000A8h through 40000AFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xA8, 0xAF);
    //40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB0] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(0, data | 0);
    }
    //40000B1h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB1] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(0, data | 0);
    }
    //40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB2] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(0, data | 0);
    }
    //40000B3h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB3] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(0, data & 0x7);    //Mask out the unused bits.
    }
    //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB4] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(0, data | 0);
    }
    //40000B5h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB5] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(0, data | 0);
    }
    //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB6] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(0, data | 0);
    }
    //40000B7h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB7] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(0, data & 0x7);
    }
    //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB8] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(0, data | 0);
    }
    //40000B9h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB9] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(0, data & 0x3F);
    }
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBA] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(0, data | 0);
    }
    //40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBB] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(0, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBC] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(1, data | 0);
    }
    //40000BDh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBD] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(1, data | 0);
    }
    //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBE] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(1, data | 0);
    }
    //40000BFh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBF] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(1, data & 0xF);    //Mask out the unused bits.
    }
    //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC0] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(1, data | 0);
    }
    //40000C1h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC1] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(1, data | 0);
    }
    //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC2] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(1, data | 0);
    }
    //40000C3h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC3] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(1, data & 0x7);
    }
    //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC4] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(1, data | 0);
    }
    //40000C5h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC5] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(1, data & 0x3F);
    }
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC6] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(1, data | 0);
    }
    //40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC7] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(1, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC8] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(2, data | 0);
    }
    //40000C9h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC9] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(2, data | 0);
    }
    //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCA] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(2, data | 0);
    }
    //40000CBh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCB] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(2, data & 0xF);    //Mask out the unused bits.
    }
    //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCC] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(2, data | 0);
    }
    //40000CDh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCD] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(2, data | 0);
    }
    //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCE] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(2, data | 0);
    }
    //40000CFh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCF] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(2, data & 0x7);
    }
    //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD0] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(2, data | 0);
    }
    //40000D1h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD1] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(2, data & 0x3F);
    }
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD2] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(2, data | 0);
    }
    //40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD3] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(2, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD4] = function (parentObj, data) {
        parentObj.dma.writeDMASource0(3, data | 0);
    }
    //40000D5h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD5] = function (parentObj, data) {
        parentObj.dma.writeDMASource1(3, data | 0);
    }
    //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD6] = function (parentObj, data) {
        parentObj.dma.writeDMASource2(3, data | 0);
    }
    //40000D7h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD7] = function (parentObj, data) {
        parentObj.dma.writeDMASource3(3, data & 0xF);    //Mask out the unused bits.
    }
    //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD8] = function (parentObj, data) {
        parentObj.dma.writeDMADestination0(3, data | 0);
    }
    //40000D9h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD9] = function (parentObj, data) {
        parentObj.dma.writeDMADestination1(3, data | 0);
    }
    //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDA] = function (parentObj, data) {
        parentObj.dma.writeDMADestination2(3, data | 0);
    }
    //40000DBh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDB] = function (parentObj, data) {
        parentObj.dma.writeDMADestination3(3, data & 0xF);
    }
    //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDC] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount0(3, data | 0);
    }
    //40000DDh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDD] = function (parentObj, data) {
        parentObj.dma.writeDMAWordCount1(3, data | 0);
    }
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDE] = function (parentObj, data) {
        parentObj.dma.writeDMAControl0(3, data | 0);
    }
    //40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDF] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(3, data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xE0, 0xFF);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x100] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x101] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x102] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000103h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x103] = this.memory.NOP;
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x104] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x105] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x106] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000107h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x107] = this.memory.NOP;
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x108] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x109] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10A] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Bh - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10B] = this.memory.NOP;
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10C] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10D] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10E] = function (parentObj, data) {
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_H(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Fh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10F] = this.memory.NOP;
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x110, 0x11F);
    //4000120h - Serial Data A (R/W)
    writeIO[0x120] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000121h - Serial Data A (R/W)
    writeIO[0x121] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000122h - Serial Data B (R/W)
    writeIO[0x122] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000123h - Serial Data B (R/W)
    writeIO[0x123] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000124h - Serial Data C (R/W)
    writeIO[0x124] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000125h - Serial Data C (R/W)
    writeIO[0x125] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000126h - Serial Data D (R/W)
    writeIO[0x126] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000127h - Serial Data D (R/W)
    writeIO[0x127] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x128] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000129h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x129] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12A] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Bh - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12B] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x12C, 0x12F);
    //4000130h - KEYINPUT - Key Status (R)
    writeIO[0x130] = this.memory.NOP;
    //4000131h - KEYINPUT - Key Status (R)
    writeIO[0x131] = this.memory.NOP;
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x132] = function (parentObj, data) {
        parentObj.joypad.writeKeyControl0(data | 0);
    }
    //4000133h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x133] = function (parentObj, data) {
        parentObj.joypad.writeKeyControl1(data | 0);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    writeIO[0x134] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000135h - RCNT (R/W) - Mode Selection
    writeIO[0x135] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000136h through 400013Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x136, 0x13F);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x140] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYCNT(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000141h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x141] = this.memory.NOP;
    //4000142h through 400014Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x142, 0x14F);
    //4000150h - JoyBus Receive (R/W)
    writeIO[0x150] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000151h - JoyBus Receive (R/W)
    writeIO[0x151] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000152h - JoyBus Receive (R/W)
    writeIO[0x152] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV2(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000153h - JoyBus Receive (R/W)
    writeIO[0x153] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV3(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000154h - JoyBus Send (R/W)
    writeIO[0x154] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000155h - JoyBus Send (R/W)
    writeIO[0x155] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000156h - JoyBus Send (R/W)
    writeIO[0x156] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND2(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000157h - JoyBus Send (R/W)
    writeIO[0x157] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND3(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000158h - JoyBus Stat (R/W)
    writeIO[0x158] = function (parentObj, data) {
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_STAT(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000159h through 40001FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x159, 0x1FF);
    //4000200h - IE - Interrupt Enable Register (R/W)
    writeIO[0x200] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000201h - IE - Interrupt Enable Register (R/W)
    writeIO[0x201] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x202] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF0(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x203] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF1(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x204] = function (parentObj, data) {
        parentObj.wait.writeWAITCNT0(data | 0);
    }
    //4000205h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x205] = function (parentObj, data) {
        parentObj.wait.writeWAITCNT1(data | 0);
    }
    //4000206h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x206] = this.memory.NOP;
    //4000207h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x207] = this.memory.NOP;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    writeIO[0x208] = function (parentObj, data) {
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIME(data | 0);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000209h through 40002FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x209, 0x2FF);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    writeIO[0x300] = function (parentObj, data) {
        parentObj.wait.writePOSTBOOT(data | 0);
    }
    //4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
    writeIO[0x301] = function (parentObj, data) {
        parentObj.wait.writeHALTCNT(data | 0);
    }
    return writeIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.generateMemoryWriteIO16 = function () {
    var writeIO = [];
    //4000000h - DISPCNT - LCD Control (Read/Write)
    writeIO[0] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPCNT0(data & 0xFF);
        parentObj.gfx.writeDISPCNT1(data >> 8);
    }
    //4000002h - Undocumented - Green Swap (R/W)
    writeIO[0x2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeGreenSwap(data & 0xFF);
    }
    //4000004h - DISPSTAT - General LCD Status (Read/Write)
    writeIO[0x4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeDISPSTAT0(data & 0xFF);
        parentObj.gfx.writeDISPSTAT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000006h - VCOUNT - Vertical Counter (Read only)
    writeIO[0x6 >> 1] = this.memory.NOP;
    //4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
    writeIO[0x8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0CNT0(data & 0xFF);
        parentObj.gfx.writeBG0CNT1(data >> 8);
    }
    //400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
    writeIO[0xA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1CNT0(data & 0xFF);
        parentObj.gfx.writeBG1CNT1(data >> 8);
    }
    //400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
    writeIO[0xC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2CNT0(data & 0xFF);
        parentObj.gfx.writeBG2CNT1(data >> 8);
    }
    //400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
    writeIO[0xE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3CNT0(data & 0xFF);
        parentObj.gfx.writeBG3CNT1(data >> 8);
    }
    //4000010h - BG0HOFS - BG0 X-Offset (W)
    writeIO[0x10 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0HOFS0(data & 0xFF);
        parentObj.gfx.writeBG0HOFS1(data >> 8);
    }
    //4000012h - BG0VOFS - BG0 Y-Offset (W)
    writeIO[0x12 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG0VOFS0(data & 0xFF);
        parentObj.gfx.writeBG0VOFS1(data >> 8);
    }
    //4000014h - BG1HOFS - BG1 X-Offset (W)
    writeIO[0x14 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1HOFS0(data & 0xFF);
        parentObj.gfx.writeBG1HOFS1(data >> 8);
    }
    //4000016h - BG1VOFS - BG1 Y-Offset (W)
    writeIO[0x16 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG1VOFS0(data & 0xFF);
        parentObj.gfx.writeBG1VOFS1(data >> 8);
    }
    //4000018h - BG2HOFS - BG2 X-Offset (W)
    writeIO[0x18 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2HOFS0(data & 0xFF);
        parentObj.gfx.writeBG2HOFS1(data >> 8);
    }
    //400001Ah - BG2VOFS - BG2 Y-Offset (W)
    writeIO[0x1A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2VOFS0(data & 0xFF);
        parentObj.gfx.writeBG2VOFS1(data >> 8);
    }
    //400001Ch - BG3HOFS - BG3 X-Offset (W)
    writeIO[0x1C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3HOFS0(data & 0xFF);
        parentObj.gfx.writeBG3HOFS1(data >> 8);
    }
    //400001Eh - BG3VOFS - BG3 Y-Offset (W)
    writeIO[0x1E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3VOFS0(data & 0xFF);
        parentObj.gfx.writeBG3VOFS1(data >> 8);
    }
    //4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x20 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PA0(data & 0xFF);
        parentObj.gfx.writeBG2PA1(data >> 8);
    }
    //4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x22 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PB0(data & 0xFF);
        parentObj.gfx.writeBG2PB1(data >> 8);
    }
    //4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x24 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PC0(data & 0xFF);
        parentObj.gfx.writeBG2PC1(data >> 8);
    }
    //4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x26 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2PD0(data & 0xFF);
        parentObj.gfx.writeBG2PD1(data >> 8);
    }
    //4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x28 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_L0(data & 0xFF);
        parentObj.gfx.writeBG2X_L1(data >> 8);
    }
    //400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x2A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2X_H0(data & 0xFF);
        parentObj.gfx.writeBG2X_H1(data >> 8);
    }
    //400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x2C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_L0(data & 0xFF);
        parentObj.gfx.writeBG2Y_L1(data >> 8);
    }
    //400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x2E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG2Y_H0(data & 0xFF);
        parentObj.gfx.writeBG2Y_H1(data >> 8);
    }
    //4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
    writeIO[0x30 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PA0(data & 0xFF);
        parentObj.gfx.writeBG3PA1(data >> 8);
    }
    //4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
    writeIO[0x32 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PB0(data & 0xFF);
        parentObj.gfx.writeBG3PB1(data >> 8);
    }
    //4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
    writeIO[0x34 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PC0(data & 0xFF);
        parentObj.gfx.writeBG3PC1(data >> 8);
    }
    //4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
    writeIO[0x36 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3PD0(data & 0xFF);
        parentObj.gfx.writeBG3PD1(data >> 8);
    }
    //4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
    writeIO[0x38 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_L0(data & 0xFF);
        parentObj.gfx.writeBG3X_L1(data >> 8);
    }
    //400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
    writeIO[0x3A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3X_H0(data & 0xFF);
        parentObj.gfx.writeBG3X_H1(data >> 8);
    }
    //400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
    writeIO[0x3C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_L0(data & 0xFF);
        parentObj.gfx.writeBG3Y_L1(data >> 8);
    }
    //400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
    writeIO[0x3E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBG3Y_H0(data & 0xFF);
        parentObj.gfx.writeBG3Y_H1(data >> 8);
    }
    //4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
    writeIO[0x40 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0H0(data & 0xFF);
        parentObj.gfx.writeWIN0H1(data >> 8);
    }
    //4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
    writeIO[0x42 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1H0(data & 0xFF);
        parentObj.gfx.writeWIN1H1(data >> 8);
    }
    //4000044h - WIN0V - Window 0 Vertical Dimensions (W)
    writeIO[0x44 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN0V0(data & 0xFF);
        parentObj.gfx.writeWIN0V1(data >> 8);
    }
    //4000046h - WIN1V - Window 1 Vertical Dimensions (W)
    writeIO[0x46 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWIN1V0(data & 0xFF);
        parentObj.gfx.writeWIN1V1(data >> 8);
    }
    //4000048h - WININ - Control of Inside of Window(s) (R/W)
    writeIO[0x48 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWININ0(data & 0xFF);
        parentObj.gfx.writeWININ1(data >> 8);
    }
    //400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
    writeIO[0x4A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeWINOUT0(data & 0xFF);
        parentObj.gfx.writeWINOUT1(data >> 8);
    }
    //400004Ch - MOSAIC - Mosaic Size (W)
    writeIO[0x4C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeMOSAIC0(data & 0xFF);
        parentObj.gfx.writeMOSAIC1(data >> 8);
    }
    //400004Eh - NOT USED - ZERO
    writeIO[0x4E >> 1] = this.memory.NOP;
    //4000050h - BLDCNT - Color Special Effects Selection (R/W)
    writeIO[0x50 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDCNT0(data & 0xFF);
        parentObj.gfx.writeBLDCNT1(data >> 8);
    }
    //4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
    writeIO[0x52 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDALPHA0(data & 0xFF);
        parentObj.gfx.writeBLDALPHA1(data >> 8);
    }
    //4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
    writeIO[0x54 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateGraphicsClocking();
        parentObj.gfx.writeBLDY(data & 0xFF);
    }
    //4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x56 >> 1, 0x5E >> 1);
    //4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
    writeIO[0x60 >> 1] = function (parentObj, data) {
        //NR10:
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_L(data & 0xFF);
    }
    //4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
    writeIO[0x62 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR11:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_H0(data & 0xFF);
        //NR12:
        parentObj.sound.writeSOUND1CNT_H1(data >> 8);
    }
    //4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
    writeIO[0x64 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR13:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND1CNT_X0(data & 0xFF);
        //NR14:
        parentObj.sound.writeSOUND1CNT_X1(data >> 8);
    }
    //4000066h - NOT USED - ZERO
    writeIO[0x66 >> 1] = this.memory.NOP;
    //4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
    writeIO[0x68 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR21:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_L0(data & 0xFF);
        //NR22:
        parentObj.sound.writeSOUND2CNT_L1(data >> 8);
    }
    //400006Ah - NOT USED - ZERO
    writeIO[0x6A >> 1] = this.memory.NOP;
    //400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
    writeIO[0x6C >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR23:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND2CNT_H0(data & 0xFF);
        //NR24:
        parentObj.sound.writeSOUND2CNT_H1(data >> 8);
    }
    //400006Eh - NOT USED - ZERO
    writeIO[0x6E >> 1] = this.memory.NOP;
    //4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
    writeIO[0x70 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR30:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_L(data & 0xFF);
    }
    //4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
    writeIO[0x72 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR31:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_H0(data & 0xFF);
        //NR32:
        parentObj.sound.writeSOUND3CNT_H1(data >> 8);
    }
    //4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
    writeIO[0x74 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR33:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND3CNT_X0(data & 0xFF);
        //NR34:
        parentObj.sound.writeSOUND3CNT_X1(data >> 8);
    }
    //4000076h - NOT USED - ZERO
    writeIO[0x76 >> 1] = this.memory.NOP;
    //4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
    writeIO[0x78 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR41:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_L0(data & 0xFF);
        //NR42:
        parentObj.sound.writeSOUND4CNT_L1(data >> 8);
    }
    //400007Ah - NOT USED - ZERO
    writeIO[0x7A >> 1] = this.memory.NOP;
    //400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
    writeIO[0x7C >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR43:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUND4CNT_H0(data & 0xFF);
        //NR44:
        parentObj.sound.writeSOUND4CNT_H1(data >> 8);
    }
    //400007Eh - NOT USED - ZERO
    writeIO[0x7E >> 1] = this.memory.NOP;
    //4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
    writeIO[0x80 >> 1] = function (parentObj, data) {
        data = data | 0;
        //NR50:
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_L0(data & 0xFF);
        //NR51:
        parentObj.sound.writeSOUNDCNT_L1(data >> 8);
    }
    //4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
    writeIO[0x82 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_H0(data & 0xFF);
        parentObj.sound.writeSOUNDCNT_H1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
    writeIO[0x84 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDCNT_X(data & 0xFF);
    }
    //4000086h - NOT USED - ZERO
    writeIO[0x86 >> 1] = this.memory.NOP;
    //4000088h - SOUNDBIAS - Sound PWM Control (R/W)
    writeIO[0x88 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeSOUNDBIAS0(data & 0xFF);
        parentObj.sound.writeSOUNDBIAS1(data >> 8);
    }
    //400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
    this.fillWriteTableNOP(writeIO, 0x8A >> 1, 0x8E >> 1);
    //4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x90 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0, data & 0xFF);
        parentObj.sound.writeWAVE(0x1, data >> 8);
    }
    //4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x92 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x2, data & 0xFF);
        parentObj.sound.writeWAVE(0x3, data >> 8);
    }
    //4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x94 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x4, data & 0xFF);
        parentObj.sound.writeWAVE(0x5, data >> 8);
    }
    //4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x96 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x6, data & 0xFF);
        parentObj.sound.writeWAVE(0x7, data >> 8);
    }
    //4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x98 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0x8, data & 0xFF);
        parentObj.sound.writeWAVE(0x9, data >> 8);
    }
    //400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xA, data & 0xFF);
        parentObj.sound.writeWAVE(0xB, data >> 8);
    }
    //400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xC, data & 0xFF);
        parentObj.sound.writeWAVE(0xD, data >> 8);
    }
    //400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
    writeIO[0x9E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeWAVE(0xE, data & 0xFF);
        parentObj.sound.writeWAVE(0xF, data >> 8);
    }
    //40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
    writeIO[0xA0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data & 0xFF);
        parentObj.sound.writeFIFOA(data >> 8);
    }
    //40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
    writeIO[0xA2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOA(data & 0xFF);
        parentObj.sound.writeFIFOA(data >> 8);
    }
    //40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
    writeIO[0xA4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data & 0xFF);
        parentObj.sound.writeFIFOB(data >> 8);
    }
    //40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
    writeIO[0xA6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.sound.writeFIFOB(data & 0xFF);
        parentObj.sound.writeFIFOB(data >> 8);
    }
    //40000A8h through 40000AFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xA8 >> 1, 0xAE >> 1);
    //40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(0, data & 0xFF);
        parentObj.dma.writeDMASource1(0, data >> 8);
    }
    //40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
    writeIO[0xB2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(0, data & 0xFF);
        parentObj.dma.writeDMASource3(0, (data >> 8) & 0x7);    //Mask out the unused bits.
    }
    //40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(0, data & 0xFF);
        parentObj.dma.writeDMADestination1(0, data >> 8);
    }
    //40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
    writeIO[0xB6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(0, data & 0xFF);
        parentObj.dma.writeDMADestination3(0, (data >> 8) & 0x7);
    }
    //40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xB8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(0, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(0, (data >> 8) & 0x3F);
    }
    //40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
    writeIO[0xBA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(0, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(0, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(1, data & 0xFF);
        parentObj.dma.writeDMASource1(1, data >> 8);
    }
    //40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
    writeIO[0xBE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(1, data & 0xFF);
        parentObj.dma.writeDMASource3(1, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(1, data & 0xFF);
        parentObj.dma.writeDMADestination1(1, data >> 8);
    }
    //40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
    writeIO[0xC2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(1, data & 0xFF);
        parentObj.dma.writeDMADestination3(1, (data >> 8) & 0x7);
    }
    //40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xC4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(1, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(1, (data >> 8) & 0x3F);
    }
    //40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
    writeIO[0xC6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(1, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(1, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
    writeIO[0xC8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(2, data & 0xFF);
        parentObj.dma.writeDMASource1(2, data >> 8);
    }
    //40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
    writeIO[0xCA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(2, data & 0xFF);
        parentObj.dma.writeDMASource3(2, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(2, data & 0xFF);
        parentObj.dma.writeDMADestination1(2, data >> 8);
    }
    //40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
    writeIO[0xCE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(2, data & 0xFF);
        parentObj.dma.writeDMADestination3(2, (data >> 8) & 0x7);
    }
    //40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
    writeIO[0xD0 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(2, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(2, (data >> 8) & 0x3F);
    }
    //40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
    writeIO[0xD2 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(2, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(2, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD4 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource0(3, data & 0xFF);
        parentObj.dma.writeDMASource1(3, data >> 8);
    }
    //40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
    writeIO[0xD6 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMASource2(3, data & 0xFF);
        parentObj.dma.writeDMASource3(3, (data >> 8) & 0xF);    //Mask out the unused bits.
    }
    //40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xD8 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination0(3, data & 0xFF);
        parentObj.dma.writeDMADestination1(3, data >> 8);
    }
    //40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
    writeIO[0xDA >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMADestination2(3, data & 0xFF);
        parentObj.dma.writeDMADestination3(3, (data >> 8) & 0xF);
    }
    //40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
    writeIO[0xDC >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAWordCount0(3, data & 0xFF);
        parentObj.dma.writeDMAWordCount1(3, data >> 8);
    }
    //40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
    writeIO[0xDE >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.dma.writeDMAControl0(3, data & 0xFF);
        parentObj.IOCore.updateCoreClocking();
        parentObj.dma.writeDMAControl1(3, data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //40000E0h through 40000FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0xE0 >> 1, 0xFE >> 1);
    //4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
    writeIO[0x100 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_L0(data & 0xFF);
        parentObj.timer.writeTM0CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000102h - TM0CNT_H - Timer 0 Control (R/W)
    writeIO[0x102 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM0CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
    writeIO[0x104 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_L0(data & 0xFF);
        parentObj.timer.writeTM1CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000106h - TM1CNT_H - Timer 1 Control (R/W)
    writeIO[0x106 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM1CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
    writeIO[0x108 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_L0(data & 0xFF);
        parentObj.timer.writeTM2CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ah - TM2CNT_H - Timer 2 Control (R/W)
    writeIO[0x10A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM2CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
    writeIO[0x10C >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_L0(data & 0xFF);
        parentObj.timer.writeTM3CNT_L1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400010Eh - TM3CNT_H - Timer 3 Control (R/W)
    writeIO[0x10E >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateTimerClocking();
        parentObj.timer.writeTM3CNT_H(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000110h through 400011Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x110 >> 1, 0x11E >> 1);
    //4000120h - Serial Data A (R/W)
    writeIO[0x120 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_A0(data & 0xFF);
        parentObj.serial.writeSIODATA_A1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000122h - Serial Data B (R/W)
    writeIO[0x122 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_B0(data & 0xFF);
        parentObj.serial.writeSIODATA_B1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000124h - Serial Data C (R/W)
    writeIO[0x124 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_C0(data & 0xFF);
        parentObj.serial.writeSIODATA_C1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000126h - Serial Data D (R/W)
    writeIO[0x126 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA_D0(data & 0xFF);
        parentObj.serial.writeSIODATA_D1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000128h - SIOCNT - SIO Sub Mode Control (R/W)
    writeIO[0x128 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIOCNT0(data & 0xFF);
        parentObj.serial.writeSIOCNT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ah - SIOMLT_SEND - Data Send Register (R/W)
    writeIO[0x12A >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeSIODATA8_0(data & 0xFF);
        parentObj.serial.writeSIODATA8_1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //400012Ch through 400012Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x12C >> 1, 0x12E >> 1);
    //4000130h - KEYINPUT - Key Status (R)
    writeIO[0x130 >> 1] = this.memory.NOP;
    //4000132h - KEYCNT - Key Interrupt Control (R/W)
    writeIO[0x132 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.joypad.writeKeyControl0(data & 0xFF);
        parentObj.joypad.writeKeyControl1(data >> 8);
    }
    //4000134h - RCNT (R/W) - Mode Selection
    writeIO[0x134 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeRCNT0(data & 0xFF);
        parentObj.serial.writeRCNT1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000136h through 400013Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x136 >> 1, 0x13E >> 1);
    //4000140h - JOYCNT - JOY BUS Control Register (R/W)
    writeIO[0x140 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYCNT(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000142h through 400014Fh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x142 >> 1, 0x14E >> 1);
    //4000150h - JoyBus Receive (R/W)
    writeIO[0x150 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV0(data & 0xFF);
        parentObj.serial.writeJOYBUS_RECV1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000152h - JoyBus Receive (R/W)
    writeIO[0x152 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_RECV2(data & 0xFF);
        parentObj.serial.writeJOYBUS_RECV3(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000154h - JoyBus Send (R/W)
    writeIO[0x154 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND0(data & 0xFF);
        parentObj.serial.writeJOYBUS_SEND1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000156h - JoyBus Send (R/W)
    writeIO[0x156 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_SEND2(data & 0xFF);
        parentObj.serial.writeJOYBUS_SEND3(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000158h - JoyBus Stat (R/W)
    writeIO[0x158 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateSerialClocking();
        parentObj.serial.writeJOYBUS_STAT(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000159h through 40001FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x15A >> 1, 0x1FE >> 1);
    //4000200h - IE - Interrupt Enable Register (R/W)
    writeIO[0x200 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIE0(data & 0xFF);
        parentObj.irq.writeIE1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
    writeIO[0x202 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIF0(data & 0xFF);
        parentObj.irq.writeIF1(data >> 8);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000204h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x204 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.wait.writeWAITCNT0(data & 0xFF);
        parentObj.wait.writeWAITCNT1(data >> 8);
    }
    //4000206h - WAITCNT - Waitstate Control (R/W)
    writeIO[0x206 >> 1] = this.memory.NOP;
    //4000208h - IME - Interrupt Master Enable Register (R/W)
    writeIO[0x208 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.IOCore.updateCoreClocking();
        parentObj.irq.writeIME(data & 0xFF);
        parentObj.IOCore.updateCoreEventTime();
    }
    //4000209h through 40002FFh - NOT USED - GLITCHED
    this.fillWriteTableNOP(writeIO, 0x20A >> 1, 0x2FE >> 1);
    //4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
    writeIO[0x300 >> 1] = function (parentObj, data) {
        data = data | 0;
        parentObj.wait.writePOSTBOOT(data & 0xFF);
        parentObj.wait.writeHALTCNT(data >> 8);
    }
    return writeIO;
}
GameBoyAdvanceMemoryDispatchGenerator.prototype.fillWriteTableNOP = function (writeIO, from, to) {
    //Fill in slots of the i/o write table:
    while (from <= to) {
        writeIO[from++] = this.memory.NOP;
    }
}