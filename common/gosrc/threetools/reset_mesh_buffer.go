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
 *      self (*Canvas):                                                       *
 *          The canvas that is being resized.                                 *
 *      buffer ([]float32):                                                   *
 *          The buffer where canvas will store its data.                      *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func (self *Canvas) ResetMeshBuffer(buffer []float32) {

    /*  The canvas is a rectangular grid, the total number of points is given *
     *  by the product of the width and the height.                           */
    self.NumberOfPoints = int(self.NxPts * self.NyPts)

    /*  Each point corresponds to three floats (the x, y, and z components).  *
     *  The mesh size is hence three times the number of points.              */
    self.MeshSize = 3 * self.NumberOfPoints

    /*  Reset the mesh buffer to use the provided slice.                      */
    self.Mesh = buffer[0:self.MeshSize]
}
/*  End of ResetMeshBuffer.                                                   */
