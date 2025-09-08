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
 *      Renders a hyperbolic paraboloid, z = x^2 - y^2, using a rainbow       *
 *      color map the colors a point based on its height.                     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       September 8, 2025                                             *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer;

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
/*  onWindowResize.                                                           */

/******************************************************************************
 *  Function:                                                                 *
 *      createDirectionalLight                                                *
 *  Purpose:                                                                  *
 *      Adds a directional light to the scene.                                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createDirectionalLight() {

    /*  Color for the directional light, plain white.                         */
    const WHITE = 0xFFFFFF;

    /*  Brightness, or strength, of the light.                                */
    const INTENSITY = 3.0;

    /*  Create the directional light and set the position.                    */
    const DIRECTIONAL_LIGHT = new three.DirectionalLight(WHITE, INTENSITY);
    DIRECTIONAL_LIGHT.position.set(0.0, 0.0, 3.0);

    /*  Add this light to the (global) scene.                                 */
    scene.add(DIRECTIONAL_LIGHT);
}
/*  End of createDirectionalLight.                                            */

/******************************************************************************
 *  Function:                                                                 *
 *      createAmbientLight                                                    *
 *  Purpose:                                                                  *
 *      Creates an ambient light for the entire scene.                        *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createAmbientLight() {

    /*  Color for the ambient light, plain white.                             */
    const WHITE = 0xFFFFFF;

    /*  Brightness, or strength, of the light.                                */
    const INTENSITY = 5.0;

    /*  Create the ambient light and add it to the (global) scene.            */
    const AMBIENT_LIGHT = new three.AmbientLight(WHITE, INTENSITY);
    scene.add(AMBIENT_LIGHT);
}
/*  End of createAmbientLight.                                                */

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Renders the scene.                                                    *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {

    /*  Render the scene. The only change that may occur is if the user       *
     *  interacts by dragging the camera with their mouse. Otherwise, the     *
     *  image is static.                                                      */
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
    const CONTROLS = new OrbitControls(camera, renderer.domElement);
    CONTROLS.target.set(0.0, 0.0, 0.0);
    CONTROLS.update();
}
/*  End of createControls.                                                    */

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
/*  End of setupRenderer.                                                     */

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
    const CAMERA_X = +3.0;
    const CAMERA_Y = +4.0;
    const CAMERA_Z = +2.0;

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
/*  End of setupCamera.                                                       */

/******************************************************************************
 *  Function:                                                                 *
 *      rainbowColorMap                                                       *
 *  Purpose:                                                                  *
 *      Creates a color map parameterized by a real number between 0 and 1.   *
 *  Arguments:                                                                *
 *      value (float):                                                        *
 *          The parameter for the color, a real number between 0 and 1.       *
 *  Output:                                                                   *
 *      color (three.Color):                                                  *
 *          The color corresponding to the input value.                       *
 ******************************************************************************/
function rainbowColorMap(value) {

    /*  Create a temporary color. It starts as black, but we will set its     *
     *  real value using the input parameter.                                 */
    const COLOR = new three.Color(0x000000);

    /*  The color map is a rainbow that varies from blue to red. The value    *
     *  zero corresponds to red, and one corresponds to blue. We can do this  *
     *  using a simple affine equation for the hue.                           */
    const HUE = 0.7 * (1.0 - value);

    /*  The saturation and value channel are held constant.                   */
    const SATURATION = 1.0;
    const VALUE = 0.5;

    /*  Reset the color and return.                                           */
    COLOR.setHSL(HUE, SATURATION, VALUE);
    return COLOR;
}
/*  End of rainbowColorMap.                                                   */

/******************************************************************************
 *  Function:                                                                 *
 *      addColorMapToGeometry                                                 *
 *  Purpose:                                                                  *
 *      Adds a color map to a three.js geometry.                              *
 *  Arguments:                                                                *
 *      geometry (three.BufferGeometry):                                      *
 *          The geometry we are adding the color map to.                      *
 *      colorMap (function: float -> three.Color):                            *
 *          The color map that maps the interval [0, 1] to three.js colors.   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 *  Notes:                                                                    *
 *      The color of each vertex v is determined by colorMap(t) where t is    *
 *      obtained by normalizing the z-coordinate difference between v and     *
 *      the lowest z-coordinate in the geometry.                              *
 *                                                                            *
 *      Note that the vertex colors will ultimately be interpolated           *
 *      barycentrically. Consequently, the triangulation of the geometry      *
 *      could have a large effect on the rendering.                           *
 ******************************************************************************/
