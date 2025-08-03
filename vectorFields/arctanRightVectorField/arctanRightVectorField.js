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
 *      Renders the vector field (atan(x) + pi / 2, 0, 0) and the unit sphere.*
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       August 2, 2025                                                *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, object;

/*  Parameters for the sphere.                                                */
const RADIUS = 1.0;
const AZIMUTH = 32;
const ZENITH = 32;

/*  The number of arrows drawn in each axis.                                  */
const X_BINS = 8;
const Y_BINS = 8;
const Z_BINS = 8;

/*  Parameters for the arrows drawn for the vector field.                     */
const LENGTH = 4.0 * RADIUS;
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
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Animates the object after moving with the mouse.                      *
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
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 16);
    camera.position.set(0.0, 6.0, 4.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene and adds the sphere.                                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    const geometry = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);
    const material = new three.MeshNormalMaterial({color: 0x00AAFF});

    object = new three.Mesh(geometry, material);

    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

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

                const POS = new three.Vector3(X, Y, Z);
                const NORM = POS.length();
                const SCALE = 0.125 * (Math.atan(X) + 0.5 * Math.PI);

                let dir, arrow;

                /*  Do not create arrows that start inside the sphere.        */
                if (NORM <= RADIUS)
                    continue;

                /*  Create the arrow and add it to the scene.                 */
                dir = new three.Vector3(1.0, 0.0, 0.0);
                arrow = new three.ArrowHelper(
                    dir, POS, SCALE, 0xFF0000, 0.3 * SCALE, 0.15 * SCALE
                );

                scene.add(arrow);
            }
        }
    }
}

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the vector field.                           *
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

    /*  Initialize the start time. This is used as the parameter for rotation.*/
    startTime = Date.now();
}

/*  Create the animation.                                                     */
init();
