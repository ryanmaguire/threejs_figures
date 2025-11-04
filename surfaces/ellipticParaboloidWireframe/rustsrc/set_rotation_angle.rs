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
 *      Sets the parameters for the rotation angle.                           *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/

/*  Globals for the program, the rotation angle and its sine and cosine.      */
use crate::{ROTATION_ANGLE, COS_ANGLE, SIN_ANGLE};

/*  First few coefficients of the Taylor series for cosine.                   */
const C0: f32 =  1.00000000E+00;
const C1: f32 = -5.00000000E-01;
const C2: f32 =  4.16666667E-02;

/*  First few coefficients of the Taylor series for sine.                     */
const S0: f32 =  1.00000000E+00;
const S1: f32 = -1.66666667E-01;

/*  Evaluates cos(z) for small z using Horner's method. Input is z^2.         */
#[inline(always)]
fn small_angle_cos(zsq: f32) -> f32 {
    C0 + zsq * (C1 + zsq * C2)
}

/*  Evaluates sin(z) for small z using Horner's method. Input is z and z^2.   */
#[inline(always)]
fn small_angle_sin(z: f32, zsq: f32) -> f32 {
    z * (S0 + zsq * S1)
}

/*  Function for setting the rotation angle and computes its sine and cosine. */
pub fn set_rotation_angle(angle: f32) {

    /*  The Taylor series are in terms of the square of the angle.            */
    let angle_squared = angle * angle;

    /*  Get variables for the globals.                                        */
    let mut rotation = ROTATION_ANGLE.lock().unwrap();
    let mut cos_val = COS_ANGLE.lock().unwrap();
    let mut sin_val = SIN_ANGLE.lock().unwrap();

    /*  Set the globals to their new values.                                  */
    *rotation = angle;
    *cos_val = small_angle_cos(angle_squared);
    *sin_val = small_angle_sin(angle, angle_squared);
}
/*  End of set_rotation_angle.                                                */
