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

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  The Go Glue code is found here. To retreive it from the command line, use *
 *  the command cp $(go env GOROOT)/misc/wasm/wasm_exec.js.                   */
import './wasm_exec.js';

export default async function createModule() {

    const go = new Go();

    let result;

    if ('instantiateStreaming' in WebAssembly) {
        result = await WebAssembly.instantiateStreaming(
            fetch('ellipticParaboloidWireframeModule.wasm'),
            go.importObject
        );
    } else {
        const resp = await fetch('ellipticParaboloidWireframeModule.wasm');
        const bytes = await resp.arrayBuffer();
        result = await WebAssembly.instantiate(bytes, go.importObject);
    }

    go.run(result.instance);

    const memory = result.instance.exports.mem;
    const setRotationAngle = window.setRotationAngle;

    /*  Helper function for initializing the three.js geometry.               */
    function initializeGeometry(geometry, meshSize, indexSize) {

        const buffer = memory.buffer;

        const meshPtr = window.meshBufferAddress();
        const indexPtr = window.indexBufferAddress();

        const meshBuffer = new Float32Array(buffer, meshPtr, meshSize);
        const indexBuffer = new Uint32Array(buffer, indexPtr, indexSize);

        const geometryAttributes = new three.BufferAttribute(meshBuffer, 3);
        const indexAttribute = new three.BufferAttribute(indexBuffer, 1);

        geometry.setAttribute('position', geometryAttributes);
        geometry.setIndex(indexAttribute);
    }

    /**************************************************************************
     *  Function:                                                             *
     *      animate                                                           *
     *  Purpose:                                                              *
     *      Rotates the elliptic paraboloid slowly about the z axis.          *
     *  Arguments:                                                            *
     *      None.                                                             *
     *  Output:                                                               *
     *      None.                                                             *
     **************************************************************************/
    function animate(renderer, scene, camera, surface, arraySize) {

        /*  Rotate the object slightly as time passes.                        */
        let geometry = surface.geometry;
        let mesh = geometry.attributes.position;
        window.rotateMesh(mesh.array.byteOffset, arraySize);

        /*  This problem seems to be unique to Go, C and rust do not have     *
         *  this issue. It is possible for the address of the mesh and index  *
         *  buffers to change on there own. It seems Go's garbage collector   *
         *  is at fault here. If the address changes, we need to update the   *
         *  JavaScript attributes to use the new locations.                   */
        if (mesh.array.byteLength == 0) {

            /*  Compute the number of elements in each buffer.                */
            const meshSize = 3 * arraySize;
            const indexSize = geometry.index.count;

            /*  Reset the geometry attributes to use the new addresses.       */
            initializeGeometry(geometry, meshSize, indexSize);
            mesh = geometry.attributes.position;
        }

        /*  Re-render the newly rotated scene.                                */
        mesh.needsUpdate = true;
        renderer.render(scene, camera);
    }

    /**************************************************************************
     *  Function:                                                             *
     *      setupScene                                                        *
     *  Purpose:                                                              *
     *      Creates the scene, which is a wireframe elliptic paraboloid and a *
     *      black background.                                                 *
     *  Arguments:                                                            *
     *      None.                                                             *
     *  Output:                                                               *
     *      None.                                                             *
     **************************************************************************/
    function setupGeometry(three, width, height) {

        const parameters = {
            nxPts: 64,
            nyPts: 64,
            width: 2.0,
            height: 2.0,
            xStart: -1.0,
            yStart: -1.0,
            meshType: 0
        };

        /*  three.js has parametric function tools, but this renders the      *
         *  object with diagonals across the squares, creating a mesh of      *
         *  triangles. To see a square pattern we need to use our own buffer. */
        const geometry = new three.BufferGeometry();
        const product = parameters.nxPts * parameters.nyPts;
        const sum = parameters.nxPts + parameters.nyPts;
        const meshSize = 3 * product;
        const indexSize = 2 * (2 * product - sum);

        /*  Setup the geometry and add a mesh of vertices and line segments.  */
        window.setupMesh(parameters)
        initializeGeometry(geometry, meshSize, indexSize);

        return geometry;
    }
    /*  End of setupGeometry.                                                 */

    const module = {
        animate,
        setRotationAngle,
        setupGeometry
    };

    return module;
}
