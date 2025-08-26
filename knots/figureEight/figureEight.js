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
 *      Renders the figure eight knot using three.js.                         *
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
 *      Rotates the figure eight knot slowly over time.                       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const currentTime = Date.now();
    const time = (currentTime - startTime) / 1024.0;

    /*  Rotate the object slightly as time passes.                            */
    object.position.y = 0.8;
    object.rotation.x = time * 0.5;
    object.rotation.y = time * 0.2;

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

    /*  Create the spotlight and set up all of its parameters.                */
    const spotLight = new three.SpotLight(white, 60);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    spotLight.position.set(2, 3, 3);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    /*  Add the spotlight to the scene (scene is a global variable).          */
    scene.add(spotLight);
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
    const dirLightColor = 0x55505A;

    /*  Create the directional light and set up its parameters.               */
    const dirLight = new three.DirectionalLight(dirLightColor, 3);
    dirLight.position.set(0, 3, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = +1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.top = +1;
    dirLight.shadow.camera.bottom = -1;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    /*  Add this light to the (global) scene.                                 */
    scene.add(dirLight);
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
    controls.target.set(0, 1, 0);
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

    /*  Aspect ratio for the window.                                          */
    const windowRatio = window.innerWidth / window.innerHeight;

    /*  Create the camera and set its initial position.                       */
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 16);
    camera.position.set(0, 1.3, 3);
}

/******************************************************************************
 *  Class:                                                                    *
 *      FigureEightCurve                                                      *
 *  Purpose:                                                                  *
 *      Extension of the three.Curve class.                                   *
 *      This parametrizes the figure eight knot.                              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
class FigureEightCurve extends three.Curve {

	constructor(scale = 0.25) {
		super();
		this.scale = scale;
	}

    /*  Parametric equations for the figure eigth.                            */
	getPoint(t, optionalTarget = new three.Vector3()) {

        const cos4PiT = Math.cos(4.0 * Math.PI * t);
		const tx = (2.0 + cos4PiT) * Math.cos(6.0 * Math.PI * t);
		const ty = (2.0 + cos4PiT) * Math.sin(6.0 * Math.PI * t);
		const tz = Math.sin(8.0 * Math.PI * t);
		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
	}
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

    /*  Color for the figure eight knot. Light blue.                          */
    const blue = 0x00A0FF;

    /*  Color for the plane. Dark gray.                                       */
    const darkGray = 0xA0A0A0;

    /*  Cyan for the sky. Used as the background parameter for the scene.     */
    const cyan = 0x00FFFF;

    /*  Material descriptions for the figure eight and the plane.             */
    const materialDescription = {
        color: blue,
        shininess: 100,
        side: three.DoubleSide,
        alphaToCoverage: true
    };

    const planeDescription = {
        color: darkGray,
        shininess: 150
    };

    /*  Parameters for the knot.                                              */
    const knotMaterial = new three.MeshPhongMaterial(materialDescription);
    const knotPath = new FigureEightCurve();
    const knotGeometry = new three.TubeGeometry(knotPath, 256, 0.1, 32, false);

    /*  Parameters for the plane beneath the knot.                            */
    const planeMaterial = new three.MeshPhongMaterial(planeDescription);
    const planeGeometry = new three.PlaneGeometry(100, 100, 1, 1);

    /*  Create the plane.                                                     */
    const ground = new three.Mesh(planeGeometry, planeMaterial);
    ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
    ground.receiveShadow = true;

    /*  Create the knot.                                                      */
    object = new three.Mesh(knotGeometry, knotMaterial);
    object.castShadow = true;

    /*  Create the scene and add both the knot and the plane to it.           */
    scene = new three.Scene();
    scene.background = new three.Color(cyan);
    scene.add(object);
    scene.add(ground);
}

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the figure eight knot.                      *
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
