import {initGeometry} from './initGeometry.js'

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
export function zRotate(renderer, scene, camera, surface, module, size) {

    /*  Rotate the object slightly as time passes.                            */
    module.zRotateMainCanvas();

    /*  This problem seems to be unique to Go, C and rust do not have this    *
     *  issue. It is possible for the address of the mesh and index buffers   *
     *  to change on their own. It seems Go's garbage collector is at fault   *
     *  here. If the address changes, we need to update the JavaScript        *
     *  attributes to use the new locations.                                  */
    if (surface.geometry.attributes.position.array.byteLength == 0) {

        /*  Compute the number of elements in each buffer.                    */
        const meshSize = 3 * size;
        const indexSize = surface.geometry.index.count;

        /*  Reset the geometry attributes to use the new addresses.           */
        initGeometry(surface.geometry, module, meshSize, indexSize);
    }

    /*  Re-render the newly rotated scene.                                    */
    surface.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
