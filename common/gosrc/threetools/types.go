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
 *      Provides common types used for creating three.js animations.          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

/*  Parametrization for surfaces of the form z = f(x, y).                     */
type SurfaceParametrization func(x, y float32) float32

/*  Vector struct used for rotating points about the z axis.                  */
type UnitVector struct {
    AngleCos, AngleSin float32
}

/*  Struct with the geometry and buffers for the animation.                   */
type Canvas struct {
    Mesh []float32
    Indices []uint32
    NumberOfPoints, MeshSize, IndexSize int
    NxPts, NyPts uint32
    Width, Height float32
    HorizontalStart, VerticalStart float32
    MeshType uint
}
