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
 *      Creates a rectangular wireframe and stores it in the main_canvas.     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 24, 2025                                             *
 ******************************************************************************/

/*  SurfaceParametrization and CanvasParameters typedefs provided here.       */
#include <threetools/types.h>

/*  The main_canvas global is declared here.                                  */
#include <threetools/globals.h>

/*  Function prototype / forward declaration found here.                      */
#include <threetools/threetools.h>

/******************************************************************************
 *  Function:                                                                 *
 *      make_rectangular_wireframe                                            *
 *  Purpose:                                                                  *
 *      Creates a rectangular wireframe stored in the main_canvas.            *
 *  Arguments:                                                                *
 *      parameters (const CanvasParameters * const):                          *
 *          The parameters for the main canvas.                               *
 *      surface (SurfaceParametrization):                                     *
 *          The parametrization, a function of the form z = f(x, y).          *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
void
make_rectangular_wireframe(const CanvasParameters * const parameters,
                           SurfaceParametrization surface)
{
    init_main_canvas(parameters);
    generate_mesh_from_parametrization(&main_canvas, surface);
    generate_rectangular_wireframe(&main_canvas);
}
/*  End of make_rectangular_wireframe.                                        */
