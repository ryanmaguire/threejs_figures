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
 *      Renders a homotopy from a plane to a Mobius strip.                    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 18, 2025                                                 *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, frontObject, backObject, mobius, plane;

/*  Parameters for the Mobius strip.                                          */
const WIDTH = 32;
const HEIGHT = 32;

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
 *      Transforms the plane to a Mobius strip using a homotopy.              *
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
            const xs = mobius.geometry.attributes.position.getX(ind);

            const yp = plane.geometry.attributes.position.getY(ind);
            const ys = mobius.geometry.attributes.position.getY(ind);

            const zp = plane.geometry.attributes.position.getZ(ind);
            const zs = mobius.geometry.attributes.position.getZ(ind);

            const x = t * xs + (1 - t) * xp;
            const y = t * ys + (1 - t) * yp;
            const z = t * zs + (1 - t) * zp;

            frontObject.geometry.attributes.position.setXYZ(ind, x, y, z);
        }
    }

    /*  Re-render the newly rotated scene.                                    */
    backObject.geometry.attributes.position.needsUpdate = true;
    frontObject.geometry.attributes.position.needsUpdate = true;

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
    camera.position.set(0.0, -5.0, 4.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene. This includes the Mobius strip and the plane.      *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has parametric function tools, but this renders the          *
     *  with diagonals across the constituents squares, creating a mesh of    *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const planeGeometry = new three.BufferGeometry();
    const mobiusGeometry = new three.BufferGeometry();
    const objectGeometry = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32PlaneVertices, f32MobiusVertices, f32ObjectVertices;
    let planeAttributes, mobiusAttributes, objectAttributes;

    /*  Material the wireframe will be made out of.                           */
    const frontParameters = {color: 0xFF2200, side: three.FrontSide};
    const backParameters = {color: 0x00AAFF, side: three.BackSide};

    const backMaterial = new three.MeshBasicMaterial(backParameters);
    const frontMaterial = new three.MeshBasicMaterial(frontParameters);

    /*  Parameters for the Mobius strip. The horizontal axis is parametrized  *
     *  by the angle on the unit circle, which varies from 0 to 2 pi.         */
    const X_START = 0.0;
    const X_FINISH = 2.0 * Math.PI;

    /*  Vertical axis is the height of the strip of paper, -1 to 1.           */
    const Y_START = -1.0;
    const Y_FINISH = 1.0;

    /*  The number of segments we'll divide the two axes into.                */
    const WIDTH = 32;
    const HEIGHT = 32;

    /*  Parameters for the uv plane, the strip in the plane that parametrizes *
     *  the Mobius band.                                                      */
    const X_LENGTH = X_FINISH - X_START;
    const Y_LENGTH = Y_FINISH - Y_START;
    const DX = X_LENGTH / (WIDTH - 1);
    const DY = Y_LENGTH / (HEIGHT - 1);

    /*  Vertices for the mesh used to draw the Mobius strip.                  */
    let mobiusVertices = [];
    let planeVertices = [];
    let objectVertices = [];
    let indices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the horizontal axis.                                     */
    for (xIndex = 0; xIndex < WIDTH; ++xIndex) {

        /*  Convert pixel index to x coordinate in the plane.                 */
        const X = X_START + xIndex * DX;

        /*  Loop through the vertical component of the object.                */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            /*  Convert pixel index to y coordinate.                          */
            const Y = Y_START + yIndex * DY;

            /*  The formula for the Mobius band.                              */
            const COS_X = Math.cos(X);
            const SIN_X = Math.sin(X);
            const COS_HALF_X = Math.cos(0.5 * X);
            const SIN_HALF_X = Math.sin(0.5 * X);

            const T = 1.0 + 0.5 * Y * COS_HALF_X;

            const X_PT = T * COS_X;
            const Y_PT = T * SIN_X;
            const Z_PT = 0.5 * Y * SIN_HALF_X;

            /*  Add this point to our vertex array.                           */
            planeVertices.push(X - Math.PI, Y, 0.0);
            objectVertices.push(X - Math.PI, Y, 0.0);

            if (xIndex != WIDTH - 1)
                mobiusVertices.push(X_PT, Y_PT, Z_PT);
        }
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  The Mobius band has a half twist, so the "orientation" of the strip   *
     *  is reverse after x varies from 0 to 2 pi (left becomes right and      *
     *  right becomes left). We cannot simply connect a line segment from the *
     *  (WIDTH - 1, y) point to the (0, y) point, these points do not line up *
     *  because of the flip. Instead we need to connect the (WIDTH - 1, y)    *
     *  point to the (0, HEIGHT - 1 - y) point, the HEIGHT - 1 - y index      *
     *  takes into account the flip. Add these to our vertex array.           */
    for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

        /*  Replacing y with HEIGHT - 1 - y flips the horizontal axis. There  *
         *  are three components to a point, since we are working in three    *
         *  dimensional space, so the index is scaled by 3.                   */
        const X_IND = 3 * (HEIGHT - 1 - yIndex);
        const Y_IND = X_IND + 1;
        const Z_IND = Y_IND + 1;

        /*  No need to recompute these points, they correspond to the first   *
         *  column in the vertex array. Add them to the end as well.          */
        mobiusVertices.push(
            mobiusVertices[X_IND],
            mobiusVertices[Y_IND],
            mobiusVertices[Z_IND]
        );
    }

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

        /*  The horizontal component is now fixed, loop through the vertical. */
        for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex) {

            /*  We operate in row-major fashion, so the starting index for    *
             *  this row is the current horizontal index times the height.    */
            const SHIFT = xIndex * HEIGHT;

            /*  The current index is the shift plus vertical index. That      *
             *  is, the index for (x, y) is x*height + y.                     */
            const INDEX00 = SHIFT + yIndex;

            /*  The point directly after the current point, in the vertical.  */
            const INDEX01 = INDEX00 + 1;

            /*  The point next to the current point, in the horizontal.       */
            const INDEX10 = INDEX00 + HEIGHT;

            /*  Lastly, the point above and to the right.                     */
            const INDEX11 = INDEX10 + 1;

            /*  Add the constituent triangles that make up the current square.*/
            indices.push(INDEX00, INDEX01, INDEX10, INDEX10, INDEX01, INDEX11);
        }
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  The BufferAttribute constructor wants a typed array, convert the      *
     *  vertex array into a 32-bit float array.                               */
    f32MobiusVertices = new Float32Array(mobiusVertices);
    f32PlaneVertices = new Float32Array(planeVertices);
    f32ObjectVertices = new Float32Array(objectVertices);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    mobiusAttributes = new three.BufferAttribute(f32MobiusVertices, 3);
    planeAttributes = new three.BufferAttribute(f32PlaneVertices, 3);
    objectAttributes = new three.BufferAttribute(f32ObjectVertices, 3);

    /*  Add the vertices and index array to the mesh.                         */
    planeGeometry.setAttribute('position', planeAttributes);
    objectGeometry.setIndex(indices);

    mobiusGeometry.setAttribute('position', mobiusAttributes);
    objectGeometry.setIndex(indices);

    objectGeometry.setAttribute('position', objectAttributes);
    objectGeometry.setIndex(indices);
    objectGeometry.computeVertexNormals();

    /*  We wish to create a wireframe for the object. Create the lines.       */
    plane = new three.Mesh(planeGeometry, frontMaterial);
	mobius = new three.Mesh(mobiusGeometry, frontMaterial);
    frontObject = new three.Mesh(objectGeometry, frontMaterial);
    backObject = new three.Mesh(objectGeometry, backMaterial);

    /*  Create the scene and add the Mobius strip to it.                      */
    scene = new three.Scene();
    scene.add(backObject);
    scene.add(frontObject);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the Mobius strip.                           *
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
