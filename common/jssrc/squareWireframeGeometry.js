import {BufferGeometry} from 'three';
import {initGeometry} from './initGeometry.js';

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
export function squareWireframeGeometry(parameters, module) {

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the squares, creating a mesh of triangles. To   *
     *  see a square pattern we need to use our own buffer.                   */
    const geometry = new BufferGeometry();
    const product = parameters.nxPts * parameters.nyPts;
    const sum = parameters.nxPts + parameters.nyPts;
    const meshSize = 3 * product;
    const indexSize = 2 * (2 * product - sum);

    /*  Setup the geometry and add a mesh of vertices and line segments.      */
    module.setupMesh(parameters)
    initGeometry(geometry, module, meshSize, indexSize);

    return geometry;
}
/*  End of setupGeometry.                                                     */
