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
 *      Provides tools for rendering an elliptic paraboloid.                  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/

/*  Object, SurfaceParameters, SurfaceParametrization, the global main_canvas,*
 *  and make_rectangular_wireframe all come from here.                        */
#include <threetools/threetools.h>

/*  New operator (C++ equivalent of malloc) found here.                       */
#include <new>

/*  Height shift for centering the mesh when it is rendered on the screen.    */
static const float surface_height_shift = -2.0F;

/******************************************************************************
 *  Function:                                                                 *
 *      elliptic_paraboloid                                                   *
 *  Purpose:                                                                  *
 *      Provides the equation for the elliptic paraboloid.                    *
 *  Arguments:                                                                *
 *      x (const float):                                                      *
 *          The x-coordinate for a point on the surface.                      *
 *      y (const float):                                                      *
 *          The y-coordinate for a point on the surface.                      *
 *  Output:                                                                   *
 *      z (float):                                                            *
 *          The z-coordinate for the point z = f(x, y).                       *
 ******************************************************************************/
static float elliptic_paraboloid(const float x, const float y)
{
    /*  An elliptic paraboloid has the formula z = x^2 + a y^2, with a > 1.   *
     *  The height shift centers the object on screen.                        */
    return x * x + 2.0F * y * y + surface_height_shift;
}
/*  End of elliptic_paraboloid.                                               */

/******************************************************************************
 *  Function:                                                                 *
 *      setup_mesh                                                            *
 *  Purpose:                                                                  *
 *      Builds the wireframe for the figure and stores it in the main_canvas. *
 *  Arguments:                                                                *
 *      parameters (SurfaceParameters):                                       *
 *          Parameters provided by JavaScript or GodotScript for the surface. *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
void setup_mesh(SurfaceParameters parameters)
{
    SurfaceParametrization surface;
    Object *object = new Object();

    surface.width = parameters.width;
    surface.height = parameters.height;
    surface.horizontal_start = parameters.x_start;
    surface.vertical_start = parameters.y_start;
    surface.parametrization = elliptic_paraboloid;

    make_rectangular_wireframe(object, &parameters, &surface);

    main_canvas.number_of_objects = 1;
    main_canvas.objects = object;
}
/*  End of setup_mesh.                                                        */
