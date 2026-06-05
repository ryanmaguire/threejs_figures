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
 *      Creates a wireframe object for a surface.                             *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  emscripten::val type provided here, allows using JS types in C++.         */
#include <emscripten/val.h>

/*  threetools provides typedefs and functions for use with Three.js.         */
#include <threetools/threetools.h>

/*  Function for allocating memory for the surface.                           */
extern void setup_mesh(SurfaceParameters parameters);

/*  Function for initializing the buffers in a geometric object.              */
extern void
init_geometry(emscripten::val geometry, const Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      square_wireframe_geometry                                             *
 *  Purpose:                                                                  *
 *      Creates a wireframe surface from a given set of parameters.           *
 *  Arguments:                                                                *
 *      ind (const std::size_t):                                              *
 *          The index for the object in the canvas.                           *
 *      parameters (const SurfaceParameters):                                 *
 *          The parameters for the surface, including the parametrization.    *
 *  Output:                                                                   *
 *      geometry (emscripten::val):                                           *
 *          The THREE.BufferGeometry containing the surface.                  *
 ******************************************************************************/
emscripten::val
square_wireframe_geometry(const std::size_t ind,
                          const SurfaceParameters parameters)
{
    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  Create a new buffer for the mesh and indices for the surface.         */
    const emscripten::val geometry = three["BufferGeometry"].new_();

    /*  The main_canvas variable contains all of the objects in the animation.*/
    const Canvas * const canvas = &main_canvas;

    /*  Setup the geometry and add a mesh of vertices and line segments.      */
    setup_mesh(parameters);
    init_geometry(geometry, &canvas->objects[ind]);

    return geometry;
}
/*  End of square_wireframe_geometry.                                         */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(square_wireframe_geometry_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("squareWireframeGeometry", &square_wireframe_geometry);
}
