/******************************************************************************
 *  Function:                                                                 *
 *      windowResize                                                          *
 *  Purpose:                                                                  *
 *      Resets the camera and renderer when the window is resized.            *
 *  Arguments:                                                                *
 *      renderer (three.WebGLRenderer):                                       *
 *          The renderer for the animation, called by the animate function.   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function windowResize(camera, renderer, sceneWindow) {
    camera.aspect = sceneWindow.innerWidth / sceneWindow.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
}
/*  End of windowResize.                                                      */

export {windowResize};
