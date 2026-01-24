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
 *      Computes the locations of the points in the mesh for a surface.       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Canvas and SurfaceParametrization typedefs found here.                    */
#include <threetools/types.h>

/*  The MAX_WIDTH and MAX_HEIGHT macros are defined here.                     */
#include <threetools/globals.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      generate_parametric_mesh                                              *
 *  Purpose:                                                                  *
 *      Computes the vertices of a mesh from a parametric equation.           *
 *  Arguments:                                                                *
 *      canvas (Canvas * const):                                              *
 *          The canvas for the animation. This contains geometry and buffers. *
 *      f (const SurfaceParametrization):                                     *
 *          The function that defines the surface, z = f(x, y).               *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void
generate_parametric_mesh(Canvas * const canvas, const SurfaceParametrization f)
{
    /*  Step sizes in the horizontal and vertical axes.                       */
    const float dx = canvas->width / (float)(canvas->nx_pts - 1U);
    const float dy = canvas->height / (float)(canvas->ny_pts - 1U);

    /*  Variables for indexing the horizontal and vertical axes.              */
    unsigned int x_index, y_index;

    /*  Variable for indexing over the array being written to.                */
    unsigned int index = 0;

    /*  Loop over the vertical axis. The surface is of the form z = f(x, y).  *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for (y_index = 0; y_index < canvas->ny_pts; ++y_index)
    {
        /*  Convert pixel index to y coordinate.                              */
        const float y = canvas->vertical_start + (float)(y_index) * dy;

        /*  Loop through the horizontal component of the object.              */
        for (x_index = 0; x_index < canvas->nx_pts; ++x_index)
        {
            /*  Convert pixel index to x coordinate in the plane.             */
            const float x = canvas->horizontal_start + (float)(x_index) * dx;

            /*  Get the z component using the provided parametrization.       */
            const float z = f(x, y);

            /*  Add this point to our vertex array.                           */
            canvas->mesh[index] = x;
            canvas->mesh[index + 1U] = y;
            canvas->mesh[index + 2U] = z;

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_parametric_mesh.                                          */
