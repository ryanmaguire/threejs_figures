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
 *      Provides JavaScript globals needed by emscripten to compile properly. *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  Classes needed from Three.js for the C++ code.                            */
import {
    BufferAttribute,
    BufferGeometry,
    LineSegments,
    MeshBasicMaterial,
    OrbitControls,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";

/*  Emscripten accesses JavaScript classes, functions, and variables using    *
 *  emscripten::val::global("THREE"). Provide this as a global.               */
globalThis.THREE = {
    BufferAttribute,
    BufferGeometry,
    LineSegments,
    MeshBasicMaterial,
    OrbitControls,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
};
