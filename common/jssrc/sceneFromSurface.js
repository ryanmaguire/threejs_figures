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
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/*  Constructor for the Scene class provided by three.js.                     */
import {Scene} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneFromSurface                                                      *
 *  Purpose:                                                                  *
 *      Creates the scene for an animation.                                   *
 *  Arguments:                                                                *
 *      surface (three.LineSegments / three.Mesh / three.Object3D):           *
 *          The object that is to be rendered in the scene.                   *
 *  Output:                                                                   *
 *      scene (three.Scene):                                                  *
 *          The scene for the animation.                                      *
 ******************************************************************************/
export function sceneFromSurface(surface) {

    /*  Create the scene and add the surface to it.                           */
    const scene = new Scene();
    scene.add(surface);
    return scene;
}
/*  End of sceneFromSurface.                                                  */
