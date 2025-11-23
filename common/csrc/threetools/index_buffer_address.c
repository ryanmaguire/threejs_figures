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
 *      Returns a pointer to the index buffer.                                *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  The index_buffer global is declared here.                                 */
#include <threetools/globals.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      index_buffer_address                                                  *
 *  Purpose:                                                                  *
 *      Returns the address of the global index buffer.                       *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (unsigned int *):                                             *
 *          The address of the global index buffer as a pointer.              *
 ******************************************************************************/
unsigned int *index_buffer_address(void)
{
    /*  We can simply return the index buffer. At the JavaScript level this   *
     *  is used to get the address of the index array for reading and writing.*/
    return index_buffer;
}
/*  End of index_buffer_address.                                              */
