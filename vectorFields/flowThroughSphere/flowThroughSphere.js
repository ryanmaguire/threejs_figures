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
const R_BINS = 12;
const PHI_BINS = 16;
const THETA_BINS = 12;

/*  Parameters for the vector field. Arrows will be drawn between R_MIN and   *
 *  R_VANISH, but will not be fully red between R_MIN and R_MAX. Between      *
 *  R_MAX and R_VANISH the arrows will start to darken, eventually fading to  *
 *  black. At R_VANISH the arrow resets to R_MIN and the process repeats.     */
const R_MIN = 0.06125;
const R_MAX = 2.0 * RADIUS;
const R_VANISH = 3.0 * RADIUS;

/*  The step size for the radius of the arrows between frames.                */
const R_INCREMENT = R_MIN / 32.0;

/*  The hex for red, and the scale factor for darkening the red.              */
const RED = 0xFF0000;
const RED_FACTOR = 255.0 / (R_VANISH - R_MAX);

/*  Increments for samples in the radial, azimuthal, and zenith directions.   */
const DR = (R_VANISH - R_MIN) / R_BINS;
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
        /*  We increment R to R + R_INCREMENT where R is the norm of the base.*/
        const LENGTH = arrowArray[ind].position.length();

        /*  Variable for the length of the new arrow after flowing.           */
        let new_length;

        /*  Once the point flows beyond the boundary (R_VANISH), reset the    *
         *  arrow to lie near the origin with radius given by R_MIN.          */
        if (LENGTH > R_VANISH)
        {
            /*  The normalization factor is 1 / LENGTH. By scaling by         *
             *  R_MIN / LENGTH the resulting vector has radius R_MIN.         */
            const MIN_SCALE = R_MIN / LENGTH;

            /*  Transform the point back to radius R_MIN.                     */
            arrowArray[ind].position.x *= MIN_SCALE;
            arrowArray[ind].position.y *= MIN_SCALE;
            arrowArray[ind].position.z *= MIN_SCALE;

            /*  The arrow is now pitch black. Reset it back to full red.      */
            arrowArray[ind].setColor(RED);
        }

        /*  Normal case, simply increment the radius of the base of the arrow.*/
        else
        {
            /*  We are moving the arrow radially outwards, increment length.  */
            const NEW_SCALE = (LENGTH + R_INCREMENT) / LENGTH;
            arrowArray[ind].position.x *= NEW_SCALE;
            arrowArray[ind].position.y *= NEW_SCALE;
            arrowArray[ind].position.z *= NEW_SCALE;

            /*  For arrows that fall between R_MAX and R_VANISH, we dim the   *
             *  color to help make the fade more gradual.                     */
            if (LENGTH > R_MAX)
            {
                /*  R_MAX corresponds to red, R_VANISH produces black, and we *
                 *  have a continuous gradient in between.                    */
                const RED_VALUE = (R_VANISH - LENGTH) * RED_FACTOR;

                /*  The color value needs to be an integer. The red channel   *
                 *  is the upper 2 hex values, which corresponds to the upper *
                 *  8 bits. Since a color is 24 bits, we shift by 16.         */
                const DIM_RED = Math.floor(RED_VALUE) << 16;

                /*  Dim the current arrow. Note, no opacity is set.           */
                arrowArray[ind].setColor(DIM_RED);
            }
        }

        /*  The vector field is the radial one, (x, y, z). We scale by 1 / 8  *
         *  to make the arrows shorter and not overwhelm the animation.       */
        new_length = 0.125 * arrowArray[ind].position.length();

        /*  Create the new arrow. The default arrow width and height are a    *
         *  bit to short, stretch those as well.                              */
        arrowArray[ind].setLength(
            new_length, 0.3 * new_length, 0.15 * new_length
        );
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
    camera.position.set(3.0, 5.0, 6.0);
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
    let rInd, phiInd, thetaInd;

    /*  Loop through the radial direction.                                    */
    for (rInd = 0; rInd < R_BINS; ++rInd)
    {
        /*  Convert x index to the x coordinate in 3D space.                  */
        const R = R_MIN + rInd * DR;
        const SCALE = 0.125 * R;

        /*  Loop through the vertical axis.                                   */
        for (thetaInd = 0; thetaInd < THETA_BINS; ++thetaInd)
        {
            /*  Convert theta index to the theta angle.                       */
            const THETA = thetaInd * DTHETA;

            /*  Pre-compute sine and cosines to save redundant calculations.  */
            const COS_THETA = Math.cos(THETA);
            const SIN_THETA = Math.sin(THETA);

            /*  Lastly, loop through the depth axis.                          */
            for (phiInd = 0; phiInd < PHI_BINS; ++phiInd)
            {
                /*  Convert phi index to the corresponding angle.             */
                const PHI = phiInd * DPHI;

                /*  Spherical coordinates needs the sines and cosines.        */
                const COS_PHI = Math.cos(PHI);
                const SIN_PHI = Math.sin(PHI);

                /*  Calculate the Cartesian components of the current point.  */
                const X_HAT = COS_PHI * SIN_THETA;
                const Y_HAT = SIN_PHI * SIN_THETA;
                const Z_HAT = COS_THETA;

                const POS = new three.Vector3(R * X_HAT, R * Y_HAT, R * Z_HAT);
                const DIR = new three.Vector3(X_HAT, Y_HAT, Z_HAT);

                /*  Create the arrow and add it to the scene.                 */
                const ARROW = new three.ArrowHelper(
                    DIR, POS, SCALE, RED, 0.3 * SCALE, 0.15 * SCALE
                );

                scene.add(ARROW);

                /*  We will rotate this arrow throughout the animation. Add   *
                 *  it to our arrow array so we can keep track of it later.   */
                arrowArray.push(ARROW);

                if (thetaInd == 0 || thetaInd == PHI_BINS - 1)
                    break;
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
