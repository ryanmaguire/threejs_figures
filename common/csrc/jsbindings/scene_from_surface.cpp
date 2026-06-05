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
 *      Creates a scene from a surface that has already been constructed.     *
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
 *      scene_from_surface                                                    *
 *  Purpose:                                                                  *
 *      Creates the scene for an animation.                                   *
 *  Arguments:                                                                *
 *      surface (emscripten::val):                                            *
 *          The object (THREE.LineSegments / THREE.Mesh / THREE.Object3D)     *
 *          that is to be rendered in the scene.                              *
 *  Output:                                                                   *
 *      scene (emscripten::val):                                              *
 *          The THREE.Scene for the animation.                                *
 ******************************************************************************/
emscripten::val scene_from_surface(emscripten::val surface)
{
    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  Create the scene and add the surface to it.                           */
    const char * const scene_str = "Scene";
    const emscripten::val scene = three[scene_str].new_();
    scene.call<void>("add", surface);

    return scene;
}
/*  End of scene_from_surface.                                                */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(scene_from_surface_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("sceneFromSurface", &scene_from_surface);
}
