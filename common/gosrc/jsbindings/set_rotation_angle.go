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
 *      Provides a JS binding for SetRotationAngle.                           *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package jsbindings

import (
    "syscall/js"
    "common/threetools"
)

/*  Wrapper for the Go function SetRotationAngle.                             */
func SetRotationAngle(this js.Value, args []js.Value) interface{} {

    /*  The input is a single float, the new rotation angle.                  */
    var angle float32 = float32(args[0].Float())

    /*  Pass the value to the Go function and return.                         */
    threetools.SetRotationAngle(angle)
    return nil
}
/*  End of SetRotationAngle.                                                  */
