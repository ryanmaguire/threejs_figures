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
 *      Computes the locations of the points in the mesh for the surface.     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/

/*  Maximum number of pixels in the vertical and horizontal axes.             */
pub use crate::{MAX_HEIGHT, MAX_WIDTH};

/*  Physical width and height of the surface (projection onto the xy plane).  */
pub use crate::{PARABOLOID_WIDTH, PARABOLOID_HEIGHT};

/*  Left-most and bottom-most extremes of the surface (projected to xy plane).*/
pub use crate::{PARABOLOID_X_START, PARABOLOID_Y_START};

/*  Function for generating the mesh for the surface by calculating vertices. */
pub fn generate_mesh(ptr: *mut f32, nx_pts: u32, ny_pts: u32) {

    /*  The size of the array passed to us is given by the number of points   *
     *  in the mesh, which is simply the width times the height.              */
    let len: usize = (3 * nx_pts * ny_pts) as usize;

    /*  Get a slice for the data.                                             */
    let arr = unsafe { std::slice::from_raw_parts_mut(ptr, len) };

    /*  Step sizes in the horizontal and vertical axes.                       */
    let dx: f32 = PARABOLOID_WIDTH / ((nx_pts - 1) as f32);
    let dy: f32 = PARABOLOID_HEIGHT / ((ny_pts - 1) as f32);

    /*  Shift factor in the z axis for centering the mesh around the origin.  */
    const HEIGH_SHIFT: f32 = -2.0;

    /*  Variable for indexing over the array being written to.                */
    let mut index: usize = 0;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if (nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT) {
        return;
    }

    /*  Loop through the vertical axis. The elliptic paraboloid lies          *
     *  above the xy plane, meaning it is of the form z = f(x, y).            *
     *                                                                        *
     *  Note, since the y index is the outer for-loop, the array is indexed   *
     *  in row-major fashion. That is, index = y * width + x.                 */
    for y_index in 0..ny_pts  {

        /*  Convert pixel index to y coordinate.                              */
        let y_pt: f32 = PARABOLOID_Y_START + (y_index as f32) * dy;

        /*  Loop through the horizontal component of the object.              */
        for x_index in 0..nx_pts {

            /*  Convert pixel index to x coordinate in the plane.             */
            let x_pt: f32 = PARABOLOID_X_START + (x_index as f32) * dx;

            /*  The elliptic paraboloid has a simple formula: z = x^2 + 2y^2. *
             *  We shift this slightly to center the surface on the screen.   */
            let z_pt: f32 = x_pt * x_pt + 2.0 * y_pt * y_pt + HEIGH_SHIFT;

            /*  Add this point to our vertex array.                           */
            arr[index] = x_pt;
            arr[index + 1] = y_pt;
            arr[index + 2] = z_pt;

            /*  Move on to the next point in the mesh. A point needs 3 f32's. */
            index += 3;
        }
        /*  End of horizontal for-loop.                                       */
    }
    /*  End of vertical for-loop.                                             */
}
/*  End of generate_mesh.                                                     */
