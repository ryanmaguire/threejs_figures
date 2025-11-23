/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is part of threejs_figures.                                     *
 *                                                                            *
 *  threejs_figures is free software: you can redistribute it and/or modify   *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  threejs_figures is distributed in the hope that it will be useful,        *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with threejs_figures.  If not, see <https://www.gnu.org/licenses/>. *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Provides the non-constant global variables for the animation.         *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  UnitVector and Canvas typedefs found here.                                */
#include <threetools/types.h>

/*  Declarations for the global variables found here.                         */
#include <threetools/globals.h>

/*  The rotation vector, initially set to the x axis (no rotation).           */
UnitVector rotation_vector = {1.0, 0.0};

/*  The main canvas for animations. Not initialized at the start.             */
Canvas main_canvas;

/*  Buffer for the vertices in the mesh.                                      */
float mesh_buffer[MAX_MESH_BUFFER_SIZE];

/*  Buffer for the indices indicating which vertices are connected by a line. */
unsigned int index_buffer[MAX_INDEX_BUFFER_SIZE];
