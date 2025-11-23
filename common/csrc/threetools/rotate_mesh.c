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
 *      Rotates the mesh by a fixed angle.                                    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Canvas and UnitVector typedefs provided here.                             */
#include <threetools/types.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      rotate_mesh                                                           *
 *  Purpose:                                                                  *
 *      Rotates the mesh in a canvas by the provided unit vector.             *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas with the mesh that is being rotated.                   *
 *      point (UnitVector):                                                   *
 *          A point on the unit circle, its polar angle is used for rotating. *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
void rotate_mesh(Canvas *canvas, UnitVector point)
{
    /*  Variable for indexing over the elements of the mesh.                  */
    unsigned int index;

    /*  Loop through each point in the mesh.                                  */
    for (index = 0; index < canvas->number_of_points; ++index)
    {
        /*  A vertex has three values, the x, y, and z coordinates. The index *
         *  for the x value of the point is 3 times the current index.        */
        const unsigned int x_index = 3U * index;

        /*  The y index is immediately after the x index.                     */
        const unsigned int y_index = x_index + 1U;

        /*  Use the rotation matrix. Get the initial values.                  */
        const float x = canvas->mesh[x_index];
        const float y = canvas->mesh[y_index];

        /*  Apply the rotation matrix and update the points.                  */
        canvas->mesh[x_index] = point.cos_angle * x - point.sin_angle * y;
        canvas->mesh[y_index] = point.cos_angle * y + point.sin_angle * x;
    }
}
/*  End of rotate_mesh.                                                       */
