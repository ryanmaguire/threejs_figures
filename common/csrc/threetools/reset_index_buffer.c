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
 *      Resets the size of the index buffer inside a canvas.                  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/

/*  Canvas typedef found here.                                                */
#include <threetools/types.h>

/*  Function prototype / forward declaration given here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      reset_index_buffer                                                    *
 *  Purpose:                                                                  *
 *      Resets the size of the index buffer.                                  *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas that is being resized.                                 *
 *      buffer (unsigned int *):                                              *
 *          The buffer where the canvas will store its data.                  *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void reset_index_buffer(Canvas *canvas, unsigned int *buffer)
{
    /*  The size of the index buffer depends on the mesh type. Compute this.  */
    compute_index_size(canvas);

    /*  Reset the index buffer to use the one provided.                       */
    canvas->indices = buffer;
}
/*  End of reset_index_buffer.                                                */
