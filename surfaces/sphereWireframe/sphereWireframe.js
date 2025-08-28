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
 *      Renders a wireframe sphere depicting a common parametrization.        *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 21, 2025                                                 *
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
    const RADIUS = 1.0;
    const LAT_LINES = 32;
    const LONG_LINES = 32;

    /*  The azimuthal angle varies from 0 to 2 pi, and we have LONG_LINES     *
     *  number of samples. The scale factor goes from longitude index to the  *
     *  azimuthal angle it corresponds to.                                    */
    const PHI_FACTOR = 2.0 * Math.PI / (LONG_LINES - 1.0);

    /*  Similarly, the zenith angle varies from 0 to pi. Note that the south  *
     *  pole and the north pole are special latitudes, they are single points.*
     *  Because of this there are LAT_LINES + 2 latitudes, LAT_LINES of which *
     *  are not just points. The scale factor is hence slightly different     *
     *  than the one used for the azimuth angle.                              */
    const THETA_FACTOR = Math.PI / (LAT_LINES + 1.0);

    /*  The north pole is the zeroth index, the south pole is the last.       */
    const SOUTH_POLE_INDEX = LAT_LINES * LONG_LINES + 1;
    const NORTH_POLE_INDEX = 0;

    /*  Vertices for the mesh used to draw the sphere.                        */
    let vertices = [];
    let indices = [];

    /*  Variables for indexing over the two angles.                           */
    let phiIndex, thetaIndex;

    /*  Start the computation by creating the north pole.                     */
    vertices.push(0.0, 0.0, RADIUS);

    /*  Loope through the zenith angles, azimuth angles are the inner loop.   */
    for (thetaIndex = 1; thetaIndex <= LAT_LINES; ++thetaIndex) {

        /*  We use the "physicist's" notation, theta is the zenith angle and  *
         *  "up" is 0 degrees. Compute spherical coordinates factors.         */
        const THETA = thetaIndex * THETA_FACTOR;
        const COS_THETA = Math.cos(THETA);
        const SIN_THETA = Math.sin(THETA);

        /*  With the latitude fixed we now go around in a circle, allowing    *
         *  the azimuthal angle to vary.                                      */
        for (phiIndex = 0; phiIndex < LONG_LINES; ++phiIndex) {

            /*  Scale factors for the azimuthal component.                    */
            const PHI = phiIndex * PHI_FACTOR;
            const COS_PHI = Math.cos(PHI);
            const SIN_PHI = Math.sin(PHI);

            /*  Compute the Cartesian coordinates from the spherical ones.    */
            const X = RADIUS * COS_PHI * SIN_THETA;
            const Y = RADIUS * SIN_PHI * SIN_THETA;
            const Z = RADIUS * COS_THETA;

            /*  Add this point to our vertex array.                           */
            vertices.push(X, Y, Z);
        }
        /*  End of azimuth for-loop.                                          */
    }
    /*  End of zenith for-loop.                                               */

    /*  Add the south pole to our vertex array.                               */
    vertices.push(0.0, 0.0, -RADIUS);

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
    for (thetaIndex = 1; thetaIndex < LAT_LINES; ++thetaIndex) {

        /*  The latitude is fixed, we now go around the azimuth component. We *
         *  attach "L"'s at each point.                                       */
        for (phiIndex = 0; phiIndex < LONG_LINES; ++phiIndex) {

            /*  The vertex array is "zenith-major", the index for the         *
             *  (phi, theta) point is theta * LONG_LINES + phi. Since the     *
             *  zeroth element was reserved for the north pole, there is an   *
             *  additional "+1" for the shift.                                */
            const SHIFT = (thetaIndex - 1) * LONG_LINES + 1;

            /*  Get the index for the current point.                          */
            const index00 = (SHIFT + phiIndex);

            /*  Compute the index for the next point on the same latitude     *
             *  line. It is possible to wrap around, the phi index needs to   *
             *  be computed mod LONG_LINES.                                   */
            const index01 = (phiIndex == LONG_LINES - 1 ? SHIFT : index00 + 1);

            /*  Compute the index for the point directly below the current    *
             *  one, which falls on the next latitude line.                   */
            const index10 = index00 + LONG_LINES;

            /*  Add the "L" shape centered at the current point. This         *
             *  consists of two line segments, and hence needs four vertices. */
            indices.push(index00, index01, index00, index10);
        }
        /*  End of azimuth for-loop.                                          */
    }
    /*  End of zenith for-loop.                                               */

    /*  Add all of the lines that connect to the north and south pole.        */
    for (phiIndex = 0; phiIndex < LONG_LINES; ++phiIndex)
    {
        /*  Same idea as before, this is the shift for the last latitude.     */
        const SHIFT = LONG_LINES * (LAT_LINES - 1) + 1;

        /*  The indices for the points on the latitude line.                  */
        const index00 = (SHIFT + phiIndex);
        const index01 = (phiIndex == LONG_LINES - 1 ? SHIFT : index00 + 1);

        /*  The south pole index is simply the last entry of the array. Add   *
         *  the "L" shape for the current point.                              */
        indices.push(index00, index01, index00, SOUTH_POLE_INDEX);

        /*  The latitude line below the north pole has already been drawn. We *
         *  simply need to draw the "spokes" connecting to the north pole.    */
        indices.push(NORTH_POLE_INDEX, phiIndex + 1);
    }

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
