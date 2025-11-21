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

/*  We use the WebGL renderer for each animation. WebGPU could also be used.  */
import {WebGLRenderer} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneRenderer                                                         *
 *  Purpose:                                                                  *
 *      Initializes the renderer for the animation with default values.       *
 *  Arguments:                                                                *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate functions.  *
 *  Notes:                                                                    *
 *      The windows used in the init functions are global variables defined   *
 *      outside of the main files. To avoid relying on globals, this function *
 *      accepts the window as an argument.                                    *
 ******************************************************************************/
export function sceneRenderer(sceneWindow) {

    /*  We enable anialiasing, however there is still some visible aliasing   *
     *  with wireframes. This seems to be dependent on the resolution of      *
     *  the screen and what device the animation is rendering on.             */
    const rendererParameters = {antialias: true};

    /*  Create a new WebGL-based renderer.                                    */
    const renderer = new WebGLRenderer(rendererParameters);

    /*  Set the basics for the renderer. We set the animation loop in a       *
     *  different function (the main init function).                          */
    renderer.setPixelRatio(sceneWindow.devicePixelRatio);
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
    renderer.shadowMap.enabled = false;
    return renderer;
}
/*  End of sceneRenderer.                                                     */
