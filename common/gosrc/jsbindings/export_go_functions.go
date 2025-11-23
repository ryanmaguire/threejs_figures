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
 *      Exports Go functions to JavaScript.                                   *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package jsbindings

/*  The Global function is here, allowing us to access the window.            */
import "syscall/js"

/*  Function for exporting the jsbindings routines to JavaScript.             */
func ExportGoFunctions() {

    /*  Get the window for the page so we may set the functions as globals.   */
    var window js.Value = js.Global()

    /*  Create JavaScript wrappers for the functions with standard camel case.*/
    window.Set("genRectWireframe", js.FuncOf(GenerateRectangularWireframe))
    window.Set("indexBufferAddress", js.FuncOf(IndexBufferAddress))
    window.Set("mainCanvasAddress", js.FuncOf(MainCanvasAddress))
    window.Set("meshBufferAddress", js.FuncOf(MeshBufferAddress))
    window.Set("rotateMesh", js.FuncOf(RotateMesh))
    window.Set("setRotationAngle", js.FuncOf(SetRotationAngle))
}
/*  End of ExportGoFunctions.                                                 */
