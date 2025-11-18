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
	MAX_WIDTH uint32 = 512
	MAX_HEIGHT uint32 = 512
	MAX_LENGTH uint32 = MAX_WIDTH * MAX_HEIGHT
	MESH_BUFFER_SIZE uint32 = 3 * MAX_LENGTH
	INDEX_BUFFER_SIZE uint32 = (2 * (2 * MAX_LENGTH - MAX_WIDTH - MAX_HEIGHT))
	paraboloid_x_start float32 = -1.0
	paraboloid_y_start float32 = -1.0
	paraboloid_width float32 = 2.0
	paraboloid_height float32 = 2.0
)

var (
	rotation_angle float32
	cos_angle float32
	sin_angle float32
	mesh_buffer [MESH_BUFFER_SIZE]float32
	index_buffer [INDEX_BUFFER_SIZE]uint32
)
