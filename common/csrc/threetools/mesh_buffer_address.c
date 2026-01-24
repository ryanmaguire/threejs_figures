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
 *      mesh_buffer_address                                                   *
 *  Purpose:                                                                  *
 *      Returns a pointer to the mesh array.                                  *
 *  Arguments:                                                                *
 *      canvas (const Canvas * const).                                        *
 *          The canvas containing the mesh buffer that we want.               *
 *  Output:                                                                   *
 *      mesh (float *):                                                       *
 *          A pointer to the mesh array.                                      *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the mesh array so it may read and write to it.                    *
 ******************************************************************************/
float *mesh_buffer_address(const Canvas * const canvas)
{
    /*  We can simply return the mesh buffer. At the JavaScript level this    *
     *  is used to get the address of the mesh array for reading and writing. */
    return canvas->mesh;
}
/*  End of mesh_buffer_address.                                               */
