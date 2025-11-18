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
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

/*  Function for generating the mesh for the surface by calculating vertices. */
func generateMesh(arr []float32, nx_pts, ny_pts uint32) {

    /*  Step sizes in the horizontal and vertical axes.                       */
    var dx float32 = paraboloid_width / float32(nx_pts - 1);
    var dy float32 = paraboloid_height / float32(ny_pts - 1);
    const height_shift float32 = -2.0;

    /*  Variables for indexing the horizontal and vertical axes.              */
    var x_index, y_index uint32;

    /*  Variable for indexing over the array being written to.                */
    var index uint32 = 0;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if (nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT) {
        return;
    }

    /*  Loop through the vertical axis. The elliptic paraboloid lies          *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for y_index = 0; y_index < ny_pts; y_index++ {

        /*  Convert pixel index to y coordinate.                              */
        var y_pt float32 = paraboloid_y_start + float32(y_index) * dy

        /*  Loop through the horizontal component of the object.              */
        for x_index = 0; x_index < nx_pts; x_index++ {

            /*  Convert pixel index to x coordinate in the plane.             */
            var x_pt float32 = paraboloid_x_start + float32(x_index) * dx;

            /*  The elliptic paraboloid has a simple formula: z = x^2 + 2y^2. *
             *  We shift this slightly to center the surface on the screen.   */
            var z_pt float32 = x_pt * x_pt + 2.0 * y_pt * y_pt + height_shift;

            /*  Add this point to our vertex array.                           */
            arr[index] = x_pt;
            arr[index + 1] = y_pt;
            arr[index + 2] = z_pt;

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_mesh.                                                     */
