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
 *      Creates the renderer (WebGL) for a scene.                             *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  emscripten::val type provided here, allows using JS types in C++.         */
#include <emscripten/val.h>

/******************************************************************************
 *  Function:                                                                 *
 *      scene_renderer                                                        *
 *  Purpose:                                                                  *
 *      Initializes the renderer for the animation with default values.       *
 *  Arguments:                                                                *
 *      sceneWindow (emscripten::val):                                        *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      renderer (emscripten::val):                                           *
 *          The renderer for the animation, called by the animate functions.  *
 *  Notes:                                                                    *
 *      The windows used in the init functions are global variables defined   *
 *      outside of the main files. To avoid relying on globals, this function *
 *      accepts the window as an argument.                                    *
 ******************************************************************************/
emscripten::val scene_renderer(emscripten::val scene_window)
{
    /*  Variable for the WebGL renderer.                                      */
    emscripten::val renderer;

    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  Get the dimensions for the window.                                    */
    const unsigned int width = scene_window["innerWidth"].as<unsigned int>();
    const unsigned int height = scene_window["innerHeight"].as<unsigned int>();

    /*  Access the WebGLRenderer constructor using emscripten.                */
    const char * const webgl_str = "WebGLRenderer";
    const emscripten::val webgl = three[webgl_str];

    /*  We enable anialiasing, however there is still some visible aliasing   *
     *  with wireframes. This seems to be dependent on the resolution of      *
     *  the screen and what device the animation is rendering on.             */
    emscripten::val renderer_parameters = emscripten::val::object();
    renderer_parameters.set("antialias", true);

    /*  Create a new WebGL-based renderer.                                    */
    renderer = webgl.new_(renderer_parameters);

    /*  Set the basics for the renderer. We set the animation loop in a       *
     *  different function (the main init function).                          */
    renderer.call<void>("setPixelRatio", scene_window["devicePixelRatio"]);
    renderer.call<void>("setSize", width, height);
    renderer["shadowMap"].set("enabled", false);

    return renderer;
}
/*  End of scene_renderer.                                                    */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(scene_renderer_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("sceneRenderer", &scene_renderer);
}