function addColorMapToGeometry(geometry, colorMap) {

    /*  The position array consists of triples of numbers which correspond to *
     *  the x, y, and z coordinates for the points in the geometry. The total *
     *  number of points is the total elements in the array divided by 3.     */
    const NUMBER_OF_POINTS = geometry.attributes.position.array.length / 3;

    /*  Variables for the minimum and maximum z-values for the geometry, and  *
     *  difference between these two values.                                  */
    let zMin, zMax, zRange, zFactor;

    /*  Variable for looping through the position array.                      */
    let index;

    /*  Empty array for the colors. We'll loop through and generate the color *
     *  array based on the height of a given vertex.                          */
    let colorArray = [];

    /*  The color array needs to be typed using 32-bit floats. We'll cast the *
     *  color array to 32-bit floats after we create it. We'll also need a    *
     *  buffer attribute for the color array.                                 */
    let f32Colors, colorAttributes;

    /*  The color map is based on the height, the value of a given vertex in  *
     *  the z axis. Compute the bounds for the given geometry.                */
    geometry.computeBoundingBox();

    /*  We only need the extremes for the z component. Compute this.          */
    zMin = geometry.boundingBox.min.z;
    zMax = geometry.boundingBox.max.z;

    /*  The value for the color is given by (z - zMin) / (zMax - zMin). This  *
     *  makes the color value vary between 0 and 1. Pre-compute this scale    *
     *  factor, 1 / (zMax - zMin).                                            */
    zRange = zMax - zMin;
    zFactor = 1.0 / zRange

    /*  Loop through the points in the position array.                        */
    for (index = 0; index < NUMBER_OF_POINTS; ++index) {

        /*  There are three real numbers to a given point which correspond to *
         *  the x, y, and z components of the point. 3 * n is thus the array  *
         *  index for the x coordinate of the nth point, meaning 3 * n + 2 is *
         *  the index for the nth z coordinate. Collect this value.           */
        const Z_IND = 3 * index + 2;
        const Z = geometry.attributes.position.array[Z_IND];

        /*  Compute the current value for the color map, given by the height. */
        const VALUE = (Z  - zMin) * zFactor;

        /*  Compute the color corresponding to this height.                   */
        const COLOR = colorMap(VALUE);

        /*  The color array stores values in RGB format. Add these values.    */
        colorArray.push(COLOR.r);
        colorArray.push(COLOR.g);
        colorArray.push(COLOR.b);
    }

    /*  Create a typed array from the current color array, and create the     *
     *  buffer attribute that we can set in the geometry object.              */
    f32Colors = new Float32Array(colorArray);
    colorAttributes = new three.BufferAttribute(f32Colors, 3, true);

    /*  Finally, attach these colors to the geometry.                         */
    geometry.setAttribute('color', colorAttributes);
}
/*  End of addColorMapToGeometry.                                             */

/******************************************************************************
 *  Function:                                                                 *
 *      addLabel                                                              *
 *  Purpose:                                                                  *
 *      Adds a label to the animation.                                        *
 *  Arguments:                                                                *
 *      text (string):                                                        *
 *          The text that is to be added to the image.                        *
 *      xValue (float):                                                       *
 *          The x-coordinate for the text.                                    *
 *      yValue (float):                                                       *
 *          The y-coordinate for the text.                                    *
 *      zValue (float):                                                       *
 *          The z-coordinate for the text.                                    *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
function addLabel(text, xValue, yValue, zValue) {

    /*  Font size for the text to be rendered.                                */
    const TEXT_SIZE = 1.0;

    /*  Text color, with the CSS context style included.                      */
    const BLACK = new three.Color(0x000000);
    const COLOR = BLACK.getStyle();

    /*  The text is drawn using the canvas for the HTML page.                 */
    const CANVAS = document.createElement('canvas');

    /*  Variables for the texture / object that is rendered as text.          */
    let materialParameters, material, sprite, context, texture;

    /*  Set the size of the canvas. Increased this value makes the text       *
     *  smaller, but also clearer. Small values produce large blurry text.    */
    CANVAS.width = 1024;
    CANVAS.height = 1024;

    /*  Set up the parameters for the text (font, color, alignment, etc.).    */
    context = CANVAS.getContext('2d');
    context.font = 'italic 64px Georgia';
    context.fillStyle = COLOR;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, CANVAS.width / 2, CANVAS.height / 2);

    /*  Create the texture that the text will be drawn on to.                 */
    texture = new three.Texture(CANVAS);

    /*  Create the material for the texture.                                  */
    materialParameters = {map: texture};
    material = new three.SpriteMaterial(materialParameters);

    /*  Finally, create the object with the text on it.                       */
    sprite = new three.Sprite(material);
    sprite.position.set(xValue, yValue, zValue);
    sprite.scale.set(TEXT_SIZE, TEXT_SIZE, TEXT_SIZE);

    /*  Add the text to the scene for rendering.                              */
    texture.needsUpdate = true;
    scene.add(sprite);
}
/*  End of addLabel.                                                          */

