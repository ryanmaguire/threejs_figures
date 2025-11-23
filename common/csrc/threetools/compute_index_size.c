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
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/

/*  Canvas and MeshType typedefs found here.                                  */
#include <threetools/types.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      compute_index_size                                                    *
 *  Purpose:                                                                  *
 *      Computes the number of elements needed for the index buffer.          *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The input canvas, the size of its index buffer is computed.       *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
void compute_index_size(Canvas *canvas)
{
    /*  The total number of points in the mesh is the product of the width    *
     *  and height. Points along the boundary usually have a different number *
     *  of line segments associated to them then those in the interior. The   *
     *  number of points along the boundary is proportional to the sum of the *
     *  width and height, compute both the sum and the product.               */
    const unsigned int product = canvas->nx_pts * canvas->ny_pts;
    const unsigned int sum = canvas->nx_pts + canvas->ny_pts;

    /*  The number of line segments is given by the type of mesh being used.  */
    switch (canvas->mesh_type)
    {
        /*  Square wireframe, internal points have two line segments tied to  *
         *  them, the top and right boundary points have only one.            */
        case SquareWireframe:
            canvas->index_size = 2U * (2U * product - sum);
            break;

        /*  Triangle wireframe, internal points have three line segments tied *
         *  to them, the top and right boundary points have only one.         */
        case TriangleWireframe:
            canvas->index_size = 2U * (3U * product - 2U * sum);
            break;

        /*  Similar to the square wireframe, but we add a line segment from   *
         *  the right edge to the left edge.                                  */
        case CylindricalSquareWireframe:
        case MobiusSquareWireframe:
            canvas->index_size = 2U * (2U * product - canvas->nx_pts);
            break;

        /*  Similar to the triangle wireframe, but we add edges and diagonals *
         *  from the right edge to the left one.                              */
        case CylindricalTriangleWireframe:
        case MobiusTriangleWireframe:
            canvas->index_size = 2U * (3U * product - 2 * canvas->nx_pts);
            break;

        /*  Similar to the square wireframe, but the bottom edge is connected *
         *  to the top edge, and the left edge to the right edge.             */
        case TorodialSquareWireframe:
        case KleinSquareWireframe:
        case ProjectiveSquareWireframe:
            canvas->index_size = 4U * product;
            break;

        /*  Similar to triangle wireframes, but the bottom edge is connected  *
         *  to the top edge, and the left edge to the right edge.             */
        case TorodialTriangleWireframe:
        case KleinTriangleWireframe:
        case ProjectiveTriangleWireframe:
            canvas->index_size = 6U * product;
            break;

        /*  Illegal input, set the size to zero.                              */
        default:
            canvas->index_size = 0;
    }
}
/*  End of compute_index_size.                                                */
