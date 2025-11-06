import {cosAngle, sinAngle} from './setRotationAngle.js';

function rotateMesh(arr, nPts) {

    /*  Variable for indexing over the elements of the mesh.                  */
    let index;

    /*  Loop through each point in the mesh.                                  */
    for (index = 0; index < nPts; ++index) {

        /*  A vertex has three values, the x, y, and z coordinates. The index *
         *  for the x value of the point is 3 times the current index.        */
        const xIndex = 3 * index;

        /*  The y index is immediately after the x index.                     */
        const yIndex = xIndex + 1;

        /*  Use the rotation matrix. Get the initial values.                  */
        const xValue = arr[xIndex];
        const yValue = arr[yIndex];

        /*  Apply the rotation matrix and update the points.                  */
        arr[xIndex] = cosAngle * xValue - sinAngle * yValue;
        arr[yIndex] = cosAngle * yValue + sinAngle * xValue;
    }
}

export {rotateMesh};
