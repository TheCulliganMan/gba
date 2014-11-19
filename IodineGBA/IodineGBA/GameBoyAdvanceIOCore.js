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
function GameBoyAdvanceIO(settings, coreExposed, BIOS, ROM) {
    //State Machine Tracking:
    this.systemStatus = 0;
    this.cyclesToIterate = 0;
    this.cyclesOveriteratedPreviously = 0;
    this.accumulatedClocks = 0;
    this.graphicsClocks = 0;
    this.timerClocks = 0;
    this.serialClocks = 0;
    this.nextEventClocks = 0;
    this.BIOSFound = false;
    //References passed to us:
    this.settings = settings;
    this.coreExposed = coreExposed;
    this.BIOS = BIOS;
    this.ROM = ROM;
    //Initialize the various handler objects:
    this.memory = new GameBoyAdvanceMemory(this);
    this.dma = new GameBoyAdvanceDMA(this);
    this.gfx = new GameBoyAdvanceGraphics(this);
    this.sound = new GameBoyAdvanceSound(this);
    this.timer = new GameBoyAdvanceTimer(this);
    this.irq = new GameBoyAdvanceIRQ(this);
    this.serial = new GameBoyAdvanceSerial(this);
    this.joypad = new GameBoyAdvanceJoyPad(this);
    this.cartridge = new GameBoyAdvanceCartridge(this);
    this.saves = new GameBoyAdvanceSaves(this);
    this.wait = new GameBoyAdvanceWait(this);
    this.cpu = new GameBoyAdvanceCPU(this);
    this.ARM = this.cpu.ARM;
    this.THUMB = this.cpu.THUMB;
    this.memory.loadReferences();
}
GameBoyAdvanceIO.prototype.enter = function (CPUCyclesTotal) {
    //Find out how many clocks to iterate through this run:
    this.cyclesToIterate = ((CPUCyclesTotal | 0) + (this.cyclesOveriteratedPreviously | 0)) | 0;
    //An extra check to make sure we don't do stuff if we did too much last run:
    if ((this.cyclesToIterate | 0) > 0) {
        //Update our core event prediction:
        this.updateCoreEventTime();
        //If clocks remaining, run iterator:
        this.run();
        //Spill our core event clocking:
        this.updateCoreClocking();
        //Ensure audio buffers at least once per iteration:
        this.sound.audioJIT();
    }
    //If we clocked just a little too much, subtract the extra from the next run:
    this.cyclesOveriteratedPreviously = this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.run = function () {
	//Clock through the state machine:
	while (true) {
		//Dispatch to optimized run loops:
		switch (this.systemStatus & 0x42) {
			case 0:
				//ARM instruction set:
				this.runARM();
				break;
			case 0x2:
				//THUMB instruction sey:
				this.runTHUMB();
				break;
			default:
				//End of stepping:
				this.deflagIterationEnd();
				return;
		}
	}
}
GameBoyAdvanceIO.prototype.runARM = function () {
    //Clock through the state machine:
    while (true) {
        //Handle the current system state selected:
        switch (this.systemStatus | 0) {
            case 0: //CPU Handle State (Normal ARM)
                this.ARM.executeIteration();
                break;
            case 1: //CPU Handle State (Bubble ARM)
                this.cpu.executeBubbleARM();
                break;
            default: //Handle lesser called / End of stepping
                /*
                 * Don't inline this into the top switch.
                 * JITs shit themselves on better optimizations on larger switches.
                 * Also, JIT compilation time is smaller on smaller switches.
                 */
                switch (this.systemStatus | 0) {
                    case 5: //CPU Handle State (Bubble ARM)
                        this.cpu.executeBubbleARM();
                        break;
                    case 4: //CPU Handle State (IRQ)
                        this.cpu.IRQinARM();
                        break;
                    case 0x8: //DMA Handle State
                    case 0x9:
                    case 0xC:
                    case 0xD:
                    case 0x18: //DMA Inside Halt State
                    case 0x19:
                    case 0x1C:
                    case 0x1D:
                        this.handleDMA();
                        break;
                    case 0x10: //Handle Halt State
                    case 0x11:
                    case 0x14:
                    case 0x15:
                        this.handleHalt();
                        break;
                    default: //Handle Stop State
						//End of Stepping and/or CPU run loop switch:
                        if ((this.systemStatus & 0x42) != 0) {
                            return;
                        }
                        this.handleStop();
                }
        }
    }
}
GameBoyAdvanceIO.prototype.runTHUMB = function () {
	//Clock through the state machine:
    while (true) {
        //Handle the current system state selected:
        switch (this.systemStatus | 0) {
            case 2: //CPU Handle State (Normal THUMB)
                this.THUMB.executeIteration();
                break;
            case 3: //CPU Handle State (Bubble THUMB)
                this.cpu.executeBubbleTHUMB();
                break;
            default: //Handle lesser called / End of stepping
                /*
                 * Don't inline this into the top switch.
                 * JITs shit themselves on better optimizations on larger switches.
                 * Also, JIT compilation time is smaller on smaller switches.
                 */
                switch (this.systemStatus | 0) {
                    case 7: //CPU Handle State (Bubble THUMB)
                        this.cpu.executeBubbleTHUMB();
                        break;
                    case 6: //CPU Handle State (IRQ)
                        this.cpu.IRQinTHUMB();
                        break;
                    case 0xA: //DMA Handle State
                    case 0xB:
                    case 0xE:
                    case 0xF:
                    case 0x1A: //DMA Inside Halt State
                    case 0x1B:
                    case 0x1E:
                    case 0x1F:
                        this.handleDMA();
                        break;
                    case 0x12: //Handle Halt State
                    case 0x13:
                    case 0x16:
                    case 0x17:
                        this.handleHalt();
                        break;
                    default: //Handle Stop State
						//End of Stepping and/or CPU run loop switch:
						if ((this.systemStatus & 0x42) != 0x2) {
							return;
						}
						this.handleStop();
                }
        }
    }
}
GameBoyAdvanceIO.prototype.updateCore = function (clocks) {
    clocks = clocks | 0;
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + (clocks | 0)) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreSingle = function () {
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + 1) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreTwice = function () {
    //This is used during normal/dma modes of operation:
    this.accumulatedClocks = ((this.accumulatedClocks | 0) + 2) | 0;
    if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
        this.updateCoreSpill();
    }
}
GameBoyAdvanceIO.prototype.updateCoreSpill = function () {
    this.updateCoreClocking();
    this.updateCoreEventTime();
}
GameBoyAdvanceIO.prototype.updateCoreSpillRetain = function () {
    //Keep the last prediction, just decrement it out, as it's still valid:
    this.nextEventClocks = ((this.nextEventClocks | 0) - (this.accumulatedClocks | 0)) | 0;
    this.updateCoreClocking();
}
GameBoyAdvanceIO.prototype.updateCoreClocking = function () {
    var clocks = this.accumulatedClocks | 0;
    //Decrement the clocks per iteration counter:
    this.cyclesToIterate = ((this.cyclesToIterate | 0) - (clocks | 0)) | 0;
    //Clock all components:
    this.gfx.addClocks(((clocks | 0) - (this.graphicsClocks | 0)) | 0);
    this.timer.addClocks(((clocks | 0) - (this.timerClocks | 0)) | 0);
    this.serial.addClocks(((clocks | 0) - (this.serialClocks | 0)) | 0);
    this.accumulatedClocks = 0;
    this.graphicsClocks = 0;
    this.timerClocks = 0;
    this.serialClocks = 0;
}
GameBoyAdvanceIO.prototype.updateGraphicsClocking = function () {
    //Clock gfx component:
    this.gfx.addClocks(((this.accumulatedClocks | 0) - (this.graphicsClocks | 0)) | 0);
    this.graphicsClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateTimerClocking = function () {
    //Clock timer component:
    this.timer.addClocks(((this.accumulatedClocks | 0) - (this.timerClocks | 0)) | 0);
    this.timerClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateSerialClocking = function () {
    //Clock serial component:
    this.serial.addClocks(((this.accumulatedClocks | 0) - (this.serialClocks | 0)) | 0);
    this.serialClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateCoreEventTime = function () {
    //Predict how many clocks until the next DMA or IRQ event:
    this.nextEventClocks = this.cyclesUntilNextEvent() | 0;
}
GameBoyAdvanceIO.prototype.getRemainingCycles = function () {
    //Return the number of cycles left until iteration end:
    if ((this.cyclesToIterate | 0) < 1) {
        //Change our stepper to our end sequence:
        this.flagIterationEnd();
        return 0;
    }
    return this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.handleDMA = function () {
    /*
     Loop our state status in here as
     an optimized iteration, as DMA stepping instances
     happen in quick succession of each other, and
     aren't often done for one memory word only.
     */
    do {
        //Perform a DMA read and write:
        this.dma.perform();
    } while ((this.systemStatus & 0x48) == 8);
}
GameBoyAdvanceIO.prototype.handleHalt = function () {
    if (!this.irq.IRQMatch()) {
        //Clock up to next IRQ match or DMA:
        this.updateCore(this.cyclesUntilNextHALTEvent() | 0);
    }
    else {
        //Exit HALT promptly:
        this.deflagHalt();
    }
}
GameBoyAdvanceIO.prototype.handleStop = function () {
    //Update sound system to add silence to buffer:
    this.sound.addClocks(this.getRemainingCycles() | 0);
    this.cyclesToIterate = 0;
    //Exits when user presses joypad or from an external irq outside of GBA internal.
}
GameBoyAdvanceIO.prototype.cyclesUntilNextHALTEvent = function () {
    //Find the clocks to the next HALT leave or DMA event:
    var haltClocks = this.irq.nextEventTime() | 0;
    var dmaClocks = this.dma.nextEventTime() | 0;
    return this.solveClosestTime(haltClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.cyclesUntilNextEvent = function () {
    //Find the clocks to the next IRQ or DMA event:
    var irqClocks = this.irq.nextIRQEventTime() | 0;
    var dmaClocks = this.dma.nextEventTime() | 0;
    return this.solveClosestTime(irqClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.solveClosestTime = function (clocks1, clocks2) {
    clocks1 = clocks1 | 0;
    clocks2 = clocks2 | 0;
    //Find the clocks closest to the next event:
    var clocks = this.getRemainingCycles() | 0;
    if ((clocks1 | 0) >= 0) {
        if ((clocks2 | 0) >= 0) {
            clocks = Math.min(clocks | 0, clocks1 | 0, clocks2 | 0) | 0;
        }
        else {
            clocks = Math.min(clocks | 0, clocks1 | 0) | 0;
        }
    }
    else if (clocks2 >= 0) {
        clocks = Math.min(clocks | 0, clocks2 | 0) | 0;
    }
    return clocks | 0;
}
GameBoyAdvanceIO.prototype.flagBubble = function () {
    //Flag a CPU pipeline bubble to step through:
    this.systemStatus = this.systemStatus | 0x1;
}
GameBoyAdvanceIO.prototype.deflagBubble = function () {
    //Deflag a CPU pipeline bubble to step through:
    this.systemStatus = this.systemStatus & 0x7E;
}
GameBoyAdvanceIO.prototype.flagTHUMB = function () {
    //Flag a CPU IRQ to step through:
    this.systemStatus = this.systemStatus | 0x2;
}
GameBoyAdvanceIO.prototype.deflagTHUMB = function () {
    //Deflag a CPU IRQ to step through:
    this.systemStatus = this.systemStatus & 0x7D;
}
GameBoyAdvanceIO.prototype.flagIRQ = function () {
    //Flag THUMB CPU mode to step through:
    this.systemStatus = this.systemStatus | 0x4;
}
GameBoyAdvanceIO.prototype.deflagIRQ = function () {
    //Deflag THUMB CPU mode to step through:
    this.systemStatus = this.systemStatus & 0x7B;
}
GameBoyAdvanceIO.prototype.flagDMA = function () {
    //Flag a DMA event to step through:
    this.systemStatus = this.systemStatus | 0x8;
}
GameBoyAdvanceIO.prototype.deflagDMA = function () {
    //Deflag a DMA event to step through:
    this.systemStatus = this.systemStatus & 0x77;
}
GameBoyAdvanceIO.prototype.flagHalt = function () {
    //Flag a halt event to step through:
    this.systemStatus = this.systemStatus | 0x10;
}
GameBoyAdvanceIO.prototype.deflagHalt = function () {
    //Deflag a halt event to step through:
    this.systemStatus = this.systemStatus & 0x6F;
}
GameBoyAdvanceIO.prototype.flagStop = function () {
    //Flag a halt event to step through:
    this.systemStatus = this.systemStatus | 0x20;
}
GameBoyAdvanceIO.prototype.deflagStop = function () {
    //Deflag a halt event to step through:
    this.systemStatus = this.systemStatus & 0x5F;
}
GameBoyAdvanceIO.prototype.flagIterationEnd = function () {
    //Flag a run loop kill event to step through:
    this.systemStatus = this.systemStatus | 0x40;
}
GameBoyAdvanceIO.prototype.deflagIterationEnd = function () {
    //Deflag a run loop kill event to step through:
    this.systemStatus = this.systemStatus & 0x3F;
}
GameBoyAdvanceIO.prototype.isStopped = function () {
    return ((this.systemStatus & 0x20) == 0x20);
}
GameBoyAdvanceIO.prototype.inDMA = function () {
    return ((this.systemStatus & 0x8) == 0x8);
}
GameBoyAdvanceIO.prototype.inTHUMB = function () {
    return ((this.systemStatus & 0x2) == 0x2);
}
GameBoyAdvanceIO.prototype.getCurrentFetchValue = function () {
    var fetch = 0;
    if ((this.systemStatus & 0x8) == 0) {
        fetch = this.cpu.getCurrentFetchValue() | 0;
    }
    else {
        fetch = this.dma.getCurrentFetchValue() | 0;
    }
    return fetch | 0;
}