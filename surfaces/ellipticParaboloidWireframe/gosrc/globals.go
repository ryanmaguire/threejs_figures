/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is free software: you can redistribute it and/or modify         *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  This file is distributed in the hope that it will be useful,              *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with this file.  If not, see <https://www.gnu.org/licenses/>.       *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Provides the non-constant global variables for the animation.         *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

const (
	maxWidth uint32 = 512
	maxHeight uint32 = 512
	maxLength uint32 = maxWidth * maxHeight
	meshBufferSize uint32 = 3 * maxLength
	indexBufferSize uint32 = (2 * (2 * maxLength - maxWidth - maxHeight))
	xStart float32 = -1.0
	yStart float32 = -1.0
	width float32 = 2.0
	height float32 = 2.0
)

var (
	rotationAngle float32
	cosAngle float32
	sinAngle float32
	meshBuffer [meshBufferSize]float32
	indexBuffer [indexBufferSize]uint32
)
