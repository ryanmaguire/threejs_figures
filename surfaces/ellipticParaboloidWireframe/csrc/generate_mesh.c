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
 *      Computes the locations of the points in the mesh for the surface.     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Function prototype and mess array found here.                             */
#include "paraboloid.h"

/*  Function for generating the mesh for the surface by calculating vertices. */
void generate_mesh(float *arr, unsigned int nx_pts, unsigned int ny_pts)
{
    /*  Step sizes in the horizontal and vertical axes.                       */
    const float dx = paraboloid_width / (float)(nx_pts - 1U);
    const float dy = paraboloid_height / (float)(ny_pts - 1U);
    const float height_shift = -2.0F;

    /*  Variables for indexing the horizontal and vertical axes.              */
    unsigned int x_index, y_index;

    /*  Variable for indexing over the array being written to.                */
    unsigned int index = 0U;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if ((nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT))
        return;

    /*  Loop through the vertical axis. The elliptic paraboloid lies          *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for (y_index = 0; y_index < ny_pts; ++y_index)
    {
        /*  Convert pixel index to y coordinate.                              */
        const float y_pt = paraboloid_y_start + (float)y_index * dy;

        /*  Loop through the horizontal component of the object.              */
        for (x_index = 0; x_index < nx_pts; ++x_index)
        {
            /*  Convert pixel index to x coordinate in the plane.             */
            const float x_pt = paraboloid_x_start + (float)x_index * dx;

            /*  The elliptic paraboloid has a simple formula: z = x^2 + 2y^2. *
             *  We shift this slightly to center the surface on the screen.   */
            const float z_pt = x_pt * x_pt + 2.0F * y_pt * y_pt + height_shift;

            /*  Add this point to our vertex array.                           */
            arr[index] = x_pt;
            arr[index + 1U] = y_pt;
            arr[index + 2U] = z_pt;

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_mesh.                                                     */