/******************************************************************************
 *  Function:                                                                 *
 *      createAxes                                                            *
 *  Purpose:                                                                  *
 *      Creates the coordinate axes and labels them.                          *
 *  Arguments:                                                                *
 *      dir (three.Vector3):                                                  *
 *          The vector for the arrow. The base is the origin.                 *
 *  Output:                                                                   *
 *      arrow (three.Group):                                                  *
 *          The arrow, which consists of the shaft and the arrow head.        *
 ******************************************************************************/
function thickArrow(dir) {

    /*  The arrow consists of two parts, the arrow shaft and the arrow head.  *
     *  We group these together using a three.js Group.                       */
    const ARROW = new three.Group();

    /*  Thickness for the shaft of the arrow.                                 */
    const THICKNESS = 0.003;

    /*  Radius for the base of the cone that makes up the arrow head.         */
    const RADIUS = 4.0 * THICKNESS;

    /*  The number of radial segments for the cylinder that makes up the      *
     *  shaft of the arrow, as well as the number of segments that are used   *
     *  to produce the cone for the arrow head.                               */
    const SEGMENTS = 8;

    /*  The arrows are black and do not interact with lights or reflections.  */
    const BLACK = 0x000000;
    const MATERIAL_PARAMETERS = {color: BLACK};
    const MATERIAL = new three.MeshBasicMaterial(MATERIAL_PARAMETERS);

    /*  Lengths parametrizing both the arrow shaft and arrow head.            */
    const LENGTH = dir.length();
    const HEAD_HEIGHT = LENGTH * 0.05;
    const SHAFT_HEIGHT = LENGTH - HEAD_HEIGHT;

    /*  Compute the geometries for both the arrow shaft and arrow head.       */
    const SHAFT_GEOMETRY = new three.CylinderGeometry(
        THICKNESS, THICKNESS, SHAFT_HEIGHT, SEGMENTS
    );

    const HEAD_GEOMETRY = new three.CylinderGeometry(
        0.0, RADIUS, HEAD_HEIGHT, SEGMENTS
    );

    /*  Create the arrow, which consists of a cylinder and a cone.            */
    const SHAFT = new three.Mesh(SHAFT_GEOMETRY, MATERIAL);
    const HEAD = new three.Mesh(HEAD_GEOMETRY, MATERIAL);

    /*  We used the CylinderGeometry class to create a cone and a cylinder    *
     *  at the origin, and now we need to rotate and translate this so that   *
     *  it is pointing along the input direction.                             */
    SHAFT.lookAt(dir);
    SHAFT.rotateX(0.5 * Math.PI);
    SHAFT.translateY(0.5 * SHAFT_HEIGHT);

    HEAD.lookAt(dir);
    HEAD.rotateX(0.5 * Math.PI);
    HEAD.translateY(LENGTH - 0.5 * HEAD_HEIGHT);

    /*  Add the two pieces to the arrow and return.                           */
    ARROW.add(HEAD);
    ARROW.add(SHAFT);
    return ARROW;
}
/*  End of thickArrow.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      createAxes                                                            *
 *  Purpose:                                                                  *
 *      Creates the coordinate axes and labels them.                          *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function createAxes() {

    /*  The ends for the arrows in each axis. The base is the origin.         */
    const ARROW_POS = 1.25;

    /*  The location of the axis labels.                                      */
    const LABEL_POS = 1.3;

    /*  Create the position vectors for the ends of each arrow.               */
    const X_AXIS = new three.Vector3(ARROW_POS, 0.0, 0.0);
    const Y_AXIS = new three.Vector3(0.0, ARROW_POS, 0.0);
    const Z_AXIS = new three.Vector3(0.0, 0.0, ARROW_POS);

    /*  Add the three coordinates axes.                                       */
    scene.add(thickArrow(X_AXIS));
    scene.add(thickArrow(Y_AXIS));
    scene.add(thickArrow(Z_AXIS));

    /*  Give the axes labels.                                                 */
    addLabel('x', LABEL_POS, 0.0, 0.0);
    addLabel('y', 0.0, LABEL_POS, 0.0);
    addLabel('z', 0.0, 0.0, LABEL_POS);
}
/*  End of createAxes.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene, which is a rainbow hyperbolic paraboloid with a    *
 *      wireframe mesh and a white background.                                *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  three.js has parametric function tools, but this renders the          *
     *  with diagonals across the constituents squares, creating a mesh of    *
     *  triangles. To see a square pattern, we'll need to make our own buffer.*/
    const GEOMETRY = new three.BufferGeometry();
    const WIRE_GEOMETRY = new three.BufferGeometry();

    /*  The vertices for the object will by typed as 32-bit floats. We'll     *
     *  need a variable for the buffer attributes as well.                    */
    let f32Vertices, geometryAttributes;

    /*  Parameters for the wireframe. It is rendered black.                   */
    const WIRE_PARAMETERS = {color: 0x000000};

    /*  Parameters for the surface.                                           */
    const MATERIAL_PARAMETERS = {
        side: three.DoubleSide,
        shininess: 100,

        /*  Enable vertex coloring to produce the rainbow color map.          */
        vertexColors: true,

        /*  The wireframe renders poorly without enabling polygon offset, and *
         *  setting the polygon offset factor. Do not set this factor too     *
         *  high since this makes the surface look semi-transparent.          */
        polygonOffset: true,
        polygonOffsetFactor: 3
    };

    /*  Material the surface and the wireframe will be made out of.           */
    const SURFACE_MATERIAL = new three.MeshPhongMaterial(MATERIAL_PARAMETERS);
    const WIRE_MATERIAL = new three.LineBasicMaterial(WIRE_PARAMETERS);

    /*  Parameters for the hyperbolic paraboloid.                             */
    const START = -1.0;
    const FINISH = 1.0;
    const LENGTH = FINISH - START;

    /*  The number of samples in the x and y axes, respectively.              */
    const WIDTH = 48;
    const HEIGHT = 48;

    /*  Displacement step sizes for the x and y axes, respectively.           */
    const DX = LENGTH / (WIDTH - 1);
    const DY = LENGTH / (HEIGHT - 1);

    /*  Vertices for the mesh used to draw the hyperbolic paraboloid.         */
    let vertices = [];

    /*  Indices corresponding to the triangles that are used to render the    *
     *  hyperbolic paraboloid.                                                */
    let indices = [];

    /*  Indices corresponding the the line segments that make the wireframe.  */
    let wireIndices = [];

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Lastly, variables for the objects that are added to the global scene. */
    let object, wireframe;

    /*  Loop through the vertical axis. The hyperbolic paraboloid lies        *
     *  above the xy plane, meaning it is of the form z = f(x, y).            */
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
            vertices.push(X, Y, Z);
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

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
     *  squares for points that fall on the bounding edges.                   */
    for (yIndex = 0; yIndex < HEIGHT - 1; ++yIndex) {

        /*  We operate in row-major fashion, so the starting index for        *
         *  this row is the current vertical index times the width.           */
        const SHIFT = yIndex * WIDTH;

        /*  The vertical component is now fixed, loop through the horizontal. */
        for (xIndex = 0; xIndex < WIDTH - 1; ++xIndex) {

            /*  The current index is the shift plus the horizontal index.     *
             *  That is, the index for (x, y) is y * WIDTH + x.               */
            const INDEX00 = SHIFT + xIndex;

            /*  The point directly after the current point, in the horizontal.*/
            const INDEX01 = INDEX00 + 1;

            /*  The point next to the current point, in the vertical.         */
            const INDEX10 = INDEX00 + WIDTH;

            /*  Lastly, the point above and to the right.                     */
            const INDEX11 = INDEX10 + 1;

            /*  Add the constituent triangles that make up the current square.*/
            indices.push(INDEX00, INDEX01, INDEX10, INDEX10, INDEX01, INDEX11);

            /*  Add the vertices for the wireframe. We create an "L" shape.   */
            wireIndices.push(INDEX00, INDEX01, INDEX00, INDEX10);

            /*  At the upper edge of the surface we need to add the boundary. */
            if (yIndex == HEIGHT - 2)
                wireIndices.push(INDEX10, INDEX11);

            /*  A similar statement is true for the right edge.               */
            if (xIndex == WIDTH - 2)
                wireIndices.push(INDEX01, INDEX11);
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */

    /*  Add the vertices and index array to the mesh.                         */
    GEOMETRY.setAttribute('position', geometryAttributes);
    GEOMETRY.setIndex(indices);

    /*  Color the surface using the rainbow color map.                        */
    addColorMapToGeometry(GEOMETRY, rainbowColorMap);

    /*  Similarly, create the wireframe geometry.                             */
    WIRE_GEOMETRY.setAttribute('position', geometryAttributes);
    WIRE_GEOMETRY.setIndex(wireIndices);

    /*  Create the mesh and wireframe from the geometries and materials.      */
    object = new three.Mesh(GEOMETRY, SURFACE_MATERIAL);
    wireframe = new three.LineSegments(WIRE_GEOMETRY, WIRE_MATERIAL);

    /*  Create the scene and add the hyperbolic paraboloid to it.             */
    scene = new three.Scene();
    scene.add(object);
    scene.add(wireframe);

    /*  Lastly, make the background white.                                    */
    scene.background = new three.Color(0xFFFFFF);
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
    createAxes();
    createDirectionalLight();
    createAmbientLight();

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
