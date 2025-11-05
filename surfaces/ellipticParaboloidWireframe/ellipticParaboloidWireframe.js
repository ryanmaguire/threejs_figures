/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is free software: you can redistribute it and/or modify         *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  This file is distributed in the hope that it will be useful,              *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with this file.  If not, see <https://www.gnu.org/licenses/>.       *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Renders an elliptic paraboloid, z = x^2 + 2y^2.                       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 22, 2025                                                 *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/* JavaScript module using WebAssembly compiled from C code using emscripten. */
import createModule from './ellipticParaboloidWireframeModule.js';

/* Create the module so we may access the C functions.                        */
const module = await createModule();

/******************************************************************************
 *  Function:                                                                 *
 *      setupRenderer                                                         *
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
function setupRenderer(sceneWindow) {

    /*  We enable anialiasing, however there is still some visible aliasing   *
     *  with the wireframe. This seems to be dependent on the resolution of   *
     *  the screen and what device the animation is running on.               */
    const rendererParameters = {antialias: true};

    /*  Create a new WebGL-based renderer.                                    */
    const renderer = new three.WebGLRenderer(rendererParameters);

    /*  Set the basics for the renderer. We set the animation loop later.     */
    renderer.setPixelRatio(sceneWindow.devicePixelRatio);
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
    renderer.shadowMap.enabled = false;
    return renderer;
}
/*  End of setupRenderer.                                                     */

/******************************************************************************
 *  Function:                                                                 *
 *      setupCamera                                                           *
 *  Purpose:                                                                  *
 *      Initialize the camera and camera geometry for the scene.              *
 *  Arguments:                                                                *
 *      sceneWindow (Window):                                                 *
 *          The window for the animation.                                     *
 *  Output:                                                                   *
 *      camera (three.PerspectiveCamera):                                     *
 *          The camera used for viewing the animation.                        *
 ******************************************************************************/
function setupCamera(sceneWindow) {

    /*  Starting location for the camera.                                     */
    const cameraX = +0.0;
    const cameraY = -5.0;
    const cameraZ = +6.0;

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const near = 0.25;
    const far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const windowRatio = sceneWindow.innerWidth / sceneWindow.innerHeight;

    /*  Create the camera and set its initial position.                       */
    const camera = new three.PerspectiveCamera(FOV, windowRatio, near, far);
    camera.position.set(cameraX, cameraY, cameraZ);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);

    return camera;
}
/*  End of setupCamera.                                                       */

/******************************************************************************
 *  Function:                                                                 *
 *      createControls                                                        *
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
function createControls(renderer, camera) {

    /*  These controls allow the user to interact with the image using the    *
     *  mouse. Clicking and dragging will rearrange the image.                */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 0.0, 0.0);
    controls.update();
}
/*  End of createControls.                                                    */

/******************************************************************************
 *  Function:                                                                 *
 *      applyAfterWindowResize                                                *
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
function applyAfterWindowResize(camera, renderer, sceneWindow) {
    camera.aspect = sceneWindow.innerWidth / sceneWindow.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneWindow.innerWidth, sceneWindow.innerHeight);
}
/*  End of applyAfterWindowResize.                                            */

/******************************************************************************
 *  Function:                                                                 *
 *      setupSurface                                                          *
 *  Purpose:                                                                  *
 *      Creates the rendered object from the mesh geometry.                   *
 *  Arguments:                                                                *
 *      geometry (three.BufferGeometry):                                      *
 *          The geometry with the vertex mesh and line segment indices.       *
 *  Output:                                                                   *
 *      surface (three.LineSegments):                                         *
 *          The threejs object that is rendered on the screen.                *
 ******************************************************************************/
function setupSurface(geometry) {

    /*  Material the wireframe will be made out of.                           */
    const lightBlue = 0x00AAFF;
    const materialDefinition = {color: lightBlue}
    const material = new three.MeshBasicMaterial(materialDefinition);

    /*  We wish to create a wireframe for the object. Create the lines.       */
    return new three.LineSegments(geometry, material);
}
/*  End of setupSurface.                                                      */

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene for the animation.                                  *
 *  Arguments:                                                                *
 *      geometry (three.LineSegments):                                        *
 *          The object that is to be rendered in the scene.                   *
 *  Output:                                                                   *
 *      surface (three.Scene):                                                *
 *          The scene for the animation.                                      *
 ******************************************************************************/
function setupScene(surface) {

    /*  Create the scene and add the elliptic paraboloid to it.               */
    const scene = new three.Scene();
    scene.add(surface);
    return scene;
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe elliptic paraboloid.          *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function init() {

    /*  The number of samples in the horizontal and vertical axes.            */
    const width = 64;
    const height = 64;

    /*  The angle of rotation between frames.                                 */
    const rotationAngle = 0.005;

    /*  The total number of vertices in the mesh.                             */
    const numberOfPoints = width * height;

    /*  Initialize the globals for the animation. This includes the renderer, *
     *  camera, objects, and scene.                                           */
    const camera = setupCamera(window);
    const renderer = setupRenderer(window);
    const geometry = module.setupGeometry(three, width, height);
    const surface = setupSurface(geometry);
    const scene = setupScene(surface);

    function animation() {
        module.animate(renderer, scene, camera, surface, numberOfPoints);
    }

    function onWindowResize () {
        applyAfterWindowResize(camera, renderer, window);
    }

    renderer.setAnimationLoop(animation);

    /*  Make the animation interactive. The user can click and drag the       *
     *  drawing around using their mouse.                                     */
    createControls(renderer, camera);

    module.setRotationAngle(rotationAngle);

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);
}
/*  End of init.                                                              */

/*  Create the animation.                                                     */
init();
