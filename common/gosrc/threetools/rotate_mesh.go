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
 *      Rotates the mesh by a fixed angle.                                    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      RotateMesh                                                            *
 *  Purpose:                                                                  *
 *      Rotates the mesh in a canvas by the provided unit vector.             *
 *  Arguments:                                                                *
 *      canvas (*Canvas):                                                     *
 *          The canvas with the mesh that is being rotated.                   *
 *      point (UnitVector]):                                                  *
 *          A point on the unit circle, its polar angle is used for rotating. *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func RotateMesh(canvas *Canvas, point UnitVector) {

    /*  Variable for indexing over the elements of the mesh.                  */
    var index int

    /*  Loop through each point in the mesh.                                  */
    for index = 0; index < canvas.NumberOfPoints; index++ {

        /*  A vertex has three values, the x, y, and z coordinates. The index *
         *  for the x value of the point is 3 times the current index.        */
        var xIndex int = 3 * index

        /*  The y index is immediately after the x index.                     */
        var yIndex int = xIndex + 1

        /*  Use the rotation matrix. Get the initial values.                  */
        var x float32 = canvas.Mesh[xIndex]
        var y float32 = canvas.Mesh[yIndex]

        /*  Apply the rotation matrix and update the points.                  */
        canvas.Mesh[xIndex] = point.AngleCos * x - point.AngleSin * y
        canvas.Mesh[yIndex] = point.AngleCos * y + point.AngleSin * x
    }
}
/*  End of RotateMesh.                                                        */
