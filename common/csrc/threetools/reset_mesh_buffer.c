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
 *      Resets the size of the mesh buffer inside a object.                   *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/

/*  Object typedef found here.                                                */
#include <threetools/types.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/*  free and malloc are found here.                                           */
#include <stdlib.h>

/******************************************************************************
 *  Function:                                                                 *
 *      reset_mesh_buffer                                                     *
 *  Purpose:                                                                  *
 *      Resets the size of the mesh buffer.                                   *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The object that is being resized.                                 *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void reset_mesh_buffer(Object * const object)
{
    /*  The object is a rectangular grid, the total number of points is given *
     *  by the product of the width and the height.                           */
    object->number_of_points = object->nx_pts * object->ny_pts;

    /*  Each point corresponds to three floats (the x, y, and z components).  *
     *  The mesh size is hence three times the number of points.              */
    object->mesh_size = 3U * object->number_of_points;

    /*  Reset the mesh buffer to use the current size.                        */
    free(object->mesh);
    object->mesh = malloc(sizeof(*object->mesh) * object->mesh_size);
}
/*  End of reset_mesh_buffer.                                                 */
