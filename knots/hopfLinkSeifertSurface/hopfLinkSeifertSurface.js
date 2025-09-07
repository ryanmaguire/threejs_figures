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
 *      Renders a Seifert surface for the Hopf link.                          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       September 2, 2025                                             *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer, startTime, frontObject, backObject, wireFrame;

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
 *      Rotates the Seifert surface slowly about the z axis.                  *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  The elapsed time is used for the rotation parameter.                  */
    const CURRENT_TIME = Date.now();
    const TIME = (CURRENT_TIME - startTime);
    const ROTATION = TIME / 4096.0;

    /*  Rotate the object slightly as time passes.                            */
    frontObject.rotation.z = ROTATION;
    backObject.rotation.z = ROTATION;
    wireFrame.rotation.z = ROTATION;

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
    const CONTROLS = new OrbitControls(camera, renderer.domElement);
    CONTROLS.target.set(0.0, 0.0, 0.0);
    CONTROLS.update();
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
    const CAMERA_X = +0.0;
    const CAMERA_Y = -5.0;
    const CAMERA_Z = +1.0;

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

    /*  Set the orientation for the camera.                                   */
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 0.0, 1.0);
}

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a Seifert surface for the Hopf link with  *
 *      the front side colored blue and the back side colored red, indicating *
 *      the surface is indeed orientable. The background is black.            *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  24-bit RGB values for the colors used for each surface.               */
    const BLUE = 0x0080FF;
    const RED = 0xFF0000;
    const BLACK = 0x000000;

    /*  There is a single underlying geometry, but three objects are rendered *
     *  from this. The geometry contains the points for the Seifert surface,  *
     *  and from this we render the front side (blue), the back side (red),   *
     *  and a wireframe to help envision the parametrization.                 */
    const GEOMETRY = new three.BufferGeometry();
    const WIRE_GEOMETRY = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32Vertices, geometryAttributes;

    /*  Descriptions for the three objects that will be rendered.             */
    const WIRE_DESCRIPTION = {color: BLACK};
    const BACK_DESCRIPTION = {side: three.BackSide, color: RED};
    const FRONT_DESCRIPTION = {side: three.FrontSide, color: BLUE};

    /*  Create the materials for the three objects.                           */
    const FRONT_MATERIAL = new three.MeshBasicMaterial(FRONT_DESCRIPTION);
    const BACK_MATERIAL = new three.MeshBasicMaterial(BACK_DESCRIPTION);
    const WIRE_MATERIAL = new three.MeshBasicMaterial(WIRE_DESCRIPTION);

    /*  Parameters for the Seifert surface. The horizontal axis is            *
     *  parametrized by the angle on the unit circle, which varies from       *
     *  0 to 2 pi.                                                            */
    const X_START = 0.0;
    const X_FINISH = 2.0 * Math.PI;

    /*  The Hopf link consists of two circles, which may be parametrized by a *
     *  single angle (this is the horizontal axis, see above). Given a point  *
     *  on the first circle with angle theta, we draw a straight line to the  *
     *  corresponding point on the second circle with angle theta. Labeling   *
     *  these points P and Q, respectively, we have:                          *
     *                                                                        *
     *      L = (1 - t) * P + t * Q                                           *
     *                                                                        *
     *  The second parameter hence varies from 0 to 1. This is the vertical   *
     *  axis used in the parametrization.                                     */
    const Y_START = 0.0;
    const Y_FINISH = 1.0;

    /*  The number of segments we'll divide the two axes into.                */
    const WIDTH = 64;
    const HEIGHT = 32;

    /*  Parameters for the xy plane, the strip in the plane that parametrizes *
     *  the Seifert surface for the Hopf link.                                */
    const X_LENGTH = X_FINISH - X_START;
    const Y_LENGTH = Y_FINISH - Y_START;

    /*  Step sizes between samples in the xy plane.                           */
    const DX = X_LENGTH / (WIDTH - 1);
    const DY = Y_LENGTH / (HEIGHT - 1);

    /*  Vertices for the mesh used to draw the Seifert surface.               */
    let vertices = [];

    /*  Indices corresponding to the vertices of the triangles that make up   *
     *  the mesh of the surface.                                              */
    let indices = [];

    /*  Indices corresponding to line segments that create the wireframe.     */
    let wireIndices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the horizontal axis.                                     */
    for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

        /*  Convert pixel index to x coordinate in the plane.                 */
        const X = X_START + xIndex * DX;

        /*  Pre-compute sine and cosine of the input.                         */
        const COS_X = Math.cos(X);
        const SIN_X = Math.sin(X);

        /*  The Hopf link consists of two circles that are looped together.   *
         *  We can create this using a circle in the xy plane and a circle in *
         *  the xz plane that has been shifted in the x direction. Both       *
         *  circles are parametrized by an angle (which is our variable X).   *
         *  Compute the location of the point for the circle in the xz plane. */
        const PX = 1.0 + COS_X;
        const PY = 0.0;
        const PZ = SIN_X;

        /*  Compute the location of the corresponding point that lies on the  *
         *  circle in the xy plane.                                           */
        const QX = COS_X;
        const QY = SIN_X;
        const QZ = 0.0;

        /*  Loop through the vertical component of the object.                */
        for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

            /*  Convert pixel index to y coordinate.                          */
            const Y = Y_START + yIndex * DY;

            /*  The Y parameter corresponds to the line segment between the   *
             *  points P and Q. Compute the location of the current point on  *
             *  the Seifert surface.                                          */
            const X_PT = PX * (1.0 - Y) + Y * QX;
            const Y_PT = PY * (1.0 - Y) + Y * QY;
            const Z_PT = PZ * (1.0 - Y) + Y * QZ;

            /*  Add this point to our vertex array.                           */
            vertices.push(X_PT, Y_PT, Z_PT);
        }
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  The end of the parametrization matches up with the start of it. That  *
     *  is, the X parameter corresponds to an angle that goes from 0 to 2 pi, *
     *  and the points corresponding to X = 0 are the same as the points that *
     *  have X = 2 pi. Rather than creating new points, we simply add the     *
     *  first column to the end of the array. The makes the surface closed.   */
    for (yIndex = 0; yIndex < HEIGHT; ++yIndex) {

        /*  There are three numbers needed per point, hence we increment in   *
         *  chunks of three. Compute the indices for the x, y, and z parts.   */
        const X_IND = 3 * yIndex;
        const Y_IND = X_IND + 1;
        const Z_IND = Y_IND + 1;

        /*  No need to recompute these points, they correspond to the first   *
         *  column in the vertex array. Add them to the end as well.          */
        vertices.push(vertices[X_IND], vertices[Y_IND], vertices[Z_IND]);
    }

    /*  The BufferAttribute constructor wants a typed array, convert the      *
     *  vertex array into a 32-bit float array.                               */
    f32Vertices = new Float32Array(vertices);

    /*  We can now create the buffer attributes. The data is 3D, hence the    *
     *  itemSize parameter is 3.                                              */
    geometryAttributes = new three.BufferAttribute(f32Vertices, 3);

    /*  We need to create the triangles that form the mesh for the surface.   *
     *  We do this by creating a sequence of ordered triples that correspond  *
     *  to the indices of three points in the vertex array that form the      *
     *  vertices for one of the triangles. Each point will be connected to    *
     *  its nearest neighbors.                                                *
     *                                                                        *
     *  The wireframe is drawn to help envision the parametrization. Because  *
     *  of this want to draw a mesh of squares, not triangles. We create a    *
     *  second index array using the wireIndices variable that consists of    *
     *  ordered pairs for the vertices we wish to connected. Each point is    *
     *  connected to its four nearest neighbors, with the exception of the    *
     *  points on the boundary, which must be handled separated. We loop      *
     *  through and add "L" shapes for points not on the boundary, and        *
     *  squares for points that fall on the upper edge.                       */
    for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

        /*  We operate in column-major fashion, so the starting index for     *
         *  this column is the current horizontal index times the height.     */
        const SHIFT = xIndex * HEIGHT;

        /*  The horizontal component is now fixed, loop through the vertical. */
        for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex) {

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

            /*  Add the vertices for the wireframe. We create an "L" shape.   */
            wireIndices.push(INDEX00, INDEX01, INDEX00, INDEX10);

            /*  At the very edge of the surface we need to add the boundary.  */
            if (yIndex == HEIGHT - 2)
                wireIndices.push(INDEX01, INDEX11);
        }
        /*  End of vertical for-loop.                                         */
    }
    /*  End of horizontal for-loop.                                           */

    /*  Add the vertices and index array to the mesh.                         */
    GEOMETRY.setAttribute('position', geometryAttributes);
    GEOMETRY.setIndex(indices);

    /*  Similarly, create the wireframe geometry.                             */
    WIRE_GEOMETRY.setAttribute('position', geometryAttributes);
    WIRE_GEOMETRY.setIndex(wireIndices);

    /*  Create the solid objects, the front and back of the surface.          */
    frontObject = new three.Mesh(GEOMETRY, FRONT_MATERIAL);
    backObject = new three.Mesh(GEOMETRY, BACK_MATERIAL);

    /*  Create the wireframe object, which consists of line segments.         */
    wireFrame = new three.LineSegments(WIRE_GEOMETRY, WIRE_MATERIAL);

    /*  Create the scene and add the Seifert surface to it.                   */
    scene = new three.Scene();
    scene.add(frontObject);
    scene.add(backObject);
    scene.add(wireFrame);
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the Hopf link Seifert surface.              *
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
