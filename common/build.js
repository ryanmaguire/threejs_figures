/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is part of threejs_figures.                                     *
 *                                                                            *
 *  threejs_figures is free software: you can redistribute it and/or modify   *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  threejs_figures is distributed in the hope that it will be useful,        *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with threejs_figures.  If not, see <https://www.gnu.org/licenses/>. *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Creates the dist directory with the min.js files for C, Go, and rust. *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       December 2, 2025                                              *
 ******************************************************************************/

/*  Used for creating the min.js files.                                       */
const esbuild = require("esbuild");

/*  Location of the C glue code, and the name of the C module.                */
const cSrc = "./csrc/jstools/index.js";
const cOut = "./dist/rjmthreetools.c.min.js";

/*  Location of the Go glue code, and the name of the Go module.              */
const goSrc = "./gosrc/jstools/index.js";
const goOut = "./dist/rjmthreetools.go.min.js";

/*  Location of the rust glue code, and the name of the rust module.          */
const rustSrc = "./rustsrc/jstools/index.js";
const rustOut = "./dist/rjmthreetools.rust.min.js";

/*  Function for creating the min.js file for a given language.               */
function build(wasmSource, output) {

    /*  Setup parameters for esbuild.                                         */
    const buildParameters = {

        /*  Each language uses the same jscommon code.                        */
        entryPoints: ["jscommon/index.js"],

        /*  Package the ES module together.                                   */
        bundle: true,

        /*  Shrink the file as much as possible.                              */
        minify: true,

        /*  Location of the generated min.js file, in the dist directory.     */
        outfile: output,

        /*  Output is an ES module.                                           */
        format: "esm",

        /*  The "main" module is provided by the individual animations. It is *
         *  external and not part of the "common" directory.                  */
        external: ["main"],

        /*  The location of "wasmtools" is dependent on the selected language.*/
        alias: {
            wasmtools: wasmSource
        }
    };

    /*  Generate the min.js file.                                             */
    esbuild.build(buildParameters).catch(() => process.exit(1));
}
/*  End of build.                                                             */

/*  Create the C, Go, and rust modules.                                       */
build(cSrc, cOut);
// build(goSrc, goOut);
// build(rustSrc, rustOut);
