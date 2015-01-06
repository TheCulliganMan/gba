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
function GameBoyAdvanceChannel3Synth(sound) {
    this.sound = sound;
    this.currentSampleLeft = 0;
    this.currentSampleLeftSecondary = 0;
    this.currentSampleRight = 0;
    this.currentSampleRightSecondary = 0;
    this.lastSampleLookup = 0;
    this.canPlay = false;
    this.WAVERAMBankSpecified = 0;
    this.WAVERAMBankAccessed = 0x20;
    this.WaveRAMBankSize = 0x1F;
    this.totalLength = 0x100;
    this.patternType = 4;
    this.frequency = 0;
    this.FrequencyPeriod = 0x4000;
    this.consecutive = true;
    this.Enabled = false;
    this.nr30 = 0;
    this.nr31 = 0;
    this.nr32 = 0;
    this.nr33 = 0;
    this.nr34 = 0;
    this.cachedSample = 0;
    this.PCM = getInt8Array(0x40);
    this.WAVERAM = getUint8Array(0x20);
}
GameBoyAdvanceChannel3Synth.prototype.disabled = function () {
    //Clear NR30:
    this.nr30 = 0;
    this.lastSampleLookup = 0;
    this.canPlay = false;
    this.WAVERAMBankSpecified = 0;
    this.WAVERAMBankAccessed = 0x20;
    this.WaveRAMBankSize = 0x1F;
    //Clear NR31:
    this.totalLength = 0x100;
    //Clear NR32:
    this.nr32 = 0;
    this.patternType = 4;
    //Clear NR33:
    this.nr33 = 0;
    this.frequency = 0;
    this.FrequencyPeriod = 0x4000;
    //Clear NR34:
    this.nr34 = 0;
    this.consecutive = true;
    this.Enabled = false;
    this.counter = 0;
}
if (!!Math.imul) {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
        if ((this.patternType | 0) != 3) {
            this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
        }
        else {
            this.cachedSample = Math.imul(this.PCM[this.lastSampleLookup | 0] | 0, 3) >> 2;
        }
        this.outputLevelCache();
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
        if ((this.patternType | 0) != 3) {
            this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
        }
        else {
            this.cachedSample = (this.PCM[this.lastSampleLookup | 0] * 0.75) | 0;
        }
        this.outputLevelCache();
    }
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelCache = function () {
    this.currentSampleLeft = (this.sound.leftChannel3) ? (this.cachedSample | 0) : 0;
    this.currentSampleRight = (this.sound.rightChannel3) ? (this.cachedSample | 0) : 0;
    this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelSecondaryCache = function () {
    if (this.Enabled) {
        this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
        this.currentSampleRightSecondary = this.currentSampleRight | 0;
    }
    else {
        this.currentSampleLeftSecondary = 0;
        this.currentSampleRightSecondary = 0;
    }
}
GameBoyAdvanceChannel3Synth.prototype.writeWAVE = function (address, data) {
    address = address | 0;
    data = data | 0;
    if (this.canPlay) {
        this.sound.audioJIT();
    }
    address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
    this.WAVERAM[address | 0] = data | 0;
    address <<= 1;
    this.PCM[address | 0] = data >> 4;
    this.PCM[address | 1] = data & 0xF;
}
GameBoyAdvanceChannel3Synth.prototype.readWAVE = function (address) {
    address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
    return this.WAVERAM[address | 0] | 0;
}
GameBoyAdvanceChannel3Synth.prototype.enableCheck = function () {
    this.Enabled = (/*this.canPlay && */(this.consecutive || (this.totalLength | 0) > 0));
}
GameBoyAdvanceChannel3Synth.prototype.clockAudioLength = function () {
    if ((this.totalLength | 0) > 1) {
        this.totalLength = ((this.totalLength | 0) - 1) | 0;
    }
    else if ((this.totalLength | 0) == 1) {
        this.totalLength = 0;
        this.enableCheck();
        this.sound.unsetNR52(0xFB);    //Channel #3 On Flag Off
    }
}
GameBoyAdvanceChannel3Synth.prototype.computeAudioChannel = function () {
    if ((this.counter | 0) == 0) {
        if (this.canPlay) {
            this.lastSampleLookup = (((this.lastSampleLookup | 0) + 1) & this.WaveRAMBankSize) | this.WAVERAMBankSpecified;
        }
        this.counter = this.FrequencyPeriod | 0;
    }
}

GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_L = function () {
    //NR30:
    return this.nr30 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_L = function (data) {
    data = data | 0;
    //NR30:
    if (!this.canPlay && (data | 0) >= 0x80) {
        this.lastSampleLookup = 0;
    }
    this.canPlay = (data > 0x7F);
    this.WaveRAMBankSize = (data & 0x20) | 0x1F;
    this.WAVERAMBankSpecified = ((data & 0x40) >> 1) ^ (data & 0x20);
    this.WAVERAMBankAccessed = ((data & 0x40) >> 1) ^ 0x20;
    if (this.canPlay && (this.nr30 | 0) > 0x7F && !this.consecutive) {
        this.sound.setNR52(0x4);
    }
    this.nr30 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H0 = function (data) {
    data = data | 0;
    //NR31:
    this.totalLength = (0x100 - (data | 0)) | 0;
    this.enableCheck();
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_H = function () {
    //NR32:
    return this.nr32 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H1 = function (data) {
    data = data | 0;
    //NR32:
    switch (data >> 5) {
        case 0:
            this.patternType = 4;
            break;
        case 1:
            this.patternType = 0;
            break;
        case 2:
            this.patternType = 1;
            break;
        case 3:
            this.patternType = 2;
            break;
        default:
            this.patternType = 3;
    }
    this.nr32 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X0 = function (data) {
    data = data | 0;
    //NR33:
    this.frequency = (this.frequency & 0x700) | data;
    this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_X = function () {
    //NR34:
    return this.nr34 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X1 = function (data) {
    data = data | 0;
    //NR34:
    if ((data | 0) > 0x7F) {
        if ((this.totalLength | 0) == 0) {
            this.totalLength = 0x100;
        }
        this.lastSampleLookup = 0;
        if ((data & 0x40) == 0x40) {
            this.sound.setNR52(0x4);
        }
    }
    this.consecutive = ((data & 0x40) == 0x0);
    this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
    this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
    this.enableCheck();
    this.nr34 = data | 0;
}