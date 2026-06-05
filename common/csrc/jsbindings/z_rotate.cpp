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
 *      Rotates the scene about the z axis using the global rotation vector.  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  threetools provides typedefs and functions for use with Three.js.         */
#include <threetools/threetools.h>

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  emscripten::val type provided here, allows using JS types in C++.         */
#include <emscripten/val.h>

/*  Tell the compiler about the function used to initialize buffers.          */
extern void
init_geometry(emscripten::val geometry, const Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      z_rotate                                                              *
 *  Purpose:                                                                  *
 *      Rotates a surface about the z axis.                                   *
 *  Arguments:                                                                *
 *      renderer (emscripten::val):                                           *
 *          The renderer for the animation.                                   *
 *      scene (const emscripten::val):                                        *
 *          The Three.js scene.                                               *
 *      camera (const emscripten::val):                                       *
 *          The Three.js camera for the scene.                                *
 *      surface (const emscripten::val):                                      *
 *          The surface being rotated.                                        *
 *      ind (const std::size_t):                                              *
 *          The index for the object in the main canvas being rotated.        *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
void
z_rotate(emscripten::val renderer,
         const emscripten::val scene,
         const emscripten::val camera,
         emscripten::val surface,
         const std::size_t ind)
{
    /*  Rotate the object slightly as time passes.                            */
    const emscripten::val pos = surface["geometry"]["attributes"]["position"];
    const std::size_t length = pos["array"]["byteLength"].as<std::size_t>();
    z_rotate_canvas(&main_canvas, rotation_vector);

    /*  This problem seems to be unique to Go, C and rust do not have this    *
     *  issue. It is possible for the address of the mesh and index buffers   *
     *  to change on their own. It seems Go's garbage collector is at fault   *
     *  here. If the address changes, we need to update the JavaScript        *
     *  attributes to use the new locations.                                  */
    if (length == 0)
        init_geometry(surface["geometry"], &main_canvas.objects[ind]);

    /*  Re-render the newly rotated scene.                                    */
    surface["geometry"]["attributes"]["position"].set("needsUpdate", true);
    renderer.call<void>("render", scene, camera);
}
/*  End of z_rotate.                                                          */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(z_rotate_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("zRotate", &z_rotate);
}
