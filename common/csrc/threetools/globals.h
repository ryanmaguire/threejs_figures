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

/*  Include guard to prevent including this file twice.                       */
#ifndef THREETOOLS_GLOBALS_H
#define THREETOOLS_GLOBALS_H

/*  UnitVector and Canvas typedefs provided here.                             */
#include <threetools/types.h>

/*  Avoid mangling with C++ compilers, check if a C++ compiler is being used. */
#ifdef __cplusplus
extern "C" {
#endif

/*  The max width and height (in terms of number of vertices) allowed.        */
#define MAX_WIDTH (512U)
#define MAX_HEIGHT (512U)

/*  The maximum total number of points allowed in the mesh.                   */
#define MAX_NUMBER_OF_POINTS (MAX_WIDTH * MAX_HEIGHT)

/*  The maximum number of floats needed for the mesh.                         */
#define MAX_MESH_BUFFER_SIZE (3U * MAX_NUMBER_OF_POINTS)

/*  The maximum number of indices in the index array, which is six times the  *
 *  maximum number of points that are used in the mesh. This occurs when we   *
 *  have a torus-like mesh that consists of triangles. Each vertex in the     *
 *  mesh corresponds to three line segments, and a line segment corresponds   *
 *  to two indices (the start and the end), so six times the number of points.*/
#define MAX_INDEX_BUFFER_SIZE (6U * MAX_NUMBER_OF_POINTS)

/*  Globals for the rotation angle. We pre-compute the sine and cosine of     *
 *  this when it is initialized to save us some redundant calculations.       */
extern UnitVector rotation_vector;

/*  Primary canvas for most animations. Contains pointers to the mesh and     *
 *  index buffers provided below.                                             */
extern Canvas main_canvas;

/*  Arrays for the mesh, which contains the points in the surface, and the    *
 *  index array, which specifies the line segments. These are fixed-width     *
 *  arrays created at compile time. No calls to malloc or free needed.        */
extern float mesh_buffer[MAX_MESH_BUFFER_SIZE];
extern unsigned int index_buffer[MAX_INDEX_BUFFER_SIZE];

/*  End the extern "C" statement if a C++ compiler is being used.             */
#ifdef __cplusplus
extern }
#endif

#endif
/*  End of include guard.                                                     */
