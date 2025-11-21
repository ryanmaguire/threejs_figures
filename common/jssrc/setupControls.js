/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/******************************************************************************
 *  Function:                                                                 *
 *      setupControls                                                         *
 *  Purpose:                                                                  *
 *      Creates controls so that a user may interact with the animation.      *
 *  Arguments:                                                                *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 *  Output:                                                                   *
 *      None.                                                                 *
 *  Notes:                                                                    *
 *      The controls are added to the renderer. We do not need to return the  *
 *      controls back to the caller, so this function has not return.         *
 ******************************************************************************/
function setupControls(renderer, camera) {

    /*  These controls allow the user to interact with the image using the    *
     *  mouse. Clicking and dragging will rearrange the image.                */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 0.0, 0.0);
    controls.update();
}
/*  End of setupControls.                                                     */

export {setupControls};
