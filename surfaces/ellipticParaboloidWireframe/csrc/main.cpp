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
#include <threetools/threetools.h>
#include <emscripten/bind.h>

/*  Height shift for centering the mesh when it is rendered on the screen.    */
static const float surface_height_shift = -2.0F;

/*  The surface being rendered, an elliptic paraboloid.                       */
static float surface(float x, float y)
{
    /*  An elliptic paraboloid has the formula z = x^2 + a y^2, with a > 1.   *
     *  We use the height shift to center the object on the screen.           */
    return x*x + 2.0F * y*y + surface_height_shift;
}
/*  End of surface.                                                           */

/*  Wrapper for the Go function MakeRectangularWireframe.                     */
static void setup_mesh(CanvasParameters parameters)
{
    make_rectangular_wireframe(&parameters, surface);
}
/*  End of setupMesh.                                                         */

/*  Main program, start of the JavaScript animation.                          */
EMSCRIPTEN_BINDINGS(threetools)
{
    emscripten::value_object<CanvasParameters>("CanvasParameters")
        .field("nxPts", &CanvasParameters::nx_pts)
        .field("nyPts", &CanvasParameters::ny_pts)
        .field("width", &CanvasParameters::width)
        .field("height", &CanvasParameters::height)
        .field("xStart", &CanvasParameters::x_start)
        .field("yStart", &CanvasParameters::y_start)
        .field("meshType", &CanvasParameters::mesh_type);

    emscripten::function("setupMesh", &setup_mesh);
}
/*  End of main.                                                              */
