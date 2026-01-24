import {BufferGeometry} from 'three';
import {initGeometry} from './initGeometry.js';
import {setupMesh} from 'wasmtools';

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe elliptic paraboloid and a     *
 *      black background.                                                     *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
export function squareWireframeGeometry(parameters) {

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the squares, creating a mesh of triangles. To   *
     *  see a square pattern we need to use our own buffer.                   */
    const geometry = new BufferGeometry();
    const product = parameters.nxPts * parameters.nyPts;
    const sum = parameters.nxPts + parameters.nyPts - 1;
    const meshSize = 3 * product;
    const indexSize = 2 * (2 * product - sum - 1);

    /*  Setup the geometry and add a mesh of vertices and line segments.      */
    setupMesh(parameters)
    initGeometry(geometry, meshSize, indexSize);

    return geometry;
}
/*  End of setupGeometry.                                                     */
