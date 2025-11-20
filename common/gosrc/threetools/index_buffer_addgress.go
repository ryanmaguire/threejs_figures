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
 *      Returns the addres to the index buffer.                               *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package threetools

/*  The Pointer type is provided here, which gets an adress from an array.    */
import "unsafe"

/******************************************************************************
 *  Function:                                                                 *
 *      IndexBufferAddress                                                    *
 *  Purpose:                                                                  *
 *      Returns the address of the global index buffer.                       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      address (uintptr):                                                    *
 *          The address of the global index buffer as an unsigned integer.    *
 ******************************************************************************/
func IndexBufferAddress() uintptr {

    /*  Get a pointer for the array and then convert this into an integer,    *
     *  which is the address of the array.                                    */
    return uintptr(unsafe.Pointer(&IndexBuffer))
}
/*  End of IndexBufferAddress.                                                */
