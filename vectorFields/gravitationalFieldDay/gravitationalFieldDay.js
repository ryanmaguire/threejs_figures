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
 *      Draws the gravitational field for the Earth.                          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 31, 2025                                                 *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, object;

/*  Hex colors for sunlight and moonlight. We use white for the sun to ensure *
 *  the Earth is properly shaded. The moon uses a gray-blue.                  */
const SUNLIGHT = 0xFFFFFF;
const MOONLIGHT = 0x506886;

/*  Parameters for the sphere, radius, and the number of subdivisions.        */
const RADIUS = 1.0;
const AZIMUTH = 64;
const ZENITH = 64;

/*  Parameters for the rotational factor.                                     */
const DT = 1.0 / 1024.0;
const THETA = Math.PI * DT;
const COS_THETA = Math.cos(THETA);
const SIN_THETA = Math.sin(THETA);

/*  Parameters for the arrows representing the vector field. The total number *
 *  of arrows is the product of the three bin sizes, so roughly O(N^3). Do    *
 *  not make these numbers too big, this will slow the animation to a crawl.  */
const LENGTH = 4.0 * RADIUS;
const X_BINS = 8;
const Y_BINS = 8;
const Z_BINS = 8;

const DX = LENGTH / X_BINS;
const DY = LENGTH / Y_BINS;
const DZ = LENGTH / Z_BINS;

const arrowArray = [];

/*  Link to the NASA map of Earth (equirectangular projection).               */
const FILE_URL =
    "https://upload.wikimedia.org/" +
        "wikipedia/" +
            "commons/" +
                "thumb/2/23/" +
                    "Blue_Marble_2002.png/2560px-Blue_Marble_2002.png";

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
 *      Rotates the Earth slowly about the y axis.                            *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    let ind;

    /*  Rotate the object slightly as time passes.                            */
    object.rotation.y += THETA;

    /*  Rotate all of the arrows as well.                                     */
    for (ind = 0; ind < arrowArray.length; ++ind)
    {
        /*  We have the sine and cosine of the angle of rotation, meaning we  *
         *  can rotate the arrows by multiplying by the rotation matrix. We   *
         *  need the components for the current arrow.                        */
        const X = arrowArray[ind].position.x;
        const Y = arrowArray[ind].position.y;
        const Z = arrowArray[ind].position.z;

        /*  We are rotating about the y axis, the rotation matrix can thus be *
         *  represented by a 2x2 array (the y part is trivial). Apply the     *
         *  transformation to the current point.                              */
        const X_NEW = COS_THETA * X + SIN_THETA * Z;
        const Z_NEW = -SIN_THETA * X + COS_THETA * Z;

        /*  Gravity points inwards, compute the new inwards vector.           */
        const DIR = new three.Vector3(-X_NEW, -Y, -Z_NEW).normalize();

        /*  Update the coordinates in the arrow and set the direction.        */
        arrowArray[ind].position.x = X_NEW;
        arrowArray[ind].position.z = Z_NEW;
        arrowArray[ind].setDirection(DIR);
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
    camera.position.set(1.0, 2.0, 6.0);
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
    const sun = new three.DirectionalLight(SUNLIGHT, 3.0);
    const moon = new three.DirectionalLight(MOONLIGHT, 0.5);

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

            /*  Lastly, loop through the depth axis.                          */
            for (zInd = 0; zInd <= Z_BINS; ++zInd)
            {
                /*  Convert y index to the y coordinate in 3D space.          */
                const Z = -0.5 * LENGTH + zInd * DZ;

                /*  The current arrow is anchored at (x, y, z). Create this   *
                 *  vector. The direction is given by -(x, y, z), but this    *
                 *  needs to be normalized, hence we compute the length too.  */
                const POS = new three.Vector3(X, Y, Z);
                const NORM = POS.length();

                /*  The gravitational law is:                                 *
                 *              (x, y, z)                                     *
                 *      F = -----------------                                 *
                 *          || (x, y, z) ||^3                                 *
                 *                                                            *
                 *  Hence we need 1 / norm^3 for the length of the arrows.    *
                 *  This makes them a bit too long, so we scale by 1 / 4.     */
                const SCALE = 0.25 / (NORM * NORM * NORM);

                /*  Variables for constructing the arrow.                     */
                let dir, arrow;

                /*  Do not create arrows that start inside the Earth.         */
                if (NORM <= RADIUS)
                    continue;

                /*  Similarly, do not create arrows that end inside the Earth.*/
                if (NORM - SCALE < RADIUS)
                    continue;

                /*  Create the arrow and add it to the scene.                 */
                dir = new three.Vector3(-X / NORM, -Y / NORM, -Z / NORM);
                arrow = new three.ArrowHelper(
                    dir, POS, SCALE, 0xFF0000, 0.3 * SCALE, 0.15 * SCALE
                );

                scene.add(arrow);

                /*  We will rotate this arrow throughout the animation. Add   *
                 *  it to our arrow array so we can keep track of it later.   */
                arrowArray.push(arrow);
            }
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

    const earthFileName = FILE_URL;
    const earthImage = new three.TextureLoader().load(earthFileName);
    const earthParameters = {map: earthImage};
    const earthMaterial = new three.MeshStandardMaterial(earthParameters);
    const earthGeometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);

    object = new three.Mesh(earthGeometry, earthMaterial);

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
