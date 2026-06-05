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
 *      Creates the controls (mouse-clicks and drags) for a scene.            *
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
 *      setup_controls                                                        *
 *  Purpose:                                                                  *
 *      Creates controls so that a user may interact with the animation.      *
 *  Arguments:                                                                *
 *      renderer (emscripten::val):                                           *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (emscripten::val):                                             *
 *          The camera used for viewing the animation.                        *
 *  Output:                                                                   *
 *      None.                                                                 *
 *  Notes:                                                                    *
 *      The controls are added to the renderer. We do not need to return the  *
 *      controls back to the caller, so this function has no return.          *
 ******************************************************************************/
void setup_controls(emscripten::val renderer, emscripten::val camera)
{
    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  These controls allow the user to interact with the animation using    *
     *  their mouse. Clicking and dragging will rearrange the camera.         */
    const char * const orbit_str = "OrbitControls";
    const emscripten::val orbit = three[orbit_str];
    emscripten::val controls = orbit.new_(camera, renderer["domElement"]);
    controls["target"].call<void>("set", 0.0, 0.0, 0.0);
    controls.call<void>("update");
}
/*  End of setup_controls.                                                    */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(scene_renderer_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("setupControls", &setup_controls);
}
