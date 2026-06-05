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
 *      Updates the camera and renderer after a window resize.                *
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
 *      window_resize                                                         *
 *  Purpose:                                                                  *
 *      Resets the camera and renderer when the window is resized.            *
 *  Arguments:                                                                *
 *      renderer (emscripten::val):                                           *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (emscripten::val):                                             *
 *          The camera used for viewing the animation.                        *
 *      scene_window (const emscripten::val ):                                *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
void
window_resize(emscripten::val camera,
              emscripten::val renderer,
              const emscripten::val scene_window)
{
    /*  Get the current dimensions for the animation.                         */
    const double width = scene_window["innerWidth"].as<double>();
    const double height = scene_window["innerHeight"].as<double>();

    /*  Update the camera to use the aspect ratio.                            */
    camera.set("aspect", width / height);
    camera.call<void>("updateProjectionMatrix");

    /*  Set these new dimensions into the renderer.                           */
    renderer.call<void>("setSize", width, height);
}
/*  End of window_resize.                                                     */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(window_resize_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("windowResize", &window_resize);
}
