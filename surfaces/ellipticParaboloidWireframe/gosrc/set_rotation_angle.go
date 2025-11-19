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
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package main

/*  First few coefficients of the Taylor series for cosine.                   */
const C0 float32 = +1.00000000E+00
const C1 float32 = -5.00000000E-01
const C2 float32 = +4.16666667E-02

/*  First few coefficients of the Taylor series for sine.                     */
const S0 float32 = +1.00000000E+00
const S1 float32 = -1.66666667E-01

/*  Evaluates cos(z) for small z using Horner's method. Input is z^2.         */
func smallAngleCosine(zsq float32) float32 {
    return C0 + zsq * (C1 + zsq * C2)
}

/*  Evaluates sin(z) for small z using Horner's method. Input is z and z^2.   */
func smallAngleSine(z, zsq float32) float32 {
    return z * (S0 + zsq * S1)
}

/*  Function for setting the rotation angle and computes its sine and cosine. */
func setRotationAngle(angle float32) {

    /*  The Taylor series are in terms of the square of the angle.            */
    var angleSquared float32 = angle * angle

    /*  Set the global angle to its new value.                                */
    rotationAngle = angle

    /*  Compute the sine and cosine of this and save it in the globals.       */
    cosAngle = smallAngleCosine(angleSquared)
    sinAngle = smallAngleSine(angle, angleSquared)
}
/*  End of setRotationAngle.                                                  */
