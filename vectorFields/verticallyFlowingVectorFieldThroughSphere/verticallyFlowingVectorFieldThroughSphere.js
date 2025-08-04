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
 *      Draws a vector field flowing through the unit sphere.                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       August 3, 2025                                                *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, object;

/*  Parameters for the sphere, radius, and the number of subdivisions.        */
const RADIUS = 1.0;
const AZIMUTH = 64;
const ZENITH = 64;

/*  Parameters for the arrows representing the vector field. The total number *
 *  of arrows is the product of the three bin sizes, so roughly O(N^3). Do    *
 *  not make these numbers too big, this will slow the animation to a crawl.  */
const X_BINS = 9;
const Y_BINS = 9;
const Z_BINS = 16;

const X_MIN = -1.5 * RADIUS;
const X_MAX = 1.5 * RADIUS;

const Y_MIN = -1.5 * RADIUS;
const Y_MAX = 1.5 * RADIUS;

const Z_MAX = 2.0 * RADIUS;

const Z_APPEAR = -4.0 * RADIUS;
const Z_VANISH = 4.0 * RADIUS;

/*  The step size for the radius of the arrows between frames.                */
const Z_INCREMENT = 1.0 / 128.0;

/*  The hex for red, and the scale factor for darkening the red.              */
const RED = 0xFF0000;
const RED_FACTOR = 255.0 / (Z_VANISH - Z_MAX);

/*  Increments for samples in the radial, azimuthal, and zenith directions.   */
const DX = (X_MAX - X_MIN) / (X_BINS - 1);
const DY = (Y_MAX - Y_MIN) / (Y_BINS - 1);
const DZ = (Z_VANISH - Z_APPEAR) / (Z_BINS);

/*  Array for the arrows. We will update them throughout the animation, so we *
 *  need to keep the individual arrows in memory.                             */
const arrowArray = [];

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
 *      Moves the vectors along the flow lines for the vector field.          *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    let ind;

    /*  The vector field is alpha * (x, y, z), where alpha is some positive   *
     *  real number. The flow lines are hence lines through the origin. We    *
     *  flow the vectors through these lines until their tail ends pass the   *
     *  R_VANISH threshold, at which point we reset them to R_MIN.            */
    for (ind = 0; ind < arrowArray.length; ++ind)
    {
        const Z_MAG = Math.abs(arrowArray[ind].position.z);

        /*  Once the point flows beyond the boundary (Z_VANISH), reset the    *
         *  arrow to lie at the bottom, Z_APPEAR.                             */
        if (Z_MAG > Z_VANISH)
        {
            /*  Transport the point back to height Z_MIN.                     */
            arrowArray[ind].position.z = Z_APPEAR;
            arrowArray[ind].setColor(0x000000);
        }

        /*  Normal case, simply increment the radius of the base of the arrow.*/
        else
        {
            /*  We are moving the vertically upwards, increment z.            */
            arrowArray[ind].position.z += Z_INCREMENT;

            if (Z_MAG > Z_MAX)
            {
                /*  Z_MAX corresponds to red, Z_VANISH produces black, and we *
                 *  have a continuous gradient in between.                    */
                const RED_VALUE = (Z_VANISH - Z_MAG) * RED_FACTOR;

                /*  The color value needs to be an integer. The red channel   *
                 *  is the upper 2 hex values, which corresponds to the upper *
                 *  8 bits. Since a color is 24 bits, we shift by 16.         */
                const DIM_RED = Math.floor(RED_VALUE) << 16;

                /*  Dim the current arrow. Note, no opacity is set.           */
                arrowArray[ind].setColor(DIM_RED);
            }
        }
    }

    /*  Re-render the new scene.                                              */
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
    camera = new three.PerspectiveCamera(50, windowRatio, 0.25, 100);
    camera.position.set(0.0, -4.0, 5.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupLight                                                            *
 *  Purpose:                                                                  *
 *      Setup lights for the animation.                                       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupLight() {

    /*  We can show off the Earth's tilt by placing the lights appropriately. */
    const earthsTilt = 0.40928;

    /*  Compute the coordinates for the lights based on the tilt.             */
    const x = RADIUS;
    const z = x / Math.tan(earthsTilt);

    /*  Create two lights, one for the sun, one for the moon.                 */
    const sun = new three.DirectionalLight(0xFFFFFF, 3.0);
    const moon = new three.DirectionalLight(0xAAAAAA, 0.5);

    /*  Set the lights and add them to the animation.                         */
    sun.position.set(x, 0.0, z);
    moon.position.set(-x, 0.0, -z);

    scene.add(sun);
    scene.add(moon);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupArrows                                                           *
 *  Purpose:                                                                  *
 *      Create the arrows for the vector field.                               *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupArrows() {

    /*  Indices for the three axes.                                           */
    let xInd, yInd, zInd;

    const SCALE = 0.125

    /*  Loop through the radial direction.                                    */
    for (xInd = 0; xInd < X_BINS; ++xInd)
    {
        /*  Convert x index to the x coordinate in 3D space.                  */
        const X = X_MIN + xInd * DX;

        /*  Loop through the vertical axis.                                   */
        for (yInd = 0; yInd < Y_BINS; ++yInd)
        {
            /*  Convert y index to the y value.                               */
            const Y = Y_MIN + yInd * DY;

            /*  Lastly, loop through the depth axis.                          */
            for (zInd = 0; zInd < Z_BINS; ++zInd)
            {
                /*  Convert z index to the corresponding height.              */
                const Z = Z_APPEAR + zInd * DZ;

                const POS = new three.Vector3(X, Y, Z);
                const DIR = new three.Vector3(0.0, 0.0, 1.0);

                /*  Create the arrow and add it to the scene.                 */
                const ARROW = new three.ArrowHelper(
                    DIR, POS, SCALE, RED, 0.3 * SCALE, 0.15 * SCALE
                );

                scene.add(ARROW);

                /*  We will rotate this arrow throughout the animation. Add   *
                 *  it to our arrow array so we can keep track of it later.   */
                arrowArray.push(ARROW);
            }
        }
    }
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, starting with the transparent sphere.              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  The unit sphere will be cyan and transparent.                         */
    const materialParameters = {
        color: 0x00FFFF,
        opacity: 0.5,
        transparent: true
    };

    /*  Create the sphere.                                                    */
    const material = new three.MeshPhongMaterial(materialParameters);
    const geometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);
    object = new three.Mesh(geometry, material);

    /*  Create the scene and add the transparent sphere to it.                */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the vector field flow.                      *
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
    setupLight();
    setupArrows();

    /*  Make the animation interactive. The user can click and drag the       *
     *  drawing around using their mouse.                                     */
    createControls();

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);
}

/*  Create the animation.                                                     */
init();
