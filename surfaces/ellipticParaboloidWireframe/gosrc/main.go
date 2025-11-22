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
 *      Provides bindings for all of the Go functions for use in JavaScript.  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/
package main

/*  JavaScript wrapper tools found here.                                      */
import (
    "syscall/js"
    "common/jsbindings"
)

func surface(x, y float32) float32 {
    return x*x + 2.0 * y*y - 2.0
}

/*  Wrapper function for the Go function generateMesh.                        */
func setupMesh(this js.Value, args []js.Value) interface{} {

    jsbindings.MakeSquareWireframe(args, surface)
    return nil
}
/*  End of setupMesh.                                                         */

func main() {
    var window js.Value = js.Global()

    /*  We need main to stay alive while the animation at the JavaScript      *
     *  level is being rendered. Create a channel for an empty struct (which  *
     *  occupies zero bytes). We'll use this to delay the exiting of this     *
     *  function indefinitely.                                                */
    empty := make(chan struct{}, 0)

    /*  Create JavaScript wrappers the function, using standard camel case.   */
    jsbindings.ExportGoFunctions()
    window.Set("setupMesh", js.FuncOf(setupMesh))

    /*  Prevent the function from exiting while the JavaScript program runs.  *
     *  Since "empty" is a channel for an empty struct, the channel does not  *
     *  contain a buffer. Since we are trying to receive from the channel     *
     *  (this is the "<-" syntax), we  must wait until there is something to  *
     *  receive. Since there is never anything to receive ("empty" is empty), *
     *  this will halt the function from exiting. The JavaScript code can     *
     *  then access the Go functions defined above without any problems.      */
    <- empty
}
