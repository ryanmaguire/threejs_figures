import {Scene} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      sceneFromSurface                                                      *
 *  Purpose:                                                                  *
 *      Creates the scene for the animation.                                  *
 *  Arguments:                                                                *
 *      geometry (three.LineSegments):                                        *
 *          The object that is to be rendered in the scene.                   *
 *  Output:                                                                   *
 *      surface (three.Scene):                                                *
 *          The scene for the animation.                                      *
 ******************************************************************************/
function sceneFromSurface(surface) {

    /*  Create the scene and add the elliptic paraboloid to it.               */
    const scene = new Scene();
    scene.add(surface);
    return scene;
}
/*  End of sceneFromSurface.                                                  */

export {sceneFromSurface};
