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
 *  Date:       November 24, 2025                                             *
 ******************************************************************************/

/*  Canvas and CanvasParameters typedefs provided here.                       */
#include <threetools/types.h>

/*  The main_canvas and buffer globals are declared here.                     */
#include <threetools/globals.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      init_main_canvas                                                      *
 *  Purpose:                                                                  *
 *      Initializes the main canvas for an animation.                         *
 *  Arguments:                                                                *
 *      parameters (CanvasParameters):                                        *
 *          The parameters for the canvas, passed from JavaScript or Godot.   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void init_main_canvas(CanvasParameters parameters)
{
    /*  Most of the JavaScript / Godot parameters are the same, copy them.    */
    main_canvas.nx_pts = parameters.nx_pts;
    main_canvas.ny_pts = parameters.ny_pts;
    main_canvas.width = parameters.width;
    main_canvas.height = parameters.height;
    main_canvas.horizontal_start = parameters.x_start;
    main_canvas.vertical_start = parameters.y_start;
    main_canvas.mesh_type = parameters.mesh_type;

    /*  The remaining variables in the canvas can be computed from these.     */
    reset_mesh_buffer(&main_canvas, mesh_buffer);
    reset_index_buffer(&main_canvas, index_buffer);
}
/*  End of init_main_canvas.                                                  */
