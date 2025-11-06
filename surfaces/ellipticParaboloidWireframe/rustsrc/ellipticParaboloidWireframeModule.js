import init, {
    generateIndices,
    generateMesh,
    getMeshBuffer,
    getIndexBuffer,
    rotateMesh,
    setRotationAngle
} from './pkg/paraboloid.js';

const wasm = await init();

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Rotates the elliptic paraboloid slowly about the z axis.              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate(renderer, scene, camera, surface, arraySize) {

    /*  Rotate the object slightly as time passes.                            */
    const mesh = surface.geometry.attributes.position;
    rotateMesh(mesh.array.byteOffset, arraySize);
    mesh.needsUpdate = true;

    /*  Re-render the newly rotated scene.                                    */
    renderer.render(scene, camera);
}

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

    const buffer = wasm.memory.buffer;

    const meshPtr = getMeshBuffer();
    const indexPtr = getIndexBuffer();

    const mesh = new Float32Array(buffer, meshPtr, bufferSize);
    const indices = new Uint32Array(buffer, indexPtr, indexSize);

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let geometryAttributes, indexAttribute;

    generateMesh(mesh.byteOffset, width, height);
    generateIndices(indices.byteOffset, width, height);

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

async function createModule() {
    const Module = {
        animate,
        generateIndices,
        generateMesh,
        rotateMesh,
        setRotationAngle,
        setupGeometry
    };

    return Module;
}

export {
    animate,
    generateIndices,
    generateMesh,
    rotateMesh,
    setRotationAngle,
    setupGeometry
};

export default createModule;
