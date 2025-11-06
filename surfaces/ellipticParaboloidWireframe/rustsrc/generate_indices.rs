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
 *      Computes the indices corresponding to vertices in the wireframe mesh. *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/

/*  Function prototype and index array found here.                            */
pub use crate::{MAX_HEIGHT, MAX_WIDTH};

/*  Function for generating the wireframe for the animation.                  */
pub fn generate_indices(ptr: *mut u32, nx_pts: u32, ny_pts: u32) {

    /*  We are only passed the address of the data, we need to convert it     *
     *  into a slice. This requires the total number of elements in the array,*
     *  which is given in terms of the number number of points in the mesh.   */
    let number_of_points: u32 = nx_pts * ny_pts;

    /*  For each vertex, there are two edges comming out of it forming an "L" *
     *  shape. This is true for all points except those along the top edge    *
     *  and the right-most edge, where there is only one edge. Lastly, for    *
     *  each edge there are two vertices, the starting vertex and the         *
     *  terminal one, meaning there are 2 (2wh - w - h) elements in the index *
     *  array, where w is the width and h is the height.                      */
    let len = (2 * (2 * number_of_points - nx_pts - ny_pts)) as usize;

    /*  Convert the pointer into a slice.                                     */
    let arr = unsafe { std::slice::from_raw_parts_mut(ptr, len) };

    /*  Variable for indexing over the array being written to.                */
    let mut index: usize = 0;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if (nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT) {
        return;
    }

    /*  We need to create the lines now. We do this by creating ordered       *
     *  pairs of the indices for the vertices in the vertex array that we     *
     *  want to connect. Each point will be connected to its four surrounding *
     *  neighbors, except for the points on the boundary, which have fewer    *
     *  neighbors. We handle these boundary points separately.                */
    for y_index in 0..ny_pts {

        /*  The indices are row-major, meaning index = y * width + x. The     *
         *  shift factor only depends on the y-component, compute this.       */
        let shift: u32 = y_index * nx_pts;

        /*  The vertical component is now fixed, loop through the horizontal. */
        for x_index in 0..nx_pts {

            /*  The current index is the shift plus horizontal index. That    *
             *  is, the index for (x, y) is y * width + x.                    */
            let index00: u32 = shift + x_index;

            /*  The point directly after the current point, in the horizontal.*/
            let index01: u32 = index00 + 1;

            /*  The point directly above the current point, in the vertical.  */
            let index10: u32 = index00 + nx_pts;

            /*  If we are not at the top edge or the right edge of the        *
             *  rectangle, we may add an "L" shape to our mesh connecting the *
             *  bottom left point to the bottom right point, and the bottom   *
             *  left point to to the upper left point. At the top of the      *
             *  rectangle the upper left point goes beyond the bounds of the  *
             *  parametrization, so we do not need to draw it. Check for this.*/
            if y_index != ny_pts - 1 {
                arr[index] = index00;
                arr[index + 1] = index10;
                index += 2;
            }

            /*  Similarly, at the right edge we have that the bottom right    *
             *  point lies outside of the parametrizion and do not need to    *
             *  add it to our mesh. Check for this.                           */
            if x_index != nx_pts - 1 {
                arr[index] = index00;
                arr[index + 1] = index01;
                index += 2;
            }
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_indices.                                                  */
