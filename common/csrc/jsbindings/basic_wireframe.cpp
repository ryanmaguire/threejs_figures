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
 *      Creates a basic wireframe from a geometry object.                     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  emscripten::val type provided here, allows using JS types in C++.         */
#include <emscripten/val.h>

/******************************************************************************
 *  Function:                                                                 *
 *      basic_wireframe                                                       *
 *  Purpose:                                                                  *
 *      Create a wireframe from a geometry object and a material description. *
 *  Arguments:                                                                *
 *      geometry (emscripten::val):                                           *
 *          A THREE.BufferGeometry object passed from the JavaScript level.   *
 *      material_definition (emscripten::val):                                *
 *          A struct with the parameters for the mesh (i.e. color).           *
 *  Output:                                                                   *
 *      surface (emscripten::val):                                            *
 *          The THREE.LineSegments object that is rendered to the screen.     *
 ******************************************************************************/
emscripten::val
basic_wireframe(emscripten::val geometry, emscripten::val material_definition)
{
    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  Three.js provides a simple material that is suited for wireframes.    */
    const char * const material_str = "MeshBasicMaterial";

    /*  Create a new material from the provided definition.                   */
    emscripten::val material = three[material_str].new_(material_definition);

    /*  A wireframe is just line segments along the mesh. Return this.        */
    return three["LineSegments"].new_(geometry, material);
}
/*  End of basic_wireframe.                                                   */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(basic_wireframe_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("basicWireframe", &basic_wireframe);
}
