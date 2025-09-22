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
 *      Draws electromagnetic waves using the Heaviside-Feynman formula.      *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       Spetember 19, 2025                                            *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, object, startTime;

/*  Parameters for the sphere, radius, and the number of subdivisions.        */
const RADIUS = 1.0;
const AZIMUTH = 16;
const ZENITH = 16;

/*  Parameters for the arrows representing the vector field. The total number *
 *  of arrows is the product of the three bin sizes, so roughly O(N^3). Do    *
 *  not make these numbers too big, this will slow the animation to a crawl.  */
const LENGTH = 16.0 * RADIUS;
const X_BINS = 48;
const Y_BINS = 48;

const DX = LENGTH / X_BINS;
const DY = LENGTH / Y_BINS;

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

function halleysMethod(rhoValue, time, guess) {

    const RHO_SQ = rhoValue * rhoValue;

    const SIN_T = Math.sin(time);
    const COS_T = Math.cos(time);

    const SIN_T_SQ = SIN_T * SIN_T;
    const SIN_T_QR = SIN_T_SQ * SIN_T_SQ;

    const NORM_SQUARED = RHO_SQ + SIN_T_SQ;
    const NORM = Math.sqrt(NORM_SQUARED);

    const FUNC = guess - time + NORM;
    const DFUNC = 1.0 + COS_T * SIN_T / NORM;

    const D2FUNC_NUMER = RHO_SQ * (1.0 - 2.0 * SIN_T_SQ) - SIN_T_QR;
    const D2FUNC_DENOM = NORM * NORM_SQUARED;
    const D2FUNC = D2FUNC_NUMER / D2FUNC_DENOM;

    const NUMER = FUNC * DFUNC;
    const DENOM = DFUNC * DFUNC - 0.5 * FUNC * D2FUNC;

    return guess - NUMER / DENOM;
}

function retardedAcceleration(rhoValue, retardedTime) {

    const SIN_T = Math.sin(retardedTime);
    const COS_T = Math.cos(retardedTime);

    const SIN_T_SQ = SIN_T * SIN_T;
    const COS_T_SQ = COS_T * COS_T;

    const NORM_SQ = rhoValue * rhoValue + SIN_T_SQ;
    const NORM = Math.sqrt(NORM_SQ);
    const RCPR_NORM = 1.0 / NORM;

    const NUMER = COS_T_SQ - SIN_T_SQ - SIN_T_SQ * COS_T_SQ / NORM_SQ;

    const FACTOR = -NUMER / NORM_SQ;
    const RHO_OUT = FACTOR * RCPR_NORM;
    const Z_OUT = (SIN_T * FACTOR - SIN_T) * RCPR_NORM;

    return new three.Vector3(RHO_OUT, RHO_OUT, Z_OUT);
}

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Rotates the Earth slowly about the y axis.                            *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    const CURRENT_TIME = Date.now();

    const TIME = (CURRENT_TIME - startTime) / 512.0;

    let ind;

    object.position.z = Math.sin(TIME);

    /*  Rotate all of the arrows as well.                                     */
    for (ind = 0; ind < arrowArray.length; ++ind)
    {
        const X = arrowArray[ind].position.x;
        const Y = arrowArray[ind].position.y;
        const RHO = Math.sqrt(X*X + Y*Y);

        const GUESS = TIME - RHO;

        let retardedTime, acceleration, direction, length;

        if (GUESS < 0.0)
            continue;

        retardedTime = halleysMethod(RHO, TIME, GUESS);
        acceleration = retardedAcceleration(RHO, retardedTime);

        acceleration.x *= X;
        acceleration.y *= Y;
        length = acceleration.length();
        direction = acceleration.normalize();

        arrowArray[ind].setDirection(direction);
        arrowArray[ind].setLength(length);
    }

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
    const CAMERA_X = 0.0;
    const CAMERA_Y = -18.0;
    const CAMERA_Z = 7.0;

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const NEAR = 0.25;
    const FAR = 100.0;

    /*  Aspect ratio for the window.                                          */
    const WINDOW_RATIO = window.innerWidth / window.innerHeight;

    /*  Create the camera and set its initial position.                       */
    camera = new three.PerspectiveCamera(FOV, WINDOW_RATIO, NEAR, FAR);
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);
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
    let xInd, yInd;

    const Z = 0.0;
    const DIR = new three.Vector3(0.0, 0.0, -1.0);
    const COLOR = 0xFF0000;

    /*  Loop through the horizontal axis.                                     */
    for (xInd = 0; xInd <= X_BINS; ++xInd)
    {
        /*  Convert x index to the x coordinate in 3D space.                  */
        const X = -0.5 * LENGTH + xInd * DX;

        /*  Loop through the vertical axis.                                   */
        for (yInd = 0; yInd <= Y_BINS; ++yInd)
        {
            /*  Convert y index to the y coordinate in 3D space.              */
            const Y = -0.5 * LENGTH + yInd * DY;
            const NORM = Math.sqrt(X*X + Y*Y);

            if (NORM < RADIUS)
                continue;

            const POS = new three.Vector3(X, Y, Z);

            const ARROW = new three.ArrowHelper(DIR, POS, 0.06125, COLOR);

            scene.add(ARROW);

            /*  We will rotate this arrow throughout the animation. Add   *
                *  it to our arrow array so we can keep track of it later.   */
            arrowArray.push(ARROW);
        }
    }
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which starts with a rotating Earth.                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    const SIZE = 0.25 * RADIUS;
    const BLUE = {color: 0x0000FF};
    const MATERIAL = new three.MeshBasicMaterial(BLUE);
    const SPHERE_GEOMETRY = new three.SphereGeometry(SIZE, AZIMUTH, ZENITH);

    object = new three.Mesh(SPHERE_GEOMETRY, MATERIAL);

    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the gravitational vector field.             *
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
    setupArrows();

    /*  Make the animation interactive. The user can click and drag the       *
     *  drawing around using their mouse.                                     */
    createControls();

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);

    startTime = Date.now();
}

/*  Create the animation.                                                     */
init();
