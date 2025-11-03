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

/*  Function prototype and index array found here.                            */
pub use crate::{MAX_HEIGHT, MAX_WIDTH};
pub use crate::{PARABOLOID_WIDTH, PARABOLOID_HEIGHT};
pub use crate::{PARABOLOID_X_START, PARABOLOID_Y_START};

pub fn generate_mesh(arr: &mut [f32], nx_pts: u32, ny_pts: u32) {

    let dx: f32 = PARABOLOID_WIDTH / ((nx_pts - 1) as f32);
    let dy: f32 = PARABOLOID_HEIGHT / ((ny_pts - 1) as f32);
    const HEIGH_SHIFT: f32 = -2.0;

    /*  Variable for indexing over the array being written to.                */
    let mut index: usize = 0;

    /*  Avoiding writing beyond the bounds of the array that was allocated.   *
     *  Check if the input sizes are too big.                                 */
    if (nx_pts > MAX_WIDTH) || (ny_pts > MAX_HEIGHT) {
        return;
    }

    for y_index in 0..ny_pts  {

        let y_pt: f32 = PARABOLOID_Y_START + (y_index as f32) * dy;

        for x_index in 0..nx_pts {

            let x_pt: f32 = PARABOLOID_X_START + (x_index as f32) * dx;
            let z_pt: f32 = x_pt * x_pt + 2.0 * y_pt * y_pt + HEIGH_SHIFT;

            arr[index] = x_pt;
            arr[index + 1] = y_pt;
            arr[index + 2] = z_pt;

            index += 3;
        }
    }
}
