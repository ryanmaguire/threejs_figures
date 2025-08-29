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
 *      Renders a solid Klein bottle.                                         *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       August 28, 2025                                               *
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
 *      Rotates the Mobius strip slowly about the z axis.                     *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const currentTime = Date.now();
    const time = (currentTime - startTime);

    /*  Rotate the object slightly as time passes.                            */
    object.rotation.z = time / 8192.0;

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
    camera.position.set(0.0, -20.0, 20.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe Mobius strip and a            *
 *      black background.                                                     *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has parametric function tools, but this renders the          *
     *  with diagonals across the constituents squares, creating a mesh of    *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const geometry = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32Vertices, geometryAttributes;

    /*  Material the wireframe will be made out of.                           */
    const materialParameters = {color: 0x00AAFF};
    const material = new three.MeshBasicMaterial(materialParameters);

    /*  Parameters for the Mobius strip. The horizontal axis is parametrized  *
     *  by the angle on the unit circle, which varies from 0 to 2 pi.         */
    const X_START = 0.0;
    const X_FINISH = 2.0 * Math.PI;

    /*  Vertical axis is the height of the strip of paper, -1 to 1.           */
    const Y_START = 0.0;
    const Y_FINISH = 2.0 * Math.PI;

    /*  The number of segments we'll divide the two axes into.                */
    const WIDTH = 63;
    const HEIGHT = 63;

    /*  Parameters for the uv plane, the strip in the plane that parametrizes *
     *  the Mobius band.                                                      */
    const X_LENGTH = X_FINISH - X_START;
    const Y_LENGTH = Y_FINISH - Y_START;
    const DX = X_LENGTH / (WIDTH - 1);
    const DY = Y_LENGTH / (HEIGHT - 1);

    /*  Vertices for the mesh used to draw the Mobius strip.                  */
    let vertices = [];
    let indices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the horizontal axis.                                     */
    for (xIndex = 0; xIndex < WIDTH; ++xIndex) {

        /*  Convert pixel index to x coordinate in the plane.                 */
        const X = X_START + xIndex * DX;

        const COS_X = Math.cos(X);
        const SIN_X = Math.sin(X);
        const T = 2.0 - COS_X;
        const X_SCALE = (X < Math.PI ? COS_X : -1.0);
        const Y_SCALE = (X < Math.PI ? T * SIN_X : 0.0);

        /*  Loop through the vertical component of the object.                */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            /*  Convert pixel index to y coordinate.                          */
            const Y = Y_START + yIndex * DY;

            const COS_Y = Math.cos(Y);
            const SIN_Y = Math.sin(Y);

            const X_PT = 3.0 * COS_X * (1.0 + SIN_X) + T * COS_Y * X_SCALE;
            const Y_PT = 8.0 * SIN_X + COS_Y * Y_SCALE;
            const Z_PT = T * SIN_Y;

            /*  Add this point to our vertex array.                           */
            vertices.push(X_PT, Y_PT, Z_PT);
        }
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  The BufferAttribute constructor wants a typed array, convert the      *
     *  vertex array into a 32-bit float array.                               */
    f32Vertices = new Float32Array(vertices);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    geometryAttributes = new three.BufferAttribute(f32Vertices, 3);

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

        /*  The indices are row-major, meaning index = y * WIDTH + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        const SHIFT = yIndex * WIDTH;

        /*  The vertical component is now fixed, loop through the horizontal  *
         *  axis. The right-most column, which is xIndex = WIDTH - 1, is the  *
         *  boundary and must be handled separately. This is done in later.   */
        for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * WIDTH + x.                    */
            const INDEX00 = SHIFT + xIndex;

            /*  The point directly after the current point, in the horizontal.*/
            const INDEX01 = INDEX00 + 1;

            /*  The point directly above the current point, in the vertical.  */
            const INDEX10 = INDEX00 + WIDTH;

            /*  If we are not at the very top of the object, we can add an    *
             *  "L" shape to our mesh, connecting the bottom left point       *
             *  with the bottom right point, and similarly the bottom left    *
             *  point with the upper left point.                              */
            if (yIndex != HEIGHT - 1)
                indices.push(INDEX00, INDEX01, INDEX00, INDEX10);

            /*  At the top boundary, the upper left point goes beyond the     *
             *  bounds of our object and does not need to be drawn. Only add  *
             *  the line from bottom left to bottom right.                    */
            else
                indices.push(INDEX00, INDEX01);
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

    /*  Add the vertices and index array to the mesh.                         */
    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indices);

    /*  We wish to create a wireframe for the object. Create the lines.       */
    object = new three.LineSegments(geometry, material);

    /*  Create the scene and add the Mobius strip to it.                      */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe Mobius strip.                 *
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
