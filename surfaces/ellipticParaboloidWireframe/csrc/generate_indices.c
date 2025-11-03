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
 *      Computes the indices corresponding to vertices in the wireframe mesh. *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Function prototype and index array found here.                            */
#include "paraboloid.h"

/*  Function for generating the wireframe for the animation.                  */
void
generate_indices(unsigned int *arr, unsigned int nx_pts, unsigned int ny_pts)
{
    /*  Variables for indexing the horizontal and vertical axes.              */
    unsigned int x_index, y_index;

    /*  Variable for indexing over the array being written to.                */
    unsigned int index = 0U;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if ((nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT))
        return;

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for (y_index = 0; y_index < ny_pts; ++y_index)
    {
        /*  The indices are row-major, meaning index = y * width + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        const unsigned int shift = y_index * nx_pts;

        /*  The vertical component is now fixed, loop through the horizontal. */
        for (x_index = 0; x_index < nx_pts; ++x_index)
        {
            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * width + x.                    */
            const unsigned int index00 = shift + x_index;

            /*  The point directly after the current point, in the horizontal.*/
            const unsigned int index01 = index00 + 1U;

            /*  The point directly above the current point, in the vertical.  */
            const unsigned int index10 = index00 + nx_pts;

            /*  If we are not at the top edge or the right edge of the        *
             *  rectangle, we may add an "L" shape to our mesh connecting the *
             *  bottom left point to the bottom right point, and the bottom   *
             *  left point to to the upper left point. At the top of the      *
             *  rectangle the upper left point goes beyond the bounds of the  *
             *  parametrization, so we do not need to draw it. Check for this.*/
            if (y_index != ny_pts - 1U)
            {
                arr[index] = index00;
                arr[index + 1U] = index10;
                index += 2U;
            }

            /*  Similarly, at the right edge we have that the bottom right    *
             *  point lies outside of the parametrizion and do not need to    *
             *  add it to our mesh. Check for this.                           */
            if (x_index != nx_pts - 1U)
            {
                arr[index] = index00;
                arr[index + 1U] = index01;
                index += 2U;
            }
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_indices.                                                  */
