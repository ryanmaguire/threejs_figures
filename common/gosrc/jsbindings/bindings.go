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
 *      Provides bindings for all of the Go functions for use in JavaScript.  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package jsbindings

import (
    "syscall/js"
    "common/threetools"
)

/*  Wrapper function for the Go function generateIndices.                     */
func GenRectWireframe(this js.Value, args []js.Value) interface{} {

    /*  Add all of the line segments to the mesh.                             */
    threetools.GenerateRectangularWireframe(&threetools.MainCanvas)
    return nil
}
/*  End of jsGenerateIndices.                                                 */

/*  Wrapper function for the Go function rotateMesh.                          */
func RotateMesh(this js.Value, args []js.Value) interface{} {

    /*  Rotate the points in the mesh by the RotationVector (see globals.go). */
    threetools.RotateMesh(&threetools.MainCanvas, threetools.RotationVector)
    return nil
}
/*  End of jsRotateMesh.                                                      */

/*  Wrapper function for the Go function setRotationAngle.                    */
func SetRotationAngle(this js.Value, args []js.Value) interface{} {

    /*  The input is a single float, the new rotation angle.                  */
    var angle float32 = float32(args[0].Float())

    /*  Pass the value to the Go function and return.                         */
    threetools.SetRotationAngle(angle)
    return nil
}
/*  End of jsSetRotationAngle.                                                */

/*  Wrapper function for the Go function getMeshBuffer.                       */
func MeshBufferAddress(this js.Value, args []js.Value) interface{} {

    /*  No input, this function simply retrieves the address of messBuffer.   */
    return threetools.MeshBufferAddress()
}
/*  End of jsGetMeshBuffer.                                                   */

/*  Wrapper function for the Go function getIndexBuffer.                      */
func IndexBufferAddress(this js.Value, args []js.Value) interface{} {

    /*  Similar to getMeshBuffer, this gets the address of the index array.   */
    return threetools.IndexBufferAddress()
}
/*  End of jsGetIndexBuffer.                                                  */
