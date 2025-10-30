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
 *      Renders an elliptic paraboloid, z = x^2 + 2y^2.                       *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       July 22, 2025                                                 *
 ******************************************************************************/

import createModule from './main.js';

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const CModule = await createModule();

/*  Globals for the animation.                                                */
let camera, scene, renderer, object, f32Vertices;

/*  The number of samples in the horizontal and vertical axes.                */
const width = 32;
const height = 32;

/*  Total number of points used for the mesh.                                 */
const numberOfPoints = width * height;
const bufferSize = 3 * numberOfPoints;
const rotationAngle = 0.005;

CModule.setRotationAngle(rotationAngle);

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
 *      Rotates the elliptic paraboloid slowly about the z axis.              *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  Rotate the object slightly as time passes.                            */
    CModule.rotateMesh(f32Vertices.byteOffset, numberOfPoints);
    object.geometry.attributes.position.needsUpdate = true;

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
    controls.target.set(0.0, 0.0, 0.0);
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
    const cameraX = +0.0;
    const cameraY = -5.0;
    const cameraZ = +6.0;

    /*  Field-of-View for the camera.                                         */
    const FOV = 36.0;

    /*  Drawing thresholds for objects in the camera's view.                  */
    const near = 0.25;
    const far = 100.0;

    /*  Aspect ratio for the window.                                          */
    const windowRatio = window.innerWidth / window.innerHeight;

    /*  Create the camera and set its initial position.                       */
    camera = new three.PerspectiveCamera(FOV, windowRatio, near, far);
    camera.position.set(cameraX, cameraY, cameraZ);

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe elliptic paraboloid and a     *
 *      black background.                                                     *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has parametric function tools, but this renders the object   *
     *  with diagonals across the constituent squares, creating a mesh of     *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const geometry = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let geometryAttributes, indexAttribute;

    /*  Material the wireframe will be made out of.                           */
    const lightBlue = 0x00AAFF;
    const materialDefinition = {color: lightBlue}
    const material = new three.MeshBasicMaterial(materialDefinition);

    /*  Vertices for the mesh used to draw the elliptic paraboloid.           */
    let indices = [];

    const ptr = CModule.getBuffer();
    f32Vertices = new Float32Array(CModule.HEAPF32.buffer, ptr, bufferSize);
    CModule.generateMesh(f32Vertices.byteOffset, width, height);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    geometryAttributes = new three.BufferAttribute(f32Vertices, 3);

    let yIndex, xIndex;

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for (yIndex = 0; yIndex < height; ++yIndex) {

        /*  The indices are row-major, meaning index = y * width + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        const shift = yIndex * width;

        /*  The vertical component is now fixed, loop through the horizontal. */
        for (xIndex = 0; xIndex < width; ++xIndex) {

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * width + x.                    */
            const index00 = shift + xIndex;

            /*  The point directly after the current point, in the horizontal.*/
            const index01 = index00 + 1;

            /*  The point directly above the current point, in the vertical.  */
            const index10 = index00 + width;

            /*  If we are not at the top edge or the right edge of the        *
             *  rectangle, we may add an "L" shape to our mesh connecting the *
             *  bottom left point to the bottom right point, and the bottom   *
             *  left point to to the upper left point. At the top of the      *
             *  rectangle the upper left point goes beyond the bounds of the  *
             *  parametrization, so we do not need to draw it. Check for this.*/
            if (yIndex != height - 1)
                indices.push(index00, index10);

            /*  Similarly, at the right edge we have that the bottom right    *
             *  point lies outside of the parametrizion and do not need to    *
             *  add it to our mesh. Check for this.                           */
            if (xIndex != width - 1)
                indices.push(index00, index01);
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

    /*  Add the vertices and index array to the mesh.                         */
    const indexU32 = new Uint16Array(indices);
    indexAttribute = new three.BufferAttribute(indexU32, 1);
    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);

    /*  We wish to create a wireframe for the object. Create the lines.       */
    object = new three.LineSegments(geometry, material);

    /*  Create the scene and add the elliptic paraboloid to it.               */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe elliptic paraboloid.          *
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
}

/*  Create the animation.                                                     */
init();
