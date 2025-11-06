
function generateIndices(indices, nxPixels, nyPixels) {

    /*  Variables for indexing the horizontal and vertical axes.              */
    let xIndex, yIndex;

    /*  Variable for indexing over the array being written to.                */
    let index = 0;

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for (yIndex = 0; yIndex < nyPixels; ++yIndex) {

        /*  The indices are row-major, meaning index = y * width + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        const shift = yIndex * nxPixels;

        /*  The vertical component is now fixed, loop through the horizontal. */
        for (xIndex = 0; xIndex < nxPixels; ++xIndex) {

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * width + x.                    */
            const index00 = shift + xIndex;

            /*  The point directly after the current point, in the horizontal.*/
            const index01 = index00 + 1;

            /*  The point directly above the current point, in the vertical.  */
            const index10 = index00 + nxPixels;

            /*  If we are not at the top edge or the right edge of the        *
             *  rectangle, we may add an "L" shape to our mesh connecting the *
             *  bottom left point to the bottom right point, and the bottom   *
             *  left point to to the upper left point. At the top of the      *
             *  rectangle the upper left point goes beyond the bounds of the  *
             *  parametrization, so we do not need to draw it. Check for this.*/
            if (yIndex != nyPixels - 1) {
                indices[index] = index00;
                indices[index + 1] = index10;
                index += 2;
            }

            /*  Similarly, at the right edge we have that the bottom right    *
             *  point lies outside of the parametrizion and do not need to    *
             *  add it to our mesh. Check for this.                           */
            if (xIndex != nxPixels - 1) {
                indices[index] = index00;
                indices[index + 1] = index01;
                index += 2;
            }
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generateIndices.                                                   */

export {generateIndices};
