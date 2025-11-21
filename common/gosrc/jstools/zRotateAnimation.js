import {initializeGeometry} from './initializeGeometry.js'

/******************************************************************************
 *  Function:                                                                 *
 *      zRotateAnimation                                                      *
 *  Purpose:                                                                  *
 *      Rotates the elliptic paraboloid slowly about the z axis.              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function zRotateAnimation(renderer, scene, camera, surface, memory, arraySize) {

    /*  Rotate the object slightly as time passes.                            */
    const geometry = surface.geometry;
    let mesh = geometry.attributes.position;
    window.rotateMesh(mesh.array.byteOffset, arraySize);

    /*  This problem seems to be unique to Go, C and rust do not have this    *
     *  issue. It is possible for the address of the mesh and index buffers   *
     *  to change on their own. It seems Go's garbage collector is at fault   *
     *  here. If the address changes, we need to update the JavaScript        *
     *  attributes to use the new locations.                                  */
    if (mesh.array.byteLength == 0) {

        /*  Compute the number of elements in each buffer.                    */
        const meshSize = 3 * arraySize;
        const indexSize = geometry.index.count;

        /*  Reset the geometry attributes to use the new addresses.           */
        initializeGeometry(geometry, memory, meshSize, indexSize);
        mesh = geometry.attributes.position;
    }

    /*  Re-render the newly rotated scene.                                    */
    mesh.needsUpdate = true;
    renderer.render(scene, camera);
}

export {zRotateAnimation};
