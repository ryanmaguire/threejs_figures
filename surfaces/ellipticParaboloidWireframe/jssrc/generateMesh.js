
function generateMesh(mesh, nxPixels, nyPixels) {

    /*  Parameters for the elliptic paraboloid.                               */
    const start = -1.0;
    const finish = +1.0;
    const length = finish - start;

    /*  Step-sizes for the displacement between samples.                      */
    const dx = length / (nxPixels - 1);
    const dy = length / (nyPixels - 1);

    /*  Shift factor to center the surface on the screen.                     */
    const heightShift = -2.0;

    /*  Variable for indexing over the array being written to.                */
    let index = 0;

    /*  Variables for indexing over the two axes.                             */
    let xIndex, yIndex;

    /*  Loop through the vertical axis. The elliptic paraboloid lies          *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for (yIndex = 0; yIndex < nyPixels; ++yIndex) {

        /*  Convert pixel index to y coordinate.                              */
        const yValue = start + yIndex * dy;

        /*  Loop through the horizontal component of the object.              */
        for (xIndex = 0; xIndex < nxPixels; ++xIndex) {

            /*  Convert pixel index to x coordinate in the plane.             */
            const xValue = start + xIndex * dx;

            /*  The elliptic paraboloid has a simple formula: z = x^2 + 2y^2. *
             *  We shift this slightly to center the surface on the screen.   */
            const zValue = xValue*xValue + 2.0*yValue*yValue + heightShift;

            /*  Add this point to our vertex array.                           */
            mesh[index] = xValue;
            mesh[index + 1] = yValue;
            mesh[index + 2] = zValue;

            /*  Move on to the next point in the mesh. A point needs 3 floats.*/
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generateMesh.                                                      */

export {generateMesh};
