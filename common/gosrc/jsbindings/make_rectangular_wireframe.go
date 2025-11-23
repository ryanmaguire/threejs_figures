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
 *      Provides a JavaScript binding for creating a rectangular wireframe.   *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package jsbindings

import (
    "syscall/js"
    "common/threetools"
)

/*  Function for creating a rectangular wireframe in JavaScript.              */
func
MakeRectangularWireframe(args []js.Value, f threetools.SurfaceParametrization) {
    InitCanvas(args)
    threetools.MainCanvas.GenerateMeshFromParametrization(f)
    threetools.MainCanvas.GenerateRectangularWireframe()
}
/*  End of MakeRectangularWireframe.                                          */
