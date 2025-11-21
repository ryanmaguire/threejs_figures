import {PerspectiveCamera} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneCamera                                                           *
 *  Purpose:                                                                  *
 *      Initialize the camera and camera geometry for the scene.              *
 *  Arguments:                                                                *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 ******************************************************************************/
function sceneCamera(sceneWindow, cameraPosition) {

    const cameraX = cameraPosition.x;
    const cameraY = cameraPosition.y;
    const cameraZ = cameraPosition.z;

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const near = 0.25;
    const far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const windowRatio = sceneWindow.innerWidth / sceneWindow.innerHeight;

    /*  Create the camera and set its initial position.                       */
    const camera = new PerspectiveCamera(FOV, windowRatio, near, far);
    camera.position.set(cameraX, cameraY, cameraZ);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);

    return camera;
}
/*  End of setupCamera.                                                       */

export {sceneCamera};
