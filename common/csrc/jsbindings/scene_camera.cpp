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
 *      Creates the camera for a scene.                                       *
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
 *      scene_camera                                                          *
 *  Purpose:                                                                  *
 *      Initialize the camera and camera geometry for the scene.              *
 *  Arguments:                                                                *
 *      scene_window (emscripten::val):                                       *
 *          The window for the animation.                                     *
 *      camera_position (emscripten::val):                                    *
 *          The camera's initial position, a struct of the from {x, y, z}.    *
 *  Output:                                                                   *
 *      camera (emscripten::val):                                             *
 *          The THREE.PerspectiveCamera used for viewing the animation.       *
 ******************************************************************************/
emscripten::val
scene_camera(emscripten::val scene_window, emscripten::val camera_position)
{
    /*  Field-of-View for the camera.                                         */
    const double field_of_view = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const double near = 0.25;
    const double far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const double inner_width = scene_window["innerWidth"].as<double>();
    const double inner_height = scene_window["innerHeight"].as<double>();
    const double aspect = inner_width / inner_height;

    /*  Location of the camera.                                               */
    const double x_val = camera_position["x"].as<double>();
    const double y_val = camera_position["y"].as<double>();
    const double z_val = camera_position["z"].as<double>();

    /*  Access Three.js tools using emscripten.                               */
    const emscripten::val three = emscripten::val::global("THREE");

    /*  Create the camera and set its initial position.                       */
    const char * const cam_str = "PerspectiveCamera";
    const emscripten::val three_cam = three[cam_str];
    emscripten::val camera = three_cam.new_(field_of_view, aspect, near, far);
    camera["position"].call<void>("set", x_val, y_val, z_val);

    /*  Set the orientation for the camera.                                   */
    camera.call<void>("lookAt", 0.0, 0.0, 0.0);
    camera["up"].call<void>("set", 0.0, 0.0, 1.0);

    return camera;
}
/*  End of scene_camera.                                                      */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(scene_camera_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("sceneCamera", &scene_camera);
}
