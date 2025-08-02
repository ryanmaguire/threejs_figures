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
 *      Draws the electric field for a dipole.                                *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       August 2, 2025                                                *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, blueObject, redObject;

/*  Parameters for the sphere, radius, and the number of subdivisions.        */
const RADIUS = 1.0;
const AZIMUTH = 32;
const ZENITH = 32;

const BLUE_CHARGE = new three.Vector3(2.0 * RADIUS, 0.0, 0.0);
const RED_CHARGE = new three.Vector3(-2.0 * RADIUS, 0.0, 0.0);

/*  Parameters for the arrows representing the vector field. The total number *
 *  of arrows is the product of the three bin sizes, so roughly O(N^3). Do    *
 *  not make these numbers too big, this will slow the animation to a crawl.  */
const LENGTH = 8.0 * RADIUS;
const X_BINS = 12;
const Y_BINS = 12;
const Z_BINS = 12;

const DX = LENGTH / X_BINS;
const DY = LENGTH / Y_BINS;
const DZ = LENGTH / Z_BINS;

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
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Animates the figure.                            *
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
                const FORCE = new three.Vector3(X, Y, Z).sub(BLUE_CHARGE);
                const RED_FORCE = new three.Vector3(X, Y, Z).sub(RED_CHARGE);

                const BLUE_DIST = FORCE.length();
                const RED_DIST = RED_FORCE.length();

                const BLUE_SCALE = 0.5 / (BLUE_DIST * BLUE_DIST * BLUE_DIST);
                const RED_SCALE = -0.5 / (RED_DIST * RED_DIST * RED_DIST);

                let dir, arrow, scale;

                FORCE.multiplyScalar(BLUE_SCALE);
                RED_FORCE.multiplyScalar(RED_SCALE);

                FORCE.add(RED_FORCE);

                scale = FORCE.length();

                if (BLUE_DIST < RADIUS)
                    continue;

                if (RED_DIST < RADIUS)
                    continue;

                if (RED_DIST - scale < RADIUS)
                    continue;

                /*  Create the arrow and add it to the scene.                 */
                dir = FORCE.normalize();

                arrow = new three.ArrowHelper(
                    dir, POS, scale, 0xFFFFFF, 0.3 * scale, 0.15 * scale
                );

                scene.add(arrow);
            }
        }
    }
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene with a positive and electric charge.                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    const blueMaterial = new three.MeshBasicMaterial( { color: 0x00AAFF } );
    const blueGeometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);
    const redMaterial = new three.MeshBasicMaterial( { color: 0xFF0000 } );
    const redGeometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);


    blueObject = new three.Mesh(blueGeometry, blueMaterial);
    redObject = new three.Mesh(redGeometry, redMaterial);

    blueObject.position.x = BLUE_CHARGE.x;
    redObject.position.x = RED_CHARGE.x;


    scene = new three.Scene();
    scene.add(blueObject);
    scene.add(redObject);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the dipole vector field.                    *
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
}

/*  Create the animation.                                                     */
init();
