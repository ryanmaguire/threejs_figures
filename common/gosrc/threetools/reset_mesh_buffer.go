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
 *      Resets the size of the mesh buffer inside a canvas.                   *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      ResetMeshBuffer                                                       *
 *  Purpose:                                                                  *
 *      Resets the size of the mesh buffer.                                   *
 *  Arguments:                                                                *
 *      canvas (*Canvas):                                                     *
 *          The canvas that is being resized.                                 *
 *      buffer ([]float32]):                                                  *
 *          The buffer where canvas will store its data.                      *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func ResetMeshBuffer(canvas *Canvas, buffer []float32) {
    canvas.NumberOfPoints = int(canvas.NxPts * canvas.NyPts)
    canvas.MeshSize = 3 * canvas.NumberOfPoints
    canvas.Mesh = buffer[0:canvas.MeshSize]
}
