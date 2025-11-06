import {rotateMesh} from './rotateMesh.js';

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

    rotateMesh(mesh.array, arraySize);
    mesh.needsUpdate = true;

    /*  Re-render the newly rotated scene.                                    */
    renderer.render(scene, camera);
}

export {animate};
