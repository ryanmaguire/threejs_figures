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
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

/*  Function for generating the wireframe for the animation.                  */
func generateIndices(arr []uint32, nxPts, nyPts uint32) {

    /*  Variables for indexing the horizontal and vertical axes.              */
    var xIndex, yIndex uint32

    /*  Variable for indexing over the array being written to.                */
    var index uint32 = 0

    /*  Avoid writing beyond the bounds of the array that was allocated.      *
     *  Check if the input sizes are too big.                                 */
    if (nxPts > maxWidth) || (nyPts > maxHeight) {
        return
    }

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for yIndex = 0; yIndex < nyPts; yIndex++ {

        /*  The indices are row-major, meaning index = y * width + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        var shift uint32 = yIndex * nxPts

        /*  The vertical component is now fixed, loop through the horizontal. */
        for xIndex = 0; xIndex < nxPts; xIndex++ {

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * width + x.                    */
            var index00 uint32 = shift + xIndex

            /*  The point directly after the current point, in the horizontal.*/
            var index01 uint32 = index00 + 1

            /*  The point directly above the current point, in the vertical.  */
            var index10 uint32 = index00 + nxPts

            /*  If we are not at the top edge or the right edge of the        *
             *  rectangle, we may add an "L" shape to our mesh connecting the *
             *  bottom left point to the bottom right point, and the bottom   *
             *  left point to to the upper left point. At the top of the      *
             *  rectangle the upper left point goes beyond the bounds of the  *
             *  parametrization, so we do not need to draw it. Check for this.*/
            if yIndex != nyPts - 1 {
                arr[index] = index00
                arr[index + 1] = index10
                index += 2
            }

            /*  Similarly, at the right edge we have that the bottom right    *
             *  point lies outside of the parametrizion and do not need to    *
             *  add it to our mesh. Check for this.                           */
            if (xIndex != nxPts - 1) {
                arr[index] = index00
                arr[index + 1] = index01
                index += 2
            }
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generateIndices.                                                   */
