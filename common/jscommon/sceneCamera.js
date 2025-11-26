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
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/*  The type of camera being used, imported from three.js.                    */
import {PerspectiveCamera} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneCamera                                                           *
 *  Purpose:                                                                  *
 *      Initialize the camera and camera geometry for the scene.              *
 *  Arguments:                                                                *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *      cameraPosition (struct):                                              *
 *          The camera's initial position, a struct of the from {x, y, z}.    *
 *  Output:                                                                   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 ******************************************************************************/
export function sceneCamera(sceneWindow, cameraPosition) {

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const near = 0.25;
    const far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const windowRatio = sceneWindow.innerWidth / sceneWindow.innerHeight;

    /*  Create the camera and set its initial position.                       */
    const camera = new PerspectiveCamera(FOV, windowRatio, near, far);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);

    return camera;
}
/*  End of setupCamera.                                                       */
