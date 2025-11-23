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
 *      Computes the locations of the points in the mesh for a surface.       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      GenerateMeshFromParametrization                                       *
 *  Purpose:                                                                  *
 *      Computes the vertices of a mesh from a parametric equation.           *
 *  Arguments:                                                                *
 *      self (*Canvas):                                                       *
 *          The canvas for the animation. This contains geometry and buffers. *
 *      f (SurfaceParametrization):                                           *
 *          The function that defines the surface, z = f(x, y).               *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func (self *Canvas) GenerateMeshFromParametrization(f SurfaceParametrization) {

    /*  Step sizes in the horizontal and vertical axes.                       */
    var dx float32 = self.Width / float32(self.NxPts - 1)
    var dy float32 = self.Height / float32(self.NyPts - 1)

    /*  Variables for indexing the horizontal and vertical axes.              */
    var xIndex, yIndex uint32

    /*  Variable for indexing over the array being written to.                */
    var index uint32 = 0

    /*  Avoid writing beyond the bounds of the array that was allocated.      *
     *  Check if the input sizes are too big.                                 */
    if (self.NxPts > MaxWidth) || (self.NyPts > MaxHeight) {
        return
    }

    /*  Loop over the vertical axis. The surface is of the form z = f(x, y).  *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for yIndex = 0; yIndex < self.NyPts; yIndex++ {

        /*  Convert pixel index to y coordinate.                              */
        var yPt float32 = self.VerticalStart + float32(yIndex) * dy

        /*  Loop through the horizontal component of the object.              */
        for xIndex = 0; xIndex < self.NxPts; xIndex++ {

            /*  Convert pixel index to x coordinate in the plane.             */
            var xPt float32 = self.HorizontalStart + float32(xIndex) * dx

            /*  Get the z component using the provided parametrization.       */
            var zPt float32 = f(xPt, yPt)

            /*  Add this point to our vertex array.                           */
            self.Mesh[index] = xPt
            self.Mesh[index + 1] = yPt
            self.Mesh[index + 2] = zPt

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of GenerateMeshFromParametrization.                                   */
