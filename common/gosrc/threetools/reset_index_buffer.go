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
 *      Resets the size of the index buffer inside a canvas.                  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

/******************************************************************************
 *  Function:                                                                 *
 *      ResetIndexBuffer                                                      *
 *  Purpose:                                                                  *
 *      Resets the size of the index buffer.                                  *
 *  Arguments:                                                                *
 *      self (*Canvas):                                                       *
 *          The canvas that is being resized.                                 *
 *      buffer ([]uint32):                                                    *
 *          The buffer where canvas will store its data.                      *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
func (self *Canvas) ResetIndexBuffer(buffer []uint32) {
    self.ComputeIndexSize()
    self.Indices = buffer[0:self.IndexSize]
}
/*  End of ResetIndexBuffer.                                                  */
