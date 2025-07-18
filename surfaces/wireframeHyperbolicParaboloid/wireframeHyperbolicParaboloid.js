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
 *      Renders a hyperbolic paraboloid, z = x^2 - y^2.                       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 10, 2025                                                 *
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
 *      Rotates the hyperbolic paraboloid slowly about the z axis.            *
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
    camera = new three.PerspectiveCamera(36, windowRatio, 0.25, 16);
    camera.position.set(0.0,-5.0, 6.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe hyperbolic paraboloid and a   *
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
    const material = new three.MeshBasicMaterial( { color: 0x00AAFF } );

    /*  Parameters for the hyperbolic paraboloid.                             */
    const START = -1.0;
    const FINISH = 1.0;
    const LENGTH = FINISH - START;
    const WIDTH = 32;
    const HEIGHT = 32;
    const DX = LENGTH / WIDTH;
    const DY = LENGTH / HEIGHT;

    /*  Vertices for the mesh used to draw the hyperbolic paraboloid.         */
    let vertices = [];
    let indices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the horizontal axis. The hyperbolic paraboloid lies      *
     *  above the xy plane, meaning it is of the form z = f(x, y).            */
    for (xIndex = 1; xIndex <= WIDTH; ++xIndex) {

        /*  Convert pixel index to x coordinate in the plane.                 */
        const X = START + xIndex * DX;

        /*  Loop through the vertical component of the object.                */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            /*  Convert pixel index to y coordinate.                          */
            const Y = START + yIndex * DY;

            /*  The hyperbolic paraboloid has a simple formula: z = x^2 - y^2.*/
            const Z = X*X - Y*Y;

            /*  Add this point to our vertex array.                           */
            vertices.push(X, Y, Z);
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
    for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

        /*  The horizontal component is now fixed, loop through the vertical. */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            /*  We operate in row-major fashion, so the starting index for    *
             *  this row is the current vertical index times the height.      */
            const SHIFT = yIndex * HEIGHT;

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y*height + x.                     */
            const INDEX00 = SHIFT + xIndex;

            /*  The point directly after the current point, in the horizontal.*/
            const INDEX01 = INDEX00 + 1;

            /*  The point directly above the current point, in the vertical.  */
            const INDEX10 = INDEX00 + HEIGHT;

            /*  If we are not at the very top of the object, we can add an    *
             *  "L" shape to our object, connecting the bottom left point     *
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
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  We stopped the horizontal for loop at WIDTH - 2, to avoid writing     *
     *  past the bounds of the object. This means we have left out the        *
     *  right-most vertical column, and need to add it back in.               */
    for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex)
    {
        /*  Same computation above, adding vertical lines only, and with the  *
         *  x index set to WIDTH - 1, the right-most index.                   */
        const SHIFT = yIndex * HEIGHT;
        const BOTTOM = SHIFT + WIDTH - 1;
        const TOP = BOTTOM + HEIGHT;
        indices.push(BOTTOM, TOP);
    }

    /*  Add the vertices and index array to the mesh.                         */
    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indices);

    /*  We wish to create a wireframe for the object. Create the lines.       */
    object = new three.LineSegments(geometry, material);

    /*  Create the scene and add the hyperbolic paraboloid to it.             */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe hyperbolic paraboloid.        *
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
