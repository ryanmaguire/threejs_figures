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
 *      Returns the address for the global mesh buffer.                       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package threetools

/*  The Pointer type is provided here, which gets an address from an array.   */
import "unsafe"

/******************************************************************************
 *  Function:                                                                 *
 *      MeshBufferAddress                                                     *
 *  Purpose:                                                                  *
 *      Returns the address of the global mesh buffer.                        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      address (uintptr):                                                    *
 *          The address of the global mesh buffer as an unsigned integer.     *
 ******************************************************************************/
func MeshBufferAddress() uintptr {

    /*  Get a pointer for the array and then convert this into an integer,    *
     *  which is the address of the array.                                    */
    return uintptr(unsafe.Pointer(&MeshBuffer))
}
/*  End of MeshBufferAddress.                                                 */
