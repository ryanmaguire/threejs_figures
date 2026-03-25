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

/*  Object and SurfaceParametrization typedefs found here.                    */
#include <threetools/types.h>

/*  Function prototype / forward declaration.                                 */
extern void
generate_parametric_mesh(Object * const object,
                         const SurfaceParametrization * const surface);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_parametric_mesh                                              *
 *  Purpose:                                                                  *
 *      Computes the vertices of a mesh from a parametric equation.           *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The geometric object. This contains index and mesh buffers.       *
 *      surface (const SurfaceParametrization):                               *
 *          The function that defines the surface, z = f(x, y).               *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void
generate_parametric_mesh(Object * const object,
                         const SurfaceParametrization * const surface)
{
    /*  Step sizes in the horizontal and vertical axes.                       */
    const float dx = surface->width / (float)(object->nx_pts - 1U);
    const float dy = surface->height / (float)(object->ny_pts - 1U);

    /*  Variables for indexing the horizontal and vertical axes.              */
    unsigned int x_index, y_index;

    /*  Variable for indexing over the array being written to.                */
    unsigned int index = 0;

    /*  Loop over the vertical axis. The surface is of the form z = f(x, y).  *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for (y_index = 0; y_index < object->ny_pts; ++y_index)
    {
        /*  Convert pixel index to y coordinate.                              */
        const float y = surface->vertical_start + (float)(y_index) * dy;

        /*  Loop through the horizontal component of the object.              */
        for (x_index = 0; x_index < object->nx_pts; ++x_index)
        {
            /*  Convert pixel index to x coordinate in the plane.             */
            const float x = surface->horizontal_start + (float)(x_index) * dx;

            /*  Get the z component using the provided parametrization.       */
            const float z = surface->parametrization(x, y);

            /*  Add this point to our vertex array.                           */
            object->mesh[index] = x;
            object->mesh[index + 1U] = y;
            object->mesh[index + 2U] = z;

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_parametric_mesh.                                          */
