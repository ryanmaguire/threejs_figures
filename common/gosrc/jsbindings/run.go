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
 *      Starts the animation by intializing all of the Go routines.           *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/
package jsbindings

/*  js.Value type provided here, as is the js.Global function.                */
import "syscall/js"

/******************************************************************************
 *  Function:                                                                 *
 *      Run                                                                   *
 *  Purpose:                                                                  *
 *      Initializes all of the Go routines and then stalls indefinitely.      *
 *  Arguments:                                                                *
 *      setupMesh (func(this js.Value, args []js.Value) interface {}):        *
 *          Function, defined by the main package, for creating the mesh.     *
 *  Output:                                                                   *
 *      null (interface{}):                                                   *
 *          A nil interface.                                                  *
 ******************************************************************************/
func Run(setupMesh func(this js.Value, args []js.Value) interface {}) {

    /*  Get access to the JavaScript window so we may set the globals.        */
    var window js.Value = js.Global()

    /*  We need Run to stay alive while the animation at the JavaScript       *
     *  level is being rendered. Create a channel for an empty struct (which  *
     *  occupies zero bytes). We'll use this to delay the exiting of this     *
     *  function indefinitely.                                                */
    empty := make(chan struct{}, 0)

    /*  Create JavaScript wrappers the function, using standard camel case.   */
    ExportGoFunctions()
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
/*  End of Run.                                                               */
