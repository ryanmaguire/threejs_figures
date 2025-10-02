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
 *      Renders the trefoil knot using three.js. This is a heavily modified   *
 *      version from the three.js tutorials.                                  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 3, 2024                                                  *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, object;

/******************************************************************************
 *  Function:                                                                 *
 *      onWindowResize                                                        *
 *  Purpose:                                                                  *
 *      Resets the camera and renderer when the window is resized.            *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Rotates the trefoil knot slowly over time.                            *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const currentTime = Date.now();
    const time = (currentTime - startTime) / 4096.0;

    /*  Rotate the object slightly as time passes.                            */
    object.rotation.x = 0.25 * time + 0.5 * Math.PI;
    object.rotation.y = 0.5 * time;
    object.rotation.z = time;

    /*  Re-render the newly rotated scene.                                    */
    renderer.render(scene, camera);
}

/******************************************************************************
 *  Function:                                                                 *
 *      createSpotLight                                                       *
 *  Purpose:                                                                  *
 *      Adds a spotlight to the scene.                                        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createSpotLight() {

    /*  Hex code for white in RGB format. This is the triple (255, 255, 255). */
    const white = 0xFFFFFF;
    const intensity = 60.0;

    /*  Create the spotlight and set up all of its parameters.                */
    const spotlight = new three.SpotLight(white, intensity);
    spotlight.angle = Math.PI / 5.0;
    spotlight.penumbra = 0.2;
    spotlight.position.set(2.0, 3.0, 3.0);
    spotlight.castShadow = true;
    spotlight.shadow.camera.near = 3.0;
    spotlight.shadow.camera.far = 10.0;

    /*  This spotlight is much further away from the knot than the            *
     *  directional light (created in the next function). Increase the shadow *
     *  resolution to prevent it from looking blurry.                         */
    spotlight.shadow.mapSize.width = 4096;
    spotlight.shadow.mapSize.height = 4096;

    /*  Add the spotlight to the scene (scene is a global variable).          */
    scene.add(spotlight);
}

/******************************************************************************
 *  Function:                                                                 *
 *      createDirectionalLight                                                *
 *  Purpose:                                                                  *
 *      Adds a directional light to the scene.                                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createDirectionalLight() {

    /*  Color for the directional light. Dark gray / violet.                  */
    const lightColor = 0x55505A;
    const intensity = 3.0;

    /*  Create the directional light and set up its parameters.               */
    const directionalLight = new three.DirectionalLight(lightColor, intensity);
    directionalLight.position.set(0.0, 0.0, 3.0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 1.0;
    directionalLight.shadow.camera.far = 10.0;
    directionalLight.shadow.camera.right = +1.0;
    directionalLight.shadow.camera.left = -1.0;
    directionalLight.shadow.camera.top = +1.0;
    directionalLight.shadow.camera.bottom = -1.0;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    /*  Add this light to the (global) scene.                                 */
    scene.add(directionalLight);
}

/******************************************************************************
 *  Function:                                                                 *
 *      createAmbientLight                                                    *
 *  Purpose:                                                                  *
 *      Creates an ambient light for the entire scene.                        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createAmbientLight() {

    /*  A neutral gray color for the light.                                   */
    const gray = 0xCCCCCC;

    /*  Create the ambient light and add it to the (global) scene.            */
    const ambientLight = new three.AmbientLight(gray);
    scene.add(ambientLight);
}

