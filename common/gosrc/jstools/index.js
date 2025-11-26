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
 *      JavaScript module containing the compiled WASM code from Go.          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 19, 2025                                             *
 ******************************************************************************/

/*  The Go Glue code is found here. To retreive it from the command line, use *
 *  the command cp $(go env GOROOT)/misc/wasm/wasm_exec.js .                  */
import './wasm_exec.js';

/*  Initialize the WebAssembly compiled from the Go source code.              */
const go = new Go();
const result = await WebAssembly.instantiateStreaming(
    fetch('main.wasm'), go.importObject
);

/*  Calling this function allows us to access the WASM memory. It is then     *
 *  available via result.instance.exports.mem.                                */
go.run(result.instance);

/*  Export all of the jsbindings functions and the WASM memory.               */
export const indexBufferAddress = window.indexBufferAddress;
export const mainCanvasAddress = window.mainCanvasAddress;
export const meshBufferAddress = window.meshBufferAddress;
export const memory = result.instance.exports.mem;
export const setupMesh = window.setupMesh;
export const setRotationAngle = window.setRotationAngle;
export const zRotateMainCanvas = window.zRotateMainCanvas;
