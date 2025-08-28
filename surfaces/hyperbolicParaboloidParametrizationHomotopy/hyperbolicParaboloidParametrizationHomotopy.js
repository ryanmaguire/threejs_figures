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
 *      Renders a homotopy from a plane to a hyperbolic paraboloid.           *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 18, 2025                                                 *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, object, paraboloid, plane;

/*  The number of samples in the horizontal and vertical axes.                */
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
 *      Transforms the plane to a hyperbolic paraboloid using a homotopy.     *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the homotopy parameter.                  */
    const CURRENT_TIME = Date.now();
    const TIME = (CURRENT_TIME - startTime) / 1024.0;

    /*  We need the parameter to vary back and forth from 0 to 1. Use the     *
     *  cosine function to do this.                                           */
    const T = 0.5 * (1.0 - Math.cos(TIME));

    /*  Variables for the indices of the vertices of the mesh.                */
    let xIndex, yIndex;

    /*  Loop through the vertical components.                                 */
    for (yIndex = 0; yIndex < HEIGHT; ++yIndex)
    {
        /*  The indices are stored in row-major format, the y-shift is used   *
         *  to get the corresponding column.                                  */
        const SHIFT = yIndex * WIDTH;

        /*  Loop through the horizontal components.                           */
        for (xIndex = 0; xIndex <= WIDTH; ++xIndex)
        {
            /*  The index for (x, y) is given by x + y-shift. Compute.        */
            const INDEX = SHIFT + xIndex;

            /*  Extract the x-coordinates from the two surfaces.              */
            const XP = plane.geometry.attributes.position.getX(INDEX);
            const XS = paraboloid.geometry.attributes.position.getX(INDEX);

            /*  Extract the y-coordinates from the two surfaces.              */
            const YP = plane.geometry.attributes.position.getY(INDEX);
            const YS = paraboloid.geometry.attributes.position.getY(INDEX);

            /*  Extract the z-coordinates from the two surfaces.              */
            const ZP = plane.geometry.attributes.position.getZ(INDEX);
            const ZS = paraboloid.geometry.attributes.position.getZ(INDEX);

            /*  We draw a straight line from the point P in the first surface *
             *  to the point Q in the second surface using a linear homotopy: *
             *                                                                *
             *      r(t) = t Q + (1 - t) P                                    *
             *                                                                *
             *  We use this to calculate the vertices of the current surface. */
            const X = T * XS + (1.0 - T) * XP;
            const Y = T * YS + (1.0 - T) * YP;
            const Z = T * ZS + (1.0 - T) * ZP;

            /*  Update the current point in the plotted object.               */
            object.geometry.attributes.position.setXYZ(INDEX, X, Y, Z);
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

    /*  Re-render the newly rotated scene.                                    */
    object.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
/*  End of animate.                                                           */

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

    /*  Starting location for the camera.                                     */
    const CAMERA_X = 0.0;
    const CAMERA_Y = -5.0;
    const CAMERA_Z = 4.0;

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
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene. This includes the paraboloid and the plane.        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the constituents squares, creating a mesh of    *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const planeGeometry = new three.BufferGeometry();
    const paraboloidGeometry = new three.BufferGeometry();
    const objectGeometry = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32PlaneVertices, f32ParaboloidVertices, f32ObjectVertices;
    let planeAttributes, paraboloidAttributes, objectAttributes;

    /*  Material the wireframe will be made out of.                           */
    const material = new three.MeshBasicMaterial({color: 0x00AAFF});

    /*  Parameters for the hyperbolic paraboloid.                             */
    const START = -1.0;
    const FINISH = 1.0;
    const LENGTH = FINISH - START;

    /*  Step-sizes for the displacement between samples.                      */
    const DX = LENGTH / (WIDTH - 1);
    const DY = LENGTH / (HEIGHT - 1);

    /*  Vertices for the mesh used to draw the hyperbolic paraboloid.         */
    let paraboloidVertices = [];
    let planeVertices = [];
    let objectVertices = [];
    let indices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the vertical axis. The hyperbolic paraboloid lies        *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * WIDTH + x.                 */
    for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

        /*  Convert pixel index to y coordinate.                              */
        const Y = START + yIndex * DY;

        /*  Loop through the horizontal component of the object.              */
        for (xIndex = 0; xIndex < WIDTH; ++xIndex) {

            /*  Convert pixel index to x coordinate in the plane.             */
            const X = START + xIndex * DX;

            /*  The hyperbolic paraboloid has a simple formula: z = x^2 - y^2.*/
            const Z = X*X - Y*Y;

            /*  Add this point to our vertex array.                           */
            paraboloidVertices.push(X, Y, Z);

            /*  Add the region in the xy plane that parametrizes the surface. */
            planeVertices.push(X, Y, 0.0);

            /*  The object starts as a rectangle in the plane, meaning it has *
             *  the same points as the plane object.                          */
            objectVertices.push(X, Y, 0.0);
        }
        /*  End of horitzonal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

    /*  The BufferAttribute constructor wants a typed array, convert the      *
     *  vertex array into a 32-bit float array.                               */
    f32ParaboloidVertices = new Float32Array(paraboloidVertices);
    f32PlaneVertices = new Float32Array(planeVertices);
    f32ObjectVertices = new Float32Array(objectVertices);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    paraboloidAttributes = new three.BufferAttribute(f32ParaboloidVertices, 3);
    planeAttributes = new three.BufferAttribute(f32PlaneVertices, 3);
    objectAttributes = new three.BufferAttribute(f32ObjectVertices, 3);

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

    /*  We stopped the horizontal for loop at WIDTH - 2, to avoid writing     *
     *  past the bounds of the object. This means we have left out the        *
     *  right-most vertical column, and need to add it back in.               */
    for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex)
    {
        /*  Same computation above, adding vertical lines only, and with the  *
         *  x index set to WIDTH - 1, the right-most index.                   */
        const SHIFT = yIndex * WIDTH;
        const BOTTOM = SHIFT + WIDTH - 1;
        const TOP = BOTTOM + WIDTH;
        indices.push(BOTTOM, TOP);
    }

    /*  Add the vertices and index arrays to the meshes.                      */
    planeGeometry.setAttribute('position', planeAttributes);
    planeGeometry.setIndex(indices);

    paraboloidGeometry.setAttribute('position', paraboloidAttributes);
    paraboloidGeometry.setIndex(indices);

    objectGeometry.setAttribute('position', objectAttributes);
    objectGeometry.setIndex(indices);

    /*  We wish to create a wireframe for the objects. Create the lines.      */
    plane = new three.LineSegments(planeGeometry, material);
	paraboloid = new three.LineSegments(paraboloidGeometry, material);
    object = new three.LineSegments(objectGeometry, material);

    /*  Create the scene and add the hyperbolic paraboloid to it.             */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the hyperbolic paraboloid.                  *
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
