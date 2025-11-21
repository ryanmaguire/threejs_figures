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
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/******************************************************************************
 *  Function:                                                                 *
 *      windowResize                                                          *
 *  Purpose:                                                                  *
 *      Resets the camera and renderer when the window is resized.            *
 *  Arguments:                                                                *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
export function windowResize(camera, renderer, sceneWindow) {
    camera.aspect = sceneWindow.innerWidth / sceneWindow.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
}
/*  End of windowResize.                                                      */
