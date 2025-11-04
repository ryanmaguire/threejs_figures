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
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Forward declarations found here.                                          */
#include "paraboloid.h"

/*  The rotation angle theta and the pre-computed sine and cosine of theta.   */
float rotation_angle = 1.0F;
float cos_angle = 1.0F;
float sin_angle = 0.0F;

/*  Buffer for the vertices in the mesh.                                      */
float mesh_buffer[MESH_BUFFER_SIZE];

/*  Buffer for the indices indicating which vertices are connected by a line. */
unsigned int index_buffer[INDEX_BUFFER_SIZE];
