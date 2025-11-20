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
 *      Computes the size of the index array needed by a canvas.              *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      SetIndexSize                                                          *
 *  Purpose:                                                                  *
 *      Computes the number of elements needed for the index buffer.          *
 *  Arguments:                                                                *
 *      canvas (*Canvas):                                                     *
 *          The input canvas, the size of its index buffer is computed.       *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func SetIndexSize(canvas *Canvas) {

    /*  The total number of points in the mesh is the product of the width    *
     *  and height. Points along the boundary usually have a different number *
     *  of line segments associated to them then those in the interior. The   *
     *  number of points along the boundary is proportional to the sum of the *
     *  width and height, compute both the sum and the product.               */
    var product uint32 = canvas.NxPts * canvas.NyPts
    var sum uint32 = canvas.NxPts + canvas.NyPts

    /*  The number of line segments is given by the type of mesh being used.  */
    switch canvas.MeshType {

        /*  Square wireframe, internal points have two line segments tied to  *
         *  them, the top and right boundary points have only one.            */
        case SquareWireframe:
            canvas.IndexSize = int(2 * (2 * product - sum))

        /*  Triangle wireframe, internal points have three line segments tied *
         *  to them, the top and right boundary points have only one.         */
        case TriangleWireframe:
            canvas.IndexSize = int(2 * (3 * product - 2 * sum))

        /*  Similar to the square wireframe, but we add a line segment from   *
         *  the right edge to the left edge.                                  */
        case CylindricalSquareWireframe:
            canvas.IndexSize = int(2 * (2 * product - canvas.NxPts))

        /*  Similar to triangle wireframe, but we add edges and diagonals     *
         *  from the right edge to the left one.                              */
        case CylindricalTriangleWireframe:
            canvas.IndexSize = int(2 * (3 * product - 2 * canvas.NxPts))

        /*  Similar to square wireframe, but the bottom edge is connected to  *
         *  the top edge, and the left edge to the right edge.                */
        case TorodialSquareWireframe:
            fallthrough
        case KleinSquareWireframe:
            fallthrough
        case ProjectiveSquareWireframe:
            canvas.IndexSize = int(4 * product)

        /*  Similar to triangle wireframe, but the bottom edge is connected   *
         *  to the top edge, and the left edge to the right edge.             */
        case TorodialTriangleWireframe:
            fallthrough
        case KleinTriangleWireframe:
            fallthrough
        case ProjectiveTriangleWireframe:
            canvas.IndexSize = int(6 * product)

        /*  Illegal input, set the size to zero.                              */
        default:
            canvas.IndexSize = 0
    }
}
/*  End of SetIndexSize.                                                      */
