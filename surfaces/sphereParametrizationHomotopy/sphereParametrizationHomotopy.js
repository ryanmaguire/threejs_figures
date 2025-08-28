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
 *      Renders a parametrization from a plane to the sphere.                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 3, 2025                                                  *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, object, sphere, plane;

/*  The number of longitudinal and latitudinal lines on the sphere.           */
const LONG_LINES = 32;
const LAT_LINES = 32;

/*  The number of divisions in the plane along the horizontals and verticals. */
const WIDTH = LONG_LINES;
const HEIGHT = LAT_LINES + 1;

/*  Radius of the sphere the plane wraps around.                              */
const RADIUS = 1.0;

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
 *      getSphereIndex                                                        *
 *  Purpose:                                                                  *
 *      Converts plane index to sphere index.                                 *
 *  Arguments:                                                                *
 *      xInd (Integer):                                                       *
 *          The x-index for the point in the plane.                           *
 *      yInd (Integer):                                                       *
 *          The y-index for the point in the plane.                           *
 *  Output:                                                                   *
 *      sInd (Integer):                                                       *
 *          The index for the point in the sphere array corresponding to the  *
 *          point in the plane.                                               *
 ******************************************************************************/
function getSphereIndex(xInd, yInd) {

    /*  The bottom edge of the plane maps to the north pole.                  */
    if (yInd == 0)
        return 0;

    /*  The top edge corresponds to the south pole.                           */
    if (yInd == HEIGHT)
        return sphere.geometry.attributes.position.count - 1;

    /*  All other points use the shift formula.                               */
    return (yInd - 1) * (LONG_LINES + 1) + xInd + 1;
}
/*  End of getSphereIndex.                                                    */

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Transforms the plane to a sphere using a straight-line homotopy.      *
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

    let xpInd, ypInd;

    for (xpInd = 0; xpInd <= WIDTH; ++xpInd)
    {
        const xsInd = (xpInd == WIDTH ? 0 : xpInd);

        for (ypInd = 0; ypInd <= HEIGHT; ++ypInd)
        {
            const pInd = ypInd * (WIDTH + 1) + xpInd;
            const sInd = getSphereIndex(xsInd, ypInd);

            const xp = plane.geometry.attributes.position.getX(pInd);
            const xs = sphere.geometry.attributes.position.getX(sInd);

            const yp = plane.geometry.attributes.position.getY(pInd);
            const ys = sphere.geometry.attributes.position.getY(sInd);

            const zp = plane.geometry.attributes.position.getZ(pInd);
            const zs = sphere.geometry.attributes.position.getZ(sInd);

            const x = t * xs + (1 - t) * xp;
            const y = t * ys + (1 - t) * yp;
            const z = t * zs + (1 - t) * zp;

            object.geometry.attributes.position.setXYZ(pInd, x, y, z);
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
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 16);
    camera.position.set(0.0, 6.0, 4.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene. This includes the sphere and the plane below.      *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    const SIZE = 4.0 * RADIUS;
    const material = new three.MeshNormalMaterial({wireframe: true});

    const sphereGeometry = new three.SphereGeometry(1.0, LONG_LINES, LAT_LINES);
    const planeGeometry = new three.PlaneGeometry(SIZE, SIZE, WIDTH, HEIGHT);
    const objectGeometry = new three.PlaneGeometry(SIZE, SIZE, WIDTH, HEIGHT);

    plane = new three.Mesh(planeGeometry, material);
	sphere = new three.Mesh(sphereGeometry, material);
    object = new three.Mesh(objectGeometry, material);

    scene = new three.Scene();
    scene.add(object);
}

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the sphere.                                 *
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
