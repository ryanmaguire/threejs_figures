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
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Globals for the animation and the function prototype found here.          */
#include "paraboloid.h"

/*  First few coefficients of the Taylor series for cosine.                   */
#define C0 (+1.00000000E+00F)
#define C1 (-5.00000000E-01F)
#define C2 (+4.16666667E-02F)

/*  First few coefficients of the Taylor series for sine.                     */
#define S0 (+1.00000000E+00F)
#define S1 (-1.66666667E-01F)

/*  Evaluates cos(z) for small z using Horner's method. Input is z^2.         */
#define SMALL_ANGLE_COS(zsq) (C0 + zsq * (C1 + zsq * C2))

/*  Evaluates sin(z) for small z using Horner's method. Input is z and z^2.   */
#define SMALL_ANGLE_SIN(z, zsq) z * (S0 + zsq * S1)

/*  Function for setting the rotation angle and computes its sine and cosine. */
void set_rotation_angle(float angle)
{
    /*  The Taylor series are in terms of the square of the angle.            */
    const float angle_squared = angle * angle;

    /*  Set the global angle to its new value.                                */
    rotation_angle = angle;

    /*  Compute the sine and cosine of this and save it in the globals.       */
    cos_angle = SMALL_ANGLE_COS(angle_squared);
    sin_angle = SMALL_ANGLE_SIN(angle, angle_squared);
}
/*  End of set_rotation_angle.                                                */
