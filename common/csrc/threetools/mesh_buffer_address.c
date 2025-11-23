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
 *      Returns a pointer to the mesh buffer.                                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  The mesh_buffer global is declared here.                                  */
#include <threetools/globals.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      main_canvas_address                                                   *
 *  Purpose:                                                                  *
 *      Returns the address of the global mesh buffer.                        *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (float *):                                                    *
 *          The address of the global mesh buffer as a pointer.               *
 ******************************************************************************/
float *mesh_buffer_address(void)
{
    /*  We can simply return the mesh buffer. At the JavaScript level this    *
     *  is used to get the address of the mesh array for reading and writing. */
    return mesh_buffer;
}
/*  End of mesh_buffer_address.                                               */
