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
package main

import (
    "syscall/js"
    "reflect"
    "unsafe"
)

/******************************************************************************
 *  Function:                                                                 *
 *      getSliceFromAddress                                                   *
 *  Purpose:                                                                  *
 *      Creates a float32 or uint32 slice from a memory address and a length. *
 *  Arguments:                                                                *
 *      address (uintptr):                                                    *
 *          The memory address of the start of the data.                      *
 *      length (int):                                                         *
 *          The number of elements in the array. This is not the total number *
 *          of bytes. The total number of bytes is length * sizeof(float32).  *
 *  Output:                                                                   *
 *      arr ([]float32 or []uint32):                                          *
 *          A slice for the data.                                             *
 ******************************************************************************/
func getSliceFromAddress[T float32 | uint32](address uintptr, length int) []T {

    /*  Declare a variable for the slice. We'll change it to hold the data.   */
    var arr []T

    /*  Convert the slice into a pointer.                                     */
    var ptr unsafe.Pointer = unsafe.Pointer(&arr)

    /*  Convert this pointer into a header for a slice.                       */
    var header *reflect.SliceHeader = (*reflect.SliceHeader)(ptr)

    /*  Set the slice attributes. The data starts at the given address, and   *
     *  the number of elements is given by the input length.                  */
    header.Data = address
    header.Len = length
    header.Cap = length

    /*  The slice now has the data in view. Return the slice.                 */
    return arr
}
/*  End of getSliceFromAddress.                                               */

/*  Wrapper function for the Go function generateMesh.                        */
func jsGenerateMesh(this js.Value, args []js.Value) interface{} {

    /*  The inputs are the address for the buffer (a Float32Array), and the   *
     *  number of pixels in the x and y axes, respectively. Cast these to     *
     *  their appropriate types.                                              */
    var ptr uintptr = uintptr(args[0].Int())
    var nxPts uint32 = uint32(args[1].Int())
    var nyPts uint32 = uint32(args[2].Int())

    /*  There are nxPts * nyPts points in the mesh, and a pointe consists of  *
     *  three floats (the x, y, and z coordinates). The total length of the   *
     *  array is thus 3 * width * height.                                     */
    var length int = int(3 * nxPts * nyPts)

    /*  Get a slice for the actual data so we may pass it to the go function. */
    var arr []float32 = getSliceFromAddress[float32](ptr, length)

    /*  Add all of the points for the surface to the mesh.                    */
    generateMesh(arr, nxPts, nyPts)
    return nil
}
/*  End of jsGenerateMesh.                                                    */

/*  Wrapper function for the Go function generateIndices.                     */
func jsGenerateIndices(this js.Value, args []js.Value) interface{} {

    /*  The inputs are the address for the indices (a Uint32Array), and the   *
     *  number of pixels in the x and y axes, respectively. Cast these to     *
     *  their appropriate types.                                              */
    var ptr uintptr = uintptr(args[0].Int())
    var nxPts uint32 = uint32(args[1].Int())
    var nyPts uint32 = uint32(args[2].Int())

    /*  There are width * height points. For each point that is not on the    *
     *  top or right edge there are two line segments associated with it,     *
     *  the points along the boundary correspond to one line segment. So      *
     *  there are 2 * width * height - width - height many line segments.     *
     *  Each line segement is defined by two vertices, and this gives us      *
     *  the length of the indices array.                                      */
    var length int = int(2 * (2 * nxPts * nyPts - nxPts - nyPts))

    /*  Get a slice for the actual data so we may pass it to the go function. */
    var arr []uint32 = getSliceFromAddress[uint32](ptr, length)

    /*  Add all of the line segments to the mesh.                             */
    generateIndices(arr, nxPts, nyPts)
    return nil
}
/*  End of jsGenerateIndices.                                                 */

/*  Wrapper function for the Go function rotateMesh.                          */
func jsRotateMesh(this js.Value, args []js.Value) interface{} {

    /*  This function wants the mesh slice and the total number of points.    */
    var ptr uintptr = uintptr(args[0].Int())
    var nPts uint32 = uint32(args[1].Int())

    /*  Each point is given by three floats, so the length is 3 * nPts.       */
    var length int = int(3 * nPts)

    /*  Get a slice for the data.                                             */
    var arr []float32 = getSliceFromAddress[float32](ptr, length)

    /*  Rotate the points in the mesh by the rotationAngle (see globals.go).  */
    rotateMesh(arr, nPts)
    return nil
}
/*  End of jsRotateMesh.                                                      */

/*  Wrapper function for the Go function setRotationAngle.                    */
func jsSetRotationAngle(this js.Value, args []js.Value) interface{} {

    /*  The input is a single float, the new rotation angle.                  */
    angle := float32(args[0].Float())

    /*  Pass the value to the Go function and return.                         */
    setRotationAngle(angle)
    return nil
}
/*  End of jsSetRotationAngle.                                                */

/*  Wrapper function for the Go function getMeshBuffer.                       */
func jsGetMeshBuffer(this js.Value, args []js.Value) interface{} {

    /*  No input, this function simply retrieves the address of messBuffer.   */
    return getMeshBuffer()
}
/*  End of jsGetMeshBuffer.                                                   */

/*  Wrapper function for the Go function getIndexBuffer.                      */
func jsGetIndexBuffer(this js.Value, args []js.Value) interface{} {

    /*  Similar to getMeshBuffer, this gets the address of the index array.   */
    return getIndexBuffer()
}
/*  End of jsGetIndexBuffer.                                                  */