/******************************************************************************
 *  Function:                                                                 *
 *      createControls                                                        *
 *  Purpose:                                                                  *
 *      Creates controls so that a user may interact with the animation.      *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createControls() {

    /*  These controls allow the user to interact with the image using the    *
     *  mouse. Clicking and dragging will rearrange the image.                */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 0.0, 0.0);
    controls.update();
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupRenderer                                                         *
 *  Purpose:                                                                  *
 *      Initializes the renderer for the animation with default values.       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupRenderer() {
    renderer = new three.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupCamera                                                           *
 *  Purpose:                                                                  *
 *      Initialize the camera and camera geometry for the scene.              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupCamera() {

    /*  Starting location for the camera.                                     */
    const cameraX = 0.0;
    const cameraY = 4.0;
    const cameraZ = 1.0;

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const near = 0.25;
    const far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const windowRatio = window.innerWidth / window.innerHeight;

    /*  Create the camera and set its initial position.                       */
    camera = new three.PerspectiveCamera(FOV, windowRatio, near, far);
    camera.position.set(cameraX, cameraY, cameraZ);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene. This includes the knot and the plane below.        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  Color for the trefoil eight knot. Light blue.                         */
    const blue = 0x00A0FF;

    /*  Color for the plane. Dark gray.                                       */
    const darkGray = 0xA0A0A0;

    /*  Cyan for the sky. Used as the background parameter for the scene.     */
    const cyan = 0x00FFFF;

    /*  Struct with the parameters for the knots material. Note the tube we   *
     *  are drawing (the "thickened" trefoil knot) is orientable, it is       *
     *  homeomorphic to a torus. We only need to render the front side of the *
     *  object. The back side is "inside", so the viewer can't see it.        */
    const knotDescription = {
        color: blue,
        shininess: 100.0,
        side: three.FrontSide,
        alphaToCoverage: true
    };

    /*  Struct describing the floor. We only render the top side. If the user *
     *  places the camera below the floor, they will still be able to see the *
     *  knot, but the floor will become invisible.                            */
    const planeDescription = {
        color: darkGray,
        shininess: 150.0,
        side: three.FrontSide
    };

    /*  Parameters for the knot.                                              */
    const knotSamples = 256;
    const meridianSamples = 32;
    const knotRadius = 0.09375;
    const knotSize = 0.5;

    /*  The trefoil is a torus knot, T(p, q), with p = 2 and q = 3.           */
    const pValue = 2;
    const qValue = 3;

    /*  Create the trefoil knot geometry.                                     */
    const knotMaterial = new three.MeshPhongMaterial(knotDescription);
    const knotGeometry = new three.TorusKnotGeometry(
        knotSize, knotRadius, knotSamples, meridianSamples, pValue, qValue
    );

    /*  Parameters for the plane beneath the knot.                            */
    const planeWidth = 128;
    const planeHeight = 128;
    const widthSegments = 1;
    const heightSegments = 1;
    const planeShift = -1.0;

    /*  Create the plane geometry.                                            */
    const planeMaterial = new three.MeshPhongMaterial(planeDescription);
    const planeGeometry = new three.PlaneGeometry(
        planeWidth, planeHeight, widthSegments, heightSegments
    );

    /*  Create the plane object. We want it to be below the knot, so we shift *
     *  it down the z axis.                                                   */
    const ground = new three.Mesh(planeGeometry, planeMaterial);
    ground.position.z = planeShift;

    /*  The shadow of the knot will appear on this plane.                     */
    ground.receiveShadow = true;

    /*  Create the knot.                                                      */
    object = new three.Mesh(knotGeometry, knotMaterial);
    object.castShadow = true;

    /*  Create the scene and add both the knot and the plane to it.           */
    scene = new three.Scene();
    scene.background = new three.Color(cyan);
    scene.add(ground);
    scene.add(object);
}

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the trefoil knot.                           *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function init() {

    /*  Initialize the globals for the animation. This includes the renderer, *
     *  camera, objects, and scene.                                           */
    setupRenderer();
    setupCamera();
    setupScene();

    /*  Add all of the lights to the scene.                                   */
    createAmbientLight();
    createSpotLight();
    createDirectionalLight();

    /*  Make the animation interactive. The user can click and drag the       *
     *  drawing around using their mouse.                                     */
    createControls();

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);

    /*  Initialize the start time. This is used as the parameter for rotation.*/
    startTime = Date.now();
}

/*  Create the animation.                                                     */
init();
