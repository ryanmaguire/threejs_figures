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
 *      Renders a hyperbolic parabaloid, z = x^2 - y^2.                       *
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
 *      Rotates the sphere slowly about the z axis.                           *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const currentTime = Date.now();
    const time = (currentTime - startTime) / 1024.0;

    /*  Rotate the object slightly as time passes.                            */
    object.rotation.z = 0.125 * time;

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
    camera.position.set(0.0, 6.0, 4.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a wireframe sphere and a black background.*
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has several sphere tools, but the wireframes end up with the *
     *  diagonal lines rendered. We are trying to represent the sphere as a   *
     *  parametrization using the square and the triangles do not help show   *
     *  this. We use BufferGeometry and create a sphere from scratch.         */
    const geometry = new three.BufferGeometry();

    /*  The vertices for the sphere will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32Vertices, geometryAttributes;

    /*  Material the wireframe will be made out of.                           */
    const material = new three.MeshBasicMaterial( { color: 0x00AAFF } );

    /*  Radius of the sphere, and the number of longitude and latitude lines. */
    const START = -1.0;
    const FINISH = 1.0;
    const LENGTH = FINISH - START;
    const WIDTH = 32;
    const HEIGHT = 32;
    const DX = LENGTH / WIDTH;
    const DY = LENGTH / HEIGHT;

    /*  Vertices for the mesh used to draw the sphere.                        */
    let vertices = [];
    let indices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loope through the zenith angles, azimuth angles are the inner loop.   */
    for (xIndex = 1; xIndex <= WIDTH; ++xIndex) {

        const X = START + xIndex * DX;

        /*  With the latitude fixed we now go around in a circle, allowing    *
         *  the azimuthal angle to vary.                                      */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            const Y = START + yIndex * DY;
            const Z = X*X - Y*Y;

            /*  Add this point to our vertex array.                           */
            vertices.push(X, Y, Z);
        }
        /*  End of azimuth for-loop.                                          */
    }
    /*  End of zenith for-loop.                                               */

    /*  The BufferAttribute constructor wants a typed array, convert the      *
     *  vertex array into a 32-bit float array.                               */
    f32Vertices = new Float32Array(vertices);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    geometryAttributes = new three.BufferAttribute(f32Vertices, 3);

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the north and south poles which will be         *
     *  connected to all adjacent points. Because of this we start the theta  *
     *  index at 1 (avoid 0, which is the north pole) and stop at             *
     *  LAT_LINES - 1, avoiding the final latitude line since this needs to   *
     *  be dealt with more carefully to account for the south pole.           */
    for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

        /*  The latitude is fixed, we now go around the azimuth component. We *
         *  attach "L"'s at each point.                                       */
        for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex) {

            const SHIFT = yIndex * HEIGHT;

            const index00 = SHIFT + xIndex;
            const index01 = index00 + 1;
            const index10 = index00 + HEIGHT;

            /*  Add the "L" shape centered at the current point. This         *
             *  consists of two line segments, and hence needs four vertices. */
            indices.push(index00, index01, index00, index10);
        }
        /*  End of azimuth for-loop.                                          */
    }
    /*  End of zenith for-loop.                                               */

    /*  Add the vertices and index array to the mesh.                         */
    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indices);

    /*  We wish to create a wireframe for the sphere. Create the lines.       */
    object = new three.LineSegments(geometry, material);

    /*  Create the scene and add the sphere to it.                            */
    scene = new three.Scene();
    scene.add(object);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the wireframe sphere.                       *
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
