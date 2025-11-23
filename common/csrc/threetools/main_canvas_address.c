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
 *      Returns a pointer to the main canvas.                                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/

/*  Canvas typedef provided here.                                             */
#include <threetools/types.h>

/*  The main_canvas global is declared here.                                  */
#include <threetools/globals.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      main_canvas_address                                                   *
 *  Purpose:                                                                  *
 *      Returns the address of the global main canvas.                        *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (Canvas *):                                                   *
 *          The address of the global main canvas as a pointer.               *
 ******************************************************************************/
Canvas *main_canvas_address(void)
{
    /*  Simply return the address of the main canvas. This is used at the     *
     *  JavaScript level to access the struct.                                */
    return &main_canvas;
}
/*  End of main_canvas_address.                                               */
