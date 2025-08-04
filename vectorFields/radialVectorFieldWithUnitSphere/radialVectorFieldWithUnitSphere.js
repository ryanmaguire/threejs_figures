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
 *      Draws a radial vector field with the unit sphere.                     *
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
const PHI_BINS = 32;
const THETA_BINS = 16;

/*  Increments for samples in the radial, azimuthal, and zenith directions.   */
const DPHI = 2.0 * Math.PI / (PHI_BINS - 1);
const DTHETA = Math.PI / (THETA_BINS - 1);

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
 *      Renders the figure after moving with the mouse.                       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

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
    camera.position.set(2.0, 3.0, 5.0);
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


    /*  Create two lights, front and back of the sphere.                      */
    const front = new three.HemisphereLight(0xFFFFFF, 3.0);
    const back = new three.HemisphereLight(0xAAAAAA, 0.5);

    /*  Set the lights and add them to the animation.                         */
    front.position.set(1.0, 0.0, 0.0);
    back.position.set(-1.0, 0.0, 0.0);

    scene.add(front);
    scene.add(back);
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
    let phiInd, thetaInd;

    const SCALE = 0.125;

    /*  Loop through the vertical axis.                                       */
    for (thetaInd = 0; thetaInd < THETA_BINS; ++thetaInd)
    {
        /*  Convert theta index to the theta angle.                           */
        const THETA = thetaInd * DTHETA;

        /*  Pre-compute sine and cosines to save redundant calculations.      */
        const COS_THETA = Math.cos(THETA);
        const SIN_THETA = Math.sin(THETA);

        /*  Lastly, loop through the depth axis.                              */
        for (phiInd = 0; phiInd < PHI_BINS; ++phiInd)
        {
            /*  Convert phi index to the corresponding angle.                 */
            const PHI = phiInd * DPHI;

            /*  Spherical coordinates needs the sines and cosines.            */
            const COS_PHI = Math.cos(PHI);
            const SIN_PHI = Math.sin(PHI);

            /*  Calculate the Cartesian components of the current point.      */
            const X_HAT = COS_PHI * SIN_THETA;
            const Y_HAT = SIN_PHI * SIN_THETA;
            const Z_HAT = COS_THETA;

            const POS = new three.Vector3(X_HAT, Y_HAT, Z_HAT);

            /*  Create the arrow and add it to the scene.                     */
            const ARROW = new three.ArrowHelper(
                POS, POS, SCALE, 0xFF0000, 0.3 * SCALE, 0.15 * SCALE
            );

            scene.add(ARROW);

            /*  We will rotate this arrow throughout the animation. Add       *
             *  it to our arrow array so we can keep track of it later.       */
            arrowArray.push(ARROW);

            if (thetaInd == 0 || thetaInd == PHI_BINS - 1)
                break;
        }
    }
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, starting with the sphere.                          *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  Create the sphere.                                                    */
    const material = new three.MeshPhongMaterial({color: 0x00FFFF});
    const geometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);
    object = new three.Mesh(geometry, material);

    /*  Create the scene and add the sphere to it.                            */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the radial vector field.                    *
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
