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
 *      Returns a slice to one of the buffers, given the buffer's address.    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package threetools

import (
    "reflect"
    "unsafe"
)

/******************************************************************************
 *  Function:                                                                 *
 *      SliceFromAddress                                                      *
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
 func SliceFromAddress[T float32 | uint32](address uintptr, length int) []T {

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
/*  End of SliceFromAddress.                                                  */
