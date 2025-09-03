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
 *      Draws the electric field for a octupole.                              *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       September 3, 2025                                             *
 ******************************************************************************/

/*  three.js has all of the tools for generating 3D animations.               */
import * as three from 'three';

/*  OrbitControls allows the user to control the animation using the mouse.   */
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/*  Globals for the animation.                                                */
let camera, scene, renderer;

/*  Parameters for the sphere: radius and the number of subdivisions.         */
const RADIUS = 1.0;
const AZIMUTH = 32;
const ZENITH = 32;

/*  Square of the radius of a sphere. Used for checking if a point is inside. */
const RADIUS_SQUARE = RADIUS * RADIUS;

/*  Position vectors for the eight charges.                                   */
const P0 = new three.Vector3(-2.0 * RADIUS, -2.0 * RADIUS, -2.0 * RADIUS);
const P1 = new three.Vector3(+2.0 * RADIUS, -2.0 * RADIUS, -2.0 * RADIUS);
const P2 = new three.Vector3(+2.0 * RADIUS, +2.0 * RADIUS, -2.0 * RADIUS);
const P3 = new three.Vector3(-2.0 * RADIUS, +2.0 * RADIUS, -2.0 * RADIUS);
const P4 = new three.Vector3(-2.0 * RADIUS, +2.0 * RADIUS, +2.0 * RADIUS);
const P5 = new three.Vector3(+2.0 * RADIUS, +2.0 * RADIUS, +2.0 * RADIUS);
const P6 = new three.Vector3(+2.0 * RADIUS, -2.0 * RADIUS, +2.0 * RADIUS);
const P7 = new three.Vector3(-2.0 * RADIUS, -2.0 * RADIUS, +2.0 * RADIUS);

/*  An array for all of the points. This makes looping over things easier.    */
const POINTS = [P0, P1, P2, P3, P4, P5, P6, P7];

/*  Array for the magnitudes of the eight charges.                            */
const CHARGES = [+1.0, -1.0, +1.0, -1.0, +1.0, -1.0, +1.0, -1.0];

/*  Parameters for the arrows representing the vector field. The total number *
 *  of arrows is the product of the three bin sizes, so roughly O(N^3). Do    *
 *  not make these numbers too big, this will slow the animation to a crawl.  */
const X_BINS = 12;
const Y_BINS = 12;
const Z_BINS = 12;

/*  The total size of the figure. We draw everything inside of a cube.        */
const LENGTH = 8.0 * RADIUS;

/*  Displacements between successive arrows that are to be drawn.             */
const DX = LENGTH / (X_BINS - 1);
const DY = LENGTH / (Y_BINS - 1);
const DZ = LENGTH / (Z_BINS - 1);

/******************************************************************************
 *  Function:                                                                 *
 *      isInSphere                                                            *
 *  Purpose:                                                                  *
 *      Determines if a point is inside one of the eight spheres.             *
 *  Arguments:                                                                *
 *      position (three.Vector3):                                             *
 *          The position vector for a point in 3D space.                      *
 *  Output:                                                                   *
 *      inSphere (Boolean):                                                   *
 *          Boolean indicated whether or not the point lies inside a sphere.  *
 ******************************************************************************/
function isInSphere(position) {

    /*  Index for looping over all of the elements of the POINTS array.       */
    let index;

    /*  Check each sphere and determine if the point lies inside one.         */
    for (index = 0; index < POINTS.length; ++index)
    {
        /*  Compute the relative position vector from the point to the center *
         *  of the current sphere.                                            */
        const X_DIST = position.x - POINTS[index].x;
        const Y_DIST = position.y - POINTS[index].y;
        const Z_DIST = position.z - POINTS[index].z;

        /*  The the magnitude of this relative position vector is smaller     *
         *  than the radius of the sphere, then the point lies inside. Check. */
        const DIST_SQUARED = X_DIST*X_DIST + Y_DIST*Y_DIST + Z_DIST*Z_DIST;

        /*  We have pre-computed the square of the radius of the sphere, so   *
         *  can save a call to the sqrt function. Compare the square of the   *
         *  distance with the square of the radius.                           */
        if (DIST_SQUARED < RADIUS_SQUARE)
            return true;
    }

    /*  The point lies outside each sphere. Return false.                     */
    return false;
}
/*  End of isInSphere.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      coulombField                                                          *
 *  Purpose:                                                                  *
 *      Computes the Coulomb electric field for the given charge distribution.*
 *  Arguments:                                                                *
 *      position (three.Vector3):                                             *
 *          The position vector for a point in 3D space.                      *
 *  Output:                                                                   *
 *      field (three.Vector3):                                                *
 *          The electric field vector at the given point.                     *
 ******************************************************************************/
