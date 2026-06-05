/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is free software: you can redistribute it and/or modify         *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  This file is distributed in the hope that it will be useful,              *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with this file.  If not, see <https://www.gnu.org/licenses/>.       *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Provides dependencies needed by threetools, installable using npm.    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  Include the necesssary classes needed by threetools.                      */
import {
    BufferAttribute,
    BufferGeometry,
    LineSegments,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";

/*  OrbitControls allows the user to control the animation using their mouse. */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Stats allows the FPS counter to be displayed.                             */
import Stats from "three/examples/jsm/libs/stats.module.js";

/*  Export everything so that threetools can access these dependencies.       */
export {
    BufferAttribute,
    BufferGeometry,
    LineSegments,
    MeshBasicMaterial,
    OrbitControls,
    PerspectiveCamera,
    Scene,
    Stats,
    WebGLRenderer
};
