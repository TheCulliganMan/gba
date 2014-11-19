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
function GameBoyAdvanceTimer(IOCore) {
    //Build references:
    this.IOCore = IOCore;
    this.initialize();
}
GameBoyAdvanceTimer.prototype.prescalarLookup = [
    0,
    0x6,
    0x8,
    0xA
];
GameBoyAdvanceTimer.prototype.initialize = function () {
    this.initializeTimers();
}
GameBoyAdvanceTimer.prototype.initializeTimers = function () {
    this.timer0Counter = 0;
    this.timer0Reload = 0;
    this.timer0Control = 0;
    this.timer0Enabled = false;
    this.timer0IRQ = false;
    this.timer0Precounter = 0;
    this.timer0Prescalar = 1;
    this.timer0PrescalarShifted = 0;
    this.timer1Counter = 0;
    this.timer1Reload = 0;
    this.timer1Control = 0;
    this.timer1Enabled = false;
    this.timer1IRQ = false;
    this.timer1Precounter = 0;
    this.timer1Prescalar = 1;
    this.timer1PrescalarShifted = 0;
    this.timer1CountUp = false;
    this.timer2Counter = 0;
    this.timer2Reload = 0;
    this.timer2Control = 0;
    this.timer2Enabled = false;
    this.timer2IRQ = false;
    this.timer2Precounter = 0;
    this.timer2Prescalar = 1;
    this.timer2PrescalarShifted = 0;
    this.timer2CountUp = false;
    this.timer3Counter = 0;
    this.timer3Reload = 0;
    this.timer3Control = 0;
    this.timer3Enabled = false;
    this.timer3IRQ = false;
    this.timer3Precounter = 0;
    this.timer3Prescalar = 1;
    this.timer3PrescalarShifted = 0;
    this.timer3CountUp = false;
    this.timer1UseMainClocks = false;
    this.timer1UseChainedClocks = false;
    this.timer2UseMainClocks = false;
    this.timer2UseChainedClocks = false;
    this.timer3UseMainClocks = false;
    this.timer3UseChainedClocks = false;
}
GameBoyAdvanceTimer.prototype.addClocks = function (clocks) {
    clocks = clocks | 0;
    //See if timer channels 0 and 1 are enabled:
    this.clockSoundTimers(clocks | 0);
    //See if timer channel 2 is enabled:
    this.clockTimer2(clocks | 0);
    //See if timer channel 3 is enabled:
    this.clockTimer3(clocks | 0);
}
GameBoyAdvanceTimer.prototype.clockSoundTimers = function (clocks) {
    clocks = clocks | 0;
    for (var audioClocks = clocks | 0, predictedClocks = 0, overflowClocks = 0; (audioClocks | 0) > 0; audioClocks = ((audioClocks | 0) - (predictedClocks | 0)) | 0) {
        overflowClocks = this.nextAudioTimerOverflow() | 0;
        predictedClocks = Math.min(audioClocks | 0, overflowClocks | 0) | 0;
        //See if timer channel 0 is enabled:
        this.clockTimer0(predictedClocks | 0);
        //See if timer channel 1 is enabled:
        this.clockTimer1(predictedClocks | 0);
        //Clock audio system up to latest timer:
        this.IOCore.sound.addClocks(predictedClocks | 0);
        //Only jit if overflow was seen:
        if ((overflowClocks | 0) == (predictedClocks | 0)) {
            this.IOCore.sound.audioJIT();
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer0 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer0Enabled) {
        this.timer0Precounter = ((this.timer0Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer0Precounter | 0) >= (this.timer0Prescalar | 0)) {
            var iterations = Math.min(this.timer0Precounter >> (this.timer0PrescalarShifted | 0), (0x10000 - (this.timer0Counter | 0)) | 0) | 0;
            this.timer0Precounter = ((this.timer0Precounter | 0) - ((iterations | 0) << (this.timer0PrescalarShifted | 0))) | 0;
            this.timer0Counter = ((this.timer0Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer0Counter | 0) > 0xFFFF) {
                this.timer0Counter = this.timer0Reload | 0;
                this.timer0ExternalTriggerCheck();
                this.timer1ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer1 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer1UseMainClocks) {
        this.timer1Precounter = ((this.timer1Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer1Precounter | 0) >= (this.timer1Prescalar | 0)) {
            var iterations = Math.min(this.timer1Precounter >> (this.timer1PrescalarShifted | 0), (0x10000 - (this.timer1Counter | 0)) | 0) | 0;
            this.timer1Precounter = ((this.timer1Precounter | 0) - ((iterations | 0) << (this.timer1PrescalarShifted | 0))) | 0;
            this.timer1Counter = ((this.timer1Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer1Counter | 0) > 0xFFFF) {
                this.timer1Counter = this.timer1Reload | 0;
                this.timer1ExternalTriggerCheck();
                this.timer2ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer2 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer2UseMainClocks) {
        this.timer2Precounter = ((this.timer2Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer2Precounter | 0) >= (this.timer2Prescalar | 0)) {
            var iterations = Math.min(this.timer2Precounter >> (this.timer2PrescalarShifted | 0), (0x10000 - (this.timer2Counter | 0)) | 0) | 0;
            this.timer2Precounter = ((this.timer2Precounter | 0) - ((iterations | 0) << (this.timer2PrescalarShifted | 0))) | 0;
            this.timer2Counter = ((this.timer2Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer2Counter | 0) > 0xFFFF) {
                this.timer2Counter = this.timer2Reload | 0;
                this.timer2ExternalTriggerCheck();
                this.timer3ClockUpTickCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.clockTimer3 = function (clocks) {
    clocks = clocks | 0;
    if (this.timer3UseMainClocks) {
        this.timer3Precounter = ((this.timer3Precounter | 0) + (clocks | 0)) | 0;
        while ((this.timer3Precounter | 0) >= (this.timer3Prescalar | 0)) {
            var iterations = Math.min(this.timer3Precounter >> (this.timer3PrescalarShifted | 0), (0x10000 - (this.timer3Counter | 0)) | 0) | 0;
            this.timer3Precounter = ((this.timer3Precounter | 0) - ((iterations | 0) << (this.timer3PrescalarShifted | 0))) | 0;
            this.timer3Counter = ((this.timer3Counter | 0) + (iterations | 0)) | 0;
            if ((this.timer3Counter | 0) > 0xFFFF) {
                this.timer3Counter = this.timer3Reload | 0;
                this.timer3ExternalTriggerCheck();
            }
        }
    }
}
GameBoyAdvanceTimer.prototype.timer1ClockUpTickCheck = function () {
    if (this.timer1UseChainedClocks) {
        this.timer1Counter = ((this.timer1Counter | 0) + 1) | 0;
        if ((this.timer1Counter | 0) > 0xFFFF) {
            this.timer1Counter = this.timer1Reload | 0;
            this.timer1ExternalTriggerCheck();
            this.timer2ClockUpTickCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer2ClockUpTickCheck = function () {
    if (this.timer2UseChainedClocks) {
        this.timer2Counter = ((this.timer2Counter | 0) + 1) | 0;
        if ((this.timer2Counter | 0) > 0xFFFF) {
            this.timer2Counter = this.timer2Reload | 0;
            this.timer2ExternalTriggerCheck();
            this.timer3ClockUpTickCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer3ClockUpTickCheck = function () {
    if (this.timer3UseChainedClocks) {
        this.timer3Counter = ((this.timer3Counter | 0) + 1) | 0;
        if ((this.timer3Counter | 0) > 0xFFFF) {
            this.timer3Counter = this.timer3Reload | 0;
            this.timer3ExternalTriggerCheck();
        }
    }
}
GameBoyAdvanceTimer.prototype.timer0ExternalTriggerCheck = function () {
    if (this.timer0IRQ) {
        this.IOCore.irq.requestIRQ(0x08);
    }
    this.IOCore.sound.AGBDirectSoundTimer0ClockTick();
}
GameBoyAdvanceTimer.prototype.timer1ExternalTriggerCheck = function () {
    if (this.timer1IRQ) {
        this.IOCore.irq.requestIRQ(0x10);
    }
    this.IOCore.sound.AGBDirectSoundTimer1ClockTick();
}
GameBoyAdvanceTimer.prototype.timer2ExternalTriggerCheck = function () {
    if (this.timer2IRQ) {
        this.IOCore.irq.requestIRQ(0x20);
    }
}
GameBoyAdvanceTimer.prototype.timer3ExternalTriggerCheck = function () {
    if (this.timer3IRQ) {
        this.IOCore.irq.requestIRQ(0x40);
    }
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_L0 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Reload = this.timer0Reload & 0xFF00;
    this.timer0Reload = this.timer0Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_L1 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Reload = this.timer0Reload & 0xFF;
    this.timer0Reload = this.timer0Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM0CNT_H = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer0Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer0Enabled) {
            this.timer0Counter = this.timer0Reload | 0;
            this.timer0Enabled = true;
            this.timer0Precounter = 0;
        }
    }
    else {
        this.timer0Enabled = false;
    }
    this.timer0IRQ = ((data & 0x40) == 0x40);
    this.timer0PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer0Prescalar = 1 << (this.timer0PrescalarShifted | 0);
}
GameBoyAdvanceTimer.prototype.readTM0CNT_L0 = function () {
    return this.timer0Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_L1 = function () {
    return (this.timer0Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM0CNT_H = function () {
    return 0x38 | this.timer0Control;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_L0 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Reload = this.timer1Reload & 0xFF00;
    this.timer1Reload = this.timer1Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_L1 = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Reload = this.timer1Reload & 0xFF;
    this.timer1Reload = this.timer1Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM1CNT_H = function (data) {
    data = data | 0;
    this.IOCore.sound.audioJIT();
    this.timer1Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer1Enabled) {
            this.timer1Counter = this.timer1Reload | 0;
            this.timer1Enabled = true;
            this.timer1Precounter = 0;
        }
    }
    else {
        this.timer1Enabled = false;
    }
    this.timer1IRQ = ((data & 0x40) == 0x40);
    this.timer1CountUp = ((data & 0x4) == 0x4);
    this.timer1PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer1Prescalar = 1 << (this.timer1PrescalarShifted | 0);
    this.preprocessTimer1();
}
GameBoyAdvanceTimer.prototype.readTM1CNT_L0 = function () {
    return this.timer1Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_L1 = function () {
    return (this.timer1Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM1CNT_H = function () {
    return 0x38 | this.timer1Control;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_L0 = function (data) {
    data = data | 0;
    this.timer2Reload = this.timer2Reload & 0xFF00;
    this.timer2Reload = this.timer2Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_L1 = function (data) {
    data = data | 0;
    this.timer2Reload = this.timer2Reload & 0xFF;
    this.timer2Reload = this.timer2Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM2CNT_H = function (data) {
    data = data | 0;
    this.timer2Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer2Enabled) {
            this.timer2Counter = this.timer2Reload | 0;
            this.timer2Enabled = true;
            this.timer2Precounter = 0;
        }
    }
    else {
        this.timer2Enabled = false;
    }
    this.timer2IRQ = ((data & 0x40) == 0x40);
    this.timer2CountUp = ((data & 0x4) == 0x4);
    this.timer2PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer2Prescalar = 1 << (this.timer2PrescalarShifted | 0);
    this.preprocessTimer2();
}
GameBoyAdvanceTimer.prototype.readTM2CNT_L0 = function () {
    return this.timer2Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_L1 = function () {
    return (this.timer2Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM2CNT_H = function () {
    return 0x38 | this.timer2Control;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_L0 = function (data) {
    data = data | 0;
    this.timer3Reload = this.timer3Reload & 0xFF00;
    this.timer3Reload = this.timer3Reload | data;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_L1 = function (data) {
    data = data | 0;
    this.timer3Reload = this.timer3Reload & 0xFF;
    this.timer3Reload = this.timer3Reload | (data << 8);
}
GameBoyAdvanceTimer.prototype.writeTM3CNT_H = function (data) {
    data = data | 0;
    this.timer3Control = data | 0;
    if ((data | 0) > 0x7F) {
        if (!this.timer3Enabled) {
            this.timer3Counter = this.timer3Reload | 0;
            this.timer3Precounter = 0;
            this.timer3Enabled = true;
        }
    }
    else {
        this.timer3Enabled = false;
    }
    this.timer3IRQ = ((data & 0x40) == 0x40);
    this.timer3CountUp = ((data & 0x4) == 0x4);
    this.timer3PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
    this.timer3Prescalar = 1 << (this.timer3PrescalarShifted | 0);
    this.preprocessTimer3();
}
GameBoyAdvanceTimer.prototype.readTM3CNT_L0 = function () {
    return this.timer3Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_L1 = function () {
    return (this.timer3Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM3CNT_H = function () {
    return 0x38 | this.timer3Control;
}
GameBoyAdvanceTimer.prototype.preprocessTimer1 = function () {
    this.timer1UseMainClocks = (this.timer1Enabled && !this.timer1CountUp);
    this.timer1UseChainedClocks = (this.timer1Enabled && this.timer1CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer2 = function () {
    this.timer2UseMainClocks = (this.timer2Enabled && !this.timer2CountUp);
    this.timer2UseChainedClocks = (this.timer2Enabled && this.timer2CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer3 = function () {
    this.timer3UseMainClocks = (this.timer3Enabled && !this.timer3CountUp);
    this.timer3UseChainedClocks = (this.timer3Enabled && this.timer3CountUp);
}
GameBoyAdvanceTimer.prototype.nextTimer0Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer0Enabled) {
        return (((0x10000 - this.timer0Counter) * this.timer0Prescalar) - this.timer0Precounter) + (((0x10000 - this.timer0Reload) * this.timer0Prescalar) * numOverflows);
    }
    return -1;
}
if (!!Math.imul) {
    //Math.imul found, insert the optimized path in:
    GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
        var eventTime = -1;
        if (this.timer0Enabled) {
            eventTime = (Math.imul((0x10000 - (this.timer0Counter | 0)), this.timer0Prescalar | 0) - (this.timer0Precounter | 0)) | 0;
        }
        return eventTime | 0;
    }
}
else {
    //Math.imul not found, use the compatibility method:
    GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
        if (this.timer0Enabled) {
            return ((0x10000 - this.timer0Counter) * this.timer0Prescalar) - this.timer0Precounter;
        }
        return -1;
    }
}
GameBoyAdvanceTimer.prototype.nextTimer1Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer1Enabled) {
        if (this.timer1CountUp) {
            return this.nextTimer0Overflow(0x10000 - this.timer1Counter + (numOverflows * (0x10000 - this.timer1Reload)));
        }
        else {
            return (((0x10000 - this.timer1Counter) * this.timer1Prescalar) - this.timer1Precounter) + (((0x10000 - this.timer1Reload) * this.timer1Prescalar) * numOverflows);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer1OverflowSingle = function () {
    if (this.timer1Enabled) {
        if (this.timer1CountUp) {
            return this.nextTimer0Overflow(0x10000 - this.timer1Counter);
        }
        else {
            return (((0x10000 - this.timer1Counter) * this.timer1Prescalar) - this.timer1Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer2Overflow = function (numOverflows) {
    --numOverflows;
    if (this.timer2Enabled) {
        if (this.timer2CountUp) {
            return this.nextTimer1Overflow(0x10000 - this.timer2Counter + (numOverflows * (0x10000 - this.timer2Reload)));
        }
        else {
            return (((0x10000 - this.timer2Counter) * this.timer2Prescalar) - this.timer2Precounter) + (((0x10000 - this.timer2Reload) * this.timer2Prescalar) * numOverflows);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer2OverflowSingle = function () {
    if (this.timer2Enabled) {
        if (this.timer2CountUp) {
            return this.nextTimer1Overflow(0x10000 - this.timer2Counter);
        }
        else {
            return (((0x10000 - this.timer2Counter) * this.timer2Prescalar) - this.timer2Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextTimer3OverflowSingle = function () {
    if (this.timer3Enabled) {
        if (this.timer3CountUp) {
            return this.nextTimer2Overflow(0x10000 - this.timer3Counter);
        }
        else {
            return (((0x10000 - this.timer3Counter) * this.timer3Prescalar) - this.timer3Precounter);
        }
    }
    return -1;
}
GameBoyAdvanceTimer.prototype.nextAudioTimerOverflow = function () {
    var timer0 = this.nextTimer0OverflowSingle() | 0;
    if ((timer0 | 0) == -1) {
        timer0 = 0x7FFFFFFF;
    }
    var timer1 = this.nextTimer1OverflowSingle();
    if (timer1 == -1) {
        timer1 = 0x7FFFFFFF;
    }
    return Math.min(timer0 | 0, timer1, 0x7FFFFFFF) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer0IRQEventTime = function () {
    return ((this.timer0Enabled && this.timer0IRQ) ? (Math.min(this.nextTimer0OverflowSingle() | 0, this.IOCore.getRemainingCycles() | 0) | 0) : -1) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer1IRQEventTime = function () {
    return ((this.timer1Enabled && this.timer1IRQ) ? (Math.min(this.nextTimer1OverflowSingle(), this.IOCore.getRemainingCycles() | 0) | 0) : -1) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer2IRQEventTime = function () {
    return ((this.timer2Enabled && this.timer2IRQ) ? (Math.min(this.nextTimer2OverflowSingle(), this.IOCore.getRemainingCycles() | 0) | 0) : -1) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer3IRQEventTime = function () {
    return ((this.timer3Enabled && this.timer3IRQ) ? (Math.min(this.nextTimer3OverflowSingle(), this.IOCore.getRemainingCycles() | 0) | 0) : -1) | 0;
}