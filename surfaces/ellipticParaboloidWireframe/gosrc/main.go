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
 *      Provides tools for rendering an elliptic paraboloid.                  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package main

/*  JavaScript wrapper tools found here.                                      */
import (
    "syscall/js"
    "common/jsbindings"
)

/*  Height shift for centering the mesh when it is rendered on the screen.    */
const surfaceHeightShift float32 = -2.0

/*  The surface being rendered, an elliptic paraboloid.                       */
func surface(x, y float32) float32 {

    /*  An elliptic paraboloid has the formula z = x^2 + a y^2, with a > 1.   *
     *  We use the height shift to center the object on the screen.           */
    return x*x + 2.0 * y*y + surfaceHeightShift
}
/*  End of surface.                                                           */

/*  Wrapper for the Go function MakeRectangularWireframe.                     */
func setupMesh(this js.Value, args []js.Value) interface{} {
    jsbindings.MakeRectangularWireframe(args, surface)
    return nil
}
/*  End of setupMesh.                                                         */

/*  Main program, start of the JavaScript animation.                          */
func main() {
    jsbindings.Run(setupMesh)
}
/*  End of main.                                                              */
