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
 *      Renders a wireframe sphere depicting a common parametrization.        *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 21, 2025                                                 *
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
 *      Rotates the sphere slowly about the z axis.                           *
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
    object.rotation.z = 0.125 * time;

    /*  Re-render the newly rotated scene.                                    */
    renderer.render(scene, camera);
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
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 100);
    camera.position.set(0.0, -10.0, 3.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe sphere and a black background.*
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    // Torus
    const majorRadius = 3;
    const minorRadius = 1;
    const torusGeometry = new three.TorusGeometry(majorRadius, minorRadius, 64, 128);
    const torusMaterial = new three.MeshStandardMaterial({ color: 0x6699ff, wireframe: false });

    // Add tangential vector field using ArrowHelper
    const uSteps = 30;
    const vSteps = 10;

    /*  Color for the figure eight knot. Light blue.                          */
    const blue = 0x00A0FF;

    /*  Color for the plane. Dark gray.                                       */
    const lightGray = 0xE0E0E0;

    /*  Cyan for the sky. Used as the background parameter for the scene.     */
    const cyan = 0x00FFFF;

    const planeDescription = {
        color: lightGray,
        shininess: 150
    };

    /*  Parameters for the plane beneath the knot.                            */
    const planeMaterial = new three.MeshPhongMaterial(planeDescription);
    const planeGeometry = new three.PlaneGeometry(100, 100, 1, 1);

    /*  Create the plane.                                                     */
    const ground = new three.Mesh(planeGeometry, planeMaterial);
    ground.receiveShadow = true;
    ground.translateZ(-2.0 * minorRadius);

    const topLight = new three.DirectionalLight(0xFFFFFF, 1);
    const bottomLight = new three.DirectionalLight(0xFFFFFF, 0.25);

    topLight.position.set(0, 0, 100.0);
    bottomLight.position.set(0, -45, 45.0);

    object = new three.Mesh(torusGeometry, torusMaterial);
    object.castShadow = true;

    scene = new three.Scene();
    scene.background = new three.Color(cyan);
    scene.add(ground);
    scene.add(topLight);
    scene.add(bottomLight);
    scene.add(object);

    const newMinorRadius = 1.5 * minorRadius;

    for (let i = 0; i < uSteps; i++) {
        const u = (i / uSteps) * 2 * Math.PI;

        for (let j = 0; j < vSteps; j++) {

            const v = (j / vSteps) * 2 * Math.PI;

            // Parametric point on the torus
            const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
            const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
            const z = minorRadius * Math.sin(v);

            const position = new three.Vector3(x, y, z);

            // Tangent vector in the u-direction
            const dx = -(majorRadius + newMinorRadius * Math.cos(v)) * Math.sin(u) - newMinorRadius * Math.sin(v) * Math.cos(u);
            const dy = (majorRadius + newMinorRadius * Math.cos(v)) * Math.cos(u) - newMinorRadius * Math.sin(v) * Math.sin(u);
            const dz = newMinorRadius * Math.cos(v);

            const tangent = new three.Vector3(dx, dy, dz).normalize();

            const arrow = new three.ArrowHelper(tangent, position, 0.5, 0xFF0000);
            scene.add(arrow);
        }
    }

    const origin = new three.Vector3(0.0, 0.0, 0.0);
    const xPos = new three.Vector3(5.0, 0.0, 0.0);
    const yPos = new three.Vector3(0.0, 5.0, 0.0);
    const zPos = new three.Vector3(0.0, 0.0, 5.0);

    const xArrow = new three.ArrowHelper(xPos, origin, 5.5, 0x000000, 0.5);
    const zArrow = new three.ArrowHelper(zPos, origin, 3.0, 0x000000, 0.5);

    scene.add(xArrow);
    scene.add(zArrow);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe sphere.                       *
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
