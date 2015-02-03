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
function ARMCPSRAttributeTable() {
    var negative = 0;            //N Bit
    var zero = 1;                //Z Bit
    var overflow = false;        //V Bit
    var carry = false;           //C Bit
    function setNegative(toSet) {
        if (!!toSet) {
            negative = -1;
        }
        else {
            negative = 0;
        }
    };
    function setNegativeInt(toSet) {
        negative = toSet | 0;
    };
    function setNegativeFalse() {
        negative = 0;
    };
    function getNegative() {
        return (negative < 0);
    };
    function getNegativeInt() {
        return negative | 0;
    };
    function setZero(toSet) {
        if (!!toSet) {
            zero = 0;
        }
        else {
            zero = 1;
        }
    };
    function setZeroInt(toSet) {
        zero = toSet | 0;
    };
    function setZeroTrue() {
        zero = 0;
    };
    function setZeroFalse() {
        zero = 1;
    };
    function getZero() {
        return (zero == 0);
    };
    function getZeroInt() {
        return zero | 0;
    };
    function setOverflow(toSet) {
        overflow = !!toSet;
    };
    function setOverflowTrue() {
        overflow = true;
    };
    function setOverflowFalse() {
        overflow = false;
    };
    function getOverflow() {
        return !!overflow;
    };
    function setCarry(toSet) {
        carry = !!toSet;
    };
    function setCarryInt(toSet) {
        carry = ((toSet | 0) < 0);
    };
    function setCarryFalse() {
        carry = false;
    };
    function getCarry() {
        return !!carry;
    };
    function getCarryInt() {
        if (carry) {
            return 1;
        }
        else {
            return 0;
        }
    };
    function getCarryIntReverse() {
        if (carry) {
            return 0;
        }
        else {
            return 1;
        }
    };
    function setNZInt(toSet) {
        toSet = toSet | 0;
        negative = toSet | 0;
        zero = toSet | 0;
    }
    function setVFlagForADD(operand1, operand2, result) {
        //Compute the overflow flag for addition:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        result = result | 0;
        overflow = ((operand1 ^ operand2) >= 0 && (operand1 ^ result) < 0);
    };
    function setVFlagForSUB(operand1, operand2, result) {
        //Compute the overflow flag for subtraction:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        result = result | 0;
        overflow = ((operand1 ^ operand2) < 0 && (operand1 ^ result) < 0);
    };
    function setADDFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) + (operand2 >>> 0);
        var result = unsignedResult | 0;
        setVFlagForADD(operand1, operand2, result);
        carry = (unsignedResult > 0xFFFFFFFF);
        negative = result | 0;
        zero = result | 0;
        return result | 0;
    };
    function setADCFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) + (operand2 >>> 0) + ((carry) ? 1 : 0);
        var result = unsignedResult | 0;
        setVFlagForADD(operand1, operand2, result);
        carry = (unsignedResult > 0xFFFFFFFF);
        negative = result | 0;
        zero = result | 0;
        return result | 0;
    };
    function setSUBFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        var result = (operand1 - operand2) | 0;
        setVFlagForSUB(operand1, operand2, result);
        carry = ((operand1 >>> 0) >= (operand2 >>> 0));
        negative = result | 0;
        zero = result | 0;
        return result | 0;
    };
    function setSBCFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) - (operand2 >>> 0) - ((carry) ? 0 : 1);
        var result = unsignedResult | 0;
        setVFlagForSUB(operand1, operand2, result);
        carry = (unsignedResult >= 0);
        negative = result | 0;
        zero = result | 0;
        return result | 0;
    };
    function setCMPFlags(operand1, operand2) {
        //Update flags for a subtraction operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        var result = (operand1 - operand2) | 0;
        setVFlagForSUB(operand1, operand2, result);
        carry = ((operand1 >>> 0) >= (operand2 >>> 0));
        negative = result | 0;
        zero = result | 0;
    };
    function setCMNFlags(operand1, operand2) {
        //Update flags for an addition operation:
        operand1 = operand1 | 0;
        operand2 = operand2 | 0;
        //We let this get outside of int32 on purpose:
        var unsignedResult = (operand1 >>> 0) + (operand2 >>> 0);
        var result = unsignedResult | 0;
        setVFlagForADD(operand1, operand2, result);
        carry = (unsignedResult > 0xFFFFFFFF);
        negative = result | 0;
        zero = result | 0;
    };
    return {
        "setNegative":setNegative,
        "setNegativeInt":setNegativeInt,
        "setNegativeFalse":setNegativeFalse,
        "getNegative":getNegative,
        "getNegativeInt":getNegativeInt,
        "setZero":setZero,
        "setZeroInt":setZeroInt,
        "setZeroTrue":setZeroTrue,
        "setZeroFalse":setZeroFalse,
        "getZero":getZero,
        "getZeroInt":getZeroInt,
        "setOverflow":setOverflow,
        "setOverflowTrue":setOverflowTrue,
        "setOverflowFalse":setOverflowFalse,
        "getOverflow":getOverflow,
        "setCarry":setCarry,
        "setCarryInt":setCarryInt,
        "setCarryFalse":setCarryFalse,
        "getCarry":getCarry,
        "getCarryInt":getCarryInt,
        "getCarryIntReverse":getCarryIntReverse,
        "setNZInt":setNZInt,
        "setADDFlags":setADDFlags,
        "setADCFlags":setADCFlags,
        "setSUBFlags":setSUBFlags,
        "setSBCFlags":setSBCFlags,
        "setCMPFlags":setCMPFlags,
        "setCMNFlags":setCMNFlags
    };
}