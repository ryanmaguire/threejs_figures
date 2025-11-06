import {generateIndices} from './generateIndices.js';
import {generateMesh} from './generateMesh.js';

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
function setupGeometry(three, width, height) {

    const numberOfPoints = width * height;
    const bufferSize = 3 * numberOfPoints;
    const indexSize = 2 * (2 * numberOfPoints - width - height);

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the constituent squares, creating a mesh of     *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const geometry = new three.BufferGeometry();

    const mesh = new Float32Array(bufferSize);
    const indices = new Uint32Array(indexSize);

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let geometryAttributes, indexAttribute;

    generateMesh(mesh, width, height);
    generateIndices(indices, width, height);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    geometryAttributes = new three.BufferAttribute(mesh, 3);
    indexAttribute = new three.BufferAttribute(indices, 1);

    /*  Add the vertices and index array to the mesh.                         */
    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);

    return geometry;
}
/*  End of setupGeometry.                                                     */

export {setupGeometry};
