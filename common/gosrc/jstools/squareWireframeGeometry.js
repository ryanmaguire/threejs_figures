import {BufferGeometry} from 'three';
import {initializeGeometry} from './initializeGeometry.js';

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
function squareWireframeGeometry(parameters, memory) {

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the squares, creating a mesh of triangles. To   *
     *  see a square pattern we need to use our own buffer.                   */
    const geometry = new BufferGeometry();
    const product = parameters.nxPts * parameters.nyPts;
    const sum = parameters.nxPts + parameters.nyPts;
    const meshSize = 3 * product;
    const indexSize = 2 * (2 * product - sum);

    /*  Setup the geometry and add a mesh of vertices and line segments.      */
    window.setupMesh(parameters)
    initializeGeometry(geometry, memory, meshSize, indexSize);

    return geometry;
}
/*  End of setupGeometry.                                                     */

export {squareWireframeGeometry};
