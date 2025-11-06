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
 *      Rotates the mesh by a fixed angle.                                    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/

/*  Pre-computed cosine and sine of the rotation angle.                       */
use crate::{COS_ANGLE, SIN_ANGLE};

/*  Function for rotating the mesh by a fixed angle.                          */
pub fn rotate_mesh(ptr: *mut f32, n_pts: u32) {

    /*  Convert the pointer into a slice.                                     */
    let n_elements = (3 * n_pts) as usize;
    let arr = unsafe { std::slice::from_raw_parts_mut(ptr, n_elements) };

    /*  Get the cosine and sine of the angle as f32's.                        */
    let cos_angle: f32 = *COS_ANGLE.lock().unwrap();
    let sin_angle: f32 = *SIN_ANGLE.lock().unwrap();

    /*  Loop through each point in the mesh.                                  */
    for index in 0..n_pts {

        /*  A vertex has three values, the x, y, and z coordinates. The index *
         *  for the x value of the point is 3 times the current index.        */
        let x_index: usize = (3 * index) as usize;

        /*  The y index is immediately after the x index.                     */
        let y_index: usize = x_index + 1;

        /*  Use the rotation matrix. Get the initial values.                  */
        let x: f32 = arr[x_index];
        let y: f32 = arr[y_index];

        /*  Apply the rotation matrix and update the points.                  */
        arr[x_index] = cos_angle * x - sin_angle * y;
        arr[y_index] = cos_angle * y + sin_angle * x;
    }
}
/*  End of rotate_mesh.                                                       */