function coulombField(position) {

    /*  Scalar quantities for the components of the electric field.           */
    let ex, ey, ez;

    /*  Index for looping over the elements of the POINTS array.              */
    let index;

    /*  Initialize the electric field to zero. We sum over the contribution   *
     *  from each charge using the principle of superposition.                */
    ex = 0.0;
    ey = 0.0;
    ez = 0.0;

    /*  Loop through each charge and add its contribution to the field.       */
    for (index = 0; index < POINTS.length; ++index)
    {
        /*  Coulomb's law says the electric field E produced by a charge q is *
         *                                                                    *
         *                q                                                   *
         *      E = k --------- R                                             *
         *            || R ||^3                                               *
         *                                                                    *
         *                q        R                                          *
         *        = k --------- -------                                       *
         *            || R ||^2 || R ||                                       *
         *                                                                    *
         *  where k is a constant (the Coulomb constant) and R is the         *
         *  relative position vector of the point charge q with respect to    *
         *  the given point in space.                                         *
         *                                                                    *
         *  By the principle of superposition, the net electric field is the  *
         *  sum of the electric fields produced by the individual charges.    *
         *                                                                    *
         *  Start by computing the components of R.                           */
        const X_DIST = position.x - POINTS[index].x;
        const Y_DIST = position.y - POINTS[index].y;
        const Z_DIST = position.z - POINTS[index].z;

        /*  Compute 1 / || R || and 1 / || R ||^2.                            */
        const DIST_SQUARED = X_DIST*X_DIST + Y_DIST*Y_DIST + Z_DIST*Z_DIST;
        const RCPR_DIST_SQUARED = 1.0 / DIST_SQUARED;
        const RCPR_DIST = Math.sqrt(RCPR_DIST_SQUARED);

        /*  The scale factor is k * q / || R ||^3. We set k = 1 for           *
         *  simplicity (we have not specified the units here). Compute.       */
        const FACTOR = CHARGES[index] * RCPR_DIST_SQUARED * RCPR_DIST;

        /*  Add this contribution to the electric field.                      */
        ex += FACTOR * X_DIST;
        ey += FACTOR * Y_DIST;
        ez += FACTOR * Z_DIST;
    }

    /*  Return the output as a vector.                                        */
    return new three.Vector3(ex, ey, ez);
}
/*  End of coulombField.                                                      */

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
    CONTROLS.target.set(0, 0, 0);
    CONTROLS.update();
}

