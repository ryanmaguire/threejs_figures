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
 *      Provides a JS binding for RotateMesh.                                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package jsbindings

import (
    "syscall/js"
    "common/threetools"
)

/*  Wrapper for the Go function RotateMesh.                                   */
func RotateMesh(this js.Value, args []js.Value) interface{} {

    /*  Rotate the points in the mesh by the RotationVector (see globals.go). */
    threetools.MainCanvas.RotateMesh(threetools.RotationVector)
    return nil
}
/*  End of RotateMesh.                                                        */
