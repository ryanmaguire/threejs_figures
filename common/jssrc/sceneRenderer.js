import {WebGLRenderer} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneRenderer                                                         *
 *  Purpose:                                                                  *
 *      Initializes the renderer for the animation with default values.       *
 *  Arguments:                                                                *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate function.   *
 *  Notes:                                                                    *
 *      The window used in the init function is a global variable defined     *
 *      outside of this file. To avoid relying on globals, this function      *
 *      accepts the window as an argument.                                    *
 ******************************************************************************/
function sceneRenderer(sceneWindow) {

    /*  We enable anialiasing, however there is still some visible aliasing   *
     *  with the wireframe. This seems to be dependent on the resolution of   *
     *  the screen and what device the animation is running on.               */
    const rendererParameters = {antialias: true};

    /*  Create a new WebGL-based renderer.                                    */
    const renderer = new WebGLRenderer(rendererParameters);

    /*  Set the basics for the renderer. We set the animation loop later.     */
    renderer.setPixelRatio(sceneWindow.devicePixelRatio);
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
    renderer.shadowMap.enabled = false;
    return renderer;
}
/*  End of sceneRenderer.                                                     */

export {sceneRenderer};
