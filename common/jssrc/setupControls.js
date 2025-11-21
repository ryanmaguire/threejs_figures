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
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/*  OrbitControls allows the user to control the animation using their mouse. */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/******************************************************************************
 *  Function:                                                                 *
 *      setupControls                                                         *
 *  Purpose:                                                                  *
 *      Creates controls so that a user may interact with the animation.      *
 *  Arguments:                                                                *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 *  Output:                                                                   *
 *      None.                                                                 *
 *  Notes:                                                                    *
 *      The controls are added to the renderer. We do not need to return the  *
 *      controls back to the caller, so this function has no return.          *
 ******************************************************************************/
export function setupControls(renderer, camera) {

    /*  These controls allow the user to interact with the image using the    *
     *  mouse. Clicking and dragging will rearrange the image.                */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 0.0, 0.0);
    controls.update();
}
/*  End of setupControls.                                                     */
