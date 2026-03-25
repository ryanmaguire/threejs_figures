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

/*  Object typedef found here.                                                */
#include <threetools/types.h>

/*  Function prototype / forward declaration.                                 */
extern unsigned int *index_buffer_address(const Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      index_buffer_address                                                  *
 *  Purpose:                                                                  *
 *      Returns the address of the index buffer.                              *
 *  Arguments:                                                                *
 *      object (const Object * const).                                        *
 *          The object containing the index buffer that we want.              *
 *  Output:                                                                   *
 *      address (unsigned int *):                                             *
 *          The address of the global index buffer as a pointer.              *
 ******************************************************************************/
unsigned int *index_buffer_address(const Object * const object)
{
    /*  We can simply return the index buffer. At the JavaScript level this   *
     *  is used to get the address of the index array for reading and writing.*/
    return object->indices;
}
/*  End of index_buffer_address.                                              */
