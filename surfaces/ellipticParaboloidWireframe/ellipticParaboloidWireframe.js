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

import Stats from "three/addons/libs/stats.module.js";

/* JavaScript module using WebAssembly compiled from C code using emscripten. */
import createModule from "jstools";

import * as jscommon from "jscommon";

/* Create the module so we may access the C functions.                        */
const module = await createModule();

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

    const parameters = {
        nxPts: 64,
        nyPts: 64,
        width: 2.0,
        height: 2.0,
        xStart: -1.0,
        yStart: -1.0,
        meshType: 0
    };

    /*  The angle of rotation between frames.                                 */
    const rotationAngle = 0.005;

    const cameraPosition = {x: 0.0, y: -5.0, z: +6.0};

    /*  The total number of vertices in the mesh.                             */
    const numberOfPoints = parameters.nxPts * parameters.nyPts;

    /*  Initialize the globals for the animation. This includes the renderer, *
     *  camera, objects, and scene.                                           */
    const lightBlue = {color: 0x00AAFF};
    const memory = module.memory;
    const geometry = module.squareWireframeGeometry(parameters, memory);

    const camera = jscommon.sceneCamera(window, cameraPosition);
    const renderer = jscommon.sceneRenderer(window);
    const surface = jscommon.basicWireframe(geometry, lightBlue);
    const scene = jscommon.sceneFromSurface(surface);
    const stats = new Stats();

    function animation() {
        module.zRotateAnimation(
            renderer, scene, camera, surface, memory, numberOfPoints
        );

        stats.update();
    }

    function onWindowResize () {
        jscommon.windowResize(camera, renderer, window);
    }

    renderer.setAnimationLoop(animation);

    /*  Make the animation interactive. The user can click and drag the       *
     *  drawing around using their mouse.                                     */
    jscommon.setupControls(renderer, camera);

    module.setRotationAngle(rotationAngle);

    /*  Attach the drawing to the actual page.                                */
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(stats.dom);

    /*  When the window is resized, update the necessary parameters.          */
    window.addEventListener('resize', onWindowResize);
}
/*  End of init.                                                              */

/*  Create the animation.                                                     */
init();
