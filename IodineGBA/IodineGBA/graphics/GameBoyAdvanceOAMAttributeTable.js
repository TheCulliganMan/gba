"use strict";
/*
 * This file is part of IodineGBA
 *
 * Copyright (C) 2012-2013 Grant Galitz
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
function GameBoyAdvanceOAMAttributeTable() {
    this.ycoord = 0;
    this.matrix2D = false;
    this.doubleSizeOrDisabled = false;
    this.mode = 0;
    this.mosaic = false;
    this.monolithicPalette = false;
    this.shape = 0;
    this.xcoord = 0;
    this.matrixParameters = 0;
    this.horizontalFlip = false;
    this.verticalFlip = false;
    this.size = 0;
    this.tileNumber = 0;
    this.priority = 0;
    this.paletteNumber = 0;
}