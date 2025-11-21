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
 *      Creates a wireframe with a basic mesh material.                       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 21, 2025                                             *
 ******************************************************************************/

/*  LineSegments makes the wireframe, MeshBasicMaterial creates the material. */
import {LineSegments, MeshBasicMaterial} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      basicWireframe                                                        *
 *  Purpose:                                                                  *
 *      Creates a basic wireframe object from a given geometry.               *
 *  Arguments:                                                                *
 *      geometry (three.BufferGeometry):                                      *
 *          The geometry with the vertex mesh and line segment indices.       *
 *      materialDefinition (struct):                                          *
 *          A struct with the parameters for the mesh (i.e. color).           *
 *  Output:                                                                   *
 *      surface (three.LineSegments):                                         *
 *          The threejs object that is rendered on the screen.                *
 ******************************************************************************/
export function basicWireframe(geometry, materialDefinition) {

    /*  Material the wireframe will be made out of.                           */
    const material = new MeshBasicMaterial(materialDefinition);

    /*  The LineSegments function constructor will produce a wireframe.       */
    return new LineSegments(geometry, material);
}
/*  End of basicWireframe.                                                    */
