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
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

/*  Function for rotating the mesh by a fixed angle.                          */
func rotateMesh(arr []float32, n_pts uint32) {

    /*  Variable for indexing over the elements of the mesh.                  */
    var index uint32

    /*  Loop through each point in the mesh.                                  */
    for index = 0; index < n_pts; index++ {

        /*  A vertex has three values, the x, y, and z coordinates. The index *
         *  for the x value of the point is 3 times the current index.        */
        var x_index uint32 = 3 * index

        /*  The y index is immediately after the x index.                     */
        var y_index uint32 = x_index + 1

        /*  Use the rotation matrix. Get the initial values.                  */
        var x float32 = arr[x_index]
        var y float32 = arr[y_index]

        /*  Apply the rotation matrix and update the points.                  */
        arr[x_index] = cos_angle * x - sin_angle * y
        arr[y_index] = cos_angle * y + sin_angle * x
    }
}
/*  End of rotate_mesh.                                                       */
