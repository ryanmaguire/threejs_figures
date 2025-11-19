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
func generateMesh(arr []float32, nxPts, nyPts uint32) {

    /*  Step sizes in the horizontal and vertical axes.                       */
    var dx float32 = width / float32(nxPts - 1)
    var dy float32 = height / float32(nyPts - 1)

    /*  Shift for centering the object around the origin.                     */
    const heightShift float32 = -2.0

    /*  Variables for indexing the horizontal and vertical axes.              */
    var xIndex, yIndex uint32

    /*  Variable for indexing over the array being written to.                */
    var index uint32 = 0

    /*  Avoid writing beyond the bounds of the array that was allocated.      *
     *  Check if the input sizes are too big.                                 */
    if (nxPts > maxWidth) || (nyPts > maxHeight) {
        return
    }

    /*  Loop through the vertical axis. The elliptic paraboloid lies          *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for yIndex = 0; yIndex < nyPts; yIndex++ {

        /*  Convert pixel index to y coordinate.                              */
        var yPt float32 = yStart + float32(yIndex) * dy

        /*  Loop through the horizontal component of the object.              */
        for xIndex = 0; xIndex < nxPts; xIndex++ {

            /*  Convert pixel index to x coordinate in the plane.             */
            var xPt float32 = xStart + float32(xIndex) * dx

            /*  The elliptic paraboloid has a simple formula: z = x^2 + 2y^2. *
             *  We shift this slightly to center the surface on the screen.   */
            var zPt float32 = xPt * xPt + 2.0 * yPt * yPt + heightShift

            /*  Add this point to our vertex array.                           */
            arr[index] = xPt
            arr[index + 1] = yPt
            arr[index + 2] = zPt

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generateMesh.                                                      */
