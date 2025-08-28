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
 *      Renders a parametrization from a plane to a torus.                    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 3, 2025                                                  *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, object, torus, plane;

/*  The number of divisions in the plane along the horizontals and verticals. */
const WIDTH = 32;
const HEIGHT = 32;

/*  Radii used to define the torus.                                           */
const INNER = 1.0;
const OUTER = 2.0;
const SIZE = 2.0 * (OUTER + INNER);

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
 *      Transforms the plane to a torus using a straight-line homotopy.       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const currentTime = Date.now();
    const time = (currentTime - startTime) / 1024.0;

    const t = 0.5 * (1.0 - Math.cos(time));

    let xInd, yInd;

    for (xInd = 0; xInd <= WIDTH; ++xInd)
    {
        for (yInd = 0; yInd <= HEIGHT; ++yInd)
        {
            const ind = yInd * (WIDTH + 1) + xInd;

            const xp = plane.geometry.attributes.position.getX(ind);
            const xs = torus.geometry.attributes.position.getX(ind);

            const yp = plane.geometry.attributes.position.getY(ind);
            const ys = torus.geometry.attributes.position.getY(ind);

            const zp = plane.geometry.attributes.position.getZ(ind);
            const zs = torus.geometry.attributes.position.getZ(ind);

            const x = t * xs + (1 - t) * xp;
            const y = t * ys + (1 - t) * yp;
            const z = t * zs + (1 - t) * zp;

            object.geometry.attributes.position.setXYZ(ind, x, y, z);
        }
    }

    /*  Re-render the newly rotated scene.                                    */
    object.geometry.attributes.position.needsUpdate = true;
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
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 25);
    camera.position.set(0.0, 0.0, 15.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene. This includes the torus and the plane.             *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    const material = new three.MeshNormalMaterial({wireframe: true});

    const torusGeometry = new three.TorusGeometry(OUTER, INNER, WIDTH, HEIGHT);
    const planeGeometry = new three.PlaneGeometry(SIZE, SIZE, WIDTH, HEIGHT);
    const objectGeometry = new three.PlaneGeometry(SIZE, SIZE, WIDTH, HEIGHT);

    plane = new three.Mesh(planeGeometry, material);
	torus = new three.Mesh(torusGeometry, material);
    object = new three.Mesh(objectGeometry, material);

    scene = new three.Scene();
    scene.add(object);
}

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the torus.                                  *
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
