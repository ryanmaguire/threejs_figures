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
 *      Returns a pointer to the index buffer.                                *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

/*  The Pointer function is provided here, which gets an adress from an array.*/
import "unsafe"

/*  Function for getting the address of the index array.                      */
func getIndexBuffer() uintptr {

    /*  Get a pointer for the array and then convert this into an integer,    *
     *  which is the address of the array. This is used at the JavaScript     *
     *  level for reading and writing to the buffer.                          */
    return uintptr(unsafe.Pointer(&indexBuffer))
}
/*  End of getIndexBuffer.                                                    */