/******************************************************************************
 *  Function:                                                                 *
 *      animate                                                               *
 *  Purpose:                                                                  *
 *      Animates the figure.                                                  *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function animate() {
    renderer.render(scene, camera);
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
    const CAMERA_X = 1.45 * LENGTH;
    const CAMERA_Y = 0.55 * LENGTH;
    const CAMERA_Z = 0.65 * LENGTH;

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
 *      setupArrows                                                           *
 *  Purpose:                                                                  *
 *      Create the arrows for the vector field.                               *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupArrows() {

    /*  Indices for the three axes.                                           */
    let xInd, yInd, zInd;

    /*  Loop through the horizontal axis.                                     */
    for (xInd = 0; xInd <= X_BINS; ++xInd)
    {
        /*  Convert x index to the x coordinate in 3D space.                  */
        const X = -0.5 * LENGTH + xInd * DX;

        /*  Loop through the vertical axis.                                   */
        for (yInd = 0; yInd <= Y_BINS; ++yInd)
        {
            /*  Convert y index to the y coordinate in 3D space.              */
            const Y = -0.5 * LENGTH + yInd * DY;

            /*  Lastly, loop through the depth axis.                          */
            for (zInd = 0; zInd <= Z_BINS; ++zInd)
            {
                /*  Convert y index to the y coordinate in 3D space.          */
                const Z = -0.5 * LENGTH + zInd * DZ;

                /*  The current arrow is anchored at (x, y, z).               */
                const POS = new three.Vector3(X, Y, Z);

                /*  Variables for the electric field, scale factor for the    *
                 *  arrow length, the arrow itself, and the direction of the  *
                 *  arrow. We'll create these if the current point is not     *
                 *  inside one of the spheres representing the charges.       */
                let field, scale, arrow, dir;

                /*  Parameters for drawing the arrow.                         */
                let headLength, headWidth;

                /*  If the point lies inside a sphere, we can skip it.        */
                if (isInSphere(POS))
                    continue;

                /*  Compute the electric field at the current point.          */
                field = coulombField(POS);

                /*  The arrow length is given by half the magnitude of the    *
                 *  electric field at this point. The reason for the 'half'   *
                 *  is to make the image a little less busy and prevent       *
                 *  arrows from overlapping.                                  */
                scale = 0.5 * field.length();

                /*  The direction of the arrow is precisely the direction of  *
                 *  the electric field at this point.                         */
                dir = field.normalize();

                /*  Set the parameters for the tip of the arrow.              */
                headLength = 0.25 * scale;
                headWidth = 0.125 * scale;

                /*  Create the arrow and add it to the scene.                 */
                arrow = new three.ArrowHelper(
                    dir, POS, scale, 0xFFFFFF, headLength, headWidth
                );

                scene.add(arrow);
            }
            /*  End of z-axis for-loop.                                       */
        }
        /*  End of y-axis for-loop.                                           */
    }
    /*  End of x-axis for-loop.                                               */
}
/*  End of setupArrows.                                                       */

/******************************************************************************
 *  Function:                                                                 *
 *      setupScene                                                            *
 *  Purpose:                                                                  *
 *      Creates the scene with the charge distribution.                       *
 *  Arguments:                                                                *
 *      None.                                                                 *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
function setupScene() {

    /*  RGB values for blue and red objects, representing positive and        *
     *  negative charges, respectively.                                       */
    const BLUE = {color: 0x00AAFF};
    const RED = {color: 0xFF0000};

    /*  Materials used for positive and negative charges, respectively.       */
    const BLUE_MATERIAL = new three.MeshBasicMaterial(BLUE);
    const RED_MATERIAL = new three.MeshBasicMaterial(RED);

    /*  Index for varying over all of the point charges.                      */
    let index;

    /*  Initialize the scene so that we can begin adding objects to it.       */
    scene = new three.Scene();

    /*  Loop through each point charge and add a small sphere.                */
    for (index = 0; index < POINTS.length; ++index)
    {
        /*  Create a sphere. We'll reset the location later.                  */
        const GEOMETRY = new three.SphereGeometry(RADIUS, AZIMUTH, ZENITH);

        /*  Extract the location of the current point charge.                 */
        const X = POINTS[index].x;
        const Y = POINTS[index].y;
        const Z = POINTS[index].z;

        /*  Object for the charge. The color depends on the sign of it.       */
        let object;

        /*  Positive charges are blue, negative charges are red.              */
        if (CHARGES[index] > 0.0)
            object = new three.Mesh(GEOMETRY, BLUE_MATERIAL);
        else
            object = new three.Mesh(GEOMETRY, RED_MATERIAL);

        /*  Move the sphere to the location of the point charge and add it.   */
        object.position.set(X, Y, Z);
        scene.add(object);
    }
}
/*  End of setupScene.                                                        */

/******************************************************************************
 *  Function:                                                                 *
 *      init                                                                  *
 *  Purpose:                                                                  *
 *      Creates the animation for the octupole vector field.                  *
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
    setupArrows();

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
