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
 *      Renders a hyperbolic paraboloid, z = x^2 - y^2, using a PNG           *
 *      texture to draw the wireframe.                                        *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       September 8, 2025                                             *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Lastly, we can plot z = x^2 - y^2 using the parametric plotting tools.    */
import {
    ParametricGeometry
} from 'three/addons/geometries/ParametricGeometry.js';

/*  Globals for the animation.                                                */
let camera, controls, scene, renderer;

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
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.0, 0.0, 0.0);
    controls.update();
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
 *      hyperbolicParaboloid                                                  *
 *  Purpose:                                                                  *
 *      Parametrizes the hyperbolic paraboloid, z = x^2 - y^2.                *
 *  Arguments:                                                                *
 *      u (float):                                                            *
 *          The horizontal component in the uv plane. x = 2 (u - 1/2).        *
 *      v (float):                                                            *
 *          The vertical component in the uv plane. y = 2 (v - 1/2).          *
 *      target (three.Vector3):                                               *
 *          Parameter for the ParametricGeometry used for drawing.            *
 *  Output:                                                                   *
 *      point (three.Vector3):                                                *
 *          The point (x, y, x^2 - y^2) on the hyperbolic paraboloid.         *
 ******************************************************************************/
function hyperbolicParaboloid(u, v, target) {

    /*  The uv plane maps to the xy plane via f(u, v) = 2 (u - 1/2, v - 1/2). */
    const X = 2.0 * (u - 0.5);
    const Y = 2.0 * (v - 0.5);

    /*  The hyperbolic paraboloid is given by z = x^2 - y^2.                  */
    const Z = X*X - Y*Y;

    /*  Return the point that lies on the surface, (x, y, z).                 */
    target.set(X, Y, Z);
    return new three.Vector3(X, Y, Z);
}
/*  End of hyperbolicParaboloid.                                              */

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

    /*  Loader used for adding the PNG texture to the mesh.                   */
    const LOADER = new three.TextureLoader()

    /*  Description of the PNG, this creates a wireframe pattern.             */
    const PNG =
        "data:\
            image/png;\
            base64,\
            iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+\
            aJAAAAVElEQVRo3u3RAREAMAwCMTr/\
            nlsd3PIKyJGUN0l2t3X9zGt/\
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
            DgB0B9B1PXA3yVG5HyAAAAAElFTkSuQmCC";

    /*  Number of samples in the x and y axes for the surface.                */
    const WIDTH = 32;
    const HEIGHT = 32;

    /*  Material for the surface, the hyperbolic paraboloid.                  */
    const MATERIAL_PARAMETERS = {
        side: three.DoubleSide,
        color: 0x00AAFF,
        transparent: 0,
        opacity: 1,
        shininess: 20
    };

    const MATERIAL = new three.MeshPhongMaterial(MATERIAL_PARAMETERS);

    /*  Create the surface from its parametrization and make a mesh from it.  */
    const SADDLE = new ParametricGeometry(hyperbolicParaboloid, WIDTH, HEIGHT);
    const SURFACE = new three.Mesh(SADDLE, MATERIAL);

    /*  Function called by the LOADER for adding the texture to the material  *
     *  the hyperbolic paraboloid is made out of.                             */
    const MATERIAL_TEXTURE = function(texture) {

        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.RepeatWrapping;
        texture.repeat.set(WIDTH, HEIGHT);

        MATERIAL.map = texture;
        MATERIAL.needsUpdate = true;

        requestAnimationFrame(animate);
    }

    /*  Add the PNG and texture function to the loader, which in turn adds    *
     *  the wireframe to the mesh.                                            */
    LOADER.load(PNG, MATERIAL_TEXTURE);

    /*  Create the scene with a white background and add the surface.         */
    scene = new three.Scene();
    scene.background = new three.Color(0xFFFFFF);
    scene.add(SURFACE);
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
    createControls();
    setupScene();
    createAxes();

    /*  Add lights to the animation.                                          */
    createDirectionalLight();
    createAmbientLight();

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);
}

/*  Create the animation.                                                     */
init();
