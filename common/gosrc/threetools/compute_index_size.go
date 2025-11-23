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
 *      Computes the size of the index array needed by a canvas.              *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      ComputeIndexSize                                                      *
 *  Purpose:                                                                  *
 *      Computes the number of elements needed for the index buffer.          *
 *  Arguments:                                                                *
 *      self (*Canvas):                                                       *
 *          The input canvas, the size of its index buffer is computed.       *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func (self *Canvas) ComputeIndexSize() {

    /*  The total number of points in the mesh is the product of the width    *
     *  and height. Points along the boundary usually have a different number *
     *  of line segments associated to them then those in the interior. The   *
     *  number of points along the boundary is proportional to the sum of the *
     *  width and height, compute both the sum and the product.               */
    var product uint32 = self.NxPts * self.NyPts
    var sum uint32 = self.NxPts + self.NyPts

    /*  The number of line segments is given by the type of mesh being used.  */
    switch self.MeshType {

        /*  Square wireframe, internal points have two line segments tied to  *
         *  them, the top and right boundary points have only one.            */
        case SquareWireframe:
            self.IndexSize = int(2 * (2 * product - sum))

        /*  Triangle wireframe, internal points have three line segments tied *
         *  to them, the top and right boundary points have only one.         */
        case TriangleWireframe:
            self.IndexSize = int(2 * (3 * product - 2 * sum))

        /*  Similar to the square wireframe, but we add a line segment from   *
         *  the right edge to the left edge.                                  */
        case CylindricalSquareWireframe:
            self.IndexSize = int(2 * (2 * product - self.NxPts))

        /*  Similar to the triangle wireframe, but we add edges and diagonals *
         *  from the right edge to the left one.                              */
        case CylindricalTriangleWireframe:
            self.IndexSize = int(2 * (3 * product - 2 * self.NxPts))

        /*  Similar to the square wireframe, but the bottom edge is connected *
         *  to the top edge, and the left edge to the right edge.             */
        case TorodialSquareWireframe:
            fallthrough
        case KleinSquareWireframe:
            fallthrough
        case ProjectiveSquareWireframe:
            self.IndexSize = int(4 * product)

        /*  Similar to triangle wireframes, but the bottom edge is connected  *
         *  to the top edge, and the left edge to the right edge.             */
        case TorodialTriangleWireframe:
            fallthrough
        case KleinTriangleWireframe:
            fallthrough
        case ProjectiveTriangleWireframe:
            self.IndexSize = int(6 * product)

        /*  Illegal input, set the size to zero.                              */
        default:
            self.IndexSize = 0
    }
}
/*  End of ComputeIndexSize.                                                  */
