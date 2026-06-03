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
 *      Rotates a canvas by the global rotation_vector global.                *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 24, 2025                                             *
 ******************************************************************************/

/*  The rotation_vector global variable is provided here.                     */
#include <threetools/globals.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/*  size_t typedef found here.                                                */
#include <stddef.h>

/******************************************************************************
 *  Function:                                                                 *
 *      z_rotate_canvas                                                       *
 *  Purpose:                                                                  *
 *      Rotates the canvas by the global rotation_vector.                     *
 *  Arguments:                                                                *
 *      canvas (Canvas * const):                                              *
 *          The canvas for the animation. This contains geometry and buffers. *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void z_rotate_canvas(Canvas * const canvas, UnitVector point)
{
    size_t n;

    /*  This function is for use at the JavaScript and Godot level so that we *
     *  may rotate the main canvas without passing any parameters. Pass the   *
     *  global variables to the rotation function.                            */
    for (n = 0; n < canvas->number_of_objects; ++n)
        rotate_mesh(&canvas->objects[n], point);
}
/*  End of z_rotate_canvas.                                                   */
