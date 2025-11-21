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
 *      JavaScript module containing the compiled WASM code from Go.          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/

import {zRotateAnimation} from './zRotateAnimation.js'
import {squareWireframeGeometry} from './squareWireframeGeometry.js'

/*  The Go Glue code is found here. To retreive it from the command line, use *
 *  the command cp $(go env GOROOT)/misc/wasm/wasm_exec.js.                   */
import './wasm_exec.js';

export default async function createModule() {

    const go = new Go();

    let result;

    if ('instantiateStreaming' in WebAssembly) {
        result = await WebAssembly.instantiateStreaming(
            fetch('main.wasm'),
            go.importObject
        );
    } else {
        const resp = await fetch('main.wasm');
        const bytes = await resp.arrayBuffer();
        result = await WebAssembly.instantiate(bytes, go.importObject);
    }

    go.run(result.instance);

    const memory = result.instance.exports.mem;
    const setRotationAngle = window.setRotationAngle;

    const module = {
        zRotateAnimation,
        setRotationAngle,
        memory,
        squareWireframeGeometry
    };

    return module;
}
