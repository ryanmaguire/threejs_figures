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
 *      Initializes the main canvas using parameters from JavaScript / Godot. *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 24, 2025                                             *
 ******************************************************************************/

/*  Canvas and CanvasParameters typedefs provided here.                       */
#include <threetools/types.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      init_surface_object                                                   *
 *  Purpose:                                                                  *
 *      Initializes the main canvas for an animation.                         *
 *  Arguments:                                                                *
 *      parameters (const SurfaceParameters * const):                         *
 *          The parameters for the canvas, passed from JavaScript or Godot.   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void
init_surface_object(Object * const object,
                    const SurfaceParameters * const parameters)
{
    /*  Most of the JavaScript / Godot parameters are the same, copy them.    */
    object->nx_pts = parameters->nx_pts;
    object->ny_pts = parameters->ny_pts;
    object->mesh_type = parameters->mesh_type;
    object->indices = NULL;
    object->mesh = NULL;

    /*  The remaining variables in the canvas can be computed from these.     */
    reset_mesh_buffer(object);
    reset_index_buffer(object);
}
/*  End of init_surface_object.                                               */
